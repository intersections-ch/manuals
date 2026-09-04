---
title: Ollama
lang: de
---

# Ollama

> **Voraussetzungen:** keine · **Language:** [English](ollama.md)

Führt offene LLMs lokal aus. Du lädst ein Modell herunter und chattest damit im Terminal.

## Installation

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

<!-- #TODO macOS-Cask-Namen prüfen — Homebrew hat `ollama` zu `ollama-app` umbenannt; der alte Name funktioniert auf manchen Installationen noch. -->

## Prüfen
```bash
ollama --version
ollama run llama3.2 "Sag Hallo in fünf Wörtern."
```

Der erste Lauf lädt das Modell (~2 GB) und antwortet dann. `ollama --version` muss auch ohne Modell sofort antworten — hängt es, läuft der Hintergrunddienst nicht.

<!-- #TODO Modell wählen, das im Kurs wirklich verwendet wird, und llama3.2 überall in dieser Datei ersetzen. -->

## Ausprobieren
- `ollama run llama3.2` — interaktiv chatten, `/bye` zum Beenden.
- `ollama list` — zeigt, was auf der Platte liegt. `ollama rm <modell>` gibt den Platz wieder frei.
- `ollama pull nomic-embed-text` — das Embedding-Modell, das der <mark>n8n</mark>-Stack später braucht.
- `curl http://localhost:11434/api/tags` — dieselbe Liste über die HTTP-API, so sprechen andere Tools mit Ollama.
- `ollama run llama3.2 "Fasse das zusammen:" < datei.txt` — eine Datei hineinpipen.

## Typische Probleme
**`port 11434 already in use`** — Ollama läuft bereits (Menüleiste auf macOS, Tray auf Windows, `systemctl status ollama` auf Linux). Nimm die laufende Instanz.

**Das Modell antwortet sehr langsam oder die Maschine swappt** — das Modell ist grösser als dein RAM. Nimm einen kleineren Tag: `ollama run llama3.2:1b`.

**`ollama: command not found` auf macOS nach der App-Installation** — die Ollama-App einmal öffnen; sie installiert das CLI beim ersten Start.
