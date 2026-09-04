---
title: n8n on Docker
lang: en
---

# n8n on Docker

> **Requires:** Docker · [Qdrant on Docker](qdrant-docker.md) · **Sprache:** [Deutsch](n8n-docker.de.md)

Self-hosted automation platform. You'll run it in a container and log in at http://localhost:5678.

We use the course stack at [intersections-ch/docker-n8n-ollama-qdrant](https://github.com/intersections-ch/docker-n8n-ollama-qdrant) — n8n, [Qdrant](qdrant-docker.md) and [Ollama](ollama.md) as three separate compose files on one shared Docker network.

## Install

Clone the stack. Only the `files` folder differs per platform.

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

Then start the three services, in this order, on every platform:

```bash
docker compose -f docker-compose.qdrant.yml up -d
docker compose -f docker-compose.ollama.yml up -d
docker compose -f docker-compose.n8n.yml up -d
docker exec -it ollama ollama pull nomic-embed-text
```

Ollama is a >3 GB image and takes a while. `-f` goes **before** the subcommand. `nomic-embed-text` is the embedding model Qdrant needs; add `docker exec -it ollama ollama pull gemma4:e4b` if you also want a chat model in the container.

## Verify
```bash
docker compose -f docker-compose.n8n.yml ps
```

`n8n` shows `running`. Open http://localhost:5678 and create a local owner account — first visit only, the credentials are yours and stay on your machine.

| Service | URL |
|---|---|
| n8n | http://localhost:5678 |
| Qdrant dashboard | http://localhost:6333/dashboard |
| Ollama | http://localhost:11434 |

## Try it
- Create the owner account at http://localhost:5678.
- New workflow → **Manual Trigger** → **Code** node returning `{ hello: "world" }` → **Execute workflow**.
- Add an **Ollama** credential with base URL <mark>`http://ollama:11434`</mark> — not `localhost`.
- Add a **Qdrant** credential with URL `http://qdrant:6333`, API key empty.
- `docker compose -f docker-compose.n8n.yml logs -f` while you run a workflow.

## Common problems
**`container name "/n8n" is already in use`** — another stack owns the name. Edit `docker-compose.n8n.yml`: change `name:`, `container_name:` and the **left** side of the port mapping (e.g. `5778:5678`). Same shape for the other two files.

**A node inside n8n can't reach Ollama or Qdrant on `localhost`** — inside the container `localhost` is n8n itself. Use `http://ollama:11434` and `http://qdrant:6333`.

**`Resource is still in use` on `down`** — expected. The shared `ragnet` network goes away with the last service you stop.
