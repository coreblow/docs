# CoreHub Downloads

CoreHub downloads are storage-backed redirects. The registry validates package metadata, signs the redirect contract, and sends clients to the artifact storage URL.

## Download Flow

1. The client asks CoreHub for `/corehub/api/v1/packages/:id/download`.
2. CoreHub resolves the package, version, publisher, and artifact manifest.
3. CoreHub checks that the version status is `available` and `artifact.downloadEnabled` is `true`.
4. CoreHub signs the redirect metadata.
5. CoreHub returns a `302` redirect to the storage URL.

CLI clients use `redirect=false` so they can inspect the signed download contract as JSON before fetching the storage URL.

## Storage Shape

Artifact manifests can include a storage locator:

```json
{
  "storage": {
    "provider": "github-raw",
    "key": "artifacts/plugin-lab-0.1.0.corehub-manifest.json",
    "url": "https://raw.githubusercontent.com/coreblow/corehub/main/artifacts/plugin-lab-0.1.0.corehub-manifest.json"
  }
}
```

Supported provider values:

| Provider | Purpose |
| --- | --- |
| `github-raw` | Public GitHub raw artifact storage. |
| `r2` | Cloudflare R2 storage. |
| `s3` | S3-compatible storage. |

## API

Follow the redirect:

```sh
curl -L https://coreblow.com/corehub/api/v1/packages/plugin-lab/download
```

Inspect the signed download contract:

```sh
curl "https://coreblow.com/corehub/api/v1/packages/plugin-lab/download?redirect=false"
```

The JSON response includes:

| Field | Purpose |
| --- | --- |
| `download.available` | Whether CoreHub will redirect this version. |
| `download.url` | Signed storage URL. |
| `download.expires` | Expiry timestamp for the redirect contract. |
| `download.signature` | CoreHub signature for the package, version, checksum, storage key, and expiry. |

## CLI

```sh
npm run corehub -- package download plugin-lab --registry https://coreblow.com/corehub
```

The CLI requests `redirect=false` and prints the signed download metadata instead of following the redirect automatically.
