# Shared Instructions

Reusable AI instructions, skills, and scripts across projects. Keep this repo generic — project-specific overrides live in each project's `.agents/` and `AGENTS.md`.

## Structure

```
instructions/     Generic AI rules (GENERAL.md, TYPESCRIPT.md, REACT.md)
scripts/          Reusable CLI tools
  setup-secrets.ts  Interactive env + GitHub secrets manager
```

## Usage

### Add to a project

```sh
git submodule add https://github.com/ftzi/shared-instructions.git shared
```

Then reference from your project's entry point:

```jsonc
// opencode.json
{
  "instructions": [
    "shared/instructions/GENERAL.md",
    "shared/instructions/TYPESCRIPT.md",
    "shared/instructions/REACT.md",
  ],
}
```

### setup-secrets

Requires an `.env.example` at the project root listing every env var with `# comment` descriptions:

```
# Auth secret (generate with `openssl rand -base64 32`)
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:8787
```

Add to `package.json`:

```json
"setup:secrets": "bun run shared/scripts/setup-secrets.ts"
```

Then run:

```sh
bun setup:secrets
```

Shows a selectable table of all env vars with local (`.env.local`) and GitHub (`gh secret list`) status. Select a key to set its value for local or GitHub.

Requires: `@clack/prompts`, `gh` CLI (for GitHub secrets).
