---
title: Qdrant on Docker
lang: en
slug: qdrant-docker
---

# Qdrant on Docker

> **Requires:** Docker · [Ollama](ollama.md) · **Other Languages:** [Deutsch](qdrant-docker.de.md)

In this manual we start Qdrant, the vector database of the course stack. It stores the embeddings your n8n workflows write and answers similarity searches against them. It comes from the same repository as n8n: [intersections-ch/docker-n8n-ollama-qdrant](https://github.com/intersections-ch/docker-n8n-ollama-qdrant).

Qdrant only stores vectors; producing them is someone else's job. In this course that is <mark>`nomic-embed-text`</mark> running on Ollama.

## Install

Clone the stack and start Qdrant. If you already cloned it in another manual, skip straight to the second command. The steps are identical on all three platforms:

```bash
git clone https://github.com/intersections-ch/docker-n8n-ollama-qdrant.git
cd docker-n8n-ollama-qdrant
docker compose -f docker-compose.qdrant.yml up -d
```

Start Qdrant **before** n8n, because it creates the shared `ragnet` network that the other services join.

Next, make sure the embedding model is available. You can pull it inside the stack's own Ollama container:

```bash
docker compose -f docker-compose.ollama.yml up -d
docker exec -it ollama ollama pull nomic-embed-text
```

Or, if Ollama already runs on your computer, leave that compose file alone and pull the model directly:

```bash
ollama pull nomic-embed-text
```

## Verify
```bash
curl http://localhost:6333/collections
```

This returns `{"result":{"collections":[]},"status":"ok",...}`. An empty list is correct at this stage, since nothing has been written yet. The dashboard is available at http://localhost:6333/dashboard.

## Try it (optional)
- Open http://localhost:6333/dashboard > **Collections**. It is empty for now, but this is where you will check your work later.
- Create one by hand and delete it again:
  ```bash
  curl -X PUT http://localhost:6333/collections/test -H 'Content-Type: application/json' -d '{"vectors":{"size":768,"distance":"Cosine"}}'
  curl -X DELETE http://localhost:6333/collections/test
  ```
  `768` is the dimension of `nomic-embed-text`, and this number always has to match the embedding model you use.
- In n8n, add a **Qdrant** credential with URL `http://qdrant:6333` and an empty API key.
- `docker compose -f docker-compose.qdrant.yml logs -f` — follow the logs while a workflow writes to the database.
- `docker compose -f docker-compose.qdrant.yml down -v` — deletes the vector store and nothing else.

## Common problems
**A node in n8n cannot reach `http://localhost:6333`** — inside a container, `localhost` refers to that container itself. Use `http://qdrant:6333` instead.

**`Wrong input: Vector dimension error`** — the data was embedded with one model and queried with another. Use `nomic-embed-text` on both sides, or delete the collection and build it again.

**`port 11434 already in use` when starting the stack's Ollama** — Ollama is already installed on your computer. Leave `docker-compose.ollama.yml` unstarted, pull the model with `ollama pull nomic-embed-text`, and point n8n at `http://host.docker.internal:11434`.

<!-- #TODO host.docker.internal does not resolve from a Linux container unless extra_hosts: host-gateway is added to docker-compose.n8n.yml. Decide whether to patch the stack repo or tell Linux users to use the containerised Ollama. -->
