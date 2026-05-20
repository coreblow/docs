# CoreHub Quickstart

Use CoreHub to browse CoreBlow ecosystem entries from the web, the public API, or the CoreHub CLI.

## Browse the Directory

Open:

```text
https://coreblow.com/corehub
```

The web directory reads from the same catalog served at:

```text
https://coreblow.com/corehub/catalog.json
```

## Query the Registry API

List entries:

```sh
curl https://coreblow.com/corehub/api/v1/entries
```

Search entries:

```sh
curl "https://coreblow.com/corehub/api/v1/search?q=plugin"
```

Inspect one package-compatible entry:

```sh
curl https://coreblow.com/corehub/api/v1/packages/plugin-lab
```

## Use the CLI Against the Hosted Registry

From the CoreHub repository:

```sh
npm run corehub -- explore --registry https://coreblow.com/corehub
npm run corehub -- search plugin --registry https://coreblow.com/corehub
npm run corehub -- package inspect plugin-lab --registry https://coreblow.com/corehub
```

You can also set:

```sh
COREHUB_REGISTRY=https://coreblow.com/corehub
```

Then run read commands without repeating `--registry`.

## Next Steps

- Read the [CLI reference](/corehub/cli).
- Read the [Registry API reference](/corehub/api).
