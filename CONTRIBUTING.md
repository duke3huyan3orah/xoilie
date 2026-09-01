# Contributing

XOILIE welcomes focused changes that preserve its provider-neutral, local-first architecture.

## Before Opening a Change

1. Search existing issues and explain the user problem, not only the proposed abstraction.
2. Keep changes within the current roadmap phase unless an issue has agreed on a broader scope.
3. Never commit credentials, generated media, model weights, or provider responses containing
   private data.
4. Add tests at the boundary where behavior changes.

## Extension Map

| Change                   | Location                                                              |
| ------------------------ | --------------------------------------------------------------------- |
| Add a provider           | `src/providers/<category>/<provider>` plus provider contract tests    |
| Add a creative workflow  | `src/creative/workflows` plus application orchestration               |
| Add a prompt compiler    | `src/prompts` for canonical prompts; adapter near its provider        |
| Add rendering behavior   | `src/rendering/<renderer>` behind `Renderer`                          |
| Add a CLI command        | `src/cli` with use-case logic in `src/application`                    |
| Add or evolve schemas    | `src/domain` with fixture and migration tests                         |
| Add tests                | `tests/unit`, `tests/integration`, and reusable `tests/fixtures` data |
| Update OpenCode behavior | `.opencode/skills/xoilie/SKILL.md`                                    |

Do not import provider SDKs from `src/domain`, `src/creative`, or general application services. See
[`PROVIDERS.md`](PROVIDERS.md) before adding an integration.

## Local Checks

```bash
npm install
npm run format:check
npm run lint
npm run typecheck
npm run test:unit
npm run test:integration
npm run build
```

## Pull Requests

- Keep the title imperative and the description specific.
- State current behavior, changed behavior, tests run, and documentation impact.
- Update `.env.example` only with placeholder values and variable names.
- Do not label a provider free unless its current published terms support that claim.
- Call out model licenses and commercial-use restrictions.

Maintainers may ask large features to be split by contract, implementation, and documentation so
each change remains reviewable.
