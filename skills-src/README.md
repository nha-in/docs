# Agent skills

One folder per skill, installable with `scripts/install-skill.sh` into
Claude Code, Cursor, Codex or Copilot: they all read the same SKILL.md
format, so installing is one copy for every target. Two kinds live here:

- **Compiled** (`hiecm-m1-build` and `hiecm-m1-debug`, the same pair for
  `m2`, `m3` and `m4`, and `hiecm-p1-build`, `hiecm-p1-debug`,
  `hiecm-p2-build` and `hiecm-p3-build` on the patient side): assembled
  from Catalogue atoms by
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

P2 and P3 have a build skill and no debug skill. NHA records the PHR error
codes once against P1 and they apply across the whole patient side, so a
second and third copy of the same errors would be three skills competing
to answer one question. `hiecm-p1-debug` is the one to reach for anywhere
in P1 to P3.

The site build copies each skill here to `/skills/<name>/SKILL.md`,
next to the per-module reference skills that
`scripts/build-skills.mjs` generates from the specs: one per module,
`abdm-m1` through `abdm-m4`, `abdm-p1` through `abdm-p3`, and
`abdm-phr-services`.
