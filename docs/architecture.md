# CoreBlow Gateway — Architecture Overview

## System Architecture

CoreBlow v2.1.5 is an enterprise-grade sovereign AI orchestration platform built on an asynchronous 12-service microkernel in TypeScript. It provides a unified gateway interface for orchestrating autonomous agents, tool execution, persistent cognitive memory, self-evolving skills, multi-channel communication, and operating-system-level sandboxing.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CoreBlow Gateway v2.1.5                         │
├────────────────────────────────────────────────────────────────────────┤
│                     12-Service Microkernel Plane                       │
│ ┌─────────────────────────┬────────────────────────┬─────────────────┐ │
│ │  Execution & Memory     │  Coordination & Tools  │ Infrastructure  │ │
│ │  ──────────────────     │  ────────────────────  │ ──────────────  │ │
│ │  • Cory 4-Layer Memory  │  • Tool Engine & MCP   │ • Config System │ │
│ │  • Knowledge Scribe     │  • War Room Swarm      │ • Plugin Host   │ │
│ │  • EvoLoop Synthesizer  │  • Channel Dispatcher  │ • Telemetry     │ │
│ │  • Provider Runtime     │  • Agent Registry      │ • Cron Scheduler│ │
│ └─────────────────────────┴────────────────────────┴─────────────────┘ │
├────────────────────────────────────────────────────────────────────────┤
│                  Runtime & Security Sandbox Layer                      │
│  • macOS Seatbelt (sandbox-exec)  • Linux Bubblewrap (bwrap)           │
│  • Container Isolation (Docker)   • Workspace-Only Path Enforcement    │
│  • Token Bucket Rate Limiting     • OWASP Agentic AI Security Policies │
└────────────────────────────────────────────────────────────────────────┘
```

## The 12-Service Microkernel

CoreBlow's execution engine is decomposed into 12 decoupled microkernel services with explicit dependency graphs and independent health lifecycle checks:

1. **Provider Runtime (`provider-runtime`)**
   - Manages AI provider connections (OpenAI, Anthropic, Google, Ollama, local models) with streaming token normalization and automatic model failover.
2. **Agent Registry (`agent-registry`)**
   - Coordinates multi-agent topologies, subagents, and turn management.
3. **Tool Engine & MCP Host (`tool-engine`)**
   - Executes built-in tools and dynamic Model Context Protocol (MCP) servers with namespaced capability isolation.
4. **Cory Memory Authority (`cory-memory`)**
   - Immutable single-writer memory service managing Identity, Durable Knowledge, Constraints, and Session WALs.
5. **EvoLoop Skill Synthesizer (`cory-skill-synthesizer`)**
   - Self-evolving closed-loop engine that synthesizes cognitive skills from successful agent trajectories.
6. **Knowledge Scribe (`cory-knowledge-scribe`)**
   - Background trajectory distillation and zero-stall memory compaction preventing context overflow.
7. **War Room Swarm Coordinator (`war-room`)**
   - Multi-agent collaboration matrix with shared message boards and role-specialized consensus.
8. **Plugin Host & Loader (`plugin-host`)**
   - Dynamic plugin lifecycle, permission grants, and CoreHub package verification.
9. **Channel Dispatcher (`channel-dispatcher`)**
   - Routes inbound and outbound messages across Telegram, Discord, Slack, WhatsApp, Signal, iMessage, and Web.
10. **OS Sandbox Manager (`os-sandbox-manager`)**
    - Enforces OS-level filesystem and network confinement using macOS Seatbelt (`sandbox-exec`) and Linux Bubblewrap (`bwrap`).
11. **Cron Scheduler (`cron-scheduler`)**
    - High-precision scheduled tasks and autonomous background recurring workflows.
12. **Telemetry & Cockpit Bridge (`telemetry-bridge`)**
    - Live health telemetry, RTT latency monitoring, and Web Cockpit real-time event streaming.

## Flagship Capabilities

### 1. Cory 4-Layer Memory Engine
Persistent, structured, sub-millisecond contextual memory:
- **Layer 1: Identity (`IDENTITY.md`)** — Permanent agent persona and directives.
- **Layer 2: Durable Knowledge (`MEMORY.md`)** — Hybrid SQLite BM25 full-text search (< 2ms).
- **Layer 3: System Constraints (`CONSTRAINTS.md`)** — Non-negotiable repository policies pinned to every turn.
- **Layer 4: Episodic Memory (Session WAL)** — Chronological turn trajectories with SHA-256 integrity checksums.

### 2. Cory EvoLoop & Cognitive Skills
Autonomous skill synthesis from verified executions, eliminating prompt drift and enabling long-term agent self-improvement.

### 3. War Room Swarms
Coordinate multi-agent swarms with dedicated roles (Coordinators, Authors, Researchers, Verifiers) communicating over an append-only blackboard.

### 4. React + Ink Terminal CLI
Rich interactive command-line interface featuring animated status widgets, real-time token streaming, session switching, and command palettes.

### 5. CoreHub Plugin Registry
Cryptographically verified plugin marketplace supporting signed tarball downloads, SHA-256 checksum validation, and permission-scoped capability declarations.

### 6. OS-Level Sandboxing
Every untrusted shell execution is strictly sandboxed. Writes outside the designated workspace directory are rejected at the operating-system kernel boundary.

## Technology Stack

| Component | Technology |
| :--- | :--- |
| Language | TypeScript (strict mode ESM) |
| Core Runtime | Node.js 22+ / Bun |
| Client Interfaces | React + Ink CLI, Electron Studio Desktop, SwiftUI macOS MenuBar |
| Gateway Protocol | WebSocket & HTTP JSON-RPC 2.0 (Port 18789) |
| Sandboxing | macOS Seatbelt, Linux Bubblewrap, Docker |
| Package Manager | pnpm (strict workspaces) |
