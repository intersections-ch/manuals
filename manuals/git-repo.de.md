---
title: Git-Repo-Zugang
lang: de
slug: git-repo
---

# Git-Repo-Zugang

> **Voraussetzungen:** keine · **Language:** [English](git-repo.md)

Ein SSH-Key auf deiner Maschine, registriert bei Azure DevOps, damit du dein Kurs-Repo klonen und zurückpushen kannst.

> **Achtung:** jede URL hier unten ist ein <mark>Platzhalter</mark>. Du bekommst dein eigenes Repo — benannt nach dir oder einem Kürzel, das du erhältst — am Morgen des Kurstags. Setz die URL ein, die du bekommst, für `<org>`, `<project>` und `<repo-name>`; rate sie nicht.

Der Kurs läuft auf **Azure DevOps**. Die GitHub-Befehle stehen trotzdem hier, weil du sie beim ersten Klon von irgendetwas anderem brauchen wirst.

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

**Azure DevOps** — User settings (oben rechts) > SSH public keys > New key > einfügen > Add.

**GitHub** — Settings > SSH and GPG keys > New SSH key > einfügen > Add.

Ein Key funktioniert für beides. Niemals `id_ed25519` ohne `.pub` einfügen — das ist der <mark>private</mark> Key und verlässt deine Maschine nie.

## Prüfen
```bash
ssh -T git@ssh.dev.azure.com
```

Antwortet `shell request failed on channel 0`. Das gilt als Erfolg — ADO hat dich authentifiziert und hat schlicht keine Shell. Beim ersten Mal die Host-Key-Frage mit `yes` beantworten.

GitHub antwortet zum Vergleich `Hi <du>! You've successfully authenticated, but GitHub does not provide shell access.`:

```bash
ssh -T git@github.com
```

Dann das Repo klonen, das du bekommen hast:

```bash
git clone git@ssh.dev.azure.com:v3/<org>/<project>/<repo-name>
```

Die GitHub-Form, für alles andere:

```bash
git clone git@github.com:<org>/<repo-name>.git
```

Auf deiner **Maschine** klonen, nicht in einer Sandbox — die Sandbox hängt den Ordner ein, aus dem du sie startest, der Checkout muss also vorher existieren.

## Ausprobieren
- `cd <repo-name> && git status` — es zeigt den Git-Status, der Klon hat also funktioniert. `git log --oneline -5` zeigt zusätzlich die Historie.
- `git remote -v` — die URL beginnt mit `git@`, nicht mit `https://`.
- `git switch -c <dein-name>/scratch`, eine leere Datei committen, `git push -u origin HEAD`, dann den Branch im ADO-Webinterface suchen.
- `ssh-add -l` — zeigt die Keys, die dein Agent hält.

## Typische Probleme
**`Permission denied (publickey)`** — der Key ist nicht registriert, oder du hast die private Hälfte kopiert. Kopierbefehl mit `.pub` wiederholen und neu hinterlegen.

**Windows: `Could not open a connection to your authentication agent`** — den Agent einmalig in einer Admin-PowerShell starten: `Set-Service ssh-agent -StartupType Automatic; Start-Service ssh-agent`.

**ADO-Klon hängt oder fragt nach einem Passwort** — die ADO-URL hat kein `.git` am Ende und nutzt `/v3/`. Kopier sie aus dem *Clone*-Button des Repos > Reiter **SSH** — nicht HTTPS.
