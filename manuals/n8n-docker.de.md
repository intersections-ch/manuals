---
title: n8n auf Docker
lang: de
---

# n8n auf Docker

> **Voraussetzungen:** Docker · [Qdrant auf Docker](qdrant-docker.de.md) · **Language:** [English](n8n-docker.md)

Selbst gehostete Automatisierungsplattform. Du startest sie in einem Container und meldest dich unter http://localhost:5678 an.

Wir nutzen den Kurs-Stack unter [intersections-ch/docker-n8n-ollama-qdrant](https://github.com/intersections-ch/docker-n8n-ollama-qdrant) — n8n, [Qdrant](qdrant-docker.de.md) und [Ollama](ollama.de.md) als drei separate Compose-Dateien in einem gemeinsamen Docker-Netzwerk.

## Installation

Stack klonen. Nur der `files`-Ordner unterscheidet sich je nach Plattform.

### macOS
```bash
git clone https://github.com/intersections-ch/docker-n8n-ollama-qdrant.git
cd docker-n8n-ollama-qdrant
mkdir -p files
```

### Windows
```powershell
git clone https://github.com/intersections-ch/docker-n8n-ollama-qdrant.git
cd docker-n8n-ollama-qdrant
New-Item -ItemType Directory -Force files
```

### Linux
```bash
git clone https://github.com/intersections-ch/docker-n8n-ollama-qdrant.git
cd docker-n8n-ollama-qdrant
mkdir -p files
```

Danach auf jeder Plattform die drei Dienste in dieser Reihenfolge starten:

```bash
docker compose -f docker-compose.qdrant.yml up -d
docker compose -f docker-compose.ollama.yml up -d
docker compose -f docker-compose.n8n.yml up -d
docker exec -it ollama ollama pull nomic-embed-text
```

Ollama ist ein Image von über 3 GB und braucht seine Zeit. `-f` steht **vor** dem Unterbefehl. `nomic-embed-text` ist das Embedding-Modell, das Qdrant braucht; für ein Chat-Modell im Container zusätzlich `docker exec -it ollama ollama pull gemma4:e4b`.

## Prüfen
```bash
docker compose -f docker-compose.n8n.yml ps
```

`n8n` steht auf `running`. Öffne http://localhost:5678 und lege ein lokales Owner-Konto an — nur beim ersten Besuch, die Zugangsdaten gehören dir und bleiben auf deiner Maschine.

| Dienst | URL |
|---|---|
| n8n | http://localhost:5678 |
| Qdrant-Dashboard | http://localhost:6333/dashboard |
| Ollama | http://localhost:11434 |

## Ausprobieren
- Owner-Konto unter http://localhost:5678 anlegen.
- Neuer Workflow → **Manual Trigger** → **Code**-Node, der `{ hello: "world" }` zurückgibt → **Execute workflow**.
- Ollama-Credential anlegen mit Base URL <mark>`http://ollama:11434`</mark> — nicht `localhost`.
- Qdrant-Credential anlegen mit URL `http://qdrant:6333`, API-Key leer lassen.
- `docker compose -f docker-compose.n8n.yml logs -f` laufen lassen, während du einen Workflow ausführst.

## Typische Probleme
**`container name "/n8n" is already in use`** — ein anderer Stack belegt den Namen. In `docker-compose.n8n.yml` `name:`, `container_name:` und die **linke** Seite des Port-Mappings ändern (z. B. `5778:5678`). Für die anderen zwei Dateien gleich vorgehen.

**Ein Node in n8n erreicht Ollama oder Qdrant unter `localhost` nicht** — im Container ist `localhost` n8n selbst. Nimm `http://ollama:11434` und `http://qdrant:6333`.

**`Resource is still in use` bei `down`** — normal. Das gemeinsame Netzwerk `ragnet` verschwindet mit dem letzten Dienst, den du stoppst.
