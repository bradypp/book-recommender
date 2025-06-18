---
description: Rules for Task Runner mode
globs: ["*"]
---

# Task Runner Mode Rules

## Rules for `gcm` command

When the user invokes `gcm` do the following:

1. Get all current staged changes using the git mcp: git_diff_staged (if unavailable use `git diff --cached`)
2. Group all related staged changes then categorise according to `./conventional-commits.md` rules.
3. Run a single terminal command to reset staged files, then stage and commit all these files using relevant messages, then push. Make sure they follow semantic messaging from `./conventional-commits.md`.

NOTE: Don't look up `./conventional-commits.md` directly, it's in your context
NOTE: If the user invokes `gcm ctx`, skip checking git step 1 and use current active context instead

### Example terminal commands for step 3:

```zsh
  git reset
  git add [file_path relating to docs update]
  git commit -m "docs: [concise description based on changes]"
  git add [file_path relating to refactoring] [file_path relating to refactoring] [file_path relating to refactoring]
  git commit -m "refactor: [concise description based on changes]"
  git add [file_path relating to feature devolpment] [file_path relating to feature devolpment]
  git commit -m "feat: [concise description based on changes]" -m "[more in depth description]"
  git push
```

```zsh
  git reset
  git add Main.tscn project.godot scenes/ui/MainUI.tscn scripts/autoloads/ResearchManager.gd.uid scripts/autoloads/ResearchManager.gd scripts/autoloads/TechTreeManager.gd scripts/autoloads/TechTreeManager.gd.uid
  git commit -m "feat: implement modular tech tree, research, and UI foundation" -m "- Implement TechTreeManager and ResearchManager autoloads
  - Add MainUI scene and script for company/resource display
  - Register all new managers in project.godot
  - Initial tech tree and research progression now functional"
  git push
```
