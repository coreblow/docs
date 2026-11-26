---
title: Ecosystem & Satellite Fleet
---

# Ecosystem & Satellite Fleet (12 Active Public Repositories)

CoreBlow organizes its public ecosystem into **12 active public repositories** under `github.com/coreblow`, governed declaratively by `scripts/fleet/fleet-manifest.json` and `scripts/fleet/fleet-engine.mjs` inside the main monorepo.

Every repository enforces 100% 40-character commit SHA-pinned GitHub Actions, automated CycloneDX SBOMs, SHA-256 checksums, and build provenance attestations on release workflows.

## 1. Flagship Repositories (6)

| Repository | Role | Stack |
| :--- | :--- | :--- |
| [`coreblow/coreblow`](https://github.com/coreblow/coreblow) | Canonical monorepo: 12-service microkernel, CLI, TUI, Web Control UI, Desktop (`apps/desktop/`), and `scripts/fleet/` engine | TypeScript / Node.js >= 22.12 |
| [`coreblow/docs`](https://github.com/coreblow/docs) | Official documentation site (`docs.coreblow.com`), Cookbook recipes, and Community guides | Markdown / Cloudflare Worker |
| [`coreblow/corehub`](https://github.com/coreblow/corehub) | On-demand plugin & skill App Store registry, Cloudflare Worker backend, and SHA-256 verified catalog | JavaScript / TypeScript |
| [`coreblow/corechat`](https://github.com/coreblow/corechat) | Lightweight Go terminal companion client (`coreblow chat --go`) with Gateway v3 Ed25519 support, `pkg/corekit`, and `pkg/coredex` | Go |
| [`coreblow/dolphin`](https://github.com/coreblow/dolphin) | Typed resumable workflow runner with atomic disk checkpoints | Node.js ESM |
| [`coreblow/trust`](https://github.com/coreblow/trust) | OWASP Agentic AI threat model and automated policy evaluator | Node.js ESM |

## 2. Distribution Channels (3)

| Repository | Role | Target Surfaces |
| :--- | :--- | :--- |
| [`coreblow/coreblow.com`](https://github.com/coreblow/coreblow.com) | Public website and universal installers | `public/install.sh`, `public/install-cli.sh` |
| [`coreblow/homebrew-tap`](https://github.com/coreblow/homebrew-tap) | Official Homebrew formula (`brew install coreblow/tap/coreblow`) | `Formula/coreblow.rb` |
| [`coreblow/nix-coreblow`](https://github.com/coreblow/nix-coreblow) | Official Nix flake (`coreblow`, `coreblow-studio`, `devShells`, `nixfmt-rfc-style` formatter) | `flake.nix` |

## 3. Specialist Companions (3)

| Repository | Role | Stack |
| :--- | :--- | :--- |
| [`coreblow/corebox`](https://github.com/coreblow/corebox) | Clean-room OS process isolation runner (Bubblewrap `bwrap`, Seatbelt, Docker) | Node.js ESM |
| [`coreblow/corebench`](https://github.com/coreblow/corebench) | Gateway throughput benchmark harness and streaming TTFT/RTT profiler (`corebench rtt`) | Node.js ESM |
| [`coreblow/corebar`](https://github.com/coreblow/corebar) | Native macOS SwiftUI Menu Bar Gateway monitor | Swift |

## Declarative Fleet Verification

The monorepo verifies cross-repo version alignment, supply-chain SHA pinning, and brand sovereignty from `scripts/fleet/fleet-manifest.json`:

```bash
node scripts/fleet/fleet-engine.mjs status
node scripts/fleet/fleet-engine.mjs verify
node scripts/fleet/fleet-engine.mjs verify --local-only
```
