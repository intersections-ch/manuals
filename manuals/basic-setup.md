---
title: Basic Setup
lang: en
slug: basic-setup
steps: true
---

# Basic Setup

> **Requires:** nothing · **Other Languages:** [Deutsch](basic-setup.de.md)

In this manual we set up the whole course environment in five steps: Claude Code in a sandbox, your repository checked out, n8n running, and the two connected to each other. Each step links to a full manual, so work through that one and then come back here.

Plan for 30–60 minutes, most of which is downloads.

This tutorial has you type a fair number of terminal commands. If anything is unclear, just ask one of the instructors.

## Install

### 1. Claude Code in a sandbox
[Claude Sandbox](claude-sandbox.md)

1. Install the Claude Code CLI and Docker's `sbx`, then run `sbx login`. Sign in with your Docker account.
2. Run `sbx run claude` in a directory of your choice. That directory becomes the sandbox. Your Git repo is a good one to use (see the next step).
3. Inside Claude: `/login` > sign in with your subscription.

This step is done when `claude --version` and `sbx --version` both print something.

### 2. Your repository on your computer
[Git Repo Access](git-repo.md)

Run `git clone <repo>` in your usual working folder to copy your repository onto your computer. Do this **outside** any sandbox.

You each get your own ADO Git repository for the course. `<repo-name>` is a <mark>placeholder</mark> throughout these manuals — substitute the URL that points at your own repository.

This step is done when `git status` inside the cloned repository shows the Git status.

### 3. Open the repo in the sandbox

```bash
cd <repo-name>
sbx run claude
```

The first run builds the sandbox and installs Claude Code inside it. From then on, that folder is everything Claude can see; nothing above it is reachable.

If needed, log in inside Claude Code with `/login`.

Two commands that are often useful afterwards:

```bash
sbx tui
sbx run shell
```

`sbx tui` is the dashboard of running sandboxes. `sbx run shell` opens a plain shell in the same sandbox, where

```bash
claude --dangerously-skip-permissions --resume
```

resumes your last conversation and stops asking permission for every command. That is only reasonable because the sandbox is isolated.

### 4. The n8n stack
[Qdrant on Docker](qdrant-docker.md) [n8n on Docker](n8n-docker.md)

Clone [the course stack](https://github.com/intersections-ch/docker-n8n-ollama-qdrant) and start Qdrant, Ollama and n8n in that order, then create the owner account at http://localhost:5678.

You need two models here: `nomic-embed-text` for Qdrant, and `gemma4:e2b` if you also want to chat locally ([Ollama](ollama.md)).

This step is done when http://localhost:5678 loads and you are logged in.

### 5. Wire Claude to n8n
[Claude ↔ n8n (MCP)](claude-mcp-n8n.md)

1. Switch on Instance-level MCP in n8n (Settings > Instance-level MCP).
2. Copy the Configuration JSON into the file `.mcp.json` in your repo (Connect > API key > copy Configuration JSON).
3. Point it at `host.docker.internal:5678` and open the sandbox firewall:

```bash
sbx policy allow network host.docker.internal:5678
```

This step is done when `/mcp` inside Claude lists `n8n` as connected.

## Verify
You can check everything at once. From your repository folder, run:

```bash
sbx run shell
```

and inside the sandbox:

```bash
claude --dangerously-skip-permissions --resume
```

Then, inside Claude, `/mcp` should show `n8n` as connected, and `List my n8n workflows.` should return an answer. If that works, all five steps are complete.

## Try it (optional)
- Ask Claude to read your repo and explain what it does.
- "Build an n8n workflow that receives a webhook and logs the body." Then inspect the result in the n8n interface.
- `sbx tui` — review your existing sandboxes, restart an older one, and continue a previous session inside it with `claude --resume`.
