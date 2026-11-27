# Windows Installation

## Native PowerShell Installer (Recommended)

Installs CoreBlow with automatic Node.js 22 LTS setup:

```powershell
irm https://coreblow.com/install.ps1 | iex
```

## npm (Node.js >= 22.12)

```powershell
npm install -g coreblow
coreblow
```

## CoreBlow Studio Desktop

Download the Windows `.exe` installer from [GitHub Releases](https://github.com/coreblow/coreblow/releases) (published with SHA-256 checksums and OIDC build provenance). CoreBlow Desktop runs natively on Windows with a built-in System Tray, OS-aware PATH/shell handling, and `electron-updater` update checks. See [CoreBlow Desktop](/platforms/desktop).
