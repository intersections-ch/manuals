---
title: Basic Setup
lang: en
---

# Basic Setup

> **Requires:** nothing · **Sprache:** [Deutsch](basic-setup.de.md)

The whole course environment in five steps: Claude Code in a sandbox, your repo checked out, n8n running, and the two talking to each other. Each step links to a full manual — do that one, then come back here.

Budget an hour, most of it downloads.

## Install

### 1. Claude Code in a sandbox
→ [Claude Sandbox](claude-sandbox.md)

Install the Claude Code CLI and Docker's `sbx`, then `sbx login` and `claude`. Sign in with your <mark>subscription</mark>, not an API key.

Done when `claude --version` and `sbx --version` both answer.

### 2. Your repo on your machine
→ [Git Repo Access](git-repo.md)

Make an SSH key, register it with GitHub or Azure DevOps, clone `<repo-name>`.

Clone on your machine, **not** in a sandbox — step 3 mounts the folder you already have.

Done when `git log` inside the clone shows history.

### 3. Open the repo in the sandbox

```bash
cd <repo-name>
sbx run claude
```

First run builds the box and installs Claude Code inside it. That folder — and nothing above it — is what Claude can see.

Two commands you'll use constantly after this:

```bash
sbx tui
sbx run shell
```

`sbx tui` is the dashboard of running sandboxes. `sbx run shell` drops you into a plain shell in the same box, where

```bash
claude --dangerously-skip-permissions --resume
```

picks your last conversation back up and stops asking permission for every command. Only reasonable because it's a sandbox.

### 4. n8n on Docker
→ [n8n on Docker](n8n-docker.md)

Clone [the course stack](https://github.com/intersections-ch/docker-n8n-ollama-qdrant), bring up Qdrant, Ollama and n8n, create the owner account at http://localhost:5678.

Done when http://localhost:5678 loads and you're logged in.

### 5. Wire Claude to n8n
→ [Claude ↔ n8n (MCP)](claude-mcp-n8n.md)

Enable Instance-level MCP in n8n, copy its Configuration JSON into `.mcp.json` in your repo, point it at `host.docker.internal:5678`, and open the firewall:

```bash
sbx policy allow network host.docker.internal:5678
```

Done when `/mcp` inside Claude lists `n8n` as connected.

## Verify
Everything at once — from your repo folder:

```bash
sbx run shell
```

and inside the sandbox:

```bash
claude --dangerously-skip-permissions --resume
```

then, in Claude: `/mcp` shows `n8n` connected, and `List my n8n workflows.` answers.

If that works, all five steps are done.

## Try it
- Ask Claude to read your repo and explain what it does.
- "Build an n8n workflow that hits a webhook and logs the body." Then look at it in the n8n UI.
- `sbx tui` — watch the sandbox's CPU and memory while Claude works.
- Ask Claude to install something absurd. It's a sandbox; `sbx rm` throws it away.
- `git switch -c <your-name>/day-1` and let Claude commit its first change.

<!-- #TODO fill in the real <repo-name> and clone URL, and say whether the class is on GitHub or Azure DevOps. -->

## Common problems
**Step 3 mounts the wrong folder** — `sbx run claude` mounts the directory you ran it from. `cd` into the repo first.

**Step 5 can't reach n8n** — `localhost` inside a sandbox is the sandbox. Use `host.docker.internal:5678` and run the `sbx policy allow` command on your machine.

**Claude asks to authenticate again inside the sandbox** — credentials live on the host per sandbox. Sign in once inside the box; `--resume` keeps the session after that.
