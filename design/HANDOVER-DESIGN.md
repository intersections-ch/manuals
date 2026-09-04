# Handover: Redesign of the Jekyll manuals site

Goal: same Markdown sources, new look. More usable width, visible code, visible steps, DM Sans, and dark surfaces to break up the white. Nothing here requires rewriting content — everything is layout, CSS, and two small includes.

Reference mockup: `Manual Redesign.dc.html` (opens in a browser). Build to that, not to your own interpretation.

---

## 0. Constraints

- Content stays plain Markdown with the existing front matter. Do not introduce per-page HTML.
- Additive front matter only: `prereqs:`, `duration:`, `lang:`, `next:`, `prev:` — all optional, every template must render fine when they are missing.
- No JS framework. One tiny inline script for TOC highlighting and code "copy" is fine.
- Keep the existing pink→yellow gradient rule under `h1` and the yellow `<mark>` highlight. Those are the site's identity — do not change their colors.

## 1. Design tokens

Put these in `_sass/_tokens.scss` and use them everywhere. No new colors beyond this list.

```scss
:root {
  --bg:        #f7f6f4;  // page
  --bg-sunk:   #f2f1ee;  // sidebar, note boxes
  --surface:   #fdfcfb;  // cards
  --ink:       #121315;  // headings
  --ink-body:  #2c2d2f;  // prose
  --ink-mute:  #55534f;  // secondary
  --ink-faint: #8b8884;  // labels, monospace eyebrows
  --line:      #dedbd6;  // hairlines
  --dark:      #17181a;  // header, footer, code, step badges
  --dark-deep: #101113;  // code block title bar
  --dark-line: #2c2e32;  // dividers on dark
  --on-dark:   #f7f6f4;
  --on-dark-mute: #8d8b87;
  --accent-yellow: #f0e15c;
  --accent-pink:   #e9a3bd;
}
```

## 2. Typography

Load once in `_includes/head.html`:

```html
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,700;1,9..40,400&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
```

Stacks:

- Prose + headings: `'DM Sans', system-ui, sans-serif`
- Code, labels, eyebrows: `'JetBrains Mono', ui-monospace, monospace`

Scale (desktop):

| Element | Size / weight / tracking |
|---|---|
| `h1` | 46px / 700 / `-0.035em`, line-height 1.05 |
| `h2` | **15px / 700 / `+0.14em`, uppercase, JetBrains Mono**, followed by a 1px `--line` rule |
| `h3` (steps) | 25px / 700 / `-0.02em` DM Sans |
| `p`, `li` | 18px / 400 / line-height 1.65, color `--ink-body`, `text-wrap: pretty` |
| inline `code` | 15px / 500 mono, `#e7e4de` bg, 1px `#d6d2cb` border, radius 5px, padding 2px 6px |
| eyebrow labels | 10px / 500 mono, `+0.12em`, uppercase, `--ink-faint` |

Note the inversion: `h2` becomes a small mono section label, `h3` becomes the big visible thing. That is deliberate — the steps are the content, the group headers are just dividers. This is the single biggest fix for "semi-structured text".

Max prose measure: `72ch`. Do not let paragraphs run the full column.

## 3. Layout — kill the empty margins

Replace the single centered column with a two-column shell in `_layouts/manual.html`:

```
grid-template-columns: 244px minmax(0, 1fr);
```

- Shell max-width `1240px`, centered, `padding: 0`.
- Left column: sticky sidebar (`position: sticky; top: 72px`), background `--bg-sunk`, 1px right border `--line`. Contains (a) "Auf dieser Seite" = the page's own `h2`/`h3` TOC, (b) "Alle Manuals" = link list of all manuals, current one bolded.
- Right column: `padding: 40px 64px 72px; max-width: 860px`.

Breakpoints:
- `< 1080px`: sidebar collapses to a `<details>` "Inhalt" block above the article; content padding `32px 24px`.
- `< 720px`: `h1` 34px, prose 17px, step grid becomes 34px badge column.

The index page (`_layouts/manuals.html`) keeps one full-width column — no sidebar — because it is the map.

## 4. Steps that look like steps

The step subheads come from `### 1. Claude Code in einer Sandbox`. Two changes:

1. **Strip the manual numbering from the Markdown** (`### Claude Code in einer Sandbox`) and let CSS counters number them, so numbering never goes stale on reorder.
2. Render each `h3` with a dark rounded badge and a vertical rail connecting to the next step.

```scss
.manual-body { counter-reset: step; }

.manual-body h3 {
  counter-increment: step;
  position: relative;
  margin: 34px 0 10px;
  padding-left: 68px;          // 40px badge + 28px gap
  font: 700 25px/1.2 'DM Sans', sans-serif;
  letter-spacing: -0.02em;
  color: var(--ink);

  &::before {                   // the number badge
    content: counter(step);
    position: absolute; left: 0; top: -2px;
    width: 40px; height: 40px;
    display: grid; place-items: center;
    border-radius: 10px;
    background: var(--dark); color: var(--on-dark);
    font: 700 16px/1 'JetBrains Mono', monospace;
  }
  &::after {                    // rail down to the next step
    content: ""; position: absolute; left: 19px; top: 48px;
    width: 2px; height: calc(100% + 100vh); // clipped by the wrapper
    background: #ddd9d4;
  }
}
```

Since a pure-Markdown body cannot wrap each step in a div, indent the step content by making everything after an `h3` sit in a padded block: give `.manual-body h3 ~ *` a `padding-left: 68px` and reset it at the next `h2` (`.manual-body h2 { padding-left: 0 }` plus a sibling-scoped rule, or use `:has()` — check the approach that renders cleanly in the real HTML and pick one). The rail must not overshoot the last step: clip it with `overflow: hidden` on `.manual-body` and cut it at the following `h2` if `:has()` support lets you.

If the CSS-only rail proves fragile, drop the rail and keep the badge. The badge is the requirement; the rail is a nice-to-have.

**Step links** ("→ Claude Sandbox") become pill buttons. Detect them by markup: a paragraph whose only child is a link, immediately after an `h3`. Style: `display: inline-flex; padding: 7px 14px; border: 1px solid var(--dark); border-radius: 999px; font: 500 13.5px 'DM Sans'; text-decoration: none;` and on hover invert to dark background / light text. Remove the literal `→` from the Markdown and add it via `::after`.

## 5. Code blocks — dark, framed, labelled

This is where the dark areas come from. Configure Rouge with a dark theme (`_config.yml`: `highlighter: rouge`, `kramdown: { syntax_highlighter_opts: { css_class: 'highlight' } }`) and write the block chrome yourself:

```scss
.highlight, div.highlighter-rouge {
  margin: 18px 0;
  border: 1px solid var(--dark-deep);
  border-radius: 10px;
  overflow: hidden;
  background: var(--dark);

  pre { margin: 0; padding: 16px 18px; overflow-x: auto;
        font: 400 14.5px/1.7 'JetBrains Mono', monospace; color: #e6e4e0; }
}
```

Add a title bar showing the language plus a copy button. In Jekyll the cleanest route is a small script in `_includes/scripts.html` that, on load, finds every `div.highlighter-rouge`, reads the language from its class (`language-bash` → `bash`), and prepends:

```html
<div class="code-bar"><span>bash</span><button data-copy>copy</button></div>
```

`.code-bar`: `background: var(--dark-deep); border-bottom: 1px solid var(--dark-line); padding: 8px 14px; display:flex; justify-content:space-between;` with 10px uppercase mono `--on-dark-mute` text. The copy button uses `navigator.clipboard.writeText` and swaps its label to `copied` for 1.2s.

Rouge token colors on dark — keep it restrained, four colors max:
`comment #6f6d69`, `keyword/builtin #c9c6bf`, `string #d7cf9a`, `literal/number #e9a3bd`, everything else `#e6e4e0`. Shell prompts (`$`) render as `--ink-faint`.

## 6. Dark surfaces beyond code

Four places, no more — the page should stay light overall:

1. **Site header**: full-width `--dark` bar, sticky, `padding: 16px 32px`. Wordmark left (keep the existing logo, invert it to light), nav + an EN/DE pill toggle right. The toggle replaces the "Language: English" line in the body — build it from the existing `<slug>.de.md` convention: current language filled light, the other muted.
2. **Meta strip** under the `h1`: replaces the pale "Voraussetzungen / Language" callout. A dark rounded bar split into 2–3 cells by 1px `--dark-line` dividers, each cell a mono uppercase label over a 14px value: Voraussetzungen, Dauer, Sprache. Drive it from front matter, and omit cells whose field is absent.
3. **Site footer**: `--dark`, 26px padding, 12px mono `--on-dark-mute`, site name left / page + language right.
4. **"Start hier" card** on the index page (see §7).

## 7. Index page

Replace the table with cards — the table's third column ("Voraussetzungen") is metadata, not a column worth scanning.

- Full-width dark hero card for Basis-Setup: yellow mono "Start hier" eyebrow, 26px title, one line of description, `→` on the right.
- Below it, a 3-column grid (`gap: 16px`, min 260px, wraps to 1 column under 720px) of light cards on `--surface` with 1px `--line`, radius 12px: 18px bold title, 15px `--ink-mute` description, and a mono uppercase "Braucht: Docker" line at the bottom. Hover: border → `--dark`.
- Generate the cards from a collection or a `_data/manuals.yml` list so the index stops being hand-maintained Markdown.

## 8. Other details

- **Note / check boxes**: `--bg-sunk` background, 1px `--line`, radius 10px, and a mono uppercase label ("Check", "Achtung") in the left gutter of a flex row. Trigger them from a blockquote convention (`> **Check:** …`) so the Markdown stays readable.
- **Mermaid diagrams**: wrap in a bordered white panel with a `--bg-sunk` title bar reading "Diagramm". No other changes — the graphs themselves are fine.
- **Breadcrumb** above the `h1`: `Manuals / Basis-Setup`, 11px mono uppercase, current segment in `--ink`.
- **Prev/next footer** inside the article: a row split left/right, mono uppercase "← Zurück" / "Weiter →" over a 16px title. Read from `prev:`/`next:` front matter; hide either side when absent.
- **Links in prose**: keep as-is (underline, pink decoration, yellow on hover). Set `text-underline-offset: 3px` so the underline stops crowding descenders.
- **Focus states**: 2px `--accent-yellow` outline with 2px offset on every interactive element. Do not remove default focus without a replacement.

## 9. Suggested order of work

1. Tokens + fonts + base type scale (§1–2). Biggest visible win, lowest risk.
2. Dark header and footer (§6.1, §6.3).
3. Code blocks (§5).
4. Step badges (§4).
5. Two-column shell + sidebar TOC (§3).
6. Meta strip and front-matter fields (§6.2).
7. Index cards (§7).
8. Details pass (§8) and responsive check at 1440 / 1080 / 720 / 390px.

Ship each step separately so the diff stays reviewable.
