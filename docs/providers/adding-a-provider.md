# Provider Implementation Checklist

Use this checklist with [`PROVIDERS.md`](../../PROVIDERS.md).

- Select exactly one provider category contract.
- Keep vendor SDK types and model-specific prompt fields inside the adapter.
- Report only tested capabilities.
- Normalize failures and cancellation.
- Use an environment variable for credentials and test redaction.
- Add model source and license metadata.
- Test success, invalid configuration, unavailable service, rate limiting, and abort behavior.
- Ensure all default CI paths run without the SDK's external service or API key.
