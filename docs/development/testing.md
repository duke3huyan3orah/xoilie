# Testing Strategy

Unit tests validate schemas, configuration, provider contracts, mocks, and serialization without
network or filesystem state. Integration tests exercise the CLI and project filesystem inside OS
temporary directories. Fixtures are stable examples, not snapshots of opaque provider responses.

Live-provider tests will be opt-in and separate from required CI. Any future rendering integration
test must generate small, visibly synthetic fixtures and clean its temporary output.
