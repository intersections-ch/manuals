---
title: Claude ↔ n8n (MCP)
lang: en
---

# Claude ↔ n8n (MCP)

> **Requires:** [n8n on Docker](n8n-docker.md) · [Claude Sandbox](claude-sandbox.md) · **Sprache:** [Deutsch](claude-mcp-n8n.de.md)

Connects Claude to your local n8n over MCP, so Claude can list, build and run your workflows. n8n hands you a ready-made JSON block; you paste it into your repo and open one hole in the sandbox firewall.

## Install

Same on all three platforms — the work happens in the n8n UI and in two files.

**1. Turn on MCP in n8n.** http://localhost:5678 > Settings > **Instance-level MCP** > *Enable MCP access*. Needs n8n 2.33 or newer.

**2. Copy the config.** Under *Connection details* > **Connect** > **API key** tab. n8n generates a token and shows a filled-in Configuration JSON block. Copy it now — once you leave the tab the token is redacted and you have to rotate it to see one again.

**3. Paste it into `.mcp.json`** at the root of your repo. Create the file if it isn't there. Then change the host to `host.docker.internal:5678`, because inside the sandbox `localhost` is the sandbox:

```json
{
  "mcpServers": {
    "n8n": {
      "type": "http",
      "url": "http://host.docker.internal:5678/mcp-server/http",
      "headers": {
        "Authorization": "Bearer <your-n8n-token>"
      }
    }
  }
}
```

**4. Let the sandbox reach n8n.** On your machine, not in the sandbox:

```bash
sbx policy allow network host.docker.internal:5678
```

**5. Restart Claude** so it reads the new file.

`.mcp.json` holds a live token — add it to `.gitignore` unless the repo is private and the token is throwaway.

## Verify
Inside Claude Code:

```
/mcp
```

`n8n` is listed as <mark>connected</mark>. Then ask it: `List my n8n workflows.`

## Try it
- `/mcp` > select `n8n` > browse the tools it exposes.
- "List my n8n workflows and tell me what each one does."
- "Build me an n8n workflow that takes a webhook and writes the body to a file." Then open http://localhost:5678 and look at what it made.
- "Run the workflow called *X* and show me the output."
- Break the URL back to `localhost:5678`, restart, and watch `/mcp` fail — that is the mistake you will make once.

<!-- #TODO confirm the endpoint path for a self-hosted 2.x instance: docs show both /mcp and /mcp-server/http. Read the URL out of the Configuration JSON n8n gives you and trust that one. -->
<!-- #TODO check whether workflows must be published and carry a webhook/form/schedule/chat trigger before they show up over MCP. -->

## Common problems
**`/mcp` shows n8n as failed** — three usual causes: the URL still says `localhost`, the `sbx policy allow` wasn't run, or Claude wasn't restarted. Check in that order.

**HTTP 403 with a policy message** — the firewall. Run the `sbx policy allow network host.docker.internal:5678` command above; `sbx policy log` shows what got blocked.

**401 from n8n** — the token expired or was rotated. Redo step 2 and paste the fresh block.
