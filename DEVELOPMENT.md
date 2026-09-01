# Development

## Setup

Install Node.js 22 LTS (22.12 or newer), then run:

```bash
npm install
npm run build
npm run creative -- --help
```

Copy `.env.example` to `.env` only when local overrides are needed. `.env` is ignored. Phase 0 does
not need credentials.

## Quality Commands

| Command                    | Purpose                                           |
| -------------------------- | ------------------------------------------------- |
| `npm run format`           | Apply Prettier formatting                         |
| `npm run format:check`     | Verify formatting without changes                 |
| `npm run lint`             | Run type-aware ESLint rules                       |
| `npm run typecheck`        | Check source and tests with strict TypeScript     |
| `npm run test:unit`        | Run isolated schema/config/provider tests         |
| `npm run test:integration` | Run filesystem and CLI tests                      |
| `npm run test`             | Run the complete test suite                       |
| `npm run build`            | Emit ESM, source maps, and declarations to `dist` |

CI runs the same stages on Linux with Node.js 22 and 24. Keep imports case-correct because Windows
may not reveal casing mistakes that fail in CI.

## Configuration

`loadConfig` validates the environment once at the application boundary. Runtime code receives the
typed result rather than repeatedly reading `process.env`. Provider keys are intentionally absent
from the schema until a real adapter defines a concrete environment variable.

`--bypass` is only a development/testing provider-selection signal. It does not disable provider
authentication, billing, safety, licensing, or platform restrictions.

## Project Fixtures

Tests should use temporary directories and deterministic timestamps. Never write generated test
content into the repository. Stable JSON examples belong in `tests/fixtures` and must validate
against the current schema.

## Release Boundary

The npm package is private during foundation development. Before publishing, maintainers must
confirm package ownership, export stability, provenance, changelog policy, and release automation.
