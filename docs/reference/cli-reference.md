---
title: CoreBlow CLI Reference
---

# CoreBlow CLI Reference (v2.4.0 / v2.5.0)

Complete reference for the `coreblow` command-line interface (`dist/entry.js`, lazy-loaded subcommands for fast cold-start).

## Global Options

- `-p, --print <prompt>`: Execute in headless mode (stdin piping up to 10 MB, `--output-format text|json|stream-json`), print response to stdout, and exit.
- `-c, --continue`: Resume the latest active session for the current workspace.
- `-r, --resume [id]`: Resume a session by ID or open the interactive SQLite WAL + FTS5 session picker.
- `--backend <type>`: Select execution backend per session.
- `--dev`: Isolate state under `~/.coreblow-dev` with shifted ports.
- `--profile <name>`: Isolate state and configuration under `~/.coreblow-<name>`.
- `-V, --version`: Output the installed CoreBlow version.
- `-h, --help`: Display command help.

## Primary Commands

### Headless & Interactive Execution
```bash
# Headless diff review with JSON output
git diff | coreblow -p "Review these changes for security and edge cases" --output-format json

# Continue the latest workspace session
coreblow -c

# Interactive fuzzy search session picker
coreblow -r
```

### CoreBlow Studio Desktop
```bash
# Launch CoreBlow Studio Desktop
coreblow desktop

# Handoff an active session directly into Desktop
coreblow desktop --session latest
```
CoreBlow Studio Desktop (`apps/desktop/`) is the sole cross-platform Electron + Vite + React desktop application for macOS, Windows, and Linux, featuring built-in Menu Bar / System Tray controls, `electron-updater`, `webPreferences.sandbox: true`, and `COREBLOW_SESSION_ID` handoff.

### 24/7 Cron Orchestration
```bash
coreblow cron list
coreblow cron add --schedule "0 * * * *" --prompt "Hourly health summary"
coreblow cron run <job-id>
```

### Unified Bot Channels
```bash
coreblow bots status
coreblow bots monitor
```

### Sovereign MCP Bridge (75 Native Tools)
```bash
# Serve all 75 native tools standalone over stdio
coreblow mcp serve

# Bridge an active Gateway URL or channel runtime
coreblow mcp serve --url http://127.0.0.1:18789
```
Exposes 75 native microkernel tools and dynamic plugin MCP tools with collision namespacing (`${pluginId}__${toolName}`).

### Gateway, Diagnostics & Companion Client
```bash
# Run the loopback WebSocket Gateway locally (default port: 18789)
coreblow gateway run
coreblow gateway status

# Measure real RTT latency percentiles (min/median/p95/max ms)
coreblow doctor --net

# Launch the lightweight Go terminal companion (corechat)
coreblow chat --go

# Audit config permissions, secrets, and sandbox posture
coreblow security audit
```

### Persistent Cloud MicroVM Sandboxes (`daytona` / `e2b`)
```bash
# List local sandbox runtimes and backend availability
coreblow sandbox list --json

# Create, execute, pause, resume, and destroy persistent Cloud MicroVM sessions
coreblow sandbox create --backend daytona --json
coreblow sandbox exec --backend daytona --session <id> -- "node -v"
coreblow sandbox pause --backend daytona --session <id>
coreblow sandbox resume --backend daytona --session <id>
coreblow sandbox destroy --backend daytona --session <id>
```
Requires `DAYTONA_API_KEY` for `daytona` or `E2B_API_KEY` for `e2b` (both fail closed when unconfigured). Planned cloud adapters (`modal`, `vercel`) remain fail-closed (`MODAL_NOT_IMPLEMENTED` / `VERCEL_NOT_IMPLEMENTED`, `available: false`).
