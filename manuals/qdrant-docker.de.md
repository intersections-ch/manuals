---
title: Qdrant auf Docker
lang: de
slug: qdrant-docker
---

# Qdrant auf Docker

> **Voraussetzungen:** Docker · [Ollama](ollama.de.md) · **Andere Sprachen:** [English](qdrant-docker.md)

In diesem Manual starten wir Qdrant, die Vektordatenbank des Kurs-Stacks. Sie speichert die Embeddings, die deine n8n-Workflows schreiben, und beantwortet Ähnlichkeitssuchen darauf. Sie stammt aus demselben Repository wie n8n: [intersections-ch/docker-n8n-ollama-qdrant](https://github.com/intersections-ch/docker-n8n-ollama-qdrant).

Qdrant speichert nur Vektoren; erzeugen muss sie etwas anderes. In diesem Kurs ist das <mark>`nomic-embed-text`</mark> auf Ollama.

## Installation

Klone den Stack und starte Qdrant. Hast du ihn in einem anderen Manual schon geklont, springst du direkt zum zweiten Befehl. Die Schritte sind auf allen drei Plattformen identisch:

```bash
git clone https://github.com/intersections-ch/docker-n8n-ollama-qdrant.git
cd docker-n8n-ollama-qdrant
docker compose -f docker-compose.qdrant.yml up -d
```

Starte Qdrant **vor** n8n, denn es erzeugt das gemeinsame Netzwerk `ragnet`, dem die anderen Dienste beitreten.

Als Nächstes stellst du sicher, dass das Embedding-Modell vorhanden ist. Du kannst es im Ollama-Container des Stacks holen:

```bash
docker compose -f docker-compose.ollama.yml up -d
docker exec -it ollama ollama pull nomic-embed-text
```

Oder du lässt diese Compose-Datei unangetastet, falls Ollama bereits auf deinem Computer läuft, und holst das Modell direkt:

```bash
ollama pull nomic-embed-text
```

## Prüfen
```bash
curl http://localhost:6333/collections
```

Das liefert `{"result":{"collections":[]},"status":"ok",...}`. Eine leere Liste ist an dieser Stelle richtig, weil noch nichts geschrieben wurde. Das Dashboard erreichst du unter http://localhost:6333/dashboard.

## Ausprobieren (optional)
- http://localhost:6333/dashboard öffnen > **Collections**. Vorerst ist die Liste leer, aber hier kontrollierst du später deine Arbeit.
- Eine von Hand anlegen und wieder löschen:
  ```bash
  curl -X PUT http://localhost:6333/collections/test -H 'Content-Type: application/json' -d '{"vectors":{"size":768,"distance":"Cosine"}}'
  curl -X DELETE http://localhost:6333/collections/test
  ```
  `768` ist die Dimension von `nomic-embed-text`, und diese Zahl muss immer zum verwendeten Embedding-Modell passen.
- In n8n ein **Qdrant**-Credential anlegen, mit URL `http://qdrant:6333` und leerem API-Key.
- `docker compose -f docker-compose.qdrant.yml logs -f` — die Logs mitlesen, während ein Workflow in die Datenbank schreibt.
- `docker compose -f docker-compose.qdrant.yml down -v` — löscht den Vektorspeicher und sonst nichts.

## Typische Probleme
**Ein Node in n8n erreicht `http://localhost:6333` nicht** — im Container bezeichnet `localhost` diesen Container selbst. Nimm stattdessen `http://qdrant:6333`.

**`Wrong input: Vector dimension error`** — die Daten wurden mit einem Modell eingebettet und mit einem anderen abgefragt. Nutz auf beiden Seiten `nomic-embed-text` oder lösch die Collection und bau sie neu auf.

**`port 11434 already in use` beim Start des Stack-Ollama** — Ollama ist bereits auf deinem Computer installiert. Lass `docker-compose.ollama.yml` ungestartet, hol das Modell mit `ollama pull nomic-embed-text` und lass n8n auf `http://host.docker.internal:11434` zeigen.

<!-- #TODO host.docker.internal löst aus einem Linux-Container nicht auf, solange extra_hosts: host-gateway nicht in docker-compose.n8n.yml steht. Entscheiden, ob das Stack-Repo gepatcht wird oder Linux-Nutzer das containerisierte Ollama nehmen sollen. -->
