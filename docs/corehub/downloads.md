# CoreHub Downloads

CoreHub downloads are storage-backed redirects. The registry validates package metadata, signs the redirect contract, and sends clients to the artifact storage URL.

## Download Flow

1. The client asks CoreHub for `/corehub/api/v1/packages/:id/download`.
2. CoreHub resolves the package, version, publisher, and artifact manifest.
3. CoreHub checks that the version status is `available` and `artifact.downloadEnabled` is `true`.
4. CoreHub signs the redirect metadata.
5. CoreHub returns a `302` redirect to the storage URL.

CLI clients use `redirect=false` so they can inspect the signed download contract as JSON before fetching the storage URL. When `--output` is provided, the CLI fetches the signed URL and verifies the artifact before writing it.

## Storage Shape

Artifact manifests can include a storage locator:

```json
{
  "storage": {
    "provider": "github-raw",
    "key": "artifacts/plugin-lab-0.1.0.coreblow-plugin.tgz",
    "url": "https://raw.githubusercontent.com/coreblow/corehub/9670d51fb8aafa8f3a34c17813bab0dd4dce4a12/artifacts/plugin-lab-0.1.0.coreblow-plugin.tgz"
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
npm run corehub -- package download plugin-lab --output plugin-lab.coreblow-plugin.tgz --registry https://coreblow.com/corehub
coreblow plugins install corehub:plugin-lab --dry-run
coreblow plugins install corehub:plugin-lab
npm run corehub -- package install plugin-lab --output plugin-lab.coreblow-plugin.tgz --registry https://coreblow.com/corehub
```

Without `--output`, the CLI requests `redirect=false` and prints the signed download metadata. With `--output`, it fetches the signed storage URL, verifies `artifact.size` and `artifact.sha256`, then writes the artifact to disk.

`coreblow plugins install corehub:<id>` is the OpenClaw-style user command. It installs by default; `--dry-run` previews the same verified CoreHub package without writing plugin config. `package install` remains the technical CoreHub command and uses the same verified download path when `--output` is present.

For the security model behind this flow, see the [Trust Model](/corehub/trust-model). For endpoint details and status codes, see the [Registry API](/corehub/api).
