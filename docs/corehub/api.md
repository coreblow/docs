# CoreHub Registry API

CoreHub Registry API v1 is the read-only public directory API for CoreBlow skills, plugins, providers, and channel entries.

Base URL:

```text
https://coreblow.com/corehub/api/v1
```

The API is backed by the static CoreHub catalog today. It is intentionally read-only while publisher identity, version storage, moderation, and write-side registry flows are planned.

## Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/corehub/api/v1` | Discovery document for API clients. |
| `GET` | `/corehub/api/v1/catalog` | Full catalog records. |
| `GET` | `/corehub/api/v1/entries` | Entry list. Supports `kind`. |
| `GET` | `/corehub/api/v1/entries/:id` | Inspect one catalog entry. |
| `GET` | `/corehub/api/v1/search?q=<query>` | Search entries by id, kind, name, summary, tags, capabilities, platforms, and review state. Supports `kind` and `limit`. |
| `GET` | `/corehub/api/v1/packages` | Package-compatible list alias over the catalog. Supports `kind` and `family=skill`. |
| `GET` | `/corehub/api/v1/packages/search?q=<query>` | Package-compatible search alias. Supports `kind` and `limit`. |
| `GET` | `/corehub/api/v1/packages/:id` | Inspect one package-compatible entry. |
| `GET` | `/corehub/api/v1/packages/:id/versions` | Return the current static version as `latest`. |
| `GET` | `/corehub/api/v1/packages/:id/files` | Return file metadata for a package version. Currently empty until artifact storage lands. |
| `GET` | `/corehub/api/v1/packages/:id/artifact` | Return artifact metadata for a package version. Currently reports no artifact. |
| `GET` | `/corehub/api/v1/packages/:id/download` | Download a package artifact. Currently returns `501 not_implemented`. |
| `GET` | `/corehub/api/v1/download?id=<id>` | Top-level download alias. Currently returns `501 not_implemented`. |

## Query Parameters

| Parameter | Endpoints | Description |
| --- | --- | --- |
| `kind` | `/entries`, `/catalog`, `/packages`, `/search`, `/packages/search` | Filters to `skill`, `plugin`, `provider`, or `channel`. |
| `q` | `/search`, `/packages/search` | Search text. Empty queries return an empty result list. |
| `limit` | `/search`, `/packages/search` | Maximum result count from `1` to `100`. Defaults to `25`. |
| `family` | `/packages` | `family=skill` maps to skill entries for ClawHub-style clients. |
| `version` | `/packages/:id/files`, `/packages/:id/artifact`, `/packages/:id/download`, `/download` | Selects a package version. Defaults to the current static version. |
| `tag` | `/packages/:id/files`, `/packages/:id/artifact`, `/packages/:id/download`, `/download` | `latest` resolves to the current static version. |
| `id` | `/download` | Package id for the top-level download alias. |

## Response Envelope

All v1 responses use the same envelope:

```json
{
  "apiVersion": "v1",
  "data": [],
  "meta": {
    "count": 0
  }
}
```

Single-entry endpoints return an object in `data`. List and search endpoints return an array in `data`.

## Entry Shape

```json
{
  "id": "plugin-lab",
  "kind": "plugin",
  "name": "Plugin Lab",
  "summary": "Compatibility lab for CoreBlow community plugins and plugin API contracts.",
  "source": "https://github.com/coreblow/plugin-lab",
  "homepage": "https://github.com/coreblow/plugin-lab",
  "version": "0.1.0",
  "tags": ["testing", "compatibility", "plugins"],
  "capabilities": ["plugin fixtures", "compatibility checks", "contract validation"],
  "review": {
    "state": "verified",
    "checkedAt": "2026-05-19",
    "notes": "CoreBlow ecosystem compatibility surface."
  },
  "coreblow": {
    "minCoreblowVersion": "1.0.0",
    "platforms": ["linux", "macos", "windows"]
  },
  "links": {
    "self": "/corehub/api/v1/entries/plugin-lab",
    "package": "/corehub/api/v1/packages/plugin-lab",
    "versions": "/corehub/api/v1/packages/plugin-lab/versions"
  }
}
```

## Examples

List every entry:

```sh
curl https://coreblow.com/corehub/api/v1/entries
```

Filter to skills:

```sh
curl "https://coreblow.com/corehub/api/v1/entries?kind=skill"
```

Search for plugin records:

```sh
curl "https://coreblow.com/corehub/api/v1/search?q=plugin"
```

Inspect one package-compatible entry:

```sh
curl https://coreblow.com/corehub/api/v1/packages/plugin-lab
```

Read file metadata:

```sh
curl https://coreblow.com/corehub/api/v1/packages/plugin-lab/files
```

Read artifact metadata:

```sh
curl https://coreblow.com/corehub/api/v1/packages/plugin-lab/artifact
```

Probe the download endpoint:

```sh
curl https://coreblow.com/corehub/api/v1/packages/plugin-lab/download
```

## CLI Usage

CoreHub CLI read commands can use the hosted registry with `--registry`:

```sh
npm run corehub -- explore --registry https://coreblow.com/corehub
npm run corehub -- search plugin --registry https://coreblow.com/corehub
npm run corehub -- package inspect plugin-lab --registry https://coreblow.com/corehub
npm run corehub -- package versions plugin-lab --registry https://coreblow.com/corehub
npm run corehub -- package files plugin-lab --registry https://coreblow.com/corehub
npm run corehub -- package artifact plugin-lab --registry https://coreblow.com/corehub
npm run corehub -- package download plugin-lab --registry https://coreblow.com/corehub
npm run corehub -- registry info --registry https://coreblow.com/corehub
```

You can also set:

```sh
COREHUB_REGISTRY=https://coreblow.com/corehub
```

## Current Limits

| Surface | Status |
| --- | --- |
| Read catalog | Available in v1. |
| Search | Available in v1 with deterministic static-catalog scoring. |
| Package aliases | Available in v1 for CLI and ClawHub-style command compatibility. |
| Publish writes | Planned. Requires publisher identity and moderation. |
| File metadata | Available in v1 with empty static-catalog results until artifact storage lands. |
| Artifact metadata | Available in v1 with `artifact: null` until artifact storage lands. |
| File downloads | Endpoint available in v1 as `501 not_implemented`. Requires version storage and integrity metadata. |
| Install counts | Planned. Requires safe aggregate analytics. |

## Error Responses

Missing entries and unknown routes return the standard envelope with an error object in `data`:

```json
{
  "apiVersion": "v1",
  "data": {
    "error": "not_found",
    "message": "CoreHub entry not found: missing-entry"
  },
  "meta": {
    "count": 0
  }
}
```
