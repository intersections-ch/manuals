---
title: Basis-Setup
lang: de
---

# Basis-Setup

> **Voraussetzungen:** keine · **Language:** [English](basic-setup.md)

Die komplette Kursumgebung in fünf Schritten: Claude Code in einer Sandbox, dein Repo ausgecheckt, n8n am Laufen, und beide miteinander verbunden. Jeder Schritt verlinkt ein vollständiges Manual — das durcharbeiten, dann hierher zurück.

Rechne mit einer Stunde, überwiegend Downloads.

## Installation

### 1. Claude Code in einer Sandbox
→ [Claude Sandbox](claude-sandbox.de.md)

Claude-Code-CLI und Dockers `sbx` installieren, dann `sbx login` und `claude`. Melde dich mit deinem <mark>Abo</mark> an, nicht mit einem API-Key.

Fertig, wenn `claude --version` und `sbx --version` beide antworten.

### 2. Dein Repo auf deiner Maschine
→ [Git-Repo-Zugang](git-repo.de.md)

SSH-Key erzeugen, bei GitHub oder Azure DevOps registrieren, `<repo-name>` klonen.

Auf deiner Maschine klonen, **nicht** in einer Sandbox — Schritt 3 hängt den Ordner ein, den du bereits hast.

Fertig, wenn `git log` im Klon Historie zeigt.

### 3. Repo in der Sandbox öffnen

```bash
cd <repo-name>
sbx run claude
```

Der erste Lauf baut die Box und installiert Claude Code darin. Dieser Ordner — und nichts darüber — ist das, was Claude sieht.

Zwei Befehle, die du danach ständig brauchst:

```bash
sbx tui
sbx run shell
```

`sbx tui` ist das Dashboard der laufenden Sandboxes. `sbx run shell` wirft dich in eine normale Shell derselben Box, wo

```bash
claude --dangerously-skip-permissions --resume
```

deine letzte Konversation zurückholt und aufhört, für jeden Befehl nach Erlaubnis zu fragen. Vertretbar nur, weil es eine Sandbox ist.

### 4. n8n auf Docker
→ [n8n auf Docker](n8n-docker.de.md)

[Den Kurs-Stack](https://github.com/intersections-ch/docker-n8n-ollama-qdrant) klonen, Qdrant, Ollama und n8n hochfahren, das Owner-Konto unter http://localhost:5678 anlegen.

Fertig, wenn http://localhost:5678 lädt und du angemeldet bist.

### 5. Claude mit n8n verbinden
→ [Claude ↔ n8n (MCP)](claude-mcp-n8n.de.md)

Instance-level MCP in n8n einschalten, das Configuration JSON in die `.mcp.json` deines Repos kopieren, auf `host.docker.internal:5678` zeigen lassen und die Firewall öffnen:

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
- `sbx tui` — CPU und Speicher der Sandbox beobachten, während Claude arbeitet.
- Lass Claude etwas völlig Absurdes installieren. Es ist eine Sandbox; `sbx rm` wirft sie weg.
- `git switch -c <dein-name>/tag-1` und Claude seinen ersten Commit machen lassen.

<!-- #TODO echten <repo-name> und Clone-URL eintragen und festhalten, ob der Kurs auf GitHub oder Azure DevOps läuft. -->

## Typische Probleme
**Schritt 3 hängt den falschen Ordner ein** — `sbx run claude` hängt das Verzeichnis ein, aus dem du es gestartet hast. Vorher ins Repo `cd`en.

**Schritt 5 erreicht n8n nicht** — `localhost` in einer Sandbox ist die Sandbox. Nimm `host.docker.internal:5678` und führ den `sbx policy allow`-Befehl auf deiner Maschine aus.

**Claude will sich in der Sandbox erneut anmelden** — Zugangsdaten liegen pro Sandbox auf dem Host. Einmal in der Box anmelden; danach hält `--resume` die Sitzung.
