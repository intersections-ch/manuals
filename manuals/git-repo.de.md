---
title: Git-Repo-Zugang
lang: de
---

# Git-Repo-Zugang

> **Voraussetzungen:** keine · **Language:** [English](git-repo.md)

Ein SSH-Key auf deiner Maschine, registriert bei GitHub oder Azure DevOps, damit du das Kurs-Repo klonen und zurückpushen kannst.

Durchgehend: `<repo-name>` ist das Repo, das du bekommen hast, `<org>` deine Organisation.

<!-- #TODO <repo-name>, <org> und <project> vor der Ausgabe durch die echten Kurswerte ersetzen. -->

## Installation

Key erzeugen. Überall derselbe Befehl — dreimal Enter für Standardpfad und keine Passphrase.

```bash
ssh-keygen -t ed25519 -C "du@example.com"
```

Dann die **öffentliche** Hälfte in die Zwischenablage kopieren:

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

Jetzt registrieren, auf jeder Plattform gleich:

**GitHub** — Settings → SSH and GPG keys → New SSH key → einfügen → Add.

**Azure DevOps** — User settings (oben rechts) → SSH public keys → New key → einfügen → Add.

Niemals `id_ed25519` ohne `.pub` einfügen. Das ist der <mark>private</mark> Key und verlässt deine Maschine nie.

## Prüfen
```bash
ssh -T git@github.com
```

Antwortet `Hi <du>! You've successfully authenticated, but GitHub does not provide shell access.` Beim ersten Mal die Host-Key-Frage mit `yes` beantworten.

Für Azure DevOps:

```bash
ssh -T git@ssh.dev.azure.com
```

Antwortet `shell request failed on channel 0` — das gilt als Erfolg, ADO hat ebenfalls keine Shell.

Dann klonen:

```bash
git clone git@github.com:<org>/<repo-name>.git
```

```bash
git clone git@ssh.dev.azure.com:v3/<org>/<project>/<repo-name>
```

Auf deiner **Maschine** klonen, nicht in einer Sandbox — die Sandbox hängt den Ordner ein, aus dem du sie startest, der Checkout muss also vorher existieren.

## Ausprobieren
- `cd <repo-name> && git log --oneline -5` — es gibt Historie, der Klon hat also funktioniert.
- `git remote -v` — beide URLs beginnen mit `git@`, nicht mit `https://`.
- `git switch -c <dein-name>/scratch`, eine leere Datei committen und `git push -u origin HEAD`.
- `ssh-add -l` — zeigt die Keys, die dein Agent hält.

## Typische Probleme
**`Permission denied (publickey)`** — der Key ist nicht registriert, oder du hast die private Hälfte kopiert. Kopierbefehl mit `.pub` wiederholen und neu hinterlegen.

**Windows: `Could not open a connection to your authentication agent`** — den Agent einmalig in einer Admin-PowerShell starten: `Set-Service ssh-agent -StartupType Automatic; Start-Service ssh-agent`.

**ADO-Klon hängt oder fragt nach einem Passwort** — die ADO-URL hat kein `.git` am Ende und nutzt `/v3/`. Kopier sie aus dem *Clone*-Button des Repos, Reiter SSH.
