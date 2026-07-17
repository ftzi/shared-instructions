import { execSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

import {
  intro,
  isCancel,
  log,
  outro,
  select,
  spinner,
  text,
} from "@clack/prompts";

const REPO_ROOT = (() => {
  const dirs = process.cwd().split("/");
  for (let i = dirs.length; i > 0; i--) {
    const candidate = dirs.slice(0, i).join("/");
    if (existsSync(path.join(candidate, ".git"))) return candidate;
  }
  return process.cwd();
})();

type Entry = {
  key: string;
  description: string;
  defaultValue: string;
  localSet: boolean;
  githubSet: boolean;
};

function parseEnvExample(): Entry[] {
  const envPath = path.join(REPO_ROOT, ".env.example");
  if (!existsSync(envPath)) {
    log.error(".env.example not found in repository root");
    process.exit(1);
  }

  const content = readFileSync(envPath, "utf-8");
  const lines = content.split("\n");
  const entries: Entry[] = [];
  let pendingDescription = "";

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === "" || trimmed.startsWith("# Copy to")) continue;
    if (trimmed.startsWith("#")) {
      pendingDescription = trimmed.replace(/^#\s*/, "");
      continue;
    }
    const eqIndex = line.indexOf("=");
    if (eqIndex === -1) continue;
    const key = line.slice(0, eqIndex).trim();
    const defaultValue = line.slice(eqIndex + 1).trim();
    entries.push({
      key,
      description: pendingDescription,
      defaultValue,
      localSet: false,
      githubSet: false,
    });
    pendingDescription = "";
  }

  return entries;
}

function readLocalEnv(): Map<string, string> {
  const map = new Map<string, string>();
  const envPath = path.join(REPO_ROOT, ".env");
  if (!existsSync(envPath)) return map;
  const content = readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (trimmed === "" || trimmed.startsWith("#")) continue;
    const eqIndex = line.indexOf("=");
    if (eqIndex === -1) continue;
    map.set(line.slice(0, eqIndex).trim(), line.slice(eqIndex + 1).trim());
  }
  return map;
}

function readGitHubSecrets(): Set<string> {
  const set = new Set<string>();
  try {
    const raw = execSync("gh secret list --json name", {
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
    });
    const parsed = JSON.parse(raw) as { name: string }[];
    for (const { name } of parsed) {
      set.add(name);
    }
  } catch {
    // gh CLI not authenticated or no secrets — show all as unset
  }
  return set;
}

function formatValue(value: string | undefined, defaultValue: string): string {
  if (value !== undefined && value.length > 0) return value;
  if (defaultValue.length > 0) return `[${defaultValue}]`;
  return "";
}

function writeLocalEnv(entries: Entry[], localEnv: Map<string, string>) {
  const lines: string[] = [];
  for (const { key, description, defaultValue } of entries) {
    if (description) lines.push(`# ${description}`);
    lines.push(`${key}=${localEnv.get(key) ?? defaultValue}`);
    lines.push("");
  }
  writeFileSync(path.join(REPO_ROOT, ".env"), lines.join("\n"));
}

async function main() {
  intro("GitHub Actions Secrets & Local Env");

  const entries = parseEnvExample();
  const localEnv = readLocalEnv();
  const githubSecrets = readGitHubSecrets();

  for (const entry of entries) {
    entry.localSet =
      localEnv.has(entry.key) && (localEnv.get(entry.key) ?? "").length > 0;
    entry.githubSet = githubSecrets.has(entry.key);
  }

  for (;;) {
    const choices = entries.map((e) => {
      const local = e.localSet ? "✓" : "—";
      const github = e.githubSet ? "✓" : "—";
      const desc = e.description ? ` — ${e.description}` : "";
      return {
        value: e.key,
        label: e.key,
        hint: `local: ${local}  github: ${github}${desc}`,
      };
    });

    choices.push({ value: "__done__", label: "Done", hint: "exit" });

    const key = await select({
      message: "Select a secret to set (↑↓ arrow keys, enter to pick)",
      options: choices,
    });

    if (isCancel(key) || key === "__done__") break;

    const entry = entries.find((e) => e.key === key);
    if (!entry) continue;

    const currentLocal = localEnv.get(entry.key);
    const defaultValue = formatValue(currentLocal, entry.defaultValue);

    const s = spinner();
    s.start(`Setting ${entry.key}`);

    const kind = await select({
      message: `Set ${entry.key} ${entry.description ? `(${entry.description})` : ""} for:`,
      options: [
        {
          value: "local",
          label: "Local (.env)",
          hint:
            typeof currentLocal === "string"
              ? `current: ${currentLocal.slice(0, 20)}...`
              : "not set",
        },
        {
          value: "github",
          label: "GitHub Actions secret",
          hint: entry.githubSet ? "already set" : "not set",
        },
        { value: "back", label: "Back" },
      ],
    });

    if (isCancel(kind) || kind === "back") {
      s.stop("Cancelled");
      continue;
    }

    const hint = defaultValue.length > 0 ? defaultValue : undefined;
    const value = await text({
      message: `Value for ${entry.key}:`,
      placeholder: hint,
      validate: (v) => {
        if (v.length === 0 && entry.defaultValue.length === 0) {
          return "Required";
        }
      },
    });

    if (isCancel(value) || value === "") {
      s.stop("Skipped");
      continue;
    }

    if (kind === "local") {
      localEnv.set(entry.key, value);
      writeLocalEnv(entries, localEnv);
      entry.localSet = true;
      s.stop("Written to .env");
    } else {
      execSync(`gh secret set "${entry.key}"`, {
        input: value,
        stdio: ["pipe", "pipe", "pipe"],
      });
      entry.githubSet = true;
      s.stop("Set as GitHub secret");
    }
  }

  outro("Done.");
}

main().catch((error: unknown) => {
  log.error(`Unexpected error: ${String(error)}`);
  process.exit(1);
});
