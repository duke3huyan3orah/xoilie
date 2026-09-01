# Providers

Providers translate XOILIE's canonical generation requests into an external or local model API.
Creative planning must remain independent of these adapters.

## Contracts

Phase 0 defines:

- `LLMProvider`
- `ImageProvider`
- `VideoProvider`
- `AudioProvider`
- `VisionProvider`
- `UpscalerProvider`

Each provider exposes identity, availability, capabilities, non-secret configuration, health,
generation, estimation, and cancellation. Requests support `AbortSignal`. Errors are normalized to
`ProviderError` and identify whether retry is safe.

## Adding a Provider

1. Create `src/providers/<category>/<provider-name>/index.ts`.
2. Implement the appropriate provider interface from `src/providers/contracts.ts`.
3. Keep SDK request/response types inside the adapter.
4. Translate vendor failures to `ProviderError`; never expose credential values in messages.
5. Declare capabilities conservatively and implement a meaningful health check.
6. Add deterministic unit tests with network calls mocked at the adapter boundary.
7. Add an opt-in integration test that is excluded from credential-free CI if a live service is
   necessary.
8. Document setup, pricing/access class, data handling, rate limits, and model licenses.

Application code must discover providers through a future registry. It must not instantiate a vendor
adapter directly.

## Capability and Access Labels

Use `local`, `free-api`, `paid-api`, or `experimental` based on verifiable current terms. "Free API"
does not mean unrestricted. Document quotas and whether a payment method is required.

## Model Metadata

Every real adapter must track model name, source, license, commercial-use restrictions, local or
remote execution, hardware requirements, and supported capabilities. Unknown license terms must be
recorded as unknown rather than assumed permissive.

## Mock Providers

Mocks are deterministic, local, and cost-free. They return `mock://` artifact references marked
`DEVELOPMENT / MOCK OUTPUT`. Phase 0 mocks do not write playable images, audio, or video. Future
bypass rendering may create explicit placeholder fixtures, but those files must remain visibly
marked and outside version control.

## Security Rules

- Read credentials from documented environment variables or a secure credential interface.
- Never store keys in `ProviderConfiguration`, project manifests, URLs, telemetry, or logs.
- Treat model output and remote filenames as untrusted input.
- Do not execute generated code or shell commands.
- Respect provider authentication, safety controls, rate limits, payment, and content terms.
