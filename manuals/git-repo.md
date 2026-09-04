---
title: Git Repo Access
lang: en
---

# Git Repo Access

> **Requires:** nothing · **Sprache:** [Deutsch](git-repo.de.md)

An SSH key on your machine, registered with GitHub or Azure DevOps, so you can clone the course repo and push back.

Throughout: `<repo-name>` is the repo you were given, `<org>` your organisation.

<!-- #TODO replace <repo-name>, <org> and <project> with the real course values before handing this out. -->

## Install

Generate a key. Same command everywhere — press Enter three times to accept the default path and no passphrase.

```bash
ssh-keygen -t ed25519 -C "you@example.com"
```

Then copy the **public** half to the clipboard:

### macOS
```bash
pbcopy < ~/.ssh/id_ed25519.pub
```

### Windows
```powershell
Get-Content ~\.ssh\id_ed25519.pub | Set-Clipboard
```

### Linux
```bash
xclip -selection clipboard < ~/.ssh/id_ed25519.pub
```

Now register it, on every platform:

**GitHub** — Settings → SSH and GPG keys → New SSH key → paste → Add.

**Azure DevOps** — User settings (top right) → SSH public keys → New key → paste → Add.

Never paste `id_ed25519` without `.pub`. That one is the <mark>private</mark> key and never leaves your machine.

## Verify
```bash
ssh -T git@github.com
```

Answers `Hi <you>! You've successfully authenticated, but GitHub does not provide shell access.` Say `yes` to the host-key prompt the first time.

For Azure DevOps:

```bash
ssh -T git@ssh.dev.azure.com
```

Answers `shell request failed on channel 0` — that counts as success, ADO has no shell either.

Then clone:

```bash
git clone git@github.com:<org>/<repo-name>.git
```

```bash
git clone git@ssh.dev.azure.com:v3/<org>/<project>/<repo-name>
```

Clone on your **machine**, not inside a sandbox — the sandbox mounts the folder you start it from, so the checkout has to exist first.

## Try it
- `cd <repo-name> && git log --oneline -5` — you have history, so the clone worked.
- `git remote -v` — both URLs start with `git@`, not `https://`.
- `git switch -c <your-name>/scratch` then commit an empty file and `git push -u origin HEAD`.
- `ssh-add -l` — lists the keys your agent is holding.

## Common problems
**`Permission denied (publickey)`** — the key isn't registered, or you copied the private half. Re-run the copy command with `.pub` and re-add it.

**Windows: `Could not open a connection to your authentication agent`** — start the agent once, in an admin PowerShell: `Set-Service ssh-agent -StartupType Automatic; Start-Service ssh-agent`.

**ADO clone hangs or asks for a password** — the ADO URL has no `.git` suffix and uses `/v3/`. Copy it from the repo's *Clone* button, SSH tab.
