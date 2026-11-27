---
title: Platform: Render
---

# Platform: Render

Running CoreBlow on Render.

## Installation

Use the Render blueprint manifest located at `deploy/examples/render.yaml` in the CoreBlow repository.

## Configuration

Configure `COREBLOW_GATEWAY_TOKEN` and any provider API keys as Render environment variables.

## Troubleshooting

Verify `/health` on port `18789` (or your configured `PORT`) and run `coreblow doctor` if gateway startup fails.
