---
title: Native MCP Bridge
---

# Native MCP Bridge (75 Built-In Tools)

CoreBlow exposes a live **Model Context Protocol (MCP)** server (`src/mcp/`) providing **75 built-in native tools** over stdio and JSON-RPC transports.

## Starting the Server

```bash
# Standalone stdio MCP server
coreblow mcp serve

# Bridge to a running local Gateway and channels
coreblow mcp serve --url http://127.0.0.1:18789 --channel-bridge
```

## Capabilities

- **75 Sovereign Native Tools:** Covers workspace file operations, search, memory queries, session inspection, browser automation, diagnostics, and task execution without requiring external MCP plugins.
- **Dynamic Plugin MCP Hosting:** Plugins loaded through CoreHub can register additional MCP tools, isolated under namespaced identifiers (`${pluginId}__${toolName}`).
- **Collision Guard:** Duplicate tool registrations are detected and blocked/namespaced automatically to preserve deterministic tool dispatch.

## Related

- [coreblow mcp CLI](/cli/mcp)
- [Architecture Overview](/architecture)
- [CLI Reference](/reference/cli-reference)
