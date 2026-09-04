---
title: Claude ↔ n8n (MCP)
lang: en
slug: claude-mcp-n8n
steps: true
---

# Claude ↔ n8n (MCP)

> **Requires:** [n8n on Docker](n8n-docker.md) · [Claude Sandbox](claude-sandbox.md) · **Other Languages:** [Deutsch](claude-mcp-n8n.de.md)

In this manual we connect Claude to your local n8n over MCP, so that Claude can list, build and run your workflows for you. n8n provides a ready-made JSON block; you paste it into your repository and open a single opening in the sandbox firewall.

## Install

The steps are the same on all three platforms, because the work happens in the n8n interface and in two files.

### 1. Turn on MCP in n8n

Go to http://localhost:5678 > Settings > **Instance-level MCP** > *Enable MCP access*. This requires n8n 2.33 or newer.

### 2. Copy the config

Open *Connection details* > **Connect** > the **API key** tab. n8n generates a token and shows a Configuration JSON block that is already filled in. Copy it right away: once you leave the tab the token is masked, and you would have to rotate it to see one again.

### 3. Paste it into `.mcp.json`

Place the file at the root of your repository, creating it if it does not exist yet. Then change the host to `host.docker.internal:5678`, because inside the sandbox `localhost` refers to the sandbox itself:

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

### 4. Let the sandbox reach n8n

Run this on your computer, not inside the sandbox:

```bash
sbx policy allow network host.docker.internal:5678
```

### 5. Restart Claude

Claude reads `.mcp.json` at startup, so the new server only shows up after a restart.

Keep in mind that `.mcp.json` now holds a live token. Add it to `.gitignore` unless the repository is private and the token is disposable.

## Verify
Inside Claude Code:

```
/mcp
```

`n8n` should be listed as <mark>connected</mark>. Then ask Claude directly: `List my n8n workflows.`

## Try it (optional)
- `/mcp` > select `n8n` > browse the tools it exposes.
- "List my n8n workflows and tell me what each one does."
- "Build me an n8n workflow that takes a webhook and writes the body to a file." Then open http://localhost:5678 and inspect what Claude built.
- "Run the workflow called *X* and show me the output."
- Set the URL back to `localhost:5678`, restart, and watch `/mcp` fail. It is worth seeing this failure once deliberately, so you recognise it later.

<!-- #TODO confirm the endpoint path for a self-hosted 2.x instance: docs show both /mcp and /mcp-server/http. Read the URL out of the Configuration JSON n8n gives you and trust that one. -->
<!-- #TODO check whether workflows must be published and carry a webhook/form/schedule/chat trigger before they show up over MCP. -->

## Common problems
**`/mcp` shows n8n as failed** — there are three usual causes: the URL still says `localhost`, the `sbx policy allow` command was not run, or Claude was not restarted. Check them in that order.

**HTTP 403 with a policy message** — the sandbox firewall blocked the request. Run the `sbx policy allow network host.docker.internal:5678` command above; `sbx policy log` shows what was blocked.

**401 from n8n** — the token has expired or was rotated. Repeat step 2 and paste in the new block.
