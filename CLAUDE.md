# Working on this repo

Every change here goes through the contributor's assistant plugin in
`plugins/abdm-contributors-assistant`. Load its `abdm-portal-index` skill first
and let it route you to the one skill that fits. Do not edit from first
principles: the skills carry the rules a diff cannot show you, including the
atom schema, the prose and voice constraints, the DPG no-vendor-dependency
rule, and what `verified` is allowed to mean.

If the plugin is not installed, install it before making changes:
[CONTRIBUTING.md](CONTRIBUTING.md) has the two commands.

NHA corrections are applied to docs pages only. Follow `docs/runbook-nha-corrections.md`.

Two things the index will not route for you, because they are repo-wide:

- Generated files are never hand-edited. `.claude/hooks/guard.sh` holds the
  list and refuses the edit; it also asks before a command deletes anything
  under `catalogue/`. If a generated file is wrong, the catalogue or the
  generator is wrong.
- Each gateway keeps its own integrators plugin: `abdm-integrators-assistant`
  for HIE-CM, `uhi-integrators-assistant` for UHI and `nhcx` for NHCX. Skills
  ship as one folder per module or service: a `SKILL.md` that routes, and the
  sections under `references/`. The guided loops are written to `skills-src/`
  by `scripts/compile-skills.mjs` and folded in by `scripts/build-skills.mjs`,
  which writes each folder to `site/static/skills/` and to its gateway's
  plugin; the UHI folders are assembled by `scripts/lib/uhi-skills.mjs` from
  the UHI atoms. Fix the atom, the journey or the generator, never an output.
- The plugin's other manifests are generated too. `.claude-plugin/plugin.json`
  is the source; `plugin.json`, `.codex-plugin/plugin.json` and
  `.agents/plugins/marketplace.json` come from it through
  `npm run build:plugins`, so one plugin installs in Claude Code, in Codex and
  in anything else that reads Agent Plugins 1.0. CI runs `check:plugins`.
- The plan under `plan/` cannot move without the skills compiled from it moving
  too. `./scripts/plan-check.sh` is the gate, and CI runs it.
