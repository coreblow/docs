# Installation

CoreBlow **v2.4.0 / v2.5.0** requires **Node.js 22.12+** for CLI/Gateway installations, or can be installed via automated one-line installers, desktop apps, or container images.

## npm Install (Recommended CLI)

```bash
npm install -g coreblow
coreblow
```

Running `coreblow` for the first time launches the interactive terminal setup wizard.

## Universal Install Scripts

**macOS & Linux** (automatic Node 22 bootstrap + `coreblow onboard --install-daemon`):
```bash
curl -fsSL https://coreblow.com/install.sh | sh
```

**Windows PowerShell** (automatic Node 22 LTS setup):
```powershell
irm https://coreblow.com/install.ps1 | iex
```

## Homebrew (macOS & Linux)

```bash
brew install coreblow/tap/coreblow
```

## Nix Flake

```bash
nix run github:coreblow/nix-coreblow
```

## CoreBlow Studio Desktop

Pre-built installers for macOS (`CoreBlow-<version>-darwin-arm64.dmg`, `.zip`), Linux (`.AppImage`, `.deb`), and Windows (`.exe`) with SHA-256 checksums, CycloneDX SBOMs, and v2.4.0+ OIDC build provenance attestations are published on [GitHub Releases](https://github.com/coreblow/coreblow/releases). See [CoreBlow Desktop](/platforms/desktop).

## Docker (GHCR)

See [Docker Installation](/install/docker) for `ghcr.io/coreblow/coreblow` and sandbox container tags.

## From Source

```bash
git clone https://github.com/coreblow/coreblow.git
cd coreblow
pnpm install
pnpm build
pnpm coreblow --help
```
