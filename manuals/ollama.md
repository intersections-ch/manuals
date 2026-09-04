---
title: Ollama
lang: en
---

# Ollama

> **Requires:** nothing · **Sprache:** [Deutsch](ollama.de.md)

Runs open LLMs locally. You'll pull a model and chat with it from the terminal.

## Install

### macOS
```bash
brew install --cask ollama-app
```

### Windows
```powershell
winget install -e --id Ollama.Ollama
```

### Linux
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

<!-- #TODO verify the macOS cask name — Homebrew renamed `ollama` to `ollama-app`; the old name still resolves on some installs. -->

## Verify
```bash
ollama --version
ollama run llama3.2 "Say hi in five words."
```

The first run downloads the model (~2 GB), then prints an answer. `ollama --version` alone must answer even when nothing is downloaded — if it hangs, the background service isn't running.

<!-- #TODO pick the model the course actually uses and replace llama3.2 everywhere in this file. -->

## Try it
- `ollama run llama3.2` — chat interactively, `/bye` to leave.
- `ollama list` — see what's on disk. `ollama rm <model>` frees the space again.
- `ollama pull nomic-embed-text` — the embedding model the <mark>n8n</mark> stack needs later.
- `curl http://localhost:11434/api/tags` — the same list over the HTTP API, which is how other tools talk to it.
- `ollama run llama3.2 "Summarise this:" < some-file.txt` — pipe a file in.

## Common problems
**`port 11434 already in use`** — Ollama is already running (menu bar on macOS, tray on Windows, `systemctl status ollama` on Linux). Use the running one.

**The model answers very slowly or the machine swaps** — the model is bigger than your RAM. Pull a smaller tag: `ollama run llama3.2:1b`.

**`ollama: command not found` on macOS after installing the app** — open the Ollama app once; it installs the CLI on first launch.
