---
title: Claude ↔ n8n (MCP)
lang: de
---

# Claude ↔ n8n (MCP)

> **Voraussetzungen:** [n8n auf Docker](n8n-docker.de.md) · [Claude Sandbox](claude-sandbox.de.md) · **Language:** [English](claude-mcp-n8n.md)

Verbindet Claude über MCP mit deinem lokalen n8n, damit Claude deine Workflows auflisten, bauen und ausführen kann. n8n liefert einen fertigen JSON-Block; du fügst ihn in dein Repo ein und öffnest ein Loch in der Sandbox-Firewall.

## Installation

Auf allen drei Plattformen gleich — die Arbeit passiert im n8n-UI und in zwei Dateien.

**1. MCP in n8n einschalten.** http://localhost:5678 → Settings → **Instance-level MCP** → *Enable MCP access*. Braucht n8n 2.33 oder neuer.

**2. Konfiguration kopieren.** Unter *Connection details* → **Connect** → Reiter **API key**. n8n erzeugt ein Token und zeigt einen ausgefüllten Configuration-JSON-Block. Jetzt kopieren — sobald du den Reiter verlässt, ist das Token maskiert und du musst es rotieren, um wieder eines zu sehen.

**3. In `.mcp.json` einfügen**, im Wurzelverzeichnis deines Repos. Datei anlegen, falls sie fehlt. Danach den Host auf `host.docker.internal:5678` ändern, denn in der Sandbox ist `localhost` die Sandbox selbst:

```json
{
  "mcpServers": {
    "n8n": {
      "type": "http",
      "url": "http://host.docker.internal:5678/mcp-server/http",
      "headers": {
        "Authorization": "Bearer <dein-n8n-token>"
      }
    }
  }
}
```

**4. Der Sandbox den Zugriff erlauben.** Auf deiner Maschine, nicht in der Sandbox:

```bash
sbx policy allow network host.docker.internal:5678
```

**5. Claude neu starten**, damit die neue Datei gelesen wird.

`.mcp.json` enthält ein gültiges Token — trag es in `.gitignore` ein, ausser das Repo ist privat und das Token wegwerfbar.

## Prüfen
In Claude Code:

```
/mcp
```

`n8n` erscheint als <mark>connected</mark>. Dann frag: `Liste meine n8n-Workflows auf.`

## Ausprobieren
- `/mcp` → `n8n` auswählen → die angebotenen Tools durchsehen.
- „Liste meine n8n-Workflows auf und sag mir, was jeder davon tut."
- „Bau mir einen n8n-Workflow, der einen Webhook entgegennimmt und den Body in eine Datei schreibt." Danach http://localhost:5678 öffnen und anschauen, was entstanden ist.
- „Führ den Workflow *X* aus und zeig mir das Ergebnis."
- Die URL zurück auf `localhost:5678` stellen, neu starten und zusehen, wie `/mcp` scheitert — diesen Fehler machst du genau einmal.

<!-- #TODO Endpunkt-Pfad für eine selbst gehostete 2.x-Instanz prüfen: die Doku zeigt sowohl /mcp als auch /mcp-server/http. Nimm die URL aus dem Configuration JSON, das n8n dir gibt. -->
<!-- #TODO prüfen, ob Workflows publiziert sein und einen Webhook-, Form-, Schedule- oder Chat-Trigger haben müssen, damit sie über MCP sichtbar sind. -->

## Typische Probleme
**`/mcp` zeigt n8n als failed** — drei übliche Ursachen: die URL sagt noch `localhost`, `sbx policy allow` wurde nicht ausgeführt, oder Claude wurde nicht neu gestartet. In dieser Reihenfolge prüfen.

**HTTP 403 mit Policy-Meldung** — die Firewall. Den `sbx policy allow network host.docker.internal:5678`-Befehl von oben ausführen; `sbx policy log` zeigt, was blockiert wurde.

**401 von n8n** — das Token ist abgelaufen oder wurde rotiert. Schritt 2 wiederholen und den frischen Block einfügen.
