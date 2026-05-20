# CoreHub

CoreHub is the CoreBlow directory for skills, plugins, providers, channels, review metadata, and compatibility information.

Public surfaces:

| Surface | URL |
| --- | --- |
| Web directory | `https://coreblow.com/corehub` |
| Registry API v1 | `https://coreblow.com/corehub/api/v1` |
| Catalog JSON | `https://coreblow.com/corehub/catalog.json` |
| CoreHub repository | `https://github.com/coreblow/corehub` |

## What CoreHub Publishes

CoreHub entries describe installable or discoverable CoreBlow ecosystem packages:

| Kind | Purpose |
| --- | --- |
| `skill` | Reusable agent instructions and local helper files. |
| `plugin` | Code plugins and compatibility fixtures. |
| `provider` | Model or service provider integrations. |
| `channel` | Messaging or communication channel integrations. |

## Current Scope

The current CoreHub release is the registry foundation:

- Static catalog validation.
- Deterministic search.
- Public web directory.
- Read-only Registry API v1.
- CLI reads through `--registry`.
- Package-compatible aliases for ClawHub-style command habits.
- Publisher identity records for catalog ownership.
- Publisher-owned version and artifact manifest metadata.

Write-side publishing, storage-backed file downloads, moderation, and install analytics are planned follow-up surfaces.

## Learn More

- [Quickstart](/corehub/quickstart)
- [CLI](/corehub/cli)
- [Publisher Identity](/corehub/publisher-identity)
- [Versions and Artifacts](/corehub/versions-and-artifacts)
- [Registry API](/corehub/api)
