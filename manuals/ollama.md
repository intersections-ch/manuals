---
title: Ollama
lang: en
---

# Ollama

> **Requires:** nothing · **Sprache:** [Deutsch](ollama.de.md)

Runs open LLMs locally. You'll pull two models and chat with one of them from the terminal.

<mark>Careful:</mark> the gemma4 model is nearly 10 GB. The download takes a while — only install it if you actually need it, and ideally during a break. The chat models also want a lot of RAM on your machine.

| Model | For |
|---|---|
| `gemma4:e2b` | chat model, ~3.5 GB |
| `gemma4:e4b` | larger chat model, ~9.6 GB |
| `nomic-embed-text` | embeddings — what [Qdrant](qdrant-docker.md) stores, ~274 MB |

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

Then pull both models, on every platform:

```bash
ollama pull gemma4:e2b
ollama pull nomic-embed-text
```

## Verify
```bash
ollama --version
ollama run gemma4:e2b "Say hi in five words."
```

Prints a version, then an answer. `ollama --version` alone must answer even when nothing is downloaded — if it hangs, the background service isn't running.

## Try it
- `ollama run gemma4:e2b` — chat interactively, `/bye` to leave.
- `ollama list` — see what's on disk. `ollama rm <model>` frees the space again.
- `curl http://localhost:11434/api/tags` — the same list over the HTTP API, which is how other tools talk to it.
- `ollama run gemma4:e2b "Summarise this:" < some-file.txt` — pipe a file in.
- `curl http://localhost:11434/api/embeddings -d '{"model":"nomic-embed-text","prompt":"hello"}'` — 768 numbers. That is what <mark>Qdrant</mark> ends up storing.

## Common problems
**`port 11434 already in use`** — Ollama is already running (menu bar on macOS, tray on Windows, `systemctl status ollama` on Linux). Use the running one.

**`gemma4:e4b` answers very slowly or the machine swaps** — it wants ~16 GB of RAM. Use the smaller variant: `ollama run gemma4:e2b`.

**`ollama: command not found` on macOS after installing the app** — open the Ollama app once; it installs the CLI on first launch.
