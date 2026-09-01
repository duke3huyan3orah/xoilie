# First Project Manifest

After building the CLI, initialize a project:

```bash
npm run creative -- init "Midnight Vehicle Study" --bypass
```

The resulting `midnight-vehicle-study/project.json` contains schema version 1, conservative video
defaults, empty creative collections, and mock provider selections. Bypass mode is recorded so later
development commands can remain deterministic. No generated media is created in Phase 0.
