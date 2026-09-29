# Agent skills

One folder per skill, installable with `scripts/install-skill.sh` into
Claude Code, Cursor, Codex or Copilot: they all read the same SKILL.md
format, so installing is one copy for every target. Two kinds live here:

- **Compiled** (`hiecm-<module>-build` and `hiecm-<module>-debug`, one
  pair per module: `gateway`, `m1` through `m4`, `p1` through `p4`
  and `scan-and-pay`): generated from the journey files
  and the specifications by `npm run compile:skills` and held to account
  by `npm run validate:skills`, which blocks the build when a loop states
  no limit or a step states no exit condition. A module gets a build
  skill when it has journeys and a debug skill when its specification's
  response examples return error codes, so a module with neither ships
  nothing rather than an empty loop, and a retired module's folder is
  removed rather than left behind.
- **Hand-authored test loops** (`hiecm-<module>-test`): the module's
  functional test cases as one loop each, folded into the module skill as
  `references/test.md`. Each case names the evidence a reviewer can check
  against the gateway, and the loop ends in a manifest of case ids to
  request ids. Only `hiecm-m1-test` exists so far; a module with no test
  source ships no test section.
- **Hand-authored** (`fhir-generate`, `fhir-audit`): agent-agnostic
  procedures for building or auditing NRCES compliant FHIR bundles. They
  assume the abdm-docs MCP server is connected, since every step calls
  its tools.

The site build copies each skill here to `/skills/<name>/SKILL.md`,
next to the per-module reference skills that
`scripts/build-skills.mjs` generates from the specs: one per module,
`abdm-gateway`, `abdm-m1` through `abdm-m4`, `abdm-p1` through `abdm-p4`,
`abdm-scan-and-pay`, and `abdm-fhir`.
