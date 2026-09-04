---
title: Manuals
lang: en
permalink: /
---

# Manuals

**Sprache:** [Deutsch](README.de.md)

> The markdown files for these manuals live here: **[github.com/intersections-ch/manuals](https://github.com/intersections-ch/manuals)**

New here? Start with [Basic Setup](manuals/basic-setup.md) — it walks the other manuals in order.
Otherwise pick one, follow it, try the things at the end. Done early? Start the next one.
Stuck? Ask Claude — paste the error, it usually knows. Still stuck? Ask one of the instructors.

| Manual | What you get | Requires |
|---|---|---|
| [Basic Setup](manuals/basic-setup.md) | The whole course environment, in order | – |
| [Claude Sandbox](manuals/claude-sandbox.md) | Claude Code in an isolated Docker box | Docker |
| [Git Repo Access](manuals/git-repo.md) | SSH key + the course repo on your machine | – |
| [Qdrant on Docker](manuals/qdrant-docker.md) | Local vector database | Docker, Ollama |
| [n8n on Docker](manuals/n8n-docker.md) | Local automation server | Docker, Qdrant |
| [RAG in n8n](manuals/n8n-rag.md) | Two workflows: a chat agent with a memory | Qdrant, n8n |
| [Claude ↔ n8n (MCP)](manuals/claude-mcp-n8n.md) | Claude talks to your n8n | n8n, Claude Sandbox |
| [Ollama](manuals/ollama.md) | Local LLMs on your machine (`gemma4:e2b`, `nomic-embed-text`) | – |

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

Every manual has a German twin at `<slug>.de.md`, linked from the header line of each page.
