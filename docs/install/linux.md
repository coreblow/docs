# Linux Installation

## Universal Script or npm (Node.js >= 22.12)

```bash
curl -fsSL https://coreblow.com/install.sh | sh
```

Or install directly with npm:

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

Download `.AppImage` or `.deb` packages from [GitHub Releases](https://github.com/coreblow/coreblow/releases). Linux sandboxing uses Bubblewrap (`bwrap`) when installed on the host.
