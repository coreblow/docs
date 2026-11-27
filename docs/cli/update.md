---
title: coreblow update
---

# coreblow update

Update CoreBlow and inspect update channel status.

## Usage

```bash
coreblow update [options]
coreblow update status
coreblow update wizard
coreblow update --help
```

## Options

| Flag | Purpose |
| --- | --- |
| `--channel <stable\|beta\|dev>` | Persist update channel (git and npm). |
| `--tag <dist-tag\|version\|spec>` | Override the package target for a one-off update without persisting channel. |
| `--dry-run` | Preview update actions without modifying config, installing, or restarting. |
| `--no-restart` | Skip restarting the gateway service after a successful update. |
| `--timeout <seconds>` | Timeout for each update step in seconds (default: `1200`). |
| `--yes` | Skip confirmation prompts (non-interactive). |
| `--json` | Output result as JSON. |

## Staged Package Update and Rollback

For global npm-compatible installs, `coreblow update` performs a staged update to protect the live installation:

1. **Stage**: Installs the target package into a temporary staging prefix (`.coreblow-update-stage-*`) inside the global `node_modules` root.
2. **Verify**: Runs `global install verify` against the staged package root to confirm the expected version and package integrity before touching the live install.
3. **Swap with backup**: Moves the existing live package to a temporary backup directory (`.coreblow-<pid>-<timestamp>`), moves the verified staged package into place, and updates npm binary shims with shim backup protection.
4. **Automatic rollback**: If verification fails, the live install is left untouched and the staging directory is cleaned up. If the swap or shim replacement fails, `coreblow update` automatically restores the backed-up package and binary shims.

## Source Checkout

```bash
pnpm coreblow update --help
```

## Related

- [CLI guide](/cli)
- [CLI commands reference](/cli/commands)
- [coreblow doctor](/cli/doctor)
