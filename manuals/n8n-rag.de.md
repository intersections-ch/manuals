---
title: RAG in n8n
lang: de
slug: n8n-rag
steps: true
---

# RAG in n8n

> **Voraussetzungen:** [Qdrant auf Docker](qdrant-docker.de.md) · [n8n auf Docker](n8n-docker.de.md) · **Language:** [English](n8n-rag.md)

Zwei Workflows, die einem Chat-Agenten ein Gedächtnis geben. Der erste nimmt Fakten entgegen, die du tippst, und legt sie als Vektoren in Qdrant ab; der zweite beantwortet Fragen, indem er diese Fakten zuerst nachschlägt. Diese Schleife — erst suchen, dann formulieren — ist die ganze Idee hinter RAG.

Alles passiert im n8n-UI unter http://localhost:5678. Keine Unterschiede zwischen den Betriebssystemen.

## Installation

Zuerst die Collection. Beide Workflows schreiben in dieselbe und lesen aus ihr, und `768` ist die Dimension von <mark>`nomic-embed-text`</mark>:

```bash
curl -X PUT http://localhost:6333/collections/facts \
  -H 'Content-Type: application/json' \
  -d '{"vectors":{"size":768,"distance":"Cosine"}}'
```

Du brauchst zwei Credentials, einmal angelegt und von beiden Workflows genutzt. Nimm die **internen** Hostnamen — im n8n-Container ist `localhost` n8n selbst:

| Credential | Einstellung |
|---|---|
| Qdrant | URL `http://qdrant:6333`, API-Key leer |
| Ollama | Base URL `http://ollama:11434` |

### 1. Remember — der Ingest-Workflow

Neuer Workflow, nenn ihn `Remember`. Vier Nodes:

1. **When chat message received** (Chat Trigger) — der Startknoten.
2. **Qdrant Vector Store** — Operation Mode <mark>**Insert Documents**</mark>, Qdrant Collection `facts`.
3. Am **Embedding**-Konnektor des Vector Store: **Embeddings Ollama** — Modell `nomic-embed-text`.
4. Am **Document**-Konnektor: **Default Data Loader** — Type of Data `JSON`, Mode `Load Specific Data`, Data <code>&#123;&#123; $json.chatInput &#125;&#125;</code>. Häng einen **Recursive Character Text Splitter** dran, Chunk-Grösse `1000`, Overlap `200`.

Speichern, dann das Chat-Panel öffnen und ein paar Fakten tippen, die es nicht wissen kann:

```
Unser Bürokater heisst Bruno und ist vierzehn Jahre alt.
```

```
Die Kaffeemaschine im zweiten Stock nimmt nur 5-Rappen-Stücke.
```

### 2. Ask — der Abfrage-Workflow

Neuer Workflow, nenn ihn `Ask`. Vier Nodes:

1. **When chat message received** (Chat Trigger).
2. **AI Agent** — die Standardwerte passen.
3. Am **Chat Model**-Konnektor des Agenten, eines von beiden:
   - **Anthropic Chat Model** — dein eigener API-Key, neuestes Claude Sonnet aus dem Dropdown. Bessere Antworten, braucht Guthaben.
   - **Ollama Chat Model** — Modell `gemma4:e2b`. Gratis und lokal, aber langsamer und merklich schwächer. `gemma4:e4b` antwortet besser und will ~16 GB RAM.
4. Am **Tool**-Konnektor des Agenten: ein zweiter **Qdrant Vector Store**, Operation Mode <mark>**Retrieve Documents (As Tool for AI Agent)**</mark>, Collection `facts`, Name `facts`, Description `Fakten, die der Nutzer mir beigebracht hat. Hier suchen, bevor du irgendetwas über das Büro, Personen oder Orte beantwortest.` Gib ihm ein eigenes **Embeddings Ollama** mit `nomic-embed-text` — dasselbe Modell wie in Workflow 1.

Die Description ist keine Dokumentation. Sie ist das Einzige, was der Agent liest, wenn er entscheidet, ob er sucht — also schreib sie als Anweisung.

## Prüfen
Das Chat-Panel im `Ask`-Workflow öffnen:

```
Wie alt ist der Bürokater?
```

Antwortet *vierzehn*. Das kann es nicht gewusst haben — es kam aus Qdrant zurück. Den Rundweg kontrollieren unter http://localhost:6333/dashboard > **Collections** > `facts`: die Punkte liegen dort, jeder mit deinem Originalsatz im Payload.

## Ausprobieren
- Bring ihm in `Remember` drei weitere Fakten bei und stell dann eine Frage, die zwei davon gleichzeitig braucht.
- Frag etwas, das du nie beigebracht hast. Ein guter Agent sagt, dass er es nicht weiss; eine schlechte Description lässt ihn eine Antwort erfinden.
- Das Chat Model zwischen Anthropic und Ollama tauschen und dieselbe Frage nochmal stellen. Dieselben gefundenen Fakten, sichtbar andere Antworten.
- Die Tool-Description auf `Unbenutzt.` ändern und nochmal fragen. Der Agent sucht nicht mehr — dieses eine Feld ist die ganze Steuerung.
- Im Qdrant-Dashboard die Collection löschen und `Ask` nochmal laufen lassen. Zusehen, wie es scheitert, dann neu anlegen und neu einlesen.

## Typische Probleme
**`Wrong input: Vector dimension error`** — die zwei Workflows nutzen verschiedene Embedding-Modelle, oder die Collection wurde mit der falschen `size` angelegt. Beide **Embeddings Ollama**-Nodes müssen `nomic-embed-text` sagen, und die Collection muss `768` sein.

**Der Agent antwortet aus dem Allgemeinwissen und sucht nie** — die Tool-Description ist zu vage. Benenn das konkrete Thema darin.

**`connect ECONNREFUSED 127.0.0.1:6333`** — ein Credential sagt noch `localhost`. Im Container muss es `http://qdrant:6333` und `http://ollama:11434` heissen.

<!-- #TODO prüfen, ob die "Collection Config"-Option des Qdrant-Nodes die Collection beim ersten Insert anlegen kann — das würde den curl-Schritt sparen. -->
<!-- #TODO Feldpfad im Default Data Loader: bestätigen, dass der Chat Trigger in n8n 2.x weiterhin <code>&#123;&#123; $json.chatInput &#125;&#125;</code> liefert. -->
