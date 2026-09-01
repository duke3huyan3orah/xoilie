# Security Policy

## Supported Versions

Until the first stable release, security fixes target the latest revision of `main`.

## Reporting a Vulnerability

Do not open a public issue for a vulnerability or suspected credential exposure. Use GitHub's
private vulnerability reporting for this repository. If that feature is unavailable, contact the
repository owner through a private channel listed on their GitHub profile and request a secure
reporting path. Include impact, reproduction steps, affected revision, and any proposed mitigation.

Do not include real API keys, private generated media, or third-party personal data in a report.

## Security Boundaries

- Provider and model output is untrusted data and must never be executed automatically.
- Credentials may be read from environment variables but may not enter project manifests or logs.
- Logging utilities redact common secret-shaped fields; adapters must still avoid logging raw
  headers and payloads.
- Paths derived from model output require containment checks before filesystem access.
- Archive extraction and media processing will require size, path, timeout, and resource limits.
- Bypass mode selects deterministic mocks only. It must never weaken third-party controls.

## Dependency Reports

Dependency alerts without a demonstrated reachable path are still useful. Include the package,
advisory, lockfile version, and whether the vulnerable API is used.
