# Agent skills

One folder per skill, installable with `scripts/install-skill.sh` into
Claude Code, Cursor, Codex or Copilot: they all read the same SKILL.md
format, so installing is one copy for every target. Two kinds live here:

- **Compiled** (`hiecm-m1-build` and `hiecm-m1-debug`, and the same pair
  for `m2` and `m3`): assembled from Catalogue atoms by
  `npm run compile:skills` and held to account by
  `npm run validate:skills`, which blocks the build when a cited atom no
  longer resolves, a loop states no limit, or a step states no exit
  condition. A milestone gets a build skill when it has flow atoms and a
  debug skill when it has error atoms, so a milestone the Catalogue has
  not reached yet ships nothing rather than an empty loop.
- **Hand-authored** (`fhir-generate`, `fhir-audit`): agent-agnostic
  procedures for building or auditing NRCES compliant FHIR bundles. They
  assume the abdm-docs MCP server is connected, since every step calls
  its tools.

M4 and the P series have no skill here. They have no flow or error atoms
yet, and a build skill with nothing behind it is worse than none. Their
endpoints, headers and error codes are in the per-module reference skills
instead.

The site build copies each skill here to `/skills/<name>/SKILL.md`,
next to the per-module reference skills that
`scripts/build-skills.mjs` generates from the specs: one per module,
`abdm-m1` through `abdm-m4`, `abdm-p1` through `abdm-p3`, and
`abdm-phr-services`.
