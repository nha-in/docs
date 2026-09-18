# Working on this repo

Every change here goes through the contributor's assistant plugin in
`plugins/abdm-contributors-assistant`. Load its `abdm-portal-index` skill first
and let it route you to the one skill that fits. Do not edit from first
principles: the skills carry the rules a diff cannot show you, including the
atom schema, the prose and voice constraints, the DPG no-vendor-dependency
rule, and what `verified` is allowed to mean.

If the plugin is not installed, install it before making changes. Two commands
from the repo root, then restart Claude Code:

```sh
claude plugin marketplace add ./
claude plugin install abdm-contributors-assistant@nha-in
```

`./` installs from this checkout, so the branch you are on is the version you
run. Nothing in this repo can install it for you: Claude Code refuses to
auto-install a plugin that repo-authored settings asked for, which is why this
is a rule you follow rather than a gate that stops you.

Two things the index will not route for you, because they are repo-wide:

- Generated files are never hand-edited. `site/docs/<gateway>/<version>/api/`,
  `site/static/specs/`, `plugins/abdm-integrators-assistant/skills/` and `site/static/llms.txt` are
  build outputs. If one is wrong, the catalogue or the generator is wrong.
- Skills ship as one folder per module: a `SKILL.md` that routes, and the
  scaffold, integrate, debug and test sections under `references/`. The guided
  loops are authored in `skills-src/` and folded in by
  `scripts/build-skills.mjs`, which writes the same nine folders to
  `site/static/skills/` and to the plugin. Edit `skills-src/`, never either
  output.
- The plugin's other manifests are generated too. `.claude-plugin/plugin.json`
  is the source; `plugin.json`, `.codex-plugin/plugin.json` and
  `.agents/plugins/marketplace.json` come from it through
  `npm run build:plugins`, so one plugin installs in Claude Code, in Codex and
  in anything else that reads Agent Plugins 1.0. CI runs `check:plugins`.
- The plan under `plan/` cannot move without the skills compiled from it moving
  too. `./scripts/plan-check.sh` is the gate, and CI runs it.
