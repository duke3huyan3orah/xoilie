# Troubleshooting

## Node.js Version Is Rejected

XOILIE requires Node.js 22.12 or newer. Contributors should use Node.js 22 LTS, matching `.nvmrc`.
Check with `node --version` and switch versions before running `npm install`.

## `creative` Is Not Found

Build and link the local package:

```bash
npm run build
npm link
creative --help
```

Alternatively run `npm run creative -- --help` without a global link.

## A Command Says `Not implemented yet.`

This is expected for Phase 0 commands other than `init` and `providers`. The CLI exposes the future
surface honestly so scripts and documentation can converge without fake generation.

## Project Initialization Fails

`creative init` refuses to overwrite an existing directory. Choose another project name or move the
existing directory. Confirm the parent directory is writable.

## Environment Validation Fails

Compare local values with `.env.example`. Boolean settings accept only `true`, `false`, `1`, or `0`.
Do not quote values unless your environment loader removes the quotes.

## Tests Behave Differently on Windows and CI

Check import and filename casing. Git on Windows is commonly case-insensitive while GitHub Actions
runs Linux. Also avoid depending on executable bits or committed symlinks.

## OpenCode Does Not Discover the Skill

The skill is located at `.opencode/skills/xoilie/SKILL.md`, which OpenCode scans by default. Restart
OpenCode after changing a skill because configuration-time files are loaded only at startup.
