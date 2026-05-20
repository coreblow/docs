# CoreHub Registry API

CoreHub Registry API v1 is the read-only public directory API for CoreBlow skills, plugins, providers, and channel entries.

Base URL:

```text
https://coreblow.com/corehub/api/v1
```

The API is backed by the static CoreHub catalog today. It is intentionally read-only while storage-backed downloads, moderation, and write-side registry flows are planned.

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
| `GET` | `/corehub/api/v1/publishers` | List publishers represented in the catalog. |
| `GET` | `/corehub/api/v1/publishers/:handle` | Inspect one publisher and its catalog entries. |
| `GET` | `/corehub/api/v1/packages/:id` | Inspect one package-compatible entry. |
| `GET` | `/corehub/api/v1/packages/:id/versions` | Return publisher-owned package versions. |
| `GET` | `/corehub/api/v1/packages/:id/files` | Return file metadata from the artifact manifest. |
| `GET` | `/corehub/api/v1/packages/:id/artifact` | Return artifact manifest metadata for a package version. |
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
  "publisher": {
    "handle": "coreblow",
    "displayName": "CoreBlow",
    "url": "https://github.com/coreblow",
    "verified": true,
    "contact": "https://github.com/coreblow/plugin-lab/security/policy"
  },
  "versions": [
    {
      "version": "0.1.0",
      "tag": "latest",
      "publishedAt": "2026-05-20",
      "publisher": {
        "handle": "coreblow"
      },
      "status": "metadata-only",
      "artifact": {
        "name": "plugin-lab-0.1.0.corehub-manifest.json",
        "mediaType": "application/vnd.coreblow.corehub.manifest+json",
        "size": 0,
        "sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        "downloadEnabled": false,
        "provenance": {
          "source": "https://github.com/coreblow/plugin-lab",
          "reviewState": "verified"
        },
        "files": []
      }
    }
  ],
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

List publishers:

```sh
curl https://coreblow.com/corehub/api/v1/publishers
```

Inspect a publisher:

```sh
curl https://coreblow.com/corehub/api/v1/publishers/coreblow
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
npm run corehub -- publishers list --registry https://coreblow.com/corehub
npm run corehub -- publishers inspect coreblow --registry https://coreblow.com/corehub
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
| Publisher identity | Available in v1 as catalog-backed publisher records. |
| Version metadata | Available in v1 as publisher-owned version records. |
| Artifact manifest | Available in v1 with checksum, provenance, files, and download policy. |
| Publish writes | Planned. Requires publisher identity and moderation. |
| File metadata | Available in v1 from artifact manifests. |
| File downloads | Endpoint available in v1 as `501 not_implemented`. Requires storage-backed artifacts and policy enforcement. |
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
