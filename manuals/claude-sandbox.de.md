---
title: Claude Sandbox
lang: de
slug: claude-sandbox
---

# Claude Sandbox

> **Voraussetzungen:** Docker · **Andere Sprachen:** [English](claude-sandbox.md)

In diesem Manual geben wir Claude Code eine sichere Docker-Sandbox (`sbx`), in der Claude alles ausführen darf, ohne deinen Computer zu verändern. Dein Projektordner wird zur Sandbox. Der Rest des Computers bleibt unerreichbar.

## Installation

Es sind zwei Teile zu installieren: das Claude-Code-CLI und Dockers `sbx`, das die Sandbox selbst bereitstellt. Nimm den Block für dein Betriebssystem.

### macOS
```bash
curl -fsSL https://claude.ai/install.sh | bash
brew trust docker/tap
brew install docker/tap/sbx
```

Dafür wird macOS 14 (Sonoma) oder neuer auf Apple Silicon vorausgesetzt.

### Windows
```powershell
winget install -e --id Anthropic.ClaudeCode
winget install -h Docker.sbx
```

Wenn `sbx` danach keine Sandbox startet, ist der Hypervisor noch nicht aktiviert. Schalte ihn einmalig in einer **Admin**-PowerShell ein und starte den Computer neu:

```powershell
Enable-WindowsOptionalFeature -Online -FeatureName HypervisorPlatform -All
```

### Linux
```bash
curl -fsSL https://claude.ai/install.sh | bash
curl -fsSL https://get.docker.com | sudo SBX=1 sh
sudo usermod -aG kvm $USER
```

Melde dich ab und wieder an, damit die `kvm`-Gruppe wirksam wird. Vorausgesetzt wird Ubuntu 24.04 oder neuer.

Sind beide installiert, meldest du dich bei beiden an. Die Schritte sind auf jeder Plattform dieselben:

1. `sbx login` — öffnet den Browser. Mit deinem Docker-Account anmelden.
2. `claude` — startet Claude Code.
3. Innerhalb von Claude: `/login` > mit deinem <mark>Abo</mark> (Pro oder Max) anmelden, nicht mit einem API-Key. `/exit`, wenn du fertig bist.

## Prüfen
```bash
claude --version
sbx --version
```

Beide sollten eine Versionsnummer ausgeben. Wechsle danach in einen beliebigen Projektordner und starte Claude dort:

```bash
sbx run claude
```

Claude Code startet in einer frischen Sandbox rund um diesen Ordner. Lass Claude `pwd && ls` ausführen, dann siehst du die Grenze seiner Welt: dein Projekt und nichts darüber.

## Ausprobieren (optional)
- `sbx tui` — Dashboard aller Sandboxes mit Zustand und Ressourcenverbrauch.
- `sbx run shell` — öffnet eine normale Shell in derselben Sandbox. Von dort holt `claude --dangerously-skip-permissions --resume` deine letzte Konversation zurück, ohne bei jedem Befehl nach Erlaubnis zu fragen. Das ist vertretbar, weil die Sandbox isoliert ist.
- `sbx policy allow network example.com` — ausgehender Verkehr ist standardmässig gesperrt, und blockierte Anfragen kommen als HTTP 403 mit der Begründung im Response-Body zurück.
- `sbx ports <sandbox-name> --publish 8080:8080/tcp` — macht einen Server in der Sandbox von deinem Computer aus erreichbar. Der Sandbox-Name steht in der Sandbox in `$SANDBOX_NAME`.
- Lass Claude in der Sandbox `rm -rf /` ausführen. Auf deinem Computer ändert sich nichts — genau darum geht es in diesem Manual.

<!-- #TODO `winget install -h Docker.sbx` prüfen — Dockers Doku nutzt `-h`, was für winget ungewöhnlich ist; `-e --id Docker.sbx` ist evtl. die sicherere Form. -->

## Typische Probleme
**`could not read Username for 'https://github.com'` in der Sandbox** — die Sandbox hat kein GitHub-Token. Auf dem Host: `sbx secret set github --sandbox <sandbox-name> -t "$(gh auth token)"`.

**Eine Anfrage scheitert mit HTTP 403** — die Firewall hat sie blockiert. Lies die Begründung im Response-Body und führ dann auf deinem Computer `sbx policy allow network <domain>` aus. `sbx policy log` listet auf, was warum blockiert wurde.

**`localhost` in der Sandbox erreicht nichts** — die Sandbox hat ihr eigenes localhost. Für Dienste auf deinem Computer nimmst du stattdessen `host.docker.internal:<port>`.
