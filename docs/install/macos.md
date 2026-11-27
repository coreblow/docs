# macOS Installation

## Universal Install Script (Recommended)

Automatically bootstraps Node.js 22 and runs `coreblow onboard --install-daemon`:

```bash
curl -fsSL https://coreblow.com/install.sh | sh
```

## Homebrew (CLI & Gateway)

```bash
brew install coreblow/tap/coreblow
coreblow
```

## npm (Node.js >= 22.12)

```bash
npm install -g coreblow
coreblow
```

## Nix Flake

```bash
nix run github:coreblow/nix-coreblow
```

## CoreBlow Studio Desktop

Download the Apple Silicon installer (`CoreBlow-<version>-darwin-arm64.dmg`) or `.zip` release archive from [GitHub Releases](https://github.com/coreblow/coreblow/releases). All v2.4.0+ releases ship with SHA-256 checksums and OIDC build provenance attestations. Built-in Menu Bar controls and automatic update notifications are included; see [CoreBlow Desktop](/platforms/desktop).
