---
title: Ollama
lang: en
slug: ollama
---

# Ollama

> **Requires:** nothing · **Other Languages:** [Deutsch](ollama.de.md)

In this manual we install Ollama, which runs open language models directly on your computer instead of in the cloud. You will download two models and chat with one of them from the terminal.

> **Careful:** the gemma4 model is nearly 10 GB. The download takes a while — only install it if you actually need it, and ideally during a break. The chat models also need a considerable amount of RAM on your computer.

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

With Ollama installed, download the two models you need. This step is the same on every platform:

```bash
ollama pull gemma4:e2b
ollama pull nomic-embed-text
```

## Verify
```bash
ollama --version
ollama run gemma4:e2b "Say hi in five words."
```

You should see a version number, then a short answer from the model. `ollama --version` has to respond even when no model has been downloaded yet, so if that command hangs, the background service is not running.

## Try it (optional)
- `ollama run gemma4:e2b` — chat interactively, `/bye` to leave.
- `ollama list` — shows which models are stored locally. `ollama rm <model>` removes one and frees the space again.
- `curl http://localhost:11434/api/tags` — the same list over the HTTP API, which is how other tools talk to it.
- `ollama run gemma4:e2b "Summarise this:" < some-file.txt` — passes the contents of a file to the model.
- `curl http://localhost:11434/api/embeddings -d '{"model":"nomic-embed-text","prompt":"hello"}'` — returns 768 numbers. Those are exactly what <mark>Qdrant</mark> later stores.

## Common problems
**`port 11434 already in use`** — Ollama is already running (menu bar on macOS, system tray on Windows, `systemctl status ollama` on Linux). Use that running instance rather than starting a second one.

**`gemma4:e4b` answers very slowly** — the model needs around 16 GB of RAM, and below that the system starts swapping to disk. Use the smaller variant instead: `ollama run gemma4:e2b`.

**`ollama: command not found` on macOS after installing the app** — open the Ollama app once. It installs the command line tool on first launch.
