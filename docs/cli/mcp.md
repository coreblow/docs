---
title: coreblow mcp
---

# coreblow mcp

Manage and serve CoreBlow's Model Context Protocol (MCP) bridge exposing **75 built-in native tools** over stdio and JSON-RPC.

## Usage

```bash
# Start the standalone MCP server over stdio
coreblow mcp serve

# Connect the MCP bridge to a running Gateway instance
coreblow mcp serve --url http://127.0.0.1:18789 --channel-bridge

# Inspect MCP options
coreblow mcp --help
```

## Features

- **75 Native Tools:** Exposes file, workspace, memory, diagnostic, browser, and orchestration tools directly over standard MCP.
- **Standalone Execution:** Runs cleanly from global npm installs without requiring an external Gateway daemon unless channel bridging is requested.
- **Collision Guard:** Automatically namespaces plugin-contributed tools (`${pluginId}__${toolName}`) to prevent duplicate tool collisions.

## Related

- [Native MCP Bridge](/concepts/mcp)
- [CLI Guide](/cli)
- [CLI Reference](/reference/cli-reference)
