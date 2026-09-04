---
title: Ollama
lang: de
slug: ollama
---

# Ollama

> **Voraussetzungen:** keine · **Andere Sprachen:** [English](ollama.md)

In diesem Manual installieren wir Ollama, das offene Sprachmodelle direkt auf deinem Computer ausführt statt in der Cloud. Du lädst zwei Modelle herunter und chattest mit einem davon im Terminal.

> **Achtung:** Das gemma4-Modell ist fast 10 GB gross. Der Download dauert eine Weile — nur installieren, wenn du es wirklich brauchst, am besten während einer Pause. Die Chat-Modelle brauchen ausserdem viel RAM auf deinem Computer.

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

Ist Ollama installiert, lädst du die beiden Modelle herunter, die du brauchst. Dieser Schritt ist auf jeder Plattform derselbe:

```bash
ollama pull gemma4:e2b
ollama pull nomic-embed-text
```

## Prüfen
```bash
ollama --version
ollama run gemma4:e2b "Sag Hallo in fünf Wörtern."
```

Du solltest eine Versionsnummer sehen und danach eine kurze Antwort des Modells. `ollama --version` muss auch dann antworten, wenn noch kein Modell heruntergeladen ist — hängt dieser Befehl, läuft der Hintergrunddienst nicht.

## Ausprobieren (optional)
- `ollama run gemma4:e2b` — interaktiv chatten, `/bye` zum Beenden.
- `ollama list` — zeigt, welche Modelle lokal gespeichert sind. `ollama rm <modell>` entfernt eines und gibt den Speicherplatz wieder frei.
- `curl http://localhost:11434/api/tags` — dieselbe Liste über die HTTP-API, so sprechen andere Tools mit Ollama.
- `ollama run gemma4:e2b "Fasse das zusammen:" < datei.txt` — übergibt dem Modell den Inhalt einer Datei.
- `curl http://localhost:11434/api/embeddings -d '{"model":"nomic-embed-text","prompt":"hallo"}'` — liefert 768 Zahlen zurück. Genau die speichert <mark>Qdrant</mark> später.

## Typische Probleme
**`port 11434 already in use`** — Ollama läuft bereits (Menüleiste auf macOS, Infobereich auf Windows, `systemctl status ollama` auf Linux). Verwende diese laufende Instanz, statt eine zweite zu starten.

**`gemma4:e4b` antwortet sehr langsam** — das Modell braucht rund 16 GB RAM, darunter lagert das System auf die Festplatte aus. Nimm stattdessen die kleinere Variante: `ollama run gemma4:e2b`.

**`ollama: command not found` auf macOS nach der App-Installation** — öffne die Ollama-App einmal. Sie installiert das Kommandozeilen-Tool beim ersten Start.
