---
title: Claude Sandbox
lang: de
---

# Claude Sandbox

> **Voraussetzungen:** Docker · **Language:** [English](claude-sandbox.md)

Claude Code in einer isolierten Docker-MicroVM (`sbx`) — es darf alles ausführen, ohne deine Maschine anzufassen. Dein Projektordner wird eingehängt, der Rest der Platte ist unerreichbar.

## Installation

Zwei Teile: das Claude-Code-CLI und Dockers `sbx`.

### macOS
```bash
curl -fsSL https://claude.ai/install.sh | bash
brew trust docker/tap
brew install docker/tap/sbx
```

Braucht macOS 14 (Sonoma) oder neuer auf Apple Silicon.

### Windows
```powershell
winget install -e --id Anthropic.ClaudeCode
winget install -h Docker.sbx
```

Wenn `sbx` keine Sandbox starten will, den Hypervisor einmalig in einer **Admin**-PowerShell aktivieren und neu starten:

```powershell
Enable-WindowsOptionalFeature -Online -FeatureName HypervisorPlatform -All
```

### Linux
```bash
curl -fsSL https://claude.ai/install.sh | bash
curl -fsSL https://get.docker.com | sudo SBX=1 sh
sudo usermod -aG kvm $USER
```

Ab- und wieder anmelden, damit die `kvm`-Gruppe greift. Ubuntu 24.04 oder neuer.

Danach auf jeder Plattform bei beiden anmelden:

1. `sbx login` — öffnet den Browser. Mit deinem Docker-Account anmelden.
2. `claude` — startet Claude Code.
3. Innerhalb von Claude: `/login` > mit deinem <mark>Abo</mark> (Pro oder Max) anmelden, nicht mit einem API-Key. `/exit`, wenn du fertig bist.

## Prüfen
```bash
claude --version
sbx --version
```

Beide geben eine Version aus. Dann aus einem beliebigen Projektordner:

```bash
sbx run claude
```

Claude Code startet in einer frischen Sandbox mit diesem Ordner eingehängt. Frag es nach `pwd && ls` — es sieht dein Projekt und nichts darüber.

## Ausprobieren
- `sbx tui` — Dashboard aller Sandboxes mit Zustand und Ressourcenverbrauch.
- `sbx run shell` — eine normale Shell in derselben Sandbox. Von dort holt `claude --dangerously-skip-permissions --resume` deine letzte Konversation zurück, ohne bei jedem Befehl zu fragen. Genau deshalb ist die Sandbox da.
- `sbx policy allow network example.com` — ausgehender Verkehr ist standardmässig gesperrt; blockierte Anfragen kommen als HTTP 403 mit Begründung im Body zurück.
- `sbx ports <sandbox-name> --publish 8080:8080/tcp` — einen Server in der Box erreichbar machen. Der Sandbox-Name steht drinnen in `$SANDBOX_NAME`.
- Lass Claude in der Sandbox `rm -rf /` ausführen. Auf deiner Maschine ändert sich nichts.

<!-- #TODO `winget install -h Docker.sbx` prüfen — Dockers Doku nutzt `-h`, was für winget ungewöhnlich ist; `-e --id Docker.sbx` ist evtl. die sicherere Form. -->

## Typische Probleme
**`could not read Username for 'https://github.com'` in der Sandbox** — die Sandbox hat kein GitHub-Token. Auf dem Host: `sbx secret set github --sandbox <sandbox-name> -t "$(gh auth token)"`.

**Eine Anfrage scheitert mit HTTP 403** — die Firewall hat blockiert. Lies den Response-Body, dann auf dem Host `sbx policy allow network <domain>`. `sbx policy log` zeigt, was warum blockiert wurde.

**`localhost` in der Sandbox erreicht nichts** — die Sandbox hat ihr eigenes localhost. Für Dienste auf deiner Maschine `host.docker.internal:<port>` nutzen.
