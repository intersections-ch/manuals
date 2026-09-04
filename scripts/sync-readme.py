#!/usr/bin/env python3
"""Regenerate the manual tables in README.md / README.de.md from _data/manuals.yml.

The site renders cards from the YAML; GitHub renders the README table. This keeps
the two from drifting. Run after editing _data/manuals.yml:

    python3 scripts/sync-readme.py
"""
import re, sys, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
DATA = ROOT / "_data" / "manuals.yml"

HEADERS = {
    "en": ("| Manual | What you get | Requires |", "README.md", ".md"),
    "de": ("| Manual | Was du bekommst | Voraussetzungen |", "README.de.md", ".de.md"),
}


def load():
    """Tiny reader for the flat shape we actually use — avoids a PyYAML dependency."""
    items, cur, lang = [], None, None
    for raw in DATA.read_text(encoding="utf-8").splitlines():
        if not raw.strip() or raw.lstrip().startswith("#"):
            continue
        indent = len(raw) - len(raw.lstrip())
        line = raw.strip()
        if line.startswith("- slug:"):
            cur = {"slug": line.split(":", 1)[1].strip(), "en": {}, "de": {}}
            items.append(cur)
            lang = None
        elif indent == 2 and line in ("en:", "de:"):
            lang = line[:-1]
        elif indent == 2 and line.startswith("start:"):
            cur["start"] = line.split(":", 1)[1].strip() == "true"
        elif indent >= 4 and lang and ":" in line:
            k, v = line.split(":", 1)
            cur[lang][k.strip()] = v.strip().strip('"')
    return items


def table(items, lang, ext):
    rows = [HEADERS[lang][0], "|---|---|---|"]
    for m in items:
        d = m[lang]
        rows.append(f"| [{d['title']}](manuals/{m['slug']}{ext}) | {d['desc']} | {d['requires']} |")
    return "\n".join(rows)


def main():
    items = load()
    changed = []
    for lang, (_, fname, ext) in HEADERS.items():
        path = ROOT / fname
        text = path.read_text(encoding="utf-8")
        new = table(items, lang, ext)
        out = re.sub(r"\| Manual \|.*?(?=\n\n)", new, text, count=1, flags=re.S)
        if out != text:
            path.write_text(out, encoding="utf-8")
            changed.append(fname)
    print("updated: " + (", ".join(changed) if changed else "nothing (already in sync)"))


if __name__ == "__main__":
    sys.exit(main())
