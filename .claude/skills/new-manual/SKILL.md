---
name: new-manual
description: Create a new installation manual in manuals/ following the repo template. Use when the user says /new-manual or asks for a manual for some software.
---

# New manual

Read `CLAUDE.md` first — the template and rules live there.

## Steps
1. If not given, ask **one question at a time** for what's missing: software name; what participants should get out of it; dependencies on other manuals in this repo; anything non-standard (ports, GPU, accounts).
2. Check the software's current official install instructions online for all three OSes. Prefer official installers/package managers over curl-pipe-bash where a sane alternative exists. Don't invent flags.
3. Write `manuals/<slug>.md` from the template. Keep it short: a participant should be done in minutes, not reading.
4. Add a row to the table in `README.md`. If the manual has dependencies, add it to the Mermaid graph.
5. Reply with the file path and 2–3 things you were unsure about (versions, OS-specific quirks) so the user can verify those first.

## Don't
- Don't add sections beyond the template.
- Don't explain what a terminal, Docker, or a package manager is.
- Don't touch the CSS or layout.
