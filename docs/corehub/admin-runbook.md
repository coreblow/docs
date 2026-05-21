# CoreHub Admin Runbook

Use this runbook when CoreBlow hosts plugins installed from CoreHub and an operator needs a repeatable trust check before rollout, update, or incident review.

## When To Run

Run the CoreHub policy audit:

- Before exposing a gateway that uses CoreHub-managed plugins.
- Before building or shipping a production image with installed plugins.
- Before plugin updates during a maintenance window.
- After a CoreHub registry moderation change.
- During incident response when a plugin publisher, version, artifact, or checksum needs to be re-verified.

## Recommended Gate

Use the refresh gate when the machine can reach the hosted registry:

```sh
coreblow plugins policy audit --refresh
```

The matching package script is:

```sh
pnpm audit:corehub:refresh
```

This command refreshes registry-backed trust metadata, audits installed CoreHub plugins, and fails closed when policy blocks an installed plugin.

## Offline Audit

Use the local audit when the host cannot reach the registry:

```sh
coreblow plugins policy audit
```

The matching package script is:

```sh
pnpm audit:corehub
```

The local audit checks the installed plugin records already present on the host. It is useful for air-gapped review, but it does not pick up new CoreHub moderation decisions until registry metadata is refreshed.

## Install Check

Before installing a plugin, verify the package policy without writing plugin config:

```sh
coreblow plugins policy check corehub:plugin-lab
```

Then inspect the full trust proof:

```sh
coreblow plugins verify corehub:plugin-lab
coreblow plugins info corehub:plugin-lab
```

Install only after the package is available, allowed by policy, backed by publisher identity, and tied to a verified artifact checksum.

## Update Check

Before plugin updates:

1. Run `coreblow plugins policy audit --refresh`.
2. Run `coreblow plugins verify corehub:<id>` for each plugin being updated.
3. Confirm publisher, version status, artifact checksum, storage locator, and signed redirect metadata.
4. Apply the update through the normal plugin installer.
5. Run `coreblow plugins policy audit --refresh` again after the update.

## What Operators Should Review

| Evidence | What to confirm |
| --- | --- |
| Publisher identity | The package owner is the expected publisher and verification state is acceptable for the environment. |
| Version ownership | The selected version belongs to the same publisher and has not changed ownership unexpectedly. |
| Moderation status | The version is `available` and not `blocked` or disabled by policy. |
| Artifact checksum | The SHA-256 in CoreHub metadata matches the downloaded bytes. |
| Storage locator | The artifact storage key and URL match the signed download contract. |
| Signed redirect | The redirect signature binds package, version, checksum, storage key, and expiry. |
| Client verification | The installer verifies byte count and checksum before recording the plugin install. |

## CI Usage

Add the refresh audit as a release or image-build gate when the runner can reach CoreHub:

```sh
pnpm audit:corehub:refresh
```

Use the non-refresh audit for offline runners that only validate the current host state:

```sh
pnpm audit:corehub
```

Treat a failed audit as a release blocker. Do not bypass the gate by installing the artifact manually; fix the publisher, version, moderation status, or artifact metadata first.

## Failure Triage

| Symptom | First check |
| --- | --- |
| Package is blocked | Inspect CoreHub moderation status and release notes before reinstalling. |
| Publisher mismatch | Confirm package ownership and expected publisher handle. |
| Checksum mismatch | Stop the rollout and compare the artifact manifest with the downloaded artifact. |
| Missing storage locator | Do not install until CoreHub exposes a storage key and signed redirect metadata. |
| Registry unavailable | Run the offline audit, keep existing plugins unchanged, and retry refresh when the registry is reachable. |

## Related Pages

- [CoreHub CLI](/corehub/cli)
- [Downloads](/corehub/downloads)
- [Trust Model](/corehub/trust-model)
- [Registry API](/corehub/api)
