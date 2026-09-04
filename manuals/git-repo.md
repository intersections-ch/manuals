---
title: Git Repo Access
lang: en
slug: git-repo
---

# Git Repo Access

> **Requires:** nothing · **Other Languages:** [Deutsch](git-repo.de.md)

In this manual we create an SSH key on your computer and register it with Azure DevOps, so that you can clone your course repository and push your work back to it.

> **Careful:** every URL below is a <mark>placeholder</mark>. You get your own repo for the course. Substitute the URL you are given for `<org>`, `<project>` and `<repo-name>`.

The course itself runs on **Azure DevOps**, so those commands come first. The GitHub equivalents are included as well, because you will need them the first time you clone anything outside the course.

## Install

Start by generating a key. The command is the same everywhere; press Enter three times to accept the default path and no passphrase.

```bash
ssh-keygen -t ed25519 -C "you@example.com"
```

Then copy the **public** half of the key to your clipboard. This is the one step that differs per operating system:

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

Now register that key with the service you are using. The steps are the same on every platform:

**Azure DevOps** — User settings (top right) > SSH public keys > New key > paste > Add.

**GitHub** — Settings > SSH and GPG keys > New SSH key > paste > Add.

A single key works for both services. Never paste `id_ed25519` without the `.pub` ending: that file is the <mark>private</mark> key and should never leave your computer.

## Verify
```bash
ssh -T git@ssh.dev.azure.com
```

This answers `shell request failed on channel 0`, which counts as success: Azure DevOps has authenticated you and simply has no shell to offer. The first time you connect, confirm the host key prompt with `yes`.

GitHub, for comparison, answers `Hi <you>! You've successfully authenticated, but GitHub does not provide shell access.`:

```bash
ssh -T git@github.com
```

With authentication working, clone the repository you were given:

```bash
git clone git@ssh.dev.azure.com:v3/<org>/<project>/<repo-name>
```

The GitHub form, for everything else:

```bash
git clone git@github.com:<org>/<repo-name>.git
```

Clone on your **computer**, not inside a sandbox. A sandbox is built around the folder you start it from, so the checkout has to exist beforehand.

## Try it (optional)
- `cd <repo-name> && git status` — printing the Git status confirms the clone worked. `git log --oneline -5` additionally shows the history.
- `git remote -v` — the URL should start with `git@` rather than `https://`.
- `git switch -c <your-name>/scratch`, commit an empty file, `git push -u origin HEAD`, then find the branch in the ADO web UI.
- `ssh-add -l` — lists the keys your SSH agent currently holds.

## Common problems
**`Permission denied (publickey)`** — either the key is not registered, or the private half was copied by mistake. Repeat the copy command with `.pub` and register it again.

**Windows: `Could not open a connection to your authentication agent`** — the SSH agent is not running. Start it once in an admin PowerShell: `Set-Service ssh-agent -StartupType Automatic; Start-Service ssh-agent`.

**The Azure DevOps clone hangs or asks for a password** — that URL has no `.git` suffix and uses `/v3/`. Copy it from the repository's *Clone* button > **SSH** tab, not the HTTPS one.
