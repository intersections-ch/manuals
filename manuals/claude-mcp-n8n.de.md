---
title: Claude ↔ n8n (MCP)
lang: de
slug: claude-mcp-n8n
steps: true
---

# Claude ↔ n8n (MCP)

> **Voraussetzungen:** [n8n auf Docker](n8n-docker.de.md) · [Claude Sandbox](claude-sandbox.de.md) · **Andere Sprachen:** [English](claude-mcp-n8n.md)

In diesem Manual verbinden wir Claude über MCP mit deinem lokalen n8n, damit Claude deine Workflows für dich auflisten, bauen und ausführen kann. n8n liefert einen fertigen JSON-Block; du fügst ihn in dein Repository ein, hinterlegst den API Key selbst als Sandbox-Secret und öffnest eine einzelne Stelle in der Sandbox-Firewall.

## Installation

Die Schritte sind auf allen drei Plattformen gleich, denn die Arbeit passiert in der n8n-Oberfläche und in zwei Dateien.

### 1. MCP in n8n einschalten

Geh auf http://localhost:5678 > Settings > **Instance-level MCP** > *Enable MCP access*. Das setzt n8n 2.33 oder neuer voraus.

### 2. Die Workflows freigeben, die Claude erreichen soll

MCP ist pro Workflow standardmässig aus. Öffne einen Workflow > **Settings** > schalte *Available in MCP* ein und speichere. Wiederhol das für **jeden** Workflow, den Claude sehen soll. Ein Workflow ohne diesen Schalter bleibt über MCP unsichtbar, selbst wenn der Server verbunden ist.

### 3. Konfiguration kopieren

Öffne *Connection details* > **Connect** > den Reiter **API key**. n8n erzeugt ein Token und zeigt einen bereits ausgefüllten Configuration-JSON-Block. Kopier ihn sofort: Sobald du den Reiter verlässt, ist das Token maskiert, und du müsstest es rotieren, um wieder eines zu sehen.

### 4. Den API Key als Sandbox-Secret hinterlegen

Führ das auf deinem Computer aus, nicht in der Sandbox. Ersetz `<your-token>` durch den API Key, den du gerade aus n8n kopiert hast:

```bash
sbx secret set-custom --host localhost --env N8N_TOKEN --value <your-token>
```

Die Sandbox bekommt den Key damit als Umgebungsvariable `N8N_TOKEN`. <mark>Achtung:</mark> Kopier den API Key selbst nicht in die Sandbox — weder in eine Datei noch in einen Prompt. Er bleibt auf deinem Computer, und nur dieser Befehl gibt ihn weiter.

### 5. Die Konfiguration in `.mcp.json` einfügen

Die Datei liegt im Wurzelverzeichnis deines Repositories; leg sie an, falls sie noch nicht existiert. Änder zwei Dinge im Block, den n8n dir gegeben hat: Der Host wird zu `host.docker.internal:5678`, denn in der Sandbox bezeichnet `localhost` die Sandbox selbst, und aus `<dein-n8n-token>` wird `${N8N_TOKEN}`, damit die Datei das Secret referenziert statt es zu enthalten:

```json
{
  "mcpServers": {
    "n8n": {
      "type": "http",
      "url": "http://host.docker.internal:5678/mcp-server/http",
      "headers": {
        "Authorization": "Bearer ${N8N_TOKEN}"
      }
    }
  }
}
```

### 6. Der Sandbox den Zugriff erlauben

Führ auch das auf deinem Computer aus:

```bash
sbx policy allow network host.docker.internal:5678
```

### 7. Claude neu starten

Claude liest `.mcp.json` beim Start, der neue Server erscheint also erst nach einem Neustart.

Weil das Token jetzt im Secret liegt und nicht in der Datei, kannst du `.mcp.json` bedenkenlos committen.

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

<!-- #TODO genaue Position des Pro-Workflow-MCP-Schalters prüfen: Label und Menüpfad (Workflow-Settings vs. das ...-Menü) können sich je nach n8n-Version unterscheiden. -->
<!-- #TODO Endpunkt-Pfad für eine selbst gehostete 2.x-Instanz prüfen: die Doku zeigt sowohl /mcp als auch /mcp-server/http. Nimm die URL aus dem Configuration JSON, das n8n dir gibt. -->
<!-- #TODO prüfen, ob Workflows publiziert sein und einen Webhook-, Form-, Schedule- oder Chat-Trigger haben müssen, damit sie über MCP sichtbar sind. -->

## Typische Probleme
**Claude sieht keine Workflows oder einen davon nicht** — `/mcp` sagt connected, aber die Liste ist leer oder unvollständig. Dem Workflow fehlt der Schalter *Available in MCP* aus Schritt 2; schalt ihn ein und frag noch einmal.

**`/mcp` zeigt n8n als failed** — dafür gibt es vier übliche Ursachen: Die URL sagt noch `localhost`, das Secret wurde nicht gesetzt, der Befehl `sbx policy allow` wurde nicht ausgeführt, oder Claude wurde nicht neu gestartet. Prüf sie in dieser Reihenfolge. Ein HTTP 403 mit Policy-Meldung heisst, dass die Sandbox-Firewall die Anfrage blockiert hat; `sbx policy log` zeigt, was blockiert wurde.

**401 von n8n** — das Token ist abgelaufen oder wurde rotiert, oder `N8N_TOKEN` ist nie in der Sandbox angekommen. Wiederhol Schritt 3 und 4 mit einem frischen API Key und starte Claude neu.
