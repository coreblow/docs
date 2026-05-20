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
        "name": "plugin-lab-0.1.0.corehub-manifest.json",
        "mediaType": "application/vnd.coreblow.corehub.manifest+json",
        "size": 228,
        "sha256": "6cff5dda1d4e54dff6c706947acdacf6cc3a4442d649424181bdde3bd2630373",
        "downloadEnabled": true,
        "storage": {
          "provider": "github-raw",
          "key": "artifacts/plugin-lab-0.1.0.corehub-manifest.json",
          "url": "https://raw.githubusercontent.com/coreblow/corehub/main/artifacts/plugin-lab-0.1.0.corehub-manifest.json"
        },
        "provenance": {
          "source": "https://github.com/coreblow/plugin-lab",
          "reviewState": "verified"
        },
        "files": []
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
