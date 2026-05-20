# CoreHub Publisher Identity

Publisher identity is the ownership layer for CoreHub entries. It must exist before real artifact downloads, remote publishing, ownership transfer, or install analytics.

## Publisher Shape

Catalog entries can include:

```json
{
  "publisher": {
    "handle": "coreblow",
    "displayName": "CoreBlow",
    "url": "https://github.com/coreblow",
    "verified": true,
    "contact": "https://github.com/coreblow/corehub/security/policy"
  }
}
```

| Field | Purpose |
| --- | --- |
| `handle` | Stable publisher id used in URLs and CLI output. |
| `displayName` | Human-readable publisher name. |
| `url` | Public publisher profile or organization URL. |
| `verified` | Whether CoreHub recognizes the publisher as verified. |
| `contact` | Public contact, support, or security policy URL. |

## API

List publishers:

```sh
curl https://coreblow.com/corehub/api/v1/publishers
```

Inspect one publisher:

```sh
curl https://coreblow.com/corehub/api/v1/publishers/coreblow
```

## CLI

```sh
npm run corehub -- publishers list --registry https://coreblow.com/corehub
npm run corehub -- publishers inspect coreblow --registry https://coreblow.com/corehub
```

## Why This Blocks Downloads

Real artifact downloads need provenance before binary storage is enabled:

- A package must have an owner.
- A version must be tied to that owner.
- Artifact integrity must be recorded.
- Moderation and security review must decide whether downloads are allowed.
- Ownership transfer must not silently change what existing installs trust.

Until those checks exist, CoreHub exposes download endpoint contracts but returns `501 not_implemented` for binary downloads.
