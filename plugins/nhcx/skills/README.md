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

Install all seven with `claude plugin install nhcx@abdm-portal`, after
`claude plugin marketplace add` for this repository, or one at a time with
`scripts/install-skill.sh <name> <target>`. The site build copies each folder
to `/skills/<name>/` and packs it as `/skills/<name>.tar.gz`, which the site's
install commands unpack.

They come from github.com/nha-in/nhcx-skills, taken from its working tree on
15 September 2026, over commit 0e7545f. Update them there and copy them across
again rather than editing them here. `npm run validate:skills` checks their
frontmatter and em dashes; they cite no Catalogue atom, so its Catalogue
checks do not reach them.
