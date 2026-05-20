# CoreHub Versions and Artifacts

CoreHub versions tie a package release to a publisher before install clients fetch artifact storage.

## Version Shape

Catalog entries can include explicit versions:

```json
{
  "versions": [
    {
      "version": "0.1.0",
      "tag": "latest",
      "publishedAt": "2026-05-20",
      "publisher": {
        "handle": "coreblow"
      },
      "status": "available",
      "artifact": {
        "name": "plugin-lab-0.1.0.coreblow-plugin.tgz",
        "mediaType": "application/vnd.coreblow.plugin-archive+gzip",
        "size": 363,
        "sha256": "43dbdab7bcf34e243b12072edd89cab97965104193c169114d8754c447d5beab",
        "downloadEnabled": true,
        "storage": {
          "provider": "github-raw",
          "key": "artifacts/plugin-lab-0.1.0.coreblow-plugin.tgz",
          "url": "https://raw.githubusercontent.com/coreblow/corehub/main/artifacts/plugin-lab-0.1.0.coreblow-plugin.tgz"
        },
        "provenance": {
          "source": "https://github.com/coreblow/plugin-lab",
          "reviewState": "verified"
        },
        "files": [
          {
            "path": "coreblow.plugin.json",
            "size": 147,
            "sha256": "8b238efe0bb0963196eeb08dda670272614a04f55b541642f8d2043c353ebefc"
          },
          {
            "path": "index.js",
            "size": 78,
            "sha256": "c8c32710010c476a058bd11d43e81c773f6a96700684c3abccaba82cdcdb369d"
          },
          {
            "path": "README.md",
            "size": 101,
            "sha256": "6b4a496fecadafe2fedbb327fe0f1ab955ab40bacb311af7339e0bebb8314243"
          }
        ]
      }
    }
  ]
}
```

## Status Values

| Status | Meaning |
| --- | --- |
| `metadata-only` | The version has publisher and artifact metadata, but signed download redirects are not enabled. |
| `available` | The version can be served by a storage-backed download flow. |
| `deprecated` | The version remains visible but should not be selected for new installs. |
| `blocked` | The version is blocked by moderation or security policy. |

## API

List package versions:

```sh
curl https://coreblow.com/corehub/api/v1/packages/plugin-lab/versions
```

Read the artifact manifest:

```sh
curl https://coreblow.com/corehub/api/v1/packages/plugin-lab/artifact
```

Read file metadata:

```sh
curl https://coreblow.com/corehub/api/v1/packages/plugin-lab/files
```

## CLI

```sh
npm run corehub -- package versions plugin-lab --registry https://coreblow.com/corehub
npm run corehub -- package artifact plugin-lab --registry https://coreblow.com/corehub
npm run corehub -- package files plugin-lab --registry https://coreblow.com/corehub
```

## Download Policy

Publisher-owned versions make the trust chain explicit. Versions with `status: "available"`, `downloadEnabled: true`, and a storage locator can be served through the signed redirect endpoint.

Next, read [Downloads](/corehub/downloads) for the signed redirect flow or [Trust Model](/corehub/trust-model) for the full verification chain.
