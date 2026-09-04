---
title: Claude ↔ n8n (MCP)
lang: de
slug: claude-mcp-n8n
steps: true
---

# Claude ↔ n8n (MCP)

> **Voraussetzungen:** [n8n auf Docker](n8n-docker.de.md) · [Claude Sandbox](claude-sandbox.de.md) · **Andere Sprachen:** [English](claude-mcp-n8n.md)

In diesem Manual verbinden wir Claude über MCP mit deinem lokalen n8n, damit Claude deine Workflows für dich auflisten, bauen und ausführen kann. n8n liefert einen fertigen JSON-Block; du fügst ihn in dein Repository ein und öffnest eine einzelne Stelle in der Sandbox-Firewall.

## Installation

Die Schritte sind auf allen drei Plattformen gleich, denn die Arbeit passiert in der n8n-Oberfläche und in zwei Dateien.

### 1. MCP in n8n einschalten

Geh auf http://localhost:5678 > Settings > **Instance-level MCP** > *Enable MCP access*. Das setzt n8n 2.33 oder neuer voraus.

### 2. Konfiguration kopieren

Öffne *Connection details* > **Connect** > den Reiter **API key**. n8n erzeugt ein Token und zeigt einen bereits ausgefüllten Configuration-JSON-Block. Kopier ihn sofort: Sobald du den Reiter verlässt, ist das Token maskiert, und du müsstest es rotieren, um wieder eines zu sehen.

### 3. In `.mcp.json` einfügen

Die Datei liegt im Wurzelverzeichnis deines Repositories; leg sie an, falls sie noch nicht existiert. Änder danach den Host auf `host.docker.internal:5678`, denn in der Sandbox bezeichnet `localhost` die Sandbox selbst:

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

### 4. Der Sandbox den Zugriff erlauben

Führ das auf deinem Computer aus, nicht in der Sandbox:

```bash
sbx policy allow network host.docker.internal:5678
```

### 5. Claude neu starten

Claude liest `.mcp.json` beim Start, der neue Server erscheint also erst nach einem Neustart.

Denk daran, dass `.mcp.json` jetzt ein gültiges Token enthält. Trag die Datei in `.gitignore` ein, ausser das Repository ist privat und das Token ist wegwerfbar.

## Prüfen
In Claude Code:

```
/mcp
```

`n8n` sollte als <mark>connected</mark> erscheinen. Frag Claude danach direkt: `Liste meine n8n-Workflows auf.`

## Ausprobieren (optional)
- `/mcp` > `n8n` auswählen > die angebotenen Tools durchsehen.
- „Liste meine n8n-Workflows auf und sag mir, was jeder davon tut."
- „Bau mir einen n8n-Workflow, der einen Webhook entgegennimmt und den Body in eine Datei schreibt." Danach http://localhost:5678 öffnen und prüfen, was Claude gebaut hat.
- „Führ den Workflow *X* aus und zeig mir das Ergebnis."
- Die URL zurück auf `localhost:5678` stellen, neu starten und zusehen, wie `/mcp` scheitert. Es lohnt sich, diesen Fehler einmal bewusst zu sehen, damit du ihn später wiedererkennst.

<!-- #TODO Endpunkt-Pfad für eine selbst gehostete 2.x-Instanz prüfen: die Doku zeigt sowohl /mcp als auch /mcp-server/http. Nimm die URL aus dem Configuration JSON, das n8n dir gibt. -->
<!-- #TODO prüfen, ob Workflows publiziert sein und einen Webhook-, Form-, Schedule- oder Chat-Trigger haben müssen, damit sie über MCP sichtbar sind. -->

## Typische Probleme
**`/mcp` zeigt n8n als failed** — dafür gibt es drei übliche Ursachen: Die URL sagt noch `localhost`, der Befehl `sbx policy allow` wurde nicht ausgeführt, oder Claude wurde nicht neu gestartet. Prüf sie in dieser Reihenfolge.

**HTTP 403 mit Policy-Meldung** — die Sandbox-Firewall hat die Anfrage blockiert. Führ den `sbx policy allow network host.docker.internal:5678`-Befehl von oben aus; `sbx policy log` zeigt, was blockiert wurde.

**401 von n8n** — das Token ist abgelaufen oder wurde rotiert. Wiederhol Schritt 2 und füg den neuen Block ein.
