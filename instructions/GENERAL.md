# General AI Instructions

Reusable across all projects. Project-specific overrides and additions live in each repo's AGENTS.md.

## Keyword Usage

Use **MUST** and **NEVER** for mandatory requirements that agents must follow without exception.

## Research & Verification

**Research before claiming absence — CRITICAL:** When asked about whether something exists (in the repo OR in general — tests, files, features, config, dependencies, tools, APIs, docs, etc.), you MUST research thoroughly before answering. NEVER claim something doesn't exist based on a single search pattern, assumption, or stale training data. Try multiple glob patterns, grep variations, directory listings, and web searches. A false negative is worse than extra search effort.

## Documentation

- **Keep docs in sync — THIS IS CRITICAL:** Project documentation MUST ALWAYS be updated when making ANY change to: project structure, packages, features, config, scripts, commands, env vars, or anything a developer would want to know. **Failing to update documentation is unacceptable.** If in doubt, update it.
- **State-only docs:** Documentation and instruction files MUST describe current state only. NEVER add change notes, migration notes, or wording like "X is now Y". Write "X is Y".
- **Skill first:** If a relevant repo-local skill exists, put the instruction in that skill first. Do NOT duplicate skill-local guidance into project docs unless the rule applies repo-wide.
- **Prefer project docs over memory:** Save instructions and feedback in project documentation, not in a local memory cache. Project docs are committed to the repo and persist across machines. NEVER use the memory system.

## Quality & Validation

- **Quality Verification:** After changing code, the project's quality check command (format, lint, typecheck, test) MUST pass before the task is considered complete. NEVER claim completion while validation is failing. Run the quality check at the end of EVERY task — no exceptions.
- **Debugging failures:** When quality checks fail, re-run the failing command directly (e.g., test, typecheck, lint) to see the full error — do NOT wrap it with a tool that compresses output and hides error details. After fixing, the full quality check MUST still be run as the final verification.

## Git

- **Commit / push gate — CRITICAL, NEVER VIOLATE:** NEVER commit, stage, push, or run `git add` under ANY circumstance unless the user types an explicit command containing the word "commit." Finishing a task is NOT permission to commit. A prior commit in the conversation does NOT carry forward. Every commit requires a fresh, explicit user request containing the word "commit." NEVER chain `git commit` or `git push` with other commands — commits must be isolated, standalone invocations triggered only by the user's explicit commit request. NEVER run any git operation that touches the index or remote without the user's explicit commit command. If unsure, ASK first — never assume.
- When user does request a commit, use `git add -A && git commit -m "<message>" && git push origin <branch>` in a single shell invocation.
- **NEVER add AI attribution to commit messages** (no `Co-Authored-By`).
- **NEVER use `--no-verify`** unless user strictly says `"skip hooks"` or `"no-verify"`. If a hook fails, fix the issue — don't bypass it.
- When on a non-main branch, after the final commit for a task, auto-create a PR via `gh pr create`.
- Review before committing: `git diff HEAD --stat` for summary, `git diff HEAD -- '*.ts' '*.tsx' '*.json' ':!bun.lock'` for code.
- New branches: `git fetch origin && git checkout -b <name> origin/main`.
- First push: `git push -u origin <branch-name>`.
- GitHub ops: use `gh` CLI.

## Persistent Fixes

- **Persistent fixes, never session-only workarounds:** When the user reports a problem or asks for a behavioral change, **YOU MUST** fix the root cause in the repo (code, scripts, tool wiring, docs, skills, or shared setup) so the fix persists for every future session. NEVER solve it only for the current turn by adapting your ad-hoc behavior without updating the underlying tool or doc. If a doc, command, or skill that you relied on is wrong or missing, fix that source in the same task. Session-only behavior changes are a bug.

## MCP & Tools

- When you need to search docs, use `context7` tools. If there are no docs for what you need, then search on web.
- If you are unsure how to do something, use `gh_grep` to search code examples from GitHub.

## General Rules

- Use caveman.
- Take user instructions literally.
- NEVER keep or aim for legacy code unless the user explicitly asks for legacy compatibility. Do things properly.
- The code must be the best and most professional code. Best structure, best readability, best logic. No hacky solutions. Simplicity is genius and things working is a must.
- NEVER say which skills you are going to use or are using in progress updates or status messages. Just use them silently.
- NEVER add narrow examples, one-off implementation advice, or micro-rules to docs or skills unless they are broadly reusable and still useful later. Keep repo docs broad, current, and high-value.
- All product and UI changes MUST be made by editing code and repo files directly.
- Visible information MUST be shown only once in the UI. NEVER duplicate the same status or value across multiple screens unless the user explicitly asks for redundancy.
- UI MUST look mature and professional. NEVER ship childish-looking design, motion, or effects.
- All code MUST be reliable and professional. NEVER add hacky, brittle, or shortcut solutions.
- ZERO TOLERANCE for warnings, errors, or noisy validation output.
- Lint and typecheck configuration MUST stay strict. NEVER downgrade, disable, or lower the severity of a lint or type rule because it reports too many findings. Existing findings MUST be fixed.
- NEVER leave placeholder implementations in completed work.
- Any code, dependency, or artifact added during a task MUST be removed if it is no longer used. NEVER leave dead code, dead packages, abandoned experiment files, or stale outputs in the tree. A task is not complete until cleanup is done.
- NEVER undo, revert, or overwrite a user change unless the user explicitly asks or the change was made by this agent in the current turn.
- Agents run in parallel in this repo. Ignore unrelated dirty files and NEVER mention unrelated dirty files in status or final messages unless they directly block the current task.
- MUST reference code as `file_path:line_number` using a relative path from the project root when pointing to implementation details.
- If the user asks to merge or resolve conflicts into any branch, the task MUST also push the resulting branch after conflicts are resolved and validation passes.
- If any file instruction points at a wrong, stale, or missing command, MUST fix the instruction source in the same task instead of working around it or leaving the bad instruction in place.
- When changing scripts in `package.json` or tools, MUST search all docs and instructions that reference them and update or add to those docs in the same task.
- **NEVER use `sed` or shell commands for file editing.** Prefer `write` over `edit` — read the file, modify the full content, write it back. Only use `edit` for single-line or trivial targeted changes where the full file is too large.
- When an edit removes content that was not intended, fix it immediately. Read the file after every edit to verify correctness.
- After finishing a task, MUST give 5 strong numbered follow-up suggestions that further increase project value.
- When a change can fit an existing component, hook, or helper, MUST reuse the nearest existing pattern instead of inventing a new abstraction. Prefer the smallest code change that fully satisfies the request.
- NEVER ask me to do something you should be the one doing, unless if it's for me to decide.
- **Read the docs before guessing** — When working with a library, API, or service where the behavior is non-obvious or the official documentation could fast-forward development and provide best practices, MUST read the official docs first. Guessing wastes time and produces wrong code.

## Code Standards

**Clean Code + SOLID + KISS + YAGNI** — self-documenting, readable, minimal complexity.

### File Size

- Source files MUST stay under ~300 lines. If a file grows past this, split it. Create a directory in the same location to house the split modules (e.g., `foo.ts` → `foo/bar.ts` + `foo/baz.ts`).
- Keep functions and components short. Extract helpers, sub-components, and constants.

### Comments

- NEVER add "what I changed" comments.
- Only comment complex, non-obvious logic.
- MUST add reference links when the why isn't obvious from the code: `// Reference: https://...`

### Debugging

- NEVER assume the cause — trace data flow backwards from the error.
- Use a common keyword prefix (e.g., `'DEBUG_AUTH:'`) so logs are easy to filter.

### Code Organization

- Keep functions focused and under reasonable cognitive complexity limits
- Extract complex conditions into well-named boolean variables
- Use early returns to reduce nesting, especially for error cases
- Prefer simple conditionals over nested ternary operators
- Group related code together and separate concerns

### Single Source of Truth

- **NEVER define the same value in two places.** Magic numbers, URLs, model names, config keys, timeout durations — anything that could drift — MUST be defined exactly once and imported everywhere else. Duplicate definitions WILL diverge and cause bugs that are hard to find.
- Extract shared constants to the package closest to where they're used. If multiple packages need the same value, move it to the lowest common dependency or a shared config module.
- If two files need the same string literal, it's already wrong. Export it.

### Security

- Validate and sanitize user input

### Implementation

- MUST implement FULLY — NEVER leave "to be implemented" placeholders.
- NEVER create documentation files unless explicitly requested.
- Code MUST be safe — NEVER allow unauthorized data access.

## When the Linter Can't Help

The linter will catch most issues automatically. Focus your attention on:

1. **Business logic correctness** — linters can't validate your algorithms
2. **Meaningful naming** — Use descriptive names for functions, variables, and types
3. **Architecture decisions** — Component structure, data flow, and API design
4. **Edge cases** — Handle boundary conditions and error states
5. **User experience** — Accessibility, performance, and usability considerations
6. **Documentation** — Add comments for complex logic, but prefer self-documenting code
