---
title: Basis-Setup
lang: de
slug: basic-setup
steps: true
---

# Basis-Setup

> **Voraussetzungen:** keine · **Andere Sprachen:** [English](basic-setup.md)

In diesem Manual richten wir die komplette Kursumgebung in fünf Schritten ein: Claude Code in einer Sandbox, dein Repository ausgecheckt, n8n am Laufen und beide miteinander verbunden. Jeder Schritt verlinkt ein vollständiges Manual, das du durcharbeitest und danach hierher zurückkehrst.

Rechne mit 30–60 Minuten, überwiegend Downloads.

Für das Tutorial müssen einige Befehle im Terminal eingegeben werden. Wenn etwas nicht klar ist, wende dich gerne an die Kursleitung.

## Installation

### 1. Claude Code in einer Sandbox
[Claude Sandbox](claude-sandbox.de.md)

1. Claude-Code-CLI und Dockers `sbx` installieren, dann `sbx login` ausführen. Mit deinem Docker-Account anmelden.
2. `sbx run claude` in einem Verzeichnis deiner Wahl ausführen. Dieses Verzeichnis wird zur Sandbox. Dein Git-Repo eignet sich dafür gut (siehe nächster Punkt).
3. Innerhalb von Claude: `/login` > mit deiner Subscription anmelden.

Dieser Schritt ist fertig, wenn `claude --version` und `sbx --version` beide etwas ausgeben.

### 2. Dein Repository auf deinem Computer
[Git-Repo-Zugang](git-repo.de.md)

Führe `git clone <repo>` in deinem üblichen Arbeitsordner aus, um dein Repository auf deinen Computer zu kopieren. Mach das **ausserhalb** jeder Sandbox.

Du bekommst dein eigenes ADO-Git-Repository für den Kurs. `<repo-name>` ist in allen Manuals ein <mark>Platzhalter</mark> — setz dort die URL ein, die zu deinem Repository führt.

Dieser Schritt ist fertig, wenn `git status` innerhalb des geklonten Repositories den Git-Status anzeigt.

### 3. Repo in der Sandbox öffnen

```bash
cd <repo-name>
sbx run claude
```

Der erste Lauf baut die Sandbox und installiert Claude Code darin. Von da an ist dieser Ordner alles, was Claude sieht; nichts darüber ist erreichbar.

Falls nötig, mit `/login` in Claude Code einloggen.

Zwei Befehle, die danach oft hilfreich sind:

```bash
sbx tui
sbx run shell
```

`sbx tui` ist das Dashboard der laufenden Sandboxes. `sbx run shell` öffnet eine normale Shell in derselben Sandbox, wo

```bash
claude --dangerously-skip-permissions --resume
```

deine letzte Konversation zurückholt und aufhört, für jeden Befehl nach Erlaubnis zu fragen. Das ist nur vertretbar, weil die Sandbox isoliert ist.

### 4. Der n8n-Stack
[Qdrant auf Docker](qdrant-docker.de.md) [n8n auf Docker](n8n-docker.de.md)

[Den Kurs-Stack](https://github.com/intersections-ch/docker-n8n-ollama-qdrant) klonen und Qdrant, Ollama und n8n in dieser Reihenfolge starten, dann das Owner-Konto unter http://localhost:5678 anlegen.

Du brauchst hier zwei Modelle: `nomic-embed-text` für Qdrant und `gemma4:e2b`, falls du zusätzlich lokal chatten möchtest ([Ollama](ollama.de.md)).

Dieser Schritt ist fertig, wenn http://localhost:5678 lädt und du angemeldet bist.

### 5. Claude mit n8n verbinden
[Claude ↔ n8n (MCP)](claude-mcp-n8n.de.md)

1. Instance-level MCP in n8n einschalten (Settings > Instance-level MCP).
2. Das Configuration JSON in das File `.mcp.json` deines Repos kopieren (Connect > API key > Configuration JSON kopieren).
3. Auf `host.docker.internal:5678` zeigen lassen und die Sandbox-Firewall öffnen:

```bash
sbx policy allow network host.docker.internal:5678
```

Dieser Schritt ist fertig, wenn `/mcp` in Claude `n8n` als connected anzeigt.

## Prüfen
Du kannst alles auf einmal prüfen. Führ aus deinem Repository-Ordner aus:

```bash
sbx run shell
```

und in der Sandbox:

```bash
claude --dangerously-skip-permissions --resume
```

Danach sollte `/mcp` in Claude `n8n` als connected zeigen, und `Liste meine n8n-Workflows auf.` sollte eine Antwort liefern. Wenn das klappt, sind alle fünf Schritte erledigt.

## Ausprobieren (optional)
- Lass Claude dein Repository lesen und erklären, was es tut.
- „Bau einen n8n-Workflow, der einen Webhook entgegennimmt und den Body loggt." Danach das Ergebnis in der n8n-Oberfläche prüfen.
- `sbx tui` — bestehende Sandboxes durchsehen, eine ältere wieder starten und darin mit `claude --resume` an einer früheren Session weiterarbeiten.
