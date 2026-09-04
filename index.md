---
title: Manuals
lang: en
layout: manuals
permalink: /
alt: /de/
intro: "New here? Start with Basic Setup, which walks through the other manuals in order. Otherwise pick whichever one you need and work through it. If you get stuck, paste the error into Claude — it will usually recognise it. If that does not help, ask one of the instructors."
repo_note: The markdown files for these manuals live here
repo_url: https://github.com/intersections-ch/manuals
---

## Order

```mermaid
graph LR
  setup[Basic Setup] --> sbx[Claude Sandbox]
  setup --> git[Git Repo Access]
  setup --> n8n[n8n on Docker]
  sbx --> mcp[Claude ↔ n8n]
  n8n --> mcp
  qdrant[Qdrant on Docker] --> n8n
  n8n --> rag[RAG in n8n]
  qdrant --> rag
  ollama[Ollama] --> qdrant
  docker[Docker] --> sbx
  docker --> qdrant
  docker --> n8n
```

Git, a terminal and a code editor are assumed. Docker isn't — see the note at the top of each manual that needs it.
