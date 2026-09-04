# Manuals repo — conventions

Course installation manuals. Plain markdown, rendered by GitHub (repo view) and GitHub Pages (Jekyll, `_layouts/default.html`, `assets/css/style.css`). Must read well in both.

## Audience
Technical participants. Give commands, not explanations of terminals. Brevity always.

## Manual template (`manuals/<slug>.md`)

```markdown
---
title: <Name>
---

# <Name>

> **Requires:** [<Manual>](<slug>.md) · or "nothing" · (git/terminal/editor are assumed, Docker is not)

One or two sentences: what this is and why we install it.

## Install

### macOS
```bash
...
```

### Windows
```powershell
...
```

### Linux
```bash
...
```

## Verify
One command that proves it works, and what the output should look like.

## Try it
3–5 short things to do with it. Concrete commands or clicks, not ideas.

## Common problems
Only if they exist. Error → fix. Max 3.
```

## Rules
- OS sections always in the order macOS, Windows, Linux. If a step is identical on all, write it once before the OS sections.
- Commands in fenced blocks, one command per line, no `$` prompt prefix.
- No "last verified" dates, no changelogs.
- New manual → also add a row to the table in `README.md` and a node to the Mermaid graph if it has dependencies.
- Use `> ` blockquote only for the Requires line and short warnings. Use `<mark>` sparingly for the one word that matters.

## Design
All design lives in the `:root` block at the top of `assets/css/style.css`. Change tokens there first; only touch rules below if a token can't express it. Colors: background stays near-white; pink/yellow/peach are highlights only.
