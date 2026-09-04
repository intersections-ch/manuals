---
title: Qdrant auf Docker
lang: de
---

# Qdrant auf Docker

> **Voraussetzungen:** Docker · [Ollama](ollama.de.md) · **Language:** [English](qdrant-docker.md)

Vektordatenbank. Sie speichert die Embeddings, die deine n8n-Workflows schreiben, und beantwortet Ähnlichkeitssuchen darauf. Gleicher Kurs-Stack wie n8n: [intersections-ch/docker-n8n-ollama-qdrant](https://github.com/intersections-ch/docker-n8n-ollama-qdrant).

Qdrant speichert nur Vektoren — erzeugen muss sie etwas anderes. Das ist <mark>`nomic-embed-text`</mark> auf Ollama.

## Installation

Stack klonen (überspringen, wenn du ihn aus einem anderen Manual schon hast) und Qdrant starten. Auf allen drei Plattformen identisch:

```bash
git clone https://github.com/intersections-ch/docker-n8n-ollama-qdrant.git
cd docker-n8n-ollama-qdrant
docker compose -f docker-compose.qdrant.yml up -d
```

Qdrant **vor** n8n starten — es erzeugt das gemeinsame Netzwerk `ragnet`, dem die anderen beitreten.

Dann sicherstellen, dass das Embedding-Modell da ist. Entweder im Ollama-Container des Stacks:

```bash
docker compose -f docker-compose.ollama.yml up -d
docker exec -it ollama ollama pull nomic-embed-text
```

oder, wenn Ollama schon auf deiner Maschine läuft, diese Compose-Datei weglassen und einfach:

```bash
ollama pull nomic-embed-text
```

## Prüfen
```bash
curl http://localhost:6333/collections
```

Liefert `{"result":{"collections":[]},"status":"ok",...}` — leer ist richtig, du hast noch nichts geschrieben. Das Dashboard liegt unter http://localhost:6333/dashboard.

## Ausprobieren
- http://localhost:6333/dashboard öffnen > **Collections**. Vorerst leer; hier kontrollierst du später deine Arbeit.
- Eine von Hand anlegen und wieder löschen:
  ```bash
  curl -X PUT http://localhost:6333/collections/test -H 'Content-Type: application/json' -d '{"vectors":{"size":768,"distance":"Cosine"}}'
  curl -X DELETE http://localhost:6333/collections/test
  ```
  `768` ist die Dimension von `nomic-embed-text` — die Zahl muss zum Embedding-Modell passen.
- In n8n ein **Qdrant**-Credential anlegen: URL `http://qdrant:6333`, API-Key leer.
- `docker compose -f docker-compose.qdrant.yml logs -f` laufen lassen, während ein Workflow schreibt.
- `docker compose -f docker-compose.qdrant.yml down -v` löscht den Vektorspeicher und sonst nichts.

## Typische Probleme
**Ein Node in n8n erreicht `http://localhost:6333` nicht** — im Container ist `localhost` dieser Container. Nimm `http://qdrant:6333`.

**`Wrong input: Vector dimension error`** — du hast mit einem Modell embedded und mit einem anderen abgefragt. Auf beiden Seiten `nomic-embed-text` nutzen oder die Collection löschen und neu aufbauen.

**`port 11434 already in use` beim Start des Stack-Ollama** — Ollama läuft schon nativ. `docker-compose.ollama.yml` nicht starten; das Modell mit einfachem `ollama pull nomic-embed-text` holen und n8n auf `http://host.docker.internal:11434` zeigen lassen.

<!-- #TODO host.docker.internal löst aus einem Linux-Container nicht auf, solange extra_hosts: host-gateway nicht in docker-compose.n8n.yml steht. Entscheiden, ob das Stack-Repo gepatcht wird oder Linux-Nutzer das containerisierte Ollama nehmen sollen. -->
