# CI

CoreBlow uses GitHub Actions for the monorepo at `coreblow/coreblow` and across its active satellite fleet.

## Main Workflows

| Workflow | Purpose |
| --- | --- |
| `CI — Build` | Runtime bundle (`tsdown`), declaration emit, and Web Control UI build checks. |
| `CI — Unit Tests` | 4-shard serial unit test suite via the Vitest wrapper. |
| `CI — Lint & Type Check` | `oxlint`, `tsgo --noEmit`, MCP import budget, security scan, and plugin SDK export checks. |
| `CI — Security Audit` | Dependency and supply-chain security checks. |
| `Ecosystem Contracts` | Cross-repo version alignment, brand sovereignty, extension manifest contracts, and 40-char SHA pinning (`check-ecosystem-contracts.mjs`, `check-release-sync.mjs`, `check-fleet-supply-chain.mjs`). |
| `Gateway CI` | Gateway-focused test lane split into three shards. |
| `Install Smoke` | Clean tarball pack (`npm pack`) and standalone CLI smoke verification. |
| `Docker Release` | Multi-stage GHCR image publishing (`coreblow`, `-sandbox-common`, `-sandbox`, `-sandbox-browser`). |
| `Desktop Release` | Unified multi-OS Electron Desktop packaging (`.dmg`, `.zip`, `.AppImage`, `.deb`, `.exe`) with provenance attestations. |
| `Workflow Sanity` | YAML validation and 40-character commit SHA pinning verification. |

## Gateway CI Shards

Gateway CI runs a three-job matrix:

```bash
pnpm test:gateway
```

Each shard receives:

```bash
COREBLOW_TEST_PROFILE=serial
COREBLOW_TEST_SHARDS=3
COREBLOW_TEST_SHARD_INDEX=<1|2|3>
```
