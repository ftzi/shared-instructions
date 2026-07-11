# Shared AI Instructions

Personal reusable instructions for projects that use [opencode](https://opencode.ai).

Intended to be a submodule so it can effortlessly be updated among projects.

For React and Typescript, they could be skills but for now it's a whatever. They aren't big files and I prefer to always have them loaded than being unlucky and the skill not being loaded when it should.

## Files

| File | Purpose |
| --- | --- |
| `GENERAL.md` | General AI rules — keyword usage, research, documentation, quality, git, tools, code organization, security |
| `TYPESCRIPT.md` | TypeScript standards — typing, async, error handling, imports, performance, testing |
| `REACT.md` | React standards — JSX, hooks, accessibility, mobile-first, destructive actions, framework-specific |

## Usage

Add this repo as a git submodule to your project:

```sh
git submodule add https://github.com/ftzi/shared-instructions.git .agents/shared-instructions
```

Then reference the instruction files you want in your project's `opencode.json` (they will work like they were inside AGENTS.md):

```json
{
  "$schema": "https://opencode.ai/config.json",
  "instructions": [
    ".agents/shared-instructions/GENERAL.md",
    ".agents/shared-instructions/TYPESCRIPT.md",
    ".agents/shared-instructions/REACT.md"
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
