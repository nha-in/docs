# Agent skills

One folder per skill, installable with `scripts/install-skill.sh` into
Claude Code, Cursor, Codex or Copilot: they all read the same SKILL.md
format, so installing is one copy for every target. Two kinds live here:

- **Compiled** (`hiecm-m1-build`, `hiecm-m1-debug`): assembled from
  Catalogue atoms by `npm run compile:skills`, finished with a hand prose
  pass, and held to account by `npm run validate:skills`, which blocks the
  build when a cited atom no longer resolves.
- **Hand-authored** (`fhir-generate`, `fhir-audit`): agent-agnostic
  procedures for building or auditing NRCES compliant FHIR bundles. They
  assume the abdm-docs MCP server is connected, since every step calls
  its tools.

The site build copies each skill here to `/skills/<name>/SKILL.md`,
next to the per-module reference skills that
`scripts/build-skills.mjs` generates from the specs.
