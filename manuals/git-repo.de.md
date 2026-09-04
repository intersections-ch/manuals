---
title: Git-Repo-Zugang
lang: de
slug: git-repo
---

# Git-Repo-Zugang

> **Voraussetzungen:** keine · **Andere Sprachen:** [English](git-repo.md)

In diesem Manual erstellen wir einen SSH-Key auf deinem Computer und registrieren ihn bei Azure DevOps, damit du dein Kurs-Repository klonen und deine Arbeit zurückpushen kannst.

> **Achtung:** jede URL hier unten ist ein <mark>Platzhalter</mark>. Du bekommst dein eigenes Repo für den Kurs. Setz die URL ein, die du bekommst, für `<org>`, `<project>` und `<repo-name>`.

Der Kurs selbst läuft auf **Azure DevOps**, deshalb stehen diese Befehle zuerst. Die GitHub-Entsprechungen sind ebenfalls aufgeführt, weil du sie beim ersten Klon ausserhalb des Kurses brauchen wirst.

## Installation

Zuerst erzeugst du einen Key. Der Befehl ist überall derselbe; dreimal Enter übernimmt den Standardpfad und keine Passphrase.

```bash
ssh-keygen -t ed25519 -C "du@example.com"
```

Danach kopierst du die **öffentliche** Hälfte des Keys in die Zwischenablage. Das ist der einzige Schritt, der sich je nach Betriebssystem unterscheidet:

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

Jetzt registrierst du diesen Key beim jeweiligen Dienst. Die Schritte sind auf jeder Plattform dieselben:

**Azure DevOps** — User settings (oben rechts) > SSH public keys > New key > einfügen > Add.

**GitHub** — Settings > SSH and GPG keys > New SSH key > einfügen > Add.

Ein einziger Key funktioniert für beide Dienste. Füg niemals `id_ed25519` ohne die Endung `.pub` ein: Diese Datei ist der <mark>private</mark> Key und sollte deinen Computer nie verlassen.

## Prüfen
```bash
ssh -T git@ssh.dev.azure.com
```

Das antwortet mit `shell request failed on channel 0`, und das gilt als Erfolg: Azure DevOps hat dich authentifiziert und stellt schlicht keine Shell bereit. Beim ersten Verbinden bestätigst du die Host-Key-Frage mit `yes`.

GitHub antwortet zum Vergleich `Hi <du>! You've successfully authenticated, but GitHub does not provide shell access.`:

```bash
ssh -T git@github.com
```

Funktioniert die Authentifizierung, klonst du das Repository, das du bekommen hast:

```bash
git clone git@ssh.dev.azure.com:v3/<org>/<project>/<repo-name>
```

Die GitHub-Form, für alles andere:

```bash
git clone git@github.com:<org>/<repo-name>.git
```

Klone auf deinem **Computer**, nicht in einer Sandbox. Eine Sandbox entsteht rund um den Ordner, aus dem du sie startest, der Checkout muss also vorher vorhanden sein.

## Ausprobieren (optional)
- `cd <repo-name> && git status` — zeigt es den Git-Status an, hat der Klon funktioniert. `git log --oneline -5` zeigt zusätzlich die Historie.
- `git remote -v` — die URL sollte mit `git@` beginnen und nicht mit `https://`.
- `git switch -c <dein-name>/scratch`, eine leere Datei committen, `git push -u origin HEAD`, dann den Branch im ADO-Webinterface suchen.
- `ssh-add -l` — listet die Keys auf, die dein SSH-Agent aktuell hält.

## Typische Probleme
**`Permission denied (publickey)`** — entweder ist der Key nicht registriert, oder es wurde versehentlich die private Hälfte kopiert. Wiederhol den Kopierbefehl mit `.pub` und hinterleg ihn erneut.

**Windows: `Could not open a connection to your authentication agent`** — der SSH-Agent läuft nicht. Starte ihn einmalig in einer Admin-PowerShell: `Set-Service ssh-agent -StartupType Automatic; Start-Service ssh-agent`.

**Der Azure-DevOps-Klon hängt oder fragt nach einem Passwort** — diese URL hat kein `.git` am Ende und nutzt `/v3/`. Kopier sie aus dem *Clone*-Button des Repositories > Reiter **SSH**, nicht HTTPS.
