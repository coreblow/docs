---
title: Platform: Fly Io
---

# Platform: Fly Io

Running CoreBlow on Fly.io.

## Installation

Use the reference Fly.io manifests in the CoreBlow repository under `deploy/examples/`:

- `deploy/examples/fly.toml` for standard deployments
- `deploy/examples/fly.private.toml` for private-network deployments

```bash
fly deploy --config deploy/examples/fly.toml
```

## Configuration

Set required runtime secrets (such as `COREBLOW_GATEWAY_TOKEN`) via `fly secrets set` before deploying.

## Troubleshooting

Run `coreblow doctor --net` against the deployed health endpoint to verify connectivity and gateway readiness.
