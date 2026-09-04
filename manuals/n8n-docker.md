---
title: n8n on Docker
lang: en
slug: n8n-docker
---

# n8n on Docker

> **Requires:** Docker · [Qdrant on Docker](qdrant-docker.md) · **Other Languages:** [Deutsch](n8n-docker.de.md)

In this manual we start n8n, the self-hosted automation platform the course builds its workflows in. It runs in a container on your computer, and you reach it in the browser at http://localhost:5678.

> **Careful:** the Ollama image is over 3 GB and the models on top of it are large again. Pull them during a break rather than while the class is waiting for you.

We use the course stack at [intersections-ch/docker-n8n-ollama-qdrant](https://github.com/intersections-ch/docker-n8n-ollama-qdrant) — n8n, [Qdrant](qdrant-docker.md) and [Ollama](ollama.md) as three separate compose files on one shared Docker network.

## Install

Clone the stack. Everything is the same on all three platforms except the command that creates the `files` folder.

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

Ollama is an image of more than 3 GB, so expect this to take a while. Note that `-f` goes **before** the subcommand. `nomic-embed-text` is the embedding model that Qdrant needs; if you also want a chat model inside the container, add `docker exec -it ollama ollama pull gemma4:e2b`.

## Verify
```bash
docker compose -f docker-compose.n8n.yml ps
```

`n8n` should show `running`. Open http://localhost:5678 and create a local owner account. This is asked only on the first visit, and the credentials are yours alone and stay on your computer.

| Service | URL |
|---|---|
| n8n | http://localhost:5678 |
| Qdrant dashboard | http://localhost:6333/dashboard |
| Ollama | http://localhost:11434 |

## Try it (optional)
- Create the owner account at http://localhost:5678.
- Build a first workflow: **Manual Trigger** → **Code** node returning `{ hello: "world" }` → **Execute workflow**.
- Credentials > new > **Ollama**, base URL <mark>`http://ollama:11434`</mark> — not `localhost`.
- Credentials > new > **Qdrant**, URL `http://qdrant:6333`, API key empty.
- `docker compose -f docker-compose.n8n.yml logs -f` — follow the logs while a workflow runs.

## Common problems
**`container name "/n8n" is already in use`** — another stack already owns that name. In `docker-compose.n8n.yml`, change `name:`, `container_name:` and the **left** side of the port mapping (for example `5778:5678`). The other two files follow the same pattern.

**A node inside n8n cannot reach Ollama or Qdrant on `localhost`** — inside the container, `localhost` refers to n8n itself. Use `http://ollama:11434` and `http://qdrant:6333` instead.

**`Resource is still in use` on `down`** — this is expected. The shared `ragnet` network is removed together with the last service you stop.
