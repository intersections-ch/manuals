---
title: RAG in n8n
lang: en
---

# RAG in n8n

> **Requires:** [Qdrant on Docker](qdrant-docker.md) · [n8n on Docker](n8n-docker.md) · **Sprache:** [Deutsch](n8n-rag.de.md)

Two workflows that give a chat agent a memory. The first takes facts you type and stores them as vectors in Qdrant; the second answers questions by looking those facts up first. That loop — retrieve, then generate — is the whole idea of RAG.

Everything happens in the n8n UI at http://localhost:5678. No OS differences.

## Install

First, the collection. Both workflows write to and read from the same one, and `768` is <mark>`nomic-embed-text`</mark>'s dimension:

```bash
curl -X PUT http://localhost:6333/collections/facts \
  -H 'Content-Type: application/json' \
  -d '{"vectors":{"size":768,"distance":"Cosine"}}'
```

You need two credentials, once, reused by both workflows. Use the **internal** hostnames — inside the n8n container `localhost` is n8n itself:

| Credential | Setting |
|---|---|
| Qdrant | URL `http://qdrant:6333`, API key empty |
| Ollama | Base URL `http://ollama:11434` |

### 1. Remember — the ingest workflow

New workflow, name it `Remember`. Four nodes:

1. **When chat message received** (Chat Trigger) — the starting node.
2. **Qdrant Vector Store** — Operation Mode <mark>**Insert Documents**</mark>, Qdrant Collection `facts`.
3. On the vector store's **Embedding** connector: **Embeddings Ollama** — model `nomic-embed-text`.
4. On its **Document** connector: **Default Data Loader** — Type of Data `JSON`, Mode `Load Specific Data`, Data `{{ $json.chatInput }}`. Give it a **Recursive Character Text Splitter** with chunk size `1000`, overlap `200`.

Save, then open the chat panel and type a few facts it couldn't know:

```
Our office cat is called Bruno and he is fourteen years old.
```

```
The coffee machine on the second floor takes only 5 rappen coins.
```

### 2. Ask — the query workflow

New workflow, name it `Ask`. Four nodes:

1. **When chat message received** (Chat Trigger).
2. **AI Agent** — defaults are fine.
3. On the agent's **Chat Model** connector, pick one:
   - **Anthropic Chat Model** — your own API key, newest Claude Sonnet in the dropdown. Better answers, needs credit.
   - **Ollama Chat Model** — model `gemma4:e2b`. Free and local, but slower and noticeably weaker. `gemma4:e4b` answers better and wants ~16 GB of RAM.
4. On the agent's **Tool** connector: another **Qdrant Vector Store**, Operation Mode <mark>**Retrieve Documents (As Tool for AI Agent)**</mark>, collection `facts`, Name `facts`, Description `Facts the user has taught me. Search here before answering anything about the office, people or places.` Give it its own **Embeddings Ollama** with `nomic-embed-text` — the same model as in workflow 1.

The Description is not documentation. It is the only thing the agent reads when deciding whether to search, so write it as an instruction.

## Verify
Open the chat panel on the `Ask` workflow:

```
How old is the office cat?
```

Answers *fourteen*. It cannot have known that — it came back out of Qdrant. Confirm the round trip in http://localhost:6333/dashboard > **Collections** > `facts`: the points are there, each with your original sentence in its payload.

## Try it
- Teach it three more facts in `Remember`, then ask a question that needs two of them at once.
- Ask something you never taught it. A good agent says it doesn't know; a bad Description makes it invent an answer.
- Swap the Chat Model between Anthropic and Ollama and re-ask the same question. Same retrieved facts, visibly different answers.
- Change the tool Description to `Unused.` and re-ask. The agent stops searching — that one field is the whole steering mechanism.
- In the Qdrant dashboard, delete the collection and re-run `Ask`. Watch it fail, then re-create and re-ingest.

## Common problems
**`Wrong input: Vector dimension error`** — the two workflows use different embedding models, or the collection was created with the wrong `size`. Both **Embeddings Ollama** nodes must say `nomic-embed-text`, and the collection must be `768`.

**The agent answers from general knowledge and never searches** — the tool Description is too vague. Name the actual subject matter in it.

**`connect ECONNREFUSED 127.0.0.1:6333`** — a credential still says `localhost`. Inside the container it must be `http://qdrant:6333` and `http://ollama:11434`.

<!-- #TODO check whether the Qdrant node's "Collection Config" option can create the collection on first insert, which would drop the curl step. -->
<!-- #TODO Default Data Loader field path: confirm `{{ $json.chatInput }}` is still what the Chat Trigger emits in n8n 2.x. -->
