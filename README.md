---
title: Manuals
permalink: /
---

# Manuals

Pick a manual, follow it, try the things at the end. Done early? Start the next one.
Stuck? Ask Claude — paste the error, it usually knows.

| Manual | What you get | Requires |
|---|---|---|
| [Ollama](manuals/ollama.md) | Local LLMs on your machine | – |
| [n8n on Docker](manuals/n8n-docker.md) | Local automation server | Docker |
| [Claude ↔ n8n (MCP)](manuals/claude-mcp-n8n.md) | Claude talks to your n8n | n8n on Docker |
| [Claude Sandbox](manuals/claude-sandbox.md) | Claude Code in an isolated Docker box | Docker |

## Order

```mermaid
graph LR
  docker[Docker] --> n8n[n8n on Docker] --> mcp[Claude ↔ n8n]
  docker --> sbx[Claude Sandbox]
  ollama[Ollama]
```

Git, a terminal and a code editor are assumed. Docker isn't — see the note at the top of each manual that needs it.
