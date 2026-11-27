# CoreBlow Gateway — Architecture Overview

## System Architecture

CoreBlow **v2.6.0** is a self-hosted AI Agent-OS and Enterprise Gateway built on a **12-service Hybrid OOP/DOP microkernel** in TypeScript. Stateful authorities (SQLite WAL, plugin sandboxes, CoreFlow orchestration, registries) stay isolated behind explicit OOP service boundaries, while hot paths (prompt assembly, SSE streaming, model routing, skill distillation) execute as pure data transforms.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CoreBlow Gateway v2.6.0                         │
├────────────────────────────────────────────────────────────────────────┤
│                    12-Service Hybrid Microkernel                       │
│ ┌─────────────────────────┬────────────────────────┬─────────────────┐ │
│ │  Cognitive & Memory     │  Routing & Execution   │ Control & Trust │ │
│ │  ──────────────────     │  ────────────────────  │ ──────────────  │ │
│ │  • Cory 4-Layer Memory  │  • Adaptive Router (8) │ • Plugin Host   │ │
│ │  • Knowledge Scribe     │  • 75 Native MCP Tools │ • AST Scanner   │ │
│ │  • EvoLoop Synthesizer  │  • CoreFlow DAG        │ • Cron & Bots   │ │
│ │  • SQLite WAL + FTS5    │  • Channel Dispatcher  │ • Telemetry     │ │
│ └─────────────────────────┴────────────────────────┴─────────────────┘ │
├────────────────────────────────────────────────────────────────────────┤
│                  Runtime & Security Sandbox Layer                      │
│  • macOS Seatbelt (sandbox-exec)  • Linux Bubblewrap (bwrap)           │
│  • Container Isolation (Docker)   • Cloud MicroVMs (Daytona / E2B)     │
│  • per-channel-peer DM Scope      • SHA-256 Tamper-Evident Audit Log   │
└────────────────────────────────────────────────────────────────────────┘
```

## The 12-Service Microkernel

1. **Provider Runtime & Adaptive Decision Router (`src/providers/`)** — Routes across 8 backends and 6 task tiers (`fast`, `deep`, `local`, `coding`, `vision`, `decision`) with Daybreak automatic quota failover to fallback cloud providers or local Ollama.
2. **Agent Registry & Cognitive Coordinator (`src/agents/`)** — Single-brain coordinator managing subagents, turn lifecycles, and session handoffs.
3. **CoreFlow Orchestrator (`src/agents/`)** — Multi-agent Kanban DAG orchestrator (preserving backward-compatible `/api/corehub/war-room/*` route aliases) delegating specialist roles (`@coder`, `@researcher`, `@auditor`, `@verifier`, `@all`) with a deterministic 5-gate pipeline (0-token Gates 1–4 + Tier 2 diff-only Gate 5, 2-retry circuit breaker) and 3-tier auto-bypass classification (`src/agents/cognitive/tier-router.ts`). Does not perform live automated GitHub PR merging.
4. **Tool Engine & Native MCP Bridge (`src/mcp/`)** — Exposes **75 built-in native tools** standalone over stdio and JSON-RPC (`coreblow mcp serve`), plus dynamic plugin MCP servers with collision namespacing.
5. **Cory 4-Layer Dialectic Memory (`src/memory/`)** — Single-writer SQLite WAL + FTS5/BM25 (`< 2ms` recall) across `IDENTITY.md`, `MEMORY.md`, `CONSTRAINTS.md`, and Session WAL journals.
6. **EvoLoop Skill Synthesizer (`src/learning/`)** — Closed-loop trajectory distiller that synthesizes zero-dependency `SKILL.md` V2 cognitive workflows verified by a 3-gate AST security scanner and Bayesian Wilson scoring.
7. **Knowledge Scribe (`src/memory/`)** — Background trajectory distillation and zero-stall compaction preserving constraints across long conversations.
8. **Plugin Host & CoreHub App Store (`src/plugins/`)** — Two-tier extensibility with verified channel packages (`corehub:@coreblow/*`), SHA-256 integrity checks, dependency denylist on install (`src/plugins/install.ts`), explicit third-party consent checks, per-plugin sync/async fault containment (`src/plugins/loader.ts`), and `coreblow/plugin-sdk/*`.
9. **Channel Dispatcher (`src/channels/`)** — 24/7 messaging across Telegram, Discord, Slack, WhatsApp, Signal, WebChat, and CoreHub extension channels.
10. **OS & Cloud Sandbox Manager (`src/security/`, `src/sandbox/`)** — 6 active production execution backends: `local`, `vm_isolate` (macOS Seatbelt / isolated host), `docker` (`--network=none --read-only`), `ssh`, and persistent Cloud MicroVM REST adapters `daytona` (`DAYTONA_API_KEY`) and `e2b` (`E2B_API_KEY`) via `PersistentSandboxSession`, plus optional Linux `corebox` (`bwrap`). Planned cloud adapters (`modal`, `vercel`) remain fail-closed (`*_NOT_IMPLEMENTED`, `available: false`).
11. **Cron Scheduler (`src/cron/`)** — Recurring natural-language and cron-expression background tasks (`coreblow cron`).
12. **Telemetry, Diagnostics & Update Bridge (`src/gateway/`, `ui/`)** — Live health probes, RTT percentiles and diagnostics (`coreblow doctor` with codex route warnings, device pairing, and plugin registry checks), staged `coreblow update` with backup and rollback, WebCrypto Ed25519 WS auth, and Web Control UI.

## Omni-Platform Client Surfaces

| Surface | Runtime / Package | Key Capabilities |
| :--- | :--- | :--- |
| **Terminal TUI** | React + Ink (`dist/entry.js`) | Fast CLI cold-start (`--version`, `--help`), inline diffs, `/model`, `/pool`, `/rewind`, `/sandbox` |
| **CoreBlow Studio Desktop** | Electron + Vite (`apps/desktop/`) | Sole cross-platform desktop app (macOS, Windows, Linux) with built-in Tray/Menu Bar, `electron-updater`, `sandbox: true`, `--session` handoff |
| **Android Companion** | Kotlin + Jetpack Compose (`apps/android/`) | Native mobile client connecting over authenticated Gateway WebSockets (with shared assets in `apps/shared/`) |
| **Web Control UI** | Pre-built SPA (`dist/control-ui/`) | Served directly by the Gateway with Ed25519 challenge-response WS auth and CoreHub admin proxy |
| **CoreChat** | Go (`coreblow/corechat`) | Lightweight Go terminal companion client (`coreblow chat --go`) |

## Technology Stack & Federated Satellite Fleet

| Component | Technology |
| :--- | :--- |
| Language | TypeScript (strict ESM) |
| Core Runtime | Node.js >= 22.12 / Bun |
| Persistence | SQLite WAL + FTS5/BM25 (`< 2ms` recall) |
| Gateway Protocol | WebSocket & HTTP JSON-RPC 2.0 (default port `18789`) |
| Sandboxing | Active: `local`, `vm_isolate`, `docker` (`--network=none --read-only`), `ssh`, Daytona & E2B `PersistentSandboxSession` (`DAYTONA_API_KEY` / `E2B_API_KEY`), plus optional `corebox` (`bwrap`); Planned (fail-closed): `modal`, `vercel` |
| Distribution | npm (`coreblow`), Homebrew, Nix, GHCR Docker, Electron Desktop |
| Satellite Fleet | 12 active public repositories (`coreblow`, `docs`, `corehub`, `corechat`, `dolphin`, `trust`, `coreblow.com`, `homebrew-tap`, `nix-coreblow`, `corebox`, `corebench`, `corebar`) managed by `scripts/fleet/fleet-engine.mjs` |
