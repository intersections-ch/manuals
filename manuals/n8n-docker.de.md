---
title: n8n auf Docker
lang: de
slug: n8n-docker
---

# n8n auf Docker

> **Voraussetzungen:** Docker · [Qdrant auf Docker](qdrant-docker.de.md) · **Andere Sprachen:** [English](n8n-docker.md)

In diesem Manual starten wir n8n, die selbst gehostete Automatisierungsplattform, in der der Kurs seine Workflows baut. Sie läuft in einem Container auf deinem Computer, und du erreichst sie im Browser unter http://localhost:5678.

> **Achtung:** Das Ollama-Image ist über 3 GB gross, die Modelle darauf nochmals. Hol sie am besten während einer Pause und nicht, während die Klasse auf dich wartet.

Wir nutzen den Kurs-Stack unter [intersections-ch/docker-n8n-ollama-qdrant](https://github.com/intersections-ch/docker-n8n-ollama-qdrant) — n8n, [Qdrant](qdrant-docker.de.md) und [Ollama](ollama.de.md) als drei separate Compose-Dateien in einem gemeinsamen Docker-Netzwerk.

## Installation

Klone den Stack. Auf allen drei Plattformen ist alles gleich, ausser dem Befehl, der den `files`-Ordner anlegt.

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

Ollama ist ein Image von über 3 GB, rechne also mit etwas Wartezeit. Beachte, dass `-f` **vor** dem Unterbefehl steht. `nomic-embed-text` ist das Embedding-Modell, das Qdrant braucht; willst du zusätzlich ein Chat-Modell im Container, ergänz `docker exec -it ollama ollama pull gemma4:e2b`.

## Prüfen
```bash
docker compose -f docker-compose.n8n.yml ps
```

`n8n` sollte auf `running` stehen. Öffne http://localhost:5678 und leg ein lokales Owner-Konto an. Danach wirst du nicht mehr gefragt, und die Zugangsdaten gehören dir allein und bleiben auf deinem Computer.

| Dienst | URL |
|---|---|
| n8n | http://localhost:5678 |
| Qdrant-Dashboard | http://localhost:6333/dashboard |
| Ollama | http://localhost:11434 |

## Ausprobieren (optional)
- Owner-Konto unter http://localhost:5678 anlegen.
- Bau einen ersten Workflow: **Manual Trigger** → **Code**-Node, der `{ hello: "world" }` zurückgibt → **Execute workflow**.
- Credentials > new > **Ollama**, Base URL <mark>`http://ollama:11434`</mark> — nicht `localhost`.
- Credentials > new > **Qdrant**, URL `http://qdrant:6333`, API-Key leer lassen.
- `docker compose -f docker-compose.n8n.yml logs -f` — die Logs mitlesen, während ein Workflow läuft.

## Typische Probleme
**`container name "/n8n" is already in use`** — ein anderer Stack belegt diesen Namen bereits. Änder in `docker-compose.n8n.yml` `name:`, `container_name:` und die **linke** Seite des Port-Mappings (zum Beispiel `5778:5678`). Die anderen zwei Dateien folgen demselben Muster.

**Ein Node in n8n erreicht Ollama oder Qdrant unter `localhost` nicht** — im Container bezeichnet `localhost` n8n selbst. Nimm stattdessen `http://ollama:11434` und `http://qdrant:6333`.

**`Resource is still in use` bei `down`** — das ist normal. Das gemeinsame Netzwerk `ragnet` wird zusammen mit dem letzten Dienst entfernt, den du stoppst.
