# Shared Instructions

Reusable AI instructions, skills, and scripts across projects. Keep this repo generic — project-specific overrides live in each project's `.agents/` and `AGENTS.md`.

## Structure

```
instructions/     Generic AI rules (GENERAL.md, TYPESCRIPT.md, REACT.md)
scripts/          Reusable CLI tools
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

