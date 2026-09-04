---
title: Claude Sandbox
lang: en
---

# Claude Sandbox

> **Requires:** Docker · **Sprache:** [Deutsch](claude-sandbox.de.md)

Claude Code inside an isolated Docker microVM (`sbx`) — it can run anything without touching your machine. Your project folder is mounted in; the rest of your disk is unreachable.

## Install

Two pieces: the Claude Code CLI, and Docker's `sbx`.

### macOS
```bash
curl -fsSL https://claude.ai/install.sh | bash
brew trust docker/tap
brew install docker/tap/sbx
```

Requires macOS 14 (Sonoma) or later on Apple silicon.

### Windows
```powershell
winget install -e --id Anthropic.ClaudeCode
winget install -h Docker.sbx
```

If `sbx` refuses to start a sandbox, enable the hypervisor once in an **admin** PowerShell and reboot:

```powershell
Enable-WindowsOptionalFeature -Online -FeatureName HypervisorPlatform -All
```

### Linux
```bash
curl -fsSL https://claude.ai/install.sh | bash
curl -fsSL https://get.docker.com | sudo SBX=1 sh
sudo usermod -aG kvm $USER
```

Log out and back in so the `kvm` group applies. Ubuntu 24.04 or later.

Then log in to both, on every platform:

1. `sbx login` — opens a browser. Sign in with your Docker account.
2. `claude` — starts Claude Code.
3. Inside Claude: `/login` > sign in with your <mark>subscription</mark> (Pro or Max), not an API key. `/exit` when you're done.

## Verify
```bash
claude --version
sbx --version
```

Both print a version. Then, from inside any project folder:

```bash
sbx run claude
```

Claude Code starts in a fresh sandbox with that folder mounted. Ask it `pwd && ls` — it sees your project and nothing above it.

## Try it
- `sbx tui` — dashboard of every sandbox, its state and resource usage.
- `sbx run shell` — a plain shell in the same sandbox. From there, `claude --dangerously-skip-permissions --resume` picks your last conversation back up with no permission prompts. Safe here precisely because it is sandboxed.
- `sbx policy allow network example.com` — outbound traffic is denied by default; blocked requests come back as HTTP 403 with the reason in the body.
- `sbx ports <sandbox-name> --publish 8080:8080/tcp` — reach a server running inside the box. Your sandbox name is `$SANDBOX_NAME` inside it.
- Ask Claude to `rm -rf /` in the sandbox. Nothing on your machine changes.

<!-- #TODO confirm `winget install -h Docker.sbx` — Docker's docs use `-h`, which is unusual for winget; `-e --id Docker.sbx` may be the safer form. -->

## Common problems
**`could not read Username for 'https://github.com'` inside the sandbox** — the sandbox has no GitHub token. On the host: `sbx secret set github --sandbox <sandbox-name> -t "$(gh auth token)"`.

**A request fails with HTTP 403** — the firewall blocked it. Read the response body, then `sbx policy allow network <domain>` on the host. `sbx policy log` shows what was blocked and why.

**`localhost` inside the sandbox reaches nothing** — the sandbox has its own localhost. Use `host.docker.internal:<port>` for services on your machine.
