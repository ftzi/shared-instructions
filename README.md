# Shared AI Instructions

Reusable instruction files for [opencode](https://opencode.ai) projects. These files define the AI agent's behavior across different coding domains.

## Files

| File | Purpose |
| --- | --- |
| `GENERAL.md` | General AI rules — keyword usage, research, documentation, quality, git, tools, code organization, security |
| `TYPESCRIPT.md` | TypeScript standards — typing, async, error handling, imports, performance, testing |
| `REACT.md` | React standards — JSX, hooks, accessibility, mobile-first, destructive actions, framework-specific |

## Usage

Add this repo as a git submodule to your project:

```sh
git submodule add https://github.com/ftzi/shared-instructions.git .opencode/shared-instructions
```

Then reference the files in your project's `opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "instructions": [
    ".opencode/shared-instructions/GENERAL.md",
    ".opencode/shared-instructions/TYPESCRIPT.md",
    ".opencode/shared-instructions/REACT.md"
  ],
  "mcp": {
    "context7": {
      "type": "remote",
      "url": "https://mcp.context7.com/mcp",
      "enabled": true
    },
    "gh_grep": {
      "type": "remote",
      "url": "https://mcp.grep.app",
      "enabled": true
    }
  }
}
```

### Caveman

`GENERAL.md` includes the rule `Use caveman.`. To install it, follow https://github.com/juliusbrussee/caveman#install. Else, remove that line.

### Updating

```sh
git submodule update --remote .opencode/shared-instructions
```
