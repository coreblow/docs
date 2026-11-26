# Installation

CoreBlow **v2.3.1** requires **Node.js 22.12+** for CLI/Gateway installations, or can be installed as a standalone desktop app or container image.

## npm Install (Recommended CLI)

```bash
npm install -g coreblow
coreblow
```

Running `coreblow` for the first time launches the interactive terminal setup wizard.

## Universal Install Script

```bash
curl -fsSL https://coreblow.com/install.sh | sh
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

Pre-built installers for macOS (`.dmg`, `.zip`), Linux (`.AppImage`, `.deb`), and Windows (`.exe`) with SHA-256 checksums and build provenance attestations are published on [GitHub Releases](https://github.com/coreblow/coreblow/releases). See [CoreBlow Desktop](/platforms/desktop).

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
