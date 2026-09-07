---
title: Claude ↔ n8n (MCP)
lang: en
slug: claude-mcp-n8n
steps: true
---

# Claude ↔ n8n (MCP)

> **Requires:** [n8n on Docker](n8n-docker.md) · [Claude Sandbox](claude-sandbox.md) · **Other Languages:** [Deutsch](claude-mcp-n8n.de.md)

In this manual we connect Claude to your local n8n over MCP, so that Claude can list, build and run your workflows for you. n8n provides a ready-made JSON block; you paste it into your repository, keep the API key itself in a sandbox secret and open a single opening in the sandbox firewall.

## Install

The steps are the same on all three platforms, because the work happens in the n8n interface and in two files.

### 1. Turn on MCP in n8n

Go to http://localhost:5678 > Settings > **Instance-level MCP** > *Enable MCP access*. This requires n8n 2.33 or newer.

### 2. Release the workflows you want Claude to reach

MCP is off per workflow by default. Open a workflow > **Settings** > turn on *Available in MCP*, then save. Repeat this for **every** workflow Claude should see. A workflow without the toggle stays invisible over MCP even though the server is connected.

### 3. Copy the config

Open *Connection details* > **Connect** > the **API key** tab. n8n generates a token and shows a Configuration JSON block that is already filled in. Copy it right away: once you leave the tab the token is masked, and you would have to rotate it to see one again.

### 4. Store the API key as a sandbox secret

Run this on your computer, not inside the sandbox. Replace `<your-token>` with the API key you just copied from n8n:

```bash
sbx secret set-custom --host localhost --env N8N_TOKEN --value <your-token>
```

The sandbox now receives the key as the environment variable `N8N_TOKEN`. <mark>Careful:</mark> do not paste the API key itself into the sandbox — not into a file, not into a prompt. It stays on your computer, and only this command hands it over.

### 5. Paste the config into `.mcp.json`

Place the file at the root of your repository, creating it if it does not exist yet. Change two things in the block n8n gave you: the host becomes `host.docker.internal:5678`, because inside the sandbox `localhost` refers to the sandbox itself, and `<your-n8n-token>` becomes `${N8N_TOKEN}`, so the file references the secret instead of containing it:

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

### 6. Let the sandbox reach n8n

Run this on your computer too:

```bash
sbx policy allow network host.docker.internal:5678
sbx policy allow network localhost:5678
```

### 7. Restart Claude

Claude reads `.mcp.json` at startup, so the new server only shows up after a restart.

Because the token now lives in the secret and not in the file, `.mcp.json` is safe to commit.

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

<!-- #TODO confirm the exact location of the per-workflow MCP toggle: label and menu path (workflow Settings vs. the ... menu) may differ by n8n version. -->
<!-- #TODO confirm the endpoint path for a self-hosted 2.x instance: docs show both /mcp and /mcp-server/http. Read the URL out of the Configuration JSON n8n gives you and trust that one. -->
<!-- #TODO check whether workflows must be published and carry a webhook/form/schedule/chat trigger before they show up over MCP. -->

## Common problems
**Claude sees no workflows, or misses one** — `/mcp` says connected, but the list is empty or short. The workflow is missing the *Available in MCP* toggle from step 2; turn it on and ask again.

**`/mcp` shows n8n as failed** — there are four usual causes: the URL still says `localhost`, the secret was not set, the `sbx policy allow` command was not run, or Claude was not restarted. Check them in that order. An HTTP 403 with a policy message means the sandbox firewall blocked the request; `sbx policy log` shows what was blocked.

**401 from n8n** — the token has expired or was rotated, or `N8N_TOKEN` never arrived in the sandbox. Repeat steps 3 and 4 with a fresh API key, then restart Claude.
