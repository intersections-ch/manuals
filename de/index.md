---
title: Manuals
lang: de
layout: manuals
permalink: /de/
alt: /
intro: "Neu hier? Fang mit Basis-Setup an, das der Reihe nach durch die anderen Manuals führt. Sonst nimm das Manual, das du brauchst, und arbeite es durch. Kommst du nicht weiter, füg die Fehlermeldung in Claude ein — meistens erkennt es das Problem. Hilft das nicht, wende dich an die Kursleitung."
repo_note: "Die Markdown-Files der Anleitungen befinden sich hier"
repo_url: https://github.com/intersections-ch/manuals
---

## Reihenfolge

```mermaid
graph LR
  setup[Basis-Setup] --> sbx[Claude Sandbox]
  setup --> git[Git-Repo-Zugang]
  setup --> n8n[n8n auf Docker]
  sbx --> mcp[Claude ↔ n8n]
  n8n --> mcp
  qdrant[Qdrant auf Docker] --> n8n
  n8n --> rag[RAG in n8n]
  qdrant --> rag
  ollama[Ollama] --> qdrant
  docker[Docker] --> sbx
  docker --> qdrant
  docker --> n8n
```

Git, ein Terminal und ein Code-Editor werden vorausgesetzt. Docker nicht — siehe die Notiz oben in jedem Manual, das es braucht.
