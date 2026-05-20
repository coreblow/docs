# CoreHub Versions and Artifacts

CoreHub versions tie a package release to a publisher before binary downloads are enabled.

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
  ]
}
```

## Status Values

| Status | Meaning |
| --- | --- |
| `metadata-only` | The version has publisher and artifact metadata, but binary download is not enabled. |
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

Publisher-owned versions make the trust chain explicit, but `downloadEnabled` stays `false` until CoreHub has storage-backed artifacts, checksum enforcement, and policy checks. The download endpoint remains available as a contract probe and returns `501 not_implemented`.
