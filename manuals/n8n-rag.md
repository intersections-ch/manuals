---
title: RAG in n8n
lang: en
slug: n8n-rag
steps: true
---

# RAG in n8n

> **Requires:** [Qdrant on Docker](qdrant-docker.md) · [n8n on Docker](n8n-docker.md) · **Other Languages:** [Deutsch](n8n-rag.de.md)

In this manual we build two workflows that together give a chat agent a memory. The first takes facts you type and stores them as vectors in Qdrant; the second answers questions by looking those facts up before replying. That loop — retrieve first, then generate — is the whole idea behind RAG.

Everything happens in the n8n interface at http://localhost:5678, so there are no differences between operating systems.

## Install

Start by creating the collection. Both workflows read from and write to the same one, and `768` is the dimension of <mark>`nomic-embed-text`</mark>:

```bash
curl -X PUT http://localhost:6333/collections/facts \
  -H 'Content-Type: application/json' \
  -d '{"vectors":{"size":768,"distance":"Cosine"}}'
```

You also need two credentials, created once and reused by both workflows. Use the **internal** hostnames, because inside the n8n container `localhost` refers to n8n itself:

| Credential | Setting |
|---|---|
| Qdrant | URL `http://qdrant:6333`, API key empty |
| Ollama | Base URL `http://ollama:11434` |

### 1. Remember — the ingest workflow

Create a new workflow and name it `Remember`. It consists of four nodes:

1. **When chat message received** (Chat Trigger) — the starting node.
2. **Qdrant Vector Store** — Operation Mode <mark>**Insert Documents**</mark>, Qdrant Collection `facts`.
3. On the vector store's **Embedding** connector: **Embeddings Ollama** — model `nomic-embed-text`.
4. On its **Document** connector: **Default Data Loader** — Type of Data `JSON`, Mode `Load Specific Data`, Data <code>&#123;&#123; $json.chatInput &#125;&#125;</code>. Give it a **Recursive Character Text Splitter** with chunk size `1000`, overlap `200`.

Save the workflow, then open the chat panel and type in a few facts the model has no way of knowing:

```
Our office cat is called Bruno and he is fourteen years old.
```

```
The coffee machine on the second floor takes only 5 rappen coins.
```

### 2. Ask — the query workflow

Create a second workflow and name it `Ask`. It also consists of four nodes:

1. **When chat message received** (Chat Trigger).
2. **AI Agent** — defaults are fine.
3. On the agent's **Chat Model** connector, pick one:
   - **Anthropic Chat Model** — uses your own API key with the newest Claude Sonnet from the dropdown. Better answers, but it needs credit.
   - **Ollama Chat Model** — uses the model `gemma4:e2b`. This runs locally at no cost, but it is slower and noticeably weaker. `gemma4:e4b` answers better and needs around 16 GB of RAM.
4. On the agent's **Tool** connector: another **Qdrant Vector Store**, Operation Mode <mark>**Retrieve Documents (As Tool for AI Agent)**</mark>, collection `facts`, Name `facts`, Description `Facts the user has taught me. Search here before answering anything about the office, people or places.` Give it its own **Embeddings Ollama** with `nomic-embed-text` — the same model as in workflow 1.

The Description is not documentation. It is the only thing the agent reads when deciding whether to search at all, so write it as an instruction rather than as an explanation.

## Verify
Open the chat panel on the `Ask` workflow:

```
How old is the office cat?
```

The answer should be *fourteen*. The model cannot have known this on its own, so the fact must have come back out of Qdrant. You can confirm the round trip at http://localhost:6333/dashboard > **Collections** > `facts`, where the points are stored, each with your original sentence in its payload.

## Try it (optional)
- Teach the agent three more facts in `Remember`, then ask a question that requires two of them at once.
- Ask about something you never taught it. A well described tool leads the agent to say it does not know, while a vague one leads it to invent an answer.
- Swap the Chat Model between Anthropic and Ollama and ask the same question again. The retrieved facts stay the same, but the answers differ noticeably.
- Change the tool Description to `Unused.` and ask again. The agent stops searching, which shows how much that single field controls.
- In the Qdrant dashboard, delete the collection and run `Ask` again. Observe the failure, then re-create the collection and ingest the facts once more.

## Common problems
**`Wrong input: Vector dimension error`** — the two workflows use different embedding models, or the collection was created with the wrong `size`. Both **Embeddings Ollama** nodes must say `nomic-embed-text`, and the collection must be `768`.

**The agent answers from general knowledge and never searches** — the tool Description is too vague. Name the actual subject matter in it explicitly.

**`connect ECONNREFUSED 127.0.0.1:6333`** — one of the credentials still says `localhost`. Inside the container the addresses have to be `http://qdrant:6333` and `http://ollama:11434`.

<!-- #TODO check whether the Qdrant node's "Collection Config" option can create the collection on first insert, which would drop the curl step. -->
<!-- #TODO Default Data Loader field path: confirm <code>&#123;&#123; $json.chatInput &#125;&#125;</code> is still what the Chat Trigger emits in n8n 2.x. -->
