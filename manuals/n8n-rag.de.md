---
title: RAG in n8n
lang: de
slug: n8n-rag
steps: true
---

# RAG in n8n

> **Voraussetzungen:** [Qdrant auf Docker](qdrant-docker.de.md) · [n8n auf Docker](n8n-docker.de.md) · **Andere Sprachen:** [English](n8n-rag.md)

In diesem Manual bauen wir zwei Workflows, die einem Chat-Agenten gemeinsam ein Gedächtnis geben. Der erste nimmt Fakten entgegen, die du tippst, und legt sie als Vektoren in Qdrant ab; der zweite beantwortet Fragen, indem er diese Fakten vor dem Antworten nachschlägt. Diese Schleife — erst suchen, dann formulieren — ist die ganze Idee hinter RAG.

Alles passiert in der n8n-Oberfläche unter http://localhost:5678, es gibt also keine Unterschiede zwischen den Betriebssystemen.

## Installation

Leg zuerst die Collection an. Beide Workflows lesen aus derselben und schreiben in sie, und `768` ist die Dimension von <mark>`nomic-embed-text`</mark>:

```bash
curl -X PUT http://localhost:6333/collections/facts \
  -H 'Content-Type: application/json' \
  -d '{"vectors":{"size":768,"distance":"Cosine"}}'
```

Ausserdem brauchst du zwei Credentials, die du einmal anlegst und in beiden Workflows verwendest. Nimm die **internen** Hostnamen, denn im n8n-Container bezeichnet `localhost` n8n selbst:

| Credential | Einstellung |
|---|---|
| Qdrant | URL `http://qdrant:6333`, API-Key leer |
| Ollama | Base URL `http://ollama:11434` |

### 1. Remember — der Ingest-Workflow

Leg einen neuen Workflow an und nenn ihn `Remember`. Er besteht aus vier Nodes:

1. **When chat message received** (Chat Trigger) — der Startknoten.
2. **Qdrant Vector Store** — Operation Mode <mark>**Insert Documents**</mark>, Qdrant Collection `facts`.
3. Am **Embedding**-Konnektor des Vector Store: **Embeddings Ollama** — Modell `nomic-embed-text`.
4. Am **Document**-Konnektor: **Default Data Loader** — Type of Data `JSON`, Mode `Load Specific Data`, Data <code>&#123;&#123; $json.chatInput &#125;&#125;</code>. Häng einen **Recursive Character Text Splitter** dran, Chunk-Grösse `1000`, Overlap `200`.

Speicher den Workflow, öffne dann das Chat-Panel und tipp ein paar Fakten ein, die das Modell unmöglich kennen kann:

```
Unser Bürokater heisst Bruno und ist vierzehn Jahre alt.
```

```
Die Kaffeemaschine im zweiten Stock nimmt nur 5-Rappen-Stücke.
```

### 2. Ask — der Abfrage-Workflow

Leg einen zweiten Workflow an und nenn ihn `Ask`. Auch er besteht aus vier Nodes:

1. **When chat message received** (Chat Trigger).
2. **AI Agent** — die Standardwerte passen.
3. Am **Chat Model**-Konnektor des Agenten, eines von beiden:
   - **Anthropic Chat Model** — nutzt deinen eigenen API-Key mit dem neuesten Claude Sonnet aus dem Dropdown. Bessere Antworten, benötigt aber Guthaben.
   - **Ollama Chat Model** — nutzt das Modell `gemma4:e2b`. Das läuft lokal und kostenlos, ist aber langsamer und merklich schwächer. `gemma4:e4b` antwortet besser und benötigt rund 16 GB RAM.
4. Am **Tool**-Konnektor des Agenten: ein zweiter **Qdrant Vector Store**, Operation Mode <mark>**Retrieve Documents (As Tool for AI Agent)**</mark>, Collection `facts`, Name `facts`, Description `Fakten, die der Nutzer mir beigebracht hat. Hier suchen, bevor du irgendetwas über das Büro, Personen oder Orte beantwortest.` Gib ihm ein eigenes **Embeddings Ollama** mit `nomic-embed-text` — dasselbe Modell wie in Workflow 1.

Die Description ist keine Dokumentation. Sie ist das Einzige, was der Agent liest, wenn er entscheidet, ob er überhaupt sucht — schreib sie also als Anweisung und nicht als Erklärung.

## Prüfen
Das Chat-Panel im `Ask`-Workflow öffnen:

```
Wie alt ist der Bürokater?
```

Die Antwort sollte *vierzehn* lauten. Das Modell kann das nicht von sich aus gewusst haben, der Fakt muss also aus Qdrant zurückgekommen sein. Den Rundweg kontrollierst du unter http://localhost:6333/dashboard > **Collections** > `facts`, wo die Punkte gespeichert sind, jeder mit deinem Originalsatz im Payload.

## Ausprobieren (optional)
- Bring dem Agenten in `Remember` drei weitere Fakten bei und stell dann eine Frage, die zwei davon gleichzeitig benötigt.
- Frag nach etwas, das du nie beigebracht hast. Ein gut beschriebenes Tool führt dazu, dass der Agent sagt, er wisse es nicht, während ein vages ihn eine Antwort erfinden lässt.
- Tausch das Chat Model zwischen Anthropic und Ollama und stell dieselbe Frage erneut. Die gefundenen Fakten bleiben gleich, die Antworten unterscheiden sich aber deutlich.
- Änder die Tool-Description auf `Unbenutzt.` und frag erneut. Der Agent sucht nicht mehr, was zeigt, wie viel dieses eine Feld steuert.
- Lösch im Qdrant-Dashboard die Collection und lass `Ask` erneut laufen. Beobachte den Fehler, leg die Collection dann neu an und lies die Fakten noch einmal ein.

## Typische Probleme
**`Wrong input: Vector dimension error`** — die zwei Workflows nutzen verschiedene Embedding-Modelle, oder die Collection wurde mit der falschen `size` angelegt. Beide **Embeddings Ollama**-Nodes müssen `nomic-embed-text` sagen, und die Collection muss `768` sein.

**Der Agent antwortet aus dem Allgemeinwissen und sucht nie** — die Tool-Description ist zu vage. Benenn das konkrete Thema darin ausdrücklich.

**`connect ECONNREFUSED 127.0.0.1:6333`** — eines der Credentials sagt noch `localhost`. Im Container müssen die Adressen `http://qdrant:6333` und `http://ollama:11434` lauten.

<!-- #TODO prüfen, ob die "Collection Config"-Option des Qdrant-Nodes die Collection beim ersten Insert anlegen kann — das würde den curl-Schritt sparen. -->
<!-- #TODO Feldpfad im Default Data Loader: bestätigen, dass der Chat Trigger in n8n 2.x weiterhin <code>&#123;&#123; $json.chatInput &#125;&#125;</code> liefert. -->
