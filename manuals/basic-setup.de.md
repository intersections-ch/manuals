---
title: Basis-Setup
lang: de
---

# Basis-Setup

> **Voraussetzungen:** keine · **Language:** [English](basic-setup.md)

Die komplette Kursumgebung in fünf Schritten: Claude Code in einer Sandbox, dein Repo ausgecheckt, n8n am Laufen, und beide miteinander verbunden. Jeder Schritt verlinkt ein vollständiges Manual — das durcharbeiten, dann hierher zurück.

Rechne mit 30–60 Minuten, überwiegend Downloads.

Für das Tutorial müssen einige Befehle im Terminal eingegeben werden. Wenn etwas nicht klar ist, wende dich gerne an die Kursleitung.

## Installation

### 1. Claude Code in einer Sandbox
Anleitung: → [Claude Sandbox](claude-sandbox.de.md)

1. Claude-Code-CLI und Dockers `sbx` installieren, dann `sbx login` ausführen. Mit Docker Account anmelden.
2. `sbx run claude` in einem Verzeichnis deiner Wahl ausführen. Dieses Verzeichnis wird zur Sandbox. Dein Git-Repo eignet sich dafür gut (siehe nächster Punkt).
3. Innerhalb von Claude: `/login` > mit deiner Subscription anmelden.

Fertig, wenn `claude --version` und `sbx --version` beide etwas ausgeben.

### 2. Dein Repo auf deiner Maschine
Anleitung Git Zugang: → [Git-Repo-Zugang](git-repo.de.md)

Führ `git clone <repo>` in deinem üblichen Arbeitsordner aus. Damit wird dein Repository auf deinen Rechner kopiert. (**Nicht** in einer Sandbox.)

Alle Teilnehmenden bekommen ein eigenes ADO-Git-Repository. `<repo-name>` ist in allen Manuals ein <mark>Platzhalter</mark> — nimm dort die URL, die zu deinem Repository führt.

Fertig, wenn `git status` innerhalb des geklonten Repositories den Git-Status anzeigt.

### 3. Repo in der Sandbox öffnen

```bash
cd <repo-name>
sbx run claude
```

Der erste Lauf baut die Box und installiert Claude Code darin. Dieser Ordner — und nichts darüber — ist das, was Claude sieht.

Falls nötig, mit `/login` in Claude Code einloggen.

Zwei Befehle, die danach oft hilfreich sind:

```bash
sbx tui
sbx run shell
```

`sbx tui` ist das Dashboard der laufenden Sandboxes. `sbx run shell` wirft dich in eine normale Shell derselben Box, wo

```bash
claude --dangerously-skip-permissions --resume
```

deine letzte Konversation zurückholt und aufhört, für jeden Befehl nach Erlaubnis zu fragen. Vertretbar nur, weil es eine Sandbox ist.

### 4. Der n8n-Stack
Anleitungen für n8n: → [Qdrant auf Docker](qdrant-docker.de.md) → [n8n auf Docker](n8n-docker.de.md)

[Den Kurs-Stack](https://github.com/intersections-ch/docker-n8n-ollama-qdrant) klonen und Qdrant, Ollama und n8n in dieser Reihenfolge hochfahren, dann das Owner-Konto unter http://localhost:5678 anlegen.

Modelle: `nomic-embed-text` für Qdrant, `gemma4:e2b` fürs lokale Chatten ([Ollama](ollama.de.md)).

Fertig, wenn http://localhost:5678 lädt und du angemeldet bist.

### 5. Claude mit n8n verbinden
Anleitung: → [Claude ↔ n8n (MCP)](claude-mcp-n8n.de.md)

1. Instance-level MCP in n8n einschalten (Settings > Instance-level MCP).
2. Das Configuration JSON in das File `.mcp.json` deines Repos kopieren (Connect > API key > Configuration JSON kopieren).
3. Auf `host.docker.internal:5678` zeigen lassen und die Sandbox-Firewall öffnen:

```bash
sbx policy allow network host.docker.internal:5678
```

Fertig, wenn `/mcp` in Claude `n8n` als connected anzeigt.

## Prüfen
Alles auf einmal — aus deinem Repo-Ordner:

```bash
sbx run shell
```

und in der Sandbox:

```bash
claude --dangerously-skip-permissions --resume
```

dann in Claude: `/mcp` zeigt `n8n` als connected, und `Liste meine n8n-Workflows auf.` liefert eine Antwort.

Wenn das klappt, sind alle fünf Schritte erledigt.

## Ausprobieren
- Lass Claude dein Repo lesen und erklären, was es tut.
- „Bau einen n8n-Workflow, der einen Webhook entgegennimmt und den Body loggt." Danach im n8n-UI anschauen.
- `sbx tui` — bestehende Sandboxes anschauen, eine ältere wieder starten und darin mit `claude --resume` an einer früheren Session weiterarbeiten.
