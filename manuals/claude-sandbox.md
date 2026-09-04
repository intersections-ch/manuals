---
title: Claude Sandbox
lang: en
slug: claude-sandbox
---

# Claude Sandbox

> **Requires:** Docker · **Other Languages:** [Deutsch](claude-sandbox.de.md)

In this manual we give Claude Code a secure Docker sandbox (`sbx`) to work in, so that it may run anything without changing your computer. Your project folder becomes the sandbox, and the rest of the computer stays out of reach.

## Install

There are two pieces to install: the Claude Code CLI, and Docker's `sbx`, which provides the sandbox itself. Pick the block for your operating system.

### macOS
```bash
curl -fsSL https://claude.ai/install.sh | bash
brew trust docker/tap
brew install docker/tap/sbx
```

This requires macOS 14 (Sonoma) or later on Apple silicon.

### Windows
```powershell
winget install -e --id Anthropic.ClaudeCode
winget install -h Docker.sbx
```

If `sbx` then refuses to start a sandbox, the hypervisor is not enabled yet. Turn it on once in an **admin** PowerShell and reboot:

```powershell
Enable-WindowsOptionalFeature -Online -FeatureName HypervisorPlatform -All
```

### Linux
```bash
curl -fsSL https://claude.ai/install.sh | bash
curl -fsSL https://get.docker.com | sudo SBX=1 sh
sudo usermod -aG kvm $USER
```

Log out and back in so that the `kvm` group takes effect. This requires Ubuntu 24.04 or later.

With both installed, log in to each of them. The steps are the same on every platform:

1. `sbx login` — opens a browser. Sign in with your Docker account.
2. `claude` — starts Claude Code.
3. Inside Claude: `/login` > sign in with your <mark>subscription</mark> (Pro or Max), not an API key. `/exit` when you're done.

## Verify
```bash
claude --version
sbx --version
```

Both should print a version number. Once they do, move into any project folder and start Claude there:

```bash
sbx run claude
```

Claude Code starts in a fresh sandbox built around that folder. Ask it to run `pwd && ls` and you will see the limit of its world: your project, and nothing above it.

## Try it (optional)
- `sbx tui` — dashboard of every sandbox, its state and resource usage.
- `sbx run shell` — opens a plain shell in the same sandbox. From there, `claude --dangerously-skip-permissions --resume` resumes your last conversation without asking permission for each command. That is defensible precisely because the sandbox is isolated.
- `sbx policy allow network example.com` — outbound traffic is blocked by default, and blocked requests return HTTP 403 with the reason in the response body.
- `sbx ports <sandbox-name> --publish 8080:8080/tcp` — makes a server running inside the sandbox reachable from your computer. The sandbox name is available as `$SANDBOX_NAME` from within it.
- Ask Claude to run `rm -rf /` inside the sandbox. Nothing on your computer changes — that is the whole point of this manual.

<!-- #TODO confirm `winget install -h Docker.sbx` — Docker's docs use `-h`, which is unusual for winget; `-e --id Docker.sbx` may be the safer form. -->

## Common problems
**`could not read Username for 'https://github.com'` inside the sandbox** — the sandbox has no GitHub token. On the host: `sbx secret set github --sandbox <sandbox-name> -t "$(gh auth token)"`.

**A request fails with HTTP 403** — the firewall blocked it. Read the response body for the reason, then run `sbx policy allow network <domain>` on your computer. `sbx policy log` lists what was blocked and why.

**`localhost` inside the sandbox reaches nothing** — the sandbox has its own localhost. For services running on your computer, use `host.docker.internal:<port>` instead.
