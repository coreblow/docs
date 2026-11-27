---
title: Gateway: Deployment
---

# Gateway: Deployment

Gateway deployment.

## Configuration

Set `gateway.mode` (`local` or `remote`) and configure `gateway.auth` (`token` or `password`) before starting the Gateway.

## Examples

Reference platform manifests live under `deploy/examples/` in the CoreBlow repository:

- `deploy/examples/fly.toml` — Public Fly.io deployment template
- `deploy/examples/fly.private.toml` — Private Fly.io deployment template
- `deploy/examples/render.yaml` — Render blueprint deployment template

See also [Fly.io](/platforms/fly-io) and [Render](/platforms/render).
