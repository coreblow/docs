# Security

## Best Practices
- Use environment variables for secrets
- Enable rate limiting
- Use HTTPS in production
- Keep plugin dependencies audited; CoreBlow enforces a built-in dependency denylist during [`coreblow plugins`](/cli/plugins) installation to block disallowed packages across manifests, `overrides`, and nested `node_modules`
- Run [`coreblow doctor`](/cli/doctor) regularly to check device pairing health, Codex route safety, and plugin registry integrity
