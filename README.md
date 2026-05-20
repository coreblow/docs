# CoreBlow Docs

CoreBlow documentation site and published docs mirror.

## Overview

CoreBlow Docs is part of the CoreBlow public repository family. Published documentation surface for CoreBlow users and operators.

This repository follows the same ecosystem split that CoreBlow uses to keep release surfaces small, auditable, and independently governed.

## Repository Role

- Phase: 1
- Priority: foundation
- Kind: documentation
- Family: CoreBlow public repository family
- Branding: CoreBlow

## Scope

- Docs site content.
- Cloudflare Worker for `https://docs.coreblow.com`.
- Link and glossary checks.
- Public guidance for installation, configuration, and operations.

## Out of Scope

- Product runtime code.
- Personal machine paths or private hostnames.

## Key Files

- `.gitignore`
- `docs/adr/001-monorepo-structure.md`
- `docs/adr/002-provider-abstraction.md`
- `docs/adr/003-channel-interface.md`
- `docs/adr/004-extension-system.md`
- `docs/adr/005-plugin-architecture.md`
- `docs/adr/006-memory-backends.md`
- `docs/adr/007-agent-framework.md`
- `src/index.js`
- `src/docs.generated.js`
- `wrangler.toml`

## Development

### Docs check

```sh
pnpm check
```

### Develop

```sh
pnpm dev
```

### Deploy

```sh
pnpm deploy
```

## Release Policy

Do not publish packages, tags, installers, or release artifacts from this repository without explicit CoreBlow release approval.

Version changes must follow the coordinated CoreBlow release plan.

## Links

- [CoreBlow](https://github.com/coreblow/coreblow)
- [Documentation](https://docs.coreblow.com)
- [Website](https://coreblow.com)
- [Security Policy](SECURITY.md)
- [Contributing](CONTRIBUTING.md)
