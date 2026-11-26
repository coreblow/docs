# CoreBlow Gateway — Architecture Overview

## System Architecture

CoreBlow **v2.3.1** is a self-hosted AI Agent-OS and Enterprise Gateway built on a **12-service Hybrid OOP/DOP microkernel** in TypeScript. Stateful authorities (SQLite WAL, plugin sandboxes, War Room orchestration, registries) stay isolated behind explicit OOP service boundaries, while hot paths (prompt assembly, SSE streaming, model routing, skill distillation) execute as pure data transforms.

```
┌────────────────────────────────────────────────────────────────────────┐
│                       CoreBlow Gateway v2.3.1                          │
├────────────────────────────────────────────────────────────────────────┤
│                    12-Service Hybrid Microkernel                       │
│ ┌─────────────────────────┬────────────────────────┬─────────────────┐ │
│ │  Cognitive & Memory     │  Routing & Execution   │ Control & Trust │ │
│ │  ──────────────────     │  ────────────────────  │ ──────────────  │ │
│ │  • Cory 4-Layer Memory  │  • Adaptive Router (8) │ • Plugin Host   │ │
│ │  • Knowledge Scribe     │  • 75 Native MCP Tools │ • AST Scanner   │ │
│ │  • EvoLoop Synthesizer  │  • War Room v2 DAG     │ • Cron & Bots   │ │
│ │  • SQLite WAL + FTS5    │  • Channel Dispatcher  │ • Telemetry     │ │
│ └─────────────────────────┴────────────────────────┴─────────────────┘ │
├────────────────────────────────────────────────────────────────────────┤
│                  Runtime & Security Sandbox Layer                      │
│  • macOS Seatbelt (sandbox-exec)  • Linux Bubblewrap (bwrap)           │
│  • Container Isolation (Docker)   • Workspace-Only Path Enforcement    │
│  • per-channel-peer DM Scope      • SHA-256 Tamper-Evident Audit Log   │
└────────────────────────────────────────────────────────────────────────┘
```

## The 12-Service Microkernel

1. **Provider Runtime & Adaptive Decision Router (`src/providers/`)** — Routes across 8 backends and 6 task tiers (`fast`, `deep`, `local`, `coding`, `vision`, `decision`) with Daybreak automatic quota failover to fallback cloud providers or local Ollama.
2. **Agent Registry & Cognitive Coordinator (`src/agents/`)** — Single-brain coordinator managing subagents, turn lifecycles, and session handoffs.
3. **War Room v2 Orchestrator (`src/agents/`)** — Multi-agent Kanban DAG delegating specialist roles (`@coder`, `@researcher`, `@auditor`, `@verifier`, `@all`) backed by a 5-gate PR workflow (`typecheck`, `linter`, `unit_tests`, `secret_scan`, `forbidden_paths`).
4. **Tool Engine & Native MCP Bridge (`src/mcp/`)** — Exposes **75 built-in native tools** standalone over stdio and JSON-RPC (`coreblow mcp serve`), plus dynamic plugin MCP servers with collision namespacing.
5. **Cory 4-Layer Dialectic Memory (`src/memory/`)** — Single-writer SQLite WAL + FTS5/BM25 (`< 2ms` recall) across `IDENTITY.md`, `MEMORY.md`, `CONSTRAINTS.md`, and Session WAL journals.
6. **EvoLoop Skill Synthesizer (`src/learning/`)** — Closed-loop trajectory distiller that synthesizes zero-dependency `SKILL.md` V2 cognitive workflows verified by a 3-gate AST security scanner and Bayesian Wilson scoring.
7. **Knowledge Scribe (`src/memory/`)** — Background trajectory distillation and zero-stall compaction preserving constraints across long conversations.
8. **Plugin Host & CoreHub App Store (`src/plugins/`)** — Two-tier extensibility with verified channel packages (`corehub:@coreblow/*`), SHA-256 integrity checks, and `coreblow/plugin-sdk`.
9. **Channel Dispatcher (`src/channels/`)** — 24/7 messaging across Telegram, Discord, Slack, WhatsApp, Signal, WebChat, and CoreHub extension channels.
10. **OS Sandbox Manager (`src/security/`, `src/sandbox/`)** — Enforces Apple Seatbelt (macOS), Linux Bubblewrap (`bwrap`), and Docker isolation with TypeScript AST skill scanning.
11. **Cron Scheduler (`src/cron/`)** — Recurring natural-language and cron-expression background tasks (`coreblow cron`).
12. **Telemetry & Control Bridge (`src/gateway/`, `ui/`)** — Live health probes, RTT percentiles (`coreblow doctor --net`), WebCrypto Ed25519 WS auth, and Web Control UI.

## Omni-Platform Client Surfaces

| Surface | Runtime / Package | Key Capabilities |
| :--- | :--- | :--- |
| **Terminal TUI** | React + Ink (`dist/entry.js`) | Fast CLI cold-start (`82.5ms` `--version`), inline diffs, `/model`, `/pool`, `/rewind`, `/sandbox` |
| **CoreBlow Studio Desktop** | Electron + Vite (`apps/desktop/`) | Sole cross-platform desktop app (macOS, Windows, Linux) with built-in Tray/Menu Bar, `electron-updater`, `sandbox: true`, `--session` handoff |
| **Web Control UI** | Pre-built SPA (`dist/control-ui/`) | Served directly by the Gateway with Ed25519 challenge-response WS auth and CoreHub admin proxy |
| **CoreChat** | Go (`coreblow/corechat`) | Lightweight Go terminal companion client (`coreblow chat --go`) |

## Technology Stack

| Component | Technology |
| :--- | :--- |
| Language | TypeScript (strict ESM) |
| Core Runtime | Node.js >= 22.12 / Bun |
| Persistence | SQLite WAL + FTS5/BM25 (`< 2ms` recall) |
| Gateway Protocol | WebSocket & HTTP JSON-RPC 2.0 (default port `18789`) |
| Sandboxing | macOS Seatbelt, Linux Bubblewrap (`bwrap`), Docker |
| Distribution | npm (`coreblow`, 74.7 MB unpacked), Homebrew, Nix, GHCR Docker, Electron Desktop |
