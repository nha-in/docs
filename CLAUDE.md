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
claude plugin install abdm-contributors-assistant@abdm-portal
```

`./` installs from this checkout, so the branch you are on is the version you
run. Nothing in this repo can install it for you: Claude Code refuses to
auto-install a plugin that repo-authored settings asked for, which is why this
is a rule you follow rather than a gate that stops you.

Two things the index will not route for you, because they are repo-wide:

- Generated files are never hand-edited. `site/docs/<gateway>/<version>/api/`,
  `site/static/specs/`, `plugins/abdm/skills/` and `site/static/llms.txt` are
  build outputs. If one is wrong, the catalogue or the generator is wrong.
- The plan under `plan/` cannot move without the skills compiled from it moving
  too. `./scripts/plan-check.sh` is the gate, and CI runs it.
