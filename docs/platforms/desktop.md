---
title: CoreBlow Studio Desktop
---

# CoreBlow Studio Desktop

**CoreBlow Studio Desktop** (`apps/desktop/`) is the sole canonical cross-platform Desktop application for CoreBlow across **macOS**, **Linux**, and **Windows**. It runs on Electron + Vite + React and connects directly to your local CoreBlow Gateway so terminal and desktop sessions share one state store.

## Release Artifacts

Each tagged release publishes signed/checksummed installers on [GitHub Releases](https://github.com/coreblow/coreblow/releases):

| Platform | Artifacts | Update Metadata |
| :--- | :--- | :--- |
| **macOS** | `.dmg`, `.zip` | `latest-mac.yml`, `SHA256SUMS.txt` |
| **Linux** | `.AppImage`, `.deb` | `latest-linux.yml`, `SHA256SUMS.txt` |
| **Windows** | `.exe` | `latest.yml`, `SHA256SUMS.txt` |

## Key Capabilities

- **Built-in Menu Bar & System Tray:** Native macOS Menu Bar icon and Windows/Linux System Tray with live Gateway Online/Offline status, Open CoreBlow, New Chat (`coreblow:tray:new-chat`), Restart Gateway, Check for Updates, and Quit actions, plus hide-to-tray close behavior.
- **Session Handoff from CLI (`--session`):** Transfer an active terminal session directly to Desktop without losing history:
  ```bash
  coreblow desktop --session latest
  ```
- **Automatic Update Notifications (`electron-updater`):** Checks GitHub Releases automatically (toggleable in Settings) and displays a dismissible update banner when a newer release is available.
- **Hardened Electron Sandbox:** Runs renderers with `webPreferences.sandbox: true`, strict CSP (`'unsafe-eval'` disabled), `ELECTRON_RUN_AS_NODE=1` for managed Gateway daemon spawns, and interactive user consent before screen capture.
