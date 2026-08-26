# Contributing content

The portal renders from two kinds of files. Where you put a file is where it
renders; no config or code changes are needed, and merging to `main` deploys.

**Before you write a page, read [the content paradigm](#the-content-paradigm).**
`npm run lint:content` enforces the parts of it a machine can check, and CI runs
it on every pull request.

| You are adding | You write | It goes in |
| --- | --- | --- |
| A documentation page | Markdown (`.md`, or `.mdx` for components) | `site/docs/<platform>/<version>/...` |
| API reference | OpenAPI 3.1 YAML | `catalogue/openapi/<platform>/<version>/<spec>.yaml` |

## Documentation pages (Markdown)

The docs tree is the navigation. Under `site/docs`:

```
site/docs/
  <platform>/                a gateway in the picker: abdm, uhi, nhcx, ...
    _platform.json           label, description, picker order, unpublished-version notes
    <version>/               v3, v1, ... newest folder becomes the default
      index.md               the platform's landing page
      getting-started/       Overview tab, first section
      registries/            Overview tab, second section
      concepts/              Overview tab, third section
      api/                   API references tab (module guide pages)
      reference/             API references tab, cross-module reference section
  whats-new/                 What's new tab
  support/                   Support tab
```

- **Add a page**: drop a `.md` file in the folder for the section it belongs
  to. A plain file with an `# H1` renders as-is; no frontmatter is required.
- **Order it**: add `sidebar_position: <n>` to the frontmatter. Files without
  a position sort alphabetically after positioned ones.
- **Add a subsection**: create a folder. An optional `_category_.json`
  (`{"label": "...", "position": n}`) names and orders it; a folder with an
  `index.md` uses that page as its landing page.
- **Add a version**: create `site/docs/<platform>/<v-next>/`. It appears in
  the version picker; the newest version becomes the default.
- **Add a platform**: create `site/docs/<platform>/` with a version folder
  inside and a `_platform.json` beside it. It appears in the platform picker.

Underscore-prefixed files and folders (`_servers.md`, `_glossary/`) are
partials: importable, never rendered as pages. Every folder also carries a
`README.md` saying what belongs in it; READMEs are for contributors on GitHub
and are never rendered either.

## API references (YAML)

Drop an OpenAPI 3.1 file at `catalogue/openapi/<platform>/<version>/<name>.yaml`.
The build generates, per spec:

- one documentation page per operation and webhook, grouped by use case
  (`x-abdm-use-case`, falling back to tags), under the module's sidebar entry
- an interactive Scalar reference at `/reference/<name>` (the filename stem)
- the aggregated Authentication, Callbacks and Error codes reference pages

Name the module in the spec's info block:

```yaml
info:
  x-portal:
    module: m1            # folder under docs/<platform>/<version>/api/
    label: M1 ABHA identity
    position: 2           # order among the platform's modules
```

Without `x-portal`, the filename stem is the module folder, `info.title` the
label, and modules sort alphabetically. Hand-written module guide pages
(overview, user journey, sequence) live in
`site/docs/<platform>/<version>/api/<module>/` next to the generated content;
never edit anything under `endpoints/` — it is overwritten on every build.

Two rules the build enforces, because breaking either one publishes something
wrong rather than failing:

- **Spec file names are unique across the whole tree.** The name is the served
  path and the Scalar route, so `uhi/v1/m1.yaml` and `hiecm/v3/m1.yaml` would
  be one page. Prefix with the gateway: `uhi-search.yaml`.
- **Do not hand-write a page at a generated name.** Generated pages carry
  `generated: true` in their frontmatter; the build refuses to overwrite a
  page that lacks it, and stops rather than dropping either version. Generated
  names are `api/index.md`, `api/<module>/errors.md`, and
  `reference/{authentication,callbacks,error-codes}.md`.

Removing a spec does not remove its module folder, because that folder also
holds hand-written guide pages. Delete the folder yourself when you retire a
specification.

## The content paradigm

Nobody reads a documentation page. People scan one, take the part they need,
and leave. Research on web reading puts it at 20 to 28 per cent of the words on
an average visit. Everything below follows from that number.

This section is binding on every page in `site/docs`. It sits on top of the
prose rules in the `writing-guide` skill, which still hold: short sentences,
say "you", no em dash, no "simply", every acronym linked on first use, and
never a claim of verification that did not happen.

### One page, one job

A page is too long because its scope is too wide, not because its prose is fat.
The fix for a page over budget is to split it or cut its scope, never to
compress the sentences.

A page is the right length when it covers what the reader has to do, what
happens if they do not, and where they go next. Nothing else.

### Word budgets, by page type

Counted over prose only. Code blocks, tables, headings, frontmatter and JSX are
excluded, because counting them punishes a reference page for being a reference
page.

| Page type | Where it lives | Prose budget |
| --- | --- | --- |
| Module overview | `api/<module>/index.mdx` | 600 |
| Concept | `concepts/` | 900 |
| Use case, how-to, everything else | anywhere else | 700 |
| Endpoint | `api/**/endpoints/` | 400 |
| Reference | `reference/`, `errors.md` | none, it is data |

Override the inferred type with `page_type:` in the frontmatter when the path
gets it wrong.

### Structure

Do not invent a section scheme per page. Every page answers the same six
questions, in whatever headings suit it: what this is and why it exists, who
needs it, when and where in the flow it happens, how to do it, how you know it
worked, and what to do when it does not.

Write every page as though the reader arrived from search having read nothing
else, because most of them did. Spell names out, link every concept, and never
write "as mentioned above". This is also what makes a page usable as a chunk by
the [MCP server](mcp/) and by an agent reading it cold.

### Two summaries, and no introduction

- **`description:` in the frontmatter is mandatory, and 160 characters or
  fewer.** It has to make sense standing alone, because it is what search
  results, link previews and the retrieval index show. This is the page's real
  summary.
- **A `## In short` block is required on any page over 300 prose words.** Three
  to five bullets, the answer first. Below 300 words it is banned: on a short
  page it repeats the title and steals the space a reader looks at first.
- **Never a section called Introduction or Overview.** Readers skip anything so
  labelled. Open with the answer. The linter rejects either word as a page's
  first heading.

### Sentences and paragraphs

| Rule | Limit | Tier |
| --- | --- | --- |
| Sentence length | 25 words | warning |
| Sentence length | 35 words | error |
| Sentences per paragraph | 5 | warning |
| Em dash | none | error |

A list of three or more parallel things is a bulleted list, not a sentence with
commas. Most sentences that break the 35 word limit are a list in disguise, and
splitting them out is usually the whole fix.

### Agent skills are the hero

Every module overview page opens with its agent skill, directly under the first
paragraph, before anything else. The panel states what the skill can do, the one
command that installs it, and how to put it to work.

One skill per module, covering the whole module: integrating, debugging and
testing. An agent hits all three inside one session, so splitting them across
files only means it loads all three.

The skill is generated by `scripts/build-skills.mjs` from the specifications,
the recorded error codes and the test matrix. The capability counts on the page
come from the same build (`site/src/data/skills.json`), so a page cannot claim
the skill covers something the generator did not put in it. Never hand-write a
skill file.

### What CI checks

`npm run lint:content` reports two tiers. Errors fail the build. Warnings are
reported and do not, so the standing stock can be cleaned page by page rather
than in one merge.

Errors today: an oversized `description`, a sentence over 35 words, a first
heading called Introduction or Overview, an em dash, and unparseable
frontmatter. On a page carrying `generated: true` all of these drop to
warnings, because the fix belongs in the generator or the specification.

Warnings today: over budget, a missing `description`, a missing `## In short`,
a sentence over 25 words, and a paragraph over five sentences.

Over budget is listed separately from the other warnings, because splitting a
page is a different piece of work from editing one. Seven pages are over
today; the linter names every one. It becomes an error once they are split.

## Roles

Every gateway splits by what the integrator is: HIE-CM has the information
management system and the PHR, UHI has HSPA and EUA, NHCX has provider and
payer. A reader picks one in the switcher at the top of the sidebar and the
tree scopes to it.

Role is a facet, not a folder. Nothing lives under a role directory, because a
module can serve several roles at once: the gateway session serves all of
them, and M1 and M3 serve both HIE-CM roles. Declare the role instead.

| Declaring for | Write |
| --- | --- |
| A specification | `info.x-abdm-roles: [phr, his]` in the YAML |
| A documentation page | `sidebar_custom_props: {roles: ['phr']}` in the frontmatter |

Declaring nothing means everyone sees it, which is right for most pages.
Only opt in when a page is genuinely not the other role's to read.

The choices a reader is offered live in `site/src/config/roles.ts`. Each role
also gets a page at `site/docs/<gateway>/<version>/roles/<role>.md` giving the
ordered path through its modules.

A reader's choice rides in the address as `?role=<id>`, so a link shared into
a ticket keeps the view the sender had. Paths never change.

## Moving or renaming a page

Old URLs must keep working. Add a redirect in `site/docusaurus.config.ts`
under the `@docusaurus/plugin-client-redirects` block, and update links that
pointed at the old URL (the build fails on broken links, so it will tell you).

## Release

CI builds the site on every pull request; a broken page or link fails the
build, so bad content cannot merge. Merging to `main` deploys via the Pages
workflow. To check locally:

```bash
npm run build --workspace site
```
