# Docker Installation

Official multi-arch container images (`linux/amd64`, `linux/arm64`) are published to GitHub Container Registry (GHCR) per CoreBlow release.

## Gateway Container (`v2.3.1`)

```bash
docker pull ghcr.io/coreblow/coreblow:2.3.1
docker run -d \
  -p 18789:18789 \
  -e COREBLOW_GATEWAY_TOKEN=change-me \
  ghcr.io/coreblow/coreblow:2.3.1
```

## Docker Compose

```bash
git clone https://github.com/coreblow/coreblow.git
cd coreblow
docker compose up -d
```

## Sandbox Container Images

CoreBlow publishes dedicated sandbox images built from a shared multi-stage runtime base:

- `ghcr.io/coreblow/coreblow-sandbox-common:latest` — Shared sandbox base image.
- `ghcr.io/coreblow/coreblow-sandbox:latest` — Isolated command execution container.
- `ghcr.io/coreblow/coreblow-sandbox-browser:latest` — Headless browser sandbox container.
