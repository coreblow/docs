# CoreHub CLI

The CoreHub CLI validates the catalog, searches local entries, inspects skill folders, and can read the hosted Registry API v1.

## Local Catalog Commands

Run these from the CoreHub repository:

```sh
npm run corehub -- validate
npm run corehub -- explore
npm run corehub -- list
npm run corehub -- list --kind skill
npm run corehub -- search plugin
npm run corehub -- publishers list
npm run corehub -- publishers inspect coreblow
npm run corehub -- inspect fixtures/example-skill
npm run corehub -- skill publish fixtures/example-skill
```

`skill publish` is currently a dry-run inspection flow. Remote publishing remains planned until publisher identity, moderation, and storage flows are ready.

## Package-Compatible Commands

CoreHub keeps ClawHub-style package commands so clients can grow around stable registry habits:

```sh
npm run corehub -- package explore
npm run corehub -- package search plugin
npm run corehub -- package inspect plugin-lab
npm run corehub -- package versions plugin-lab
npm run corehub -- package files plugin-lab
npm run corehub -- package artifact plugin-lab
npm run corehub -- package download plugin-lab
```

## Hosted Registry Reads

Pass `--registry` to read from production:

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

Or configure:

```sh
COREHUB_REGISTRY=https://coreblow.com/corehub
```

## Command Map

| Command | Status | Purpose |
| --- | --- | --- |
| `corehub validate` | Available | Validate the local catalog. |
| `corehub explore` | Available | List catalog entries. |
| `corehub list` | Available | List entries, optionally filtered by `kind`. |
| `corehub search <query>` | Available | Search local or hosted entries. |
| `corehub publishers list` | Available | List publishers represented in the catalog. |
| `corehub publishers inspect <handle>` | Available | Inspect one publisher and its catalog entries. |
| `corehub inspect <target>` | Available | Inspect a catalog id or local skill folder. |
| `corehub package explore` | Available | Package-compatible list command. |
| `corehub package search <query>` | Available | Package-compatible search command. |
| `corehub package inspect <id>` | Available | Inspect one package-compatible entry. |
| `corehub package versions <id>` | Available | Show publisher-owned version metadata. |
| `corehub package files <id>` | Available | Show file metadata from the artifact manifest. |
| `corehub package artifact <id>` | Available | Show artifact manifest metadata, checksum, provenance, and download policy. |
| `corehub package download <id>` | Available | Print signed download metadata for storage-backed artifacts. |
| `corehub package publish <source>` | Planned | Publish package artifacts after registry writes land. |
| `corehub registry info` | Available | Read the API discovery document. |
