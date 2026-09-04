---
title: Git Repo Access
lang: en
---

# Git Repo Access

> **Requires:** nothing · **Sprache:** [Deutsch](git-repo.de.md)

An SSH key on your machine, registered with Azure DevOps, so you can clone your course repo and push back.

> Every URL below is a <mark>placeholder</mark>. You get your own repo — named after you or a tag you're given — on the morning of the course. Substitute the URL you're handed for `<org>`, `<project>` and `<repo-name>`; don't try to guess it.

The class runs on **Azure DevOps**. The GitHub commands are here too, because you will need them the first time you clone anything else.

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

**Azure DevOps** — User settings (top right) > SSH public keys > New key > paste > Add.

**GitHub** — Settings > SSH and GPG keys > New SSH key > paste > Add.

One key works for both. Never paste `id_ed25519` without `.pub` — that one is the <mark>private</mark> key and never leaves your machine.

## Verify
```bash
ssh -T git@ssh.dev.azure.com
```

Answers `shell request failed on channel 0`. That counts as success — ADO authenticated you and has no shell to give. Say `yes` to the host-key prompt the first time.

GitHub, for comparison, answers `Hi <you>! You've successfully authenticated, but GitHub does not provide shell access.`:

```bash
ssh -T git@github.com
```

Then clone the repo you were given:

```bash
git clone git@ssh.dev.azure.com:v3/<org>/<project>/<repo-name>
```

The GitHub form, for everything else:

```bash
git clone git@github.com:<org>/<repo-name>.git
```

Clone on your **machine**, not inside a sandbox — the sandbox mounts the folder you start it from, so the checkout has to exist first.

## Try it
- `cd <repo-name> && git status` — it prints the Git status, so the clone worked. `git log --oneline -5` shows you have history too.
- `git remote -v` — the URL starts with `git@`, not `https://`.
- `git switch -c <your-name>/scratch`, commit an empty file, `git push -u origin HEAD`, then find the branch in the ADO web UI.
- `ssh-add -l` — lists the keys your agent is holding.

## Common problems
**`Permission denied (publickey)`** — the key isn't registered, or you copied the private half. Re-run the copy command with `.pub` and re-add it.

**Windows: `Could not open a connection to your authentication agent`** — start the agent once, in an admin PowerShell: `Set-Service ssh-agent -StartupType Automatic; Start-Service ssh-agent`.

**ADO clone hangs or asks for a password** — the ADO URL has no `.git` suffix and uses `/v3/`. Copy it from the repo's *Clone* button > **SSH** tab — not the HTTPS one.
