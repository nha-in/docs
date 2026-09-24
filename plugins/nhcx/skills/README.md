# NHCX agent skills

Seven skills for building the provider side of NHCX into a hospital
information system: `nhcx-full`, the whole integration end to end, and one per
use case, `nhcx-coverage`, `nhcx-preauth`, `nhcx-claim`,
`nhcx-communication`, `nhcx-payment` and `nhcx-reprocess`.

Each skill is a folder, not a single file. `SKILL.md` routes: it names the
goal, the knowledge source and the eight steps, from discovery to end-to-end
tests. The folder holds what those steps read: `steps/` for the steps
themselves, `references/` for the binding rules (`CORE.md` first) and the
scaffolding, and one folder per kind of spec, `apis/`, `callbacks/`,
`database/`, `fhir/`, `gateway/` and `screens/`. A skill holds only the specs
its goal needs, so the folders differ: a spec shared by two skills can name
the other skill it links to, and `nhcx-full` holds every spec. Each folder
installs alone.

Every skill takes its NHCX facts from one knowledge source: the nhcx-docs MCP
server when it is connected, otherwise the release of the NHCX package at
github.com/nha-in/nhcx-package.

Install all seven with `claude plugin install nhcx@nha`, after
`claude plugin marketplace add nha-in/agent-plugins`, or one at a time from the
site. The site build copies each folder to `/skills/<name>/` and packs it as
`/skills/<name>.tar.gz`, which the site's install commands unpack.

They come from github.com/nha-in/nhcx-skills, taken from its working tree on
21 September 2026, over commit 7f59d09. Update them there and copy them across
again rather than editing them here.

One block in each `SKILL.md` is the exception, and it is generated rather than
hand written. `npm run stamp:nhcx` writes it: where the folder came from, that
it is a snapshot and where to re-download it, that the nhcx-docs MCP server
outranks it, and what its claims rest on. The counts in it are read from this
repository, so the block goes stale when the Catalogue moves.
`npm run check:nhcx-stamp` fails when it has, and CI runs it.

`npm run validate:skills` opens these folders. It checks each router's
frontmatter, that its name matches its folder, that the provenance block is
present, that every file the router links to exists in the folder, and that no
file carries an em dash.
