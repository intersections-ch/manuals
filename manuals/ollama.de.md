---
title: Ollama
lang: de
---

# Ollama

> **Voraussetzungen:** keine · **Language:** [English](ollama.md)

Führt offene LLMs lokal aus. Du lädst zwei Modelle herunter und chattest mit einem davon im Terminal.

<mark>Achtung:</mark> Das gemma4-Modell ist fast 10 GB gross. Der Download dauert eine Weile — nur installieren, wenn du es wirklich brauchst, am besten während einer Pause. Die Chat-Modelle brauchen ausserdem viel RAM auf deinem Computer.

| Modell | Wofür |
|---|---|
| `gemma4:e2b` | Chat-Modell, ~3.5 GB |
| `gemma4:e4b` | Grösseres Chat-Modell, ~9.6 GB |
| `nomic-embed-text` | Embeddings — das, was [Qdrant](qdrant-docker.de.md) speichert, ~274 MB |

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

Dann beide Modelle holen, auf jeder Plattform:

```bash
ollama pull gemma4:e2b
ollama pull nomic-embed-text
```

## Prüfen
```bash
ollama --version
ollama run gemma4:e2b "Sag Hallo in fünf Wörtern."
```

Gibt eine Version aus, dann eine Antwort. `ollama --version` muss auch ohne Modell sofort antworten — hängt es, läuft der Hintergrunddienst nicht.

## Ausprobieren
- `ollama run gemma4:e2b` — interaktiv chatten, `/bye` zum Beenden.
- `ollama list` — zeigt, was auf der Platte liegt. `ollama rm <modell>` gibt den Platz wieder frei.
- `curl http://localhost:11434/api/tags` — dieselbe Liste über die HTTP-API, so sprechen andere Tools mit Ollama.
- `ollama run gemma4:e2b "Fasse das zusammen:" < datei.txt` — eine Datei hineinpipen.
- `curl http://localhost:11434/api/embeddings -d '{"model":"nomic-embed-text","prompt":"hallo"}'` — 768 Zahlen. Genau die landen später in <mark>Qdrant</mark>.

## Typische Probleme
**`port 11434 already in use`** — Ollama läuft bereits (Menüleiste auf macOS, Tray auf Windows, `systemctl status ollama` auf Linux). Nimm die laufende Instanz.

**`gemma4:e4b` antwortet sehr langsam oder die Maschine swappt** — es will ~16 GB RAM. Nimm die kleinere Variante: `ollama run gemma4:e2b`.

**`ollama: command not found` auf macOS nach der App-Installation** — die Ollama-App einmal öffnen; sie installiert das CLI beim ersten Start.
