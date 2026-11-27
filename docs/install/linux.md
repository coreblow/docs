# Linux Installation

## Universal Script (Recommended)

Automatically bootstraps Node.js 22 and runs `coreblow onboard --install-daemon`:

```bash
curl -fsSL https://coreblow.com/install.sh | sh
```

Or install directly with npm (requires Node.js >= 22.12):

```bash
npm install -g coreblow
coreblow
```

## Homebrew / Nix

```bash
brew install coreblow/tap/coreblow
# or
nix run github:coreblow/nix-coreblow
```

## CoreBlow Studio Desktop

Download `.AppImage` or `.deb` packages from [GitHub Releases](https://github.com/coreblow/coreblow/releases) (with SHA-256 checksums and OIDC build provenance). Linux sandboxing uses Bubblewrap (`bwrap`) when installed on the host.
