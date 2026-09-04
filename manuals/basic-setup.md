---
title: Basic Setup
lang: en
slug: basic-setup
steps: true
---

# Basic Setup

> **Requires:** nothing · **Sprache:** [Deutsch](basic-setup.de.md)

The whole course environment in five steps: Claude Code in a sandbox, your repo checked out, n8n running, and the two talking to each other. Each step links to a full manual — do that one, then come back here.

Budget 30–60 minutes, most of it downloads.

This tutorial has you type a fair number of terminal commands. If anything is unclear, just ask one of the instructors.

## Install

### 1. Claude Code in a sandbox
[Claude Sandbox](claude-sandbox.md)

1. Install the Claude Code CLI and Docker's `sbx`, then run `sbx login`. Sign in with your Docker account.
2. Run `sbx run claude` in a directory of your choice. That directory becomes the sandbox. Your Git repo is a good one to use (see the next step).
3. Inside Claude: `/login` > sign in with your subscription.

Done when `claude --version` and `sbx --version` both print something.

### 2. Your repo on your machine
[Git Repo Access](git-repo.md)

Run `git clone <repo>` in your usual working folder. That copies your repository onto your machine. (**Not** inside a sandbox.)

Everyone gets their own ADO Git repository. `<repo-name>` is a <mark>placeholder</mark> throughout these manuals — put in the URL that points at your repository.

Done when `git status` inside the cloned repository shows the Git status.

### 3. Open the repo in the sandbox

```bash
cd <repo-name>
sbx run claude
```

First run builds the box and installs Claude Code inside it. That folder — and nothing above it — is what Claude can see.

If needed, log in inside Claude Code with `/login`.

Two commands that are often useful afterwards:

```bash
sbx tui
sbx run shell
```

`sbx tui` is the dashboard of running sandboxes. `sbx run shell` drops you into a plain shell in the same box, where

```bash
claude --dangerously-skip-permissions --resume
```

picks your last conversation back up and stops asking permission for every command. Only reasonable because it's a sandbox.

### 4. The n8n stack
[Qdrant on Docker](qdrant-docker.md) [n8n on Docker](n8n-docker.md)

Clone [the course stack](https://github.com/intersections-ch/docker-n8n-ollama-qdrant) and bring up Qdrant, Ollama and n8n — in that order — then create the owner account at http://localhost:5678.

Models: `nomic-embed-text` for Qdrant, `gemma4:e2b` if you want to chat locally ([Ollama](ollama.md)).

Done when http://localhost:5678 loads and you're logged in.

### 5. Wire Claude to n8n
[Claude ↔ n8n (MCP)](claude-mcp-n8n.md)

1. Switch on Instance-level MCP in n8n (Settings > Instance-level MCP).
2. Copy the Configuration JSON into the file `.mcp.json` in your repo (Connect > API key > copy Configuration JSON).
3. Point it at `host.docker.internal:5678` and open the sandbox firewall:

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
- `sbx tui` — look at your existing sandboxes, restart an older one, and pick up a previous session inside it with `claude --resume`.
