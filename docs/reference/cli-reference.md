---
title: CoreBlow CLI Reference
---

# CoreBlow CLI Reference (v2.1.4)

Complete reference for the `coreblow` command-line interface.

## Global Options

- `-p, --print <prompt>`: Execute in headless mode, streaming or printing the response directly to stdout and exiting cleanly.
- `-c, --continue`: Resume the latest active session for the current workspace.
- `-r, --resume [id]`: Resume a conversation session by ID or open the interactive SQLite WAL+FTS5 session picker.
- `--dev`: Run with the development profile (isolated state under `~/.coreblow-dev`, shifted ports).
- `--profile <name>`: Isolate state and configuration under `~/.coreblow-<name>`.
- `-V, --version`: Output the current CoreBlow version (`2.1.4`).
- `-h, --help`: Display help and command usage.

## Primary Commands

### Headless & Interactive Execution
```bash
# Headless prompt execution with pipe support
cat prompt.txt | coreblow -p "Review this implementation"

# Continue the latest workspace session
coreblow -c

# Interactive fuzzy search session picker
coreblow -r
```

### CoreBlow Studio Desktop
```bash
# Launch CoreBlow Studio Desktop
coreblow desktop

# Handoff active session directly into the sandboxed Electron Studio
coreblow desktop --session <session-id>
```
CoreBlow Studio Desktop provides a high-performance Electron + Vite + React desktop environment with `webPreferences.sandbox: true`, secure IPC token handoff (`COREBLOW_SESSION_ID`), and screen capture consent guardrails.

### 24/7 Cron Orchestration
```bash
# List all active and scheduled cron jobs
coreblow cron list

# Add a recurring scheduled prompt
coreblow cron add --schedule "0 * * * *" --prompt "Hourly health summary"

# Trigger a job run immediately
coreblow cron run <job-id>
```

### Unified Bot Channels
```bash
# Manage 24/7 bot messaging channels (Telegram, Discord, Slack, WhatsApp, Signal)
coreblow bots status

# Monitor bot lifecycle and automated loop protection
coreblow bots monitor
```

### Sovereign MCP Bridge
```bash
# Serve Model Context Protocol (MCP) tools over JSON-RPC / stdio transport
coreblow mcp serve
```
Exposes 75 native microkernel tools and dynamic plugin MCP tools with collision namespacing (`${pluginId}__${toolName}`) and `notifications/coreblow/*` protocol.

### Gateway Control Plane
```bash
# Run the WebSocket Gateway locally (default port: 18789)
coreblow gateway run

# Check gateway reachability and service status
coreblow gateway status
```

### Health & Security
```bash
# Run system diagnostics and repair recommendations
coreblow doctor

# Run local security audits and credential scan
coreblow security audit
```
