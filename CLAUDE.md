# Manuals repo — conventions

Course installation manuals. Plain markdown, rendered by GitHub (repo view) and GitHub Pages (Jekyll, `_layouts/default.html`, `assets/css/style.css`). Must read well in both.

## Audience
Technical participants. Give commands, not explanations of terminals. Brevity always.

## Tone
- Friendly and concrete, never clever. Course context is fine ("ask one of the instructors").
- UI navigation is a `>` breadcrumb with the literal labels: `Settings > Instance-level MCP > Enable MCP access`.
  `→` is reserved for links to other manuals and for node/data chains.
- Anything with more than one action becomes a numbered list, not a sentence.
- A link to another manual gets a label: `Manual: → [Claude Sandbox](claude-sandbox.md)`.
- Big downloads get an upfront `<mark>Careful:</mark>` / `<mark>Achtung:</mark>` line: size, that it takes a
  while, and to do it during a break.
- Default to the smaller/cheaper option (`gemma4:e2b`); list the bigger one as available, not as the default.
- "Done when …" criteria are observable and lenient — `git status` prints something, not `git log` shows history.

## Manual template (`manuals/<slug>.md`)

Every manual is a pair: `manuals/<slug>.md` (English) and `manuals/<slug>.de.md` (German).
Same headings, same commands, same order — only the prose is translated. Each links to the other
on the Requires line. `lang:` in the front matter drives `<html lang>` and the header nav.

````markdown
---
title: <Name>
lang: en
---

# <Name>

> **Requires:** [<Manual>](<slug>.md) · or "nothing" · (git/terminal/editor are assumed, Docker is not) · **Sprache:** [Deutsch](<slug>.de.md)

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
````

The German twin uses `lang: de`, German headings (`Installation`, `Prüfen`, `Ausprobieren`,
`Typische Probleme`), links to German siblings, and swaps the header link:

```markdown
> **Voraussetzungen:** [<Manual>](<slug>.de.md) · **Language:** [English](<slug>.md)
```

German is informal (*du*) and Swiss (`ss`, never `ß`).

## Rules
- OS sections always in the order macOS, Windows, Linux. If a step is identical on all, write it once before the OS sections.
- Commands in fenced blocks, one command per line, no `$` prompt prefix.
- No "last verified" dates, no changelogs.
- New manual → write both `<slug>.md` and `<slug>.de.md`, and add a row to the table in **both**
  `README.md` and `README.de.md` (plus a node to each Mermaid graph if it has dependencies).
- Unverified facts stay in the source as `<!-- #TODO ... -->` so they are greppable
  (`grep -rn '#TODO' manuals README*.md`) but invisible on the rendered page. Mirror them into the German twin.
- Use `> ` blockquote only for the Requires line and short warnings. Use `<mark>` sparingly for the one word that matters.

## Design
All design lives in the `:root` block at the top of `assets/css/style.css`. Change tokens there first; only touch rules below if a token can't express it. Colors: background stays near-white; pink/yellow/peach are highlights only.
