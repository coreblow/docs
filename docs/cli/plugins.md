---
title: coreblow plugins
---

# coreblow plugins

Manage CoreBlow plugin packages.

## Usage

```bash
coreblow plugins [options]
coreblow plugins --help
```

## Dependency Denylist Enforcement

During plugin installation, CoreBlow validates both the plugin manifest (`package.json`) and extracted package contents against a built-in dependency denylist before enabling or linking the plugin:

- Inspects `name`, `dependencies`, `optionalDependencies`, `peerDependencies`, and `overrides` (including `npm:` alias targets).
- Scans nested `node_modules` directories and files inside the package archive for blocked package names (such as `plain-crypto-js`).
- Rejects installation with a `blocked_dependency` error if any disallowed package is detected.

Use [`coreblow doctor`](/cli/doctor) to audit existing managed plugin registries and peer dependency links.

## Source Checkout

```bash
pnpm coreblow plugins --help
```

## Related

- [CLI guide](/cli)
- [CLI commands reference](/cli/commands)
- [Security](/security)
