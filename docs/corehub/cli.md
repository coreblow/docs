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
npm run corehub -- install plugin-lab
npm run corehub -- install plugin-lab --dry-run
npm run corehub -- publishers list
npm run corehub -- publishers inspect coreblow
npm run corehub -- inspect fixtures/example-skill
npm run corehub -- skill publish fixtures/example-skill
```

`skill publish` is currently a dry-run inspection flow. Remote publishing remains planned until publisher identity, moderation, and storage flows are ready.

## Registry Workflow

Use this workflow when you want to inspect a package the same way an install client should reason about it.

1. Discover entries:

```sh
npm run corehub -- search plugin --registry https://coreblow.com/corehub
```

2. Inspect the package record:

```sh
npm run corehub -- package inspect plugin-lab --registry https://coreblow.com/corehub
```

3. Verify the publisher:

```sh
npm run corehub -- publishers inspect coreblow --registry https://coreblow.com/corehub
```

4. Inspect versions and artifact metadata:

```sh
npm run corehub -- package versions plugin-lab --registry https://coreblow.com/corehub
npm run corehub -- package artifact plugin-lab --registry https://coreblow.com/corehub
```

5. Read signed download metadata or write a verified artifact:

```sh
npm run corehub -- package download plugin-lab --registry https://coreblow.com/corehub
npm run corehub -- package download plugin-lab --output plugin-lab.corehub-manifest.json --registry https://coreblow.com/corehub
```

Without `--output`, the CLI requests `redirect=false` from the Registry API and prints the package, publisher, artifact checksum, storage URL, and signature metadata. With `--output`, it fetches the signed storage URL, verifies the downloaded byte count and SHA-256 checksum, and writes the artifact only after verification passes.

6. Use the OpenClaw-style install command:

```sh
npm run corehub -- install plugin-lab --registry https://coreblow.com/corehub
npm run corehub -- install plugin-lab --dry-run --registry https://coreblow.com/corehub
```

`corehub install <id>` is the user-facing install entrypoint, matching OpenClaw's simple install shape. During the current transition, it resolves the package and publisher, but the apply step is blocked until CoreHub versions publish installable CoreBlow plugin archives. Use `--dry-run` to preview the install plan.

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
npm run corehub -- package download plugin-lab --output plugin-lab.corehub-manifest.json
npm run corehub -- package install plugin-lab
npm run corehub -- package install plugin-lab --dry-run
npm run corehub -- package install plugin-lab --output plugin-lab.corehub-manifest.json
```

## Hosted Registry Reads

Pass `--registry` to read from production:

```sh
npm run corehub -- explore --registry https://coreblow.com/corehub
npm run corehub -- search plugin --registry https://coreblow.com/corehub
npm run corehub -- install plugin-lab --registry https://coreblow.com/corehub
npm run corehub -- install plugin-lab --dry-run --registry https://coreblow.com/corehub
npm run corehub -- publishers list --registry https://coreblow.com/corehub
npm run corehub -- publishers inspect coreblow --registry https://coreblow.com/corehub
npm run corehub -- package inspect plugin-lab --registry https://coreblow.com/corehub
npm run corehub -- package versions plugin-lab --registry https://coreblow.com/corehub
npm run corehub -- package files plugin-lab --registry https://coreblow.com/corehub
npm run corehub -- package artifact plugin-lab --registry https://coreblow.com/corehub
npm run corehub -- package download plugin-lab --registry https://coreblow.com/corehub
npm run corehub -- package download plugin-lab --output plugin-lab.corehub-manifest.json --registry https://coreblow.com/corehub
npm run corehub -- package install plugin-lab --registry https://coreblow.com/corehub
npm run corehub -- package install plugin-lab --output plugin-lab.corehub-manifest.json --registry https://coreblow.com/corehub
npm run corehub -- registry info --registry https://coreblow.com/corehub
```

Or configure:

```sh
COREHUB_REGISTRY=https://coreblow.com/corehub
```

## Download Verification

CoreHub CLI downloads are metadata-first unless an output path is provided. Before writing a file, the CLI compares the fetched artifact with:

| Field | Required check |
| --- | --- |
| `artifact.size` | Downloaded byte count must match. |
| `artifact.sha256` | Downloaded content hash must match. |
| `artifact.storage.key` | Storage path should match the signed redirect contract. |
| `download.signature` | Signature should be tied to package, version, checksum, storage key, and expiry. |

Use `--output <path>` to perform the verified fetch:

```sh
npm run corehub -- package download plugin-lab --output plugin-lab.corehub-manifest.json --registry https://coreblow.com/corehub
```

If the byte count or SHA-256 checksum does not match the artifact manifest, the command fails before writing the output file.

For the signed redirect behavior behind this command, see [Downloads](/corehub/downloads). For the full trust chain, see [Trust Model](/corehub/trust-model).

## Install Planning

`corehub package install <id>` is currently an install planner. It returns JSON with:

| Field | Purpose |
| --- | --- |
| `dryRun` | `true` only when `--dry-run` is provided. |
| `install.status` | Planned install action and whether CoreBlow state would be modified. |
| `download.verified` | Whether the artifact was fetched and checksum verified. |
| `plan` | Ordered install steps for package resolution, publisher verification, artifact fetch, and plugin install. |

Use `--output <path>` when you want the planner to prove the artifact bytes:

```sh
npm run corehub -- package install plugin-lab --output plugin-lab.corehub-manifest.json --registry https://coreblow.com/corehub
```

The command remains dry-run after writing the verified artifact; it does not install the plugin into CoreBlow yet.

The user-facing command is shorter:

```sh
npm run corehub -- install plugin-lab --registry https://coreblow.com/corehub
```

That command follows the OpenClaw UX direction. It attempts the install flow by default and reports a blocked apply step until installable CoreBlow plugin archives are available.

## Command Map

| Command | Status | Purpose |
| --- | --- | --- |
| `corehub validate` | Available | Validate the local catalog. |
| `corehub explore` | Available | List catalog entries. |
| `corehub list` | Available | List entries, optionally filtered by `kind`. |
| `corehub search <query>` | Available | Search local or hosted entries. |
| `corehub install <id>` | Available | Start the user-facing install flow, with `--dry-run` for preview. |
| `corehub publishers list` | Available | List publishers represented in the catalog. |
| `corehub publishers inspect <handle>` | Available | Inspect one publisher and its catalog entries. |
| `corehub inspect <target>` | Available | Inspect a catalog id or local skill folder. |
| `corehub package explore` | Available | Package-compatible list command. |
| `corehub package search <query>` | Available | Package-compatible search command. |
| `corehub package inspect <id>` | Available | Inspect one package-compatible entry. |
| `corehub package versions <id>` | Available | Show publisher-owned version metadata. |
| `corehub package files <id>` | Available | Show file metadata from the artifact manifest. |
| `corehub package artifact <id>` | Available | Show artifact manifest metadata, checksum, provenance, and download policy. |
| `corehub package download <id>` | Available | Print signed download metadata or write a verified artifact with `--output`. |
| `corehub package install <id>` | Available | Produce a technical install plan, optionally with a verified artifact download and `--dry-run` preview. |
| `corehub package publish <source>` | Planned | Publish package artifacts after registry writes land. |
| `corehub registry info` | Available | Read the API discovery document. |
