---
title: coreblow doctor
---

# coreblow doctor

Run health checks and guided repairs for gateway, channels, pairing, and plugins.

## Usage

```bash
coreblow doctor [options]
coreblow doctor --help
```

## Options

| Flag | Purpose |
| --- | --- |
| `--repair`, `--fix` | Apply recommended repairs when issues are detected. |
| `--yes` | Accept default repair prompts. |
| `--force` | Apply aggressive repairs (for example, overwriting custom service config). |
| `--non-interactive` | Run without interactive prompts. |
| `--deep` | Run extended system and service scans. |
| `--net` | Run network latency and gateway health probes. |
| `--net-url <url>` | Gateway URL to probe (default: `http://127.0.0.1:18789/health`). |
| `--net-samples <n>` | Number of RTT samples to collect (default: `5`). |
| `--generate-gateway-token` | Generate a gateway token if missing. |
| `--no-workspace-suggestions` | Skip workspace memory system suggestions. |
| `--json` | Output diagnostics in JSON format. |

## Diagnostics in v2.6.0

- **Codex route warnings and repair**: Scans config and agent session stores for legacy `openai-codex/*` model references, unsupported Codex compaction overrides, and disabled Codex plugin routes, offering canonical `openai/*` route repairs.
- **Device pairing health**: Inspects pending and paired devices (via the running Gateway or local pairing state) for first-time approvals, public-key repairs, role or scope upgrade requests, and local device token mismatches.
- **Plugin registry state**: Detects stale bundled packages in the managed npm plugin root, audits CoreBlow peer dependency links, and refreshes or migrates plugin registry records.

## Source Checkout

```bash
pnpm coreblow doctor --help
```

## Related

- [CLI guide](/cli)
- [CLI commands reference](/cli/commands)
- [coreblow plugins](/cli/plugins)
