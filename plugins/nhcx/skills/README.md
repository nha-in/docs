# NHCX agent skills

One skill per NHCX use case, in episode order: `nhcx-coverage`,
`nhcx-insurance`, `nhcx-preauth`, `nhcx-claim`, `nhcx-payment`,
`nhcx-communication` and `nhcx-reprocess`. Each builds its use case into a
hospital information system or a standalone claims desk, held to the pinned
FHIR bundles of the NHCX package.

Each skill is a folder, not a single file: `SKILL.md` points into the folder's
own `core/`, `stages/`, `references/`, `fhir/`, `flow/`, `ui/`, `templates/`
and `scripts/`, and the shared files are repeated in every folder so any one
installs alone. `scripts/fetch-package.sh` fetches the NHCX package from
github.com/nha-in/nhcx-package into the project being built.

Install all seven with `claude plugin install nhcx@nha-in`, after
`claude plugin marketplace add` for this repository, or one at a time with
`scripts/install-skill.sh <name> <target>`. The site build copies each folder
to `/skills/<name>/` and packs it as `/skills/<name>.tar.gz`, which the site's
install commands unpack.

They come from github.com/nha-in/nhcx-skills, taken from its working tree on
15 September 2026, over commit 0e7545f. Update them there and copy them across
again rather than editing them here.

One block in each `SKILL.md` is the exception, and it is generated rather than
hand written. `npm run stamp:nhcx` writes it: where the folder came from, that
it is a snapshot and where to re-download it, that the nhcx-docs MCP server
outranks it, and what its claims rest on. The counts in it are read from this
repository, so the block goes stale when the Catalogue moves.
`npm run check:nhcx-stamp` fails when it has, and CI runs it.

`npm run validate:skills` now opens these folders. It checks each router's
frontmatter, that the provenance block is present, and that no file carries an
em dash. It also checks that the files every folder repeats are byte identical
across all seven, which is the rule that matters here: 57 of each folder's 58
files are copies, so a fix applied to one folder and not the rest would
otherwise ship as six stale copies. They cite no Catalogue atom, so the
Catalogue checks that the compiled ABDM skills get still do not reach them.
