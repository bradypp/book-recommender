---
description: Roo rules
globs: ["*"]
---

## Roo rules

- Don't read rules from within the any dot directories (e.g. `.roo`, `.kilocode`, `.windsurf`) directly unless updating memory, updating/creating rules, or requested to by the user - you will already have these rules in your context
- Make sure you use windows compatible terminal commands

## Efficiency and optimization

- Prioritise using the most efficient tool - `codebase_search` (or `search_files`) and `read_multiple_files` when analyzing the codebase or gathering context about the user's request. `diting multiple files at once instead of sequentially
- Plan multi-step operations - consider the full workflow before starting to minimize back-and-forth
- Maximize work per API call - batch operations whenever possible rather than making sequential calls
