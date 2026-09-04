---
title: Qdrant on Docker
lang: en
slug: qdrant-docker
---

# Qdrant on Docker

> **Requires:** Docker · [Ollama](ollama.md) · **Sprache:** [Deutsch](qdrant-docker.de.md)

Vector database. It stores the embeddings your n8n workflows write, and answers similarity searches against them. Same course stack as n8n: [intersections-ch/docker-n8n-ollama-qdrant](https://github.com/intersections-ch/docker-n8n-ollama-qdrant).

Qdrant only stores vectors — something else has to produce them. That's <mark>`nomic-embed-text`</mark> running on Ollama.

## Install

Clone the stack (skip if you already have it from another manual) and start Qdrant. Identical on all three platforms:

```bash
git clone https://github.com/intersections-ch/docker-n8n-ollama-qdrant.git
cd docker-n8n-ollama-qdrant
docker compose -f docker-compose.qdrant.yml up -d
```

Start Qdrant **before** n8n — it creates the shared `ragnet` network the others join.

Then make sure the embedding model exists. Either in the stack's Ollama container:

```bash
docker compose -f docker-compose.ollama.yml up -d
docker exec -it ollama ollama pull nomic-embed-text
```

or, if you already run Ollama on your machine, skip that compose file and just:

```bash
ollama pull nomic-embed-text
```

## Verify
```bash
curl http://localhost:6333/collections
```

Returns `{"result":{"collections":[]},"status":"ok",...}` — empty is correct, you haven't written anything yet. The dashboard is at http://localhost:6333/dashboard.

## Try it
- Open http://localhost:6333/dashboard > **Collections**. Empty for now; this is where you check your work later.
- Create one by hand and delete it again:
  ```bash
  curl -X PUT http://localhost:6333/collections/test -H 'Content-Type: application/json' -d '{"vectors":{"size":768,"distance":"Cosine"}}'
  curl -X DELETE http://localhost:6333/collections/test
  ```
  `768` is `nomic-embed-text`'s dimension — the number has to match your embedding model.
- In n8n, add a **Qdrant** credential: URL `http://qdrant:6333`, API key empty.
- `docker compose -f docker-compose.qdrant.yml logs -f` while a workflow writes to it.
- `docker compose -f docker-compose.qdrant.yml down -v` wipes the vector store and nothing else.

## Common problems
**A node in n8n can't reach `http://localhost:6333`** — inside a container `localhost` is that container. Use `http://qdrant:6333`.

**`Wrong input: Vector dimension error`** — you embedded with one model and queried with another. Use `nomic-embed-text` on both sides, or delete the collection and rebuild it.

**`port 11434 already in use` when starting the stack's Ollama** — you already run Ollama natively. Don't start `docker-compose.ollama.yml`; pull the model with plain `ollama pull nomic-embed-text` and point n8n at `http://host.docker.internal:11434`.

<!-- #TODO host.docker.internal does not resolve from a Linux container unless extra_hosts: host-gateway is added to docker-compose.n8n.yml. Decide whether to patch the stack repo or tell Linux users to use the containerised Ollama. -->
