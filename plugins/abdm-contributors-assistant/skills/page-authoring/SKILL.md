---
name: page-authoring
description: 'How to write or edit a documentation page under site/docs: where it goes in the tree, the mandatory frontmatter, the six questions every page answers, the word budget by page type, when the "In short" block is required or banned, the sentence and paragraph limits, and which of these CI fails on versus only warns about. Use whenever creating or editing a page under site/docs, deciding where a new page belongs, splitting an over budget page, or a lint:content failure needs explaining.'
---

# Page Authoring

A page is a markdown file under `site/docs`. There is no separate metadata file: the frontmatter and the prose live in the one file that renders, which is the only reason the site and the rules on it cannot drift.

## Before you write anything

Answer these. If you cannot, you are not ready to write the page.

1. **Where does it live?** The tree under `site/docs` is the navigation, not a suggestion. Pick the folder for the section the reader is in: `getting-started/`, `registries/`, `concepts/`, `api/<module>/`, `reference/`. The folder decides the page's type and its word budget, unless you override both with `page_type:` in the frontmatter.
2. **What type is it, and what is its budget?** Module overview, concept, use case or how to, endpoint, or reference. See the table below.
3. **Is any part of this generated?** If the page lives at `api/<module>/`, check `endpoints/`, `errors.md`, or `api/index.md` for `generated: true`. Never hand edit those; fix the specification or the generator instead.
4. **What are the six questions this page has to answer?** See Structure below. If you cannot answer all six for the topic, the page is not scoped yet.

## Where a page goes

```
site/docs/
  <platform>/                a gateway in the picker: abdm, uhi, nhcx, ...
    <version>/                v3, v1, ... newest folder becomes the default
      getting-started/        Overview tab, first section
      registries/              Overview tab, second section
      concepts/                Overview tab, third section
      api/                     API references tab (module guide pages)
      reference/                API references tab, cross-module reference section
```

- **Add a page**: drop a `.md` file in the folder for the section it belongs to. A plain file with an `# H1` renders as is; no frontmatter is required to render, but see Mandatory frontmatter below for what the paradigm requires.
- **Order it**: `sidebar_position: <n>` in the frontmatter. Files without a position sort alphabetically after positioned ones.
- **Add a subsection**: create a folder. An optional `_category_.json` (`{"label": "...", "position": n}`) names and orders it; a folder with an `index.md` uses that page as its landing page.
- Underscore prefixed files and folders (`_servers.md`, `_glossary/`) are partials: importable, never rendered as pages.

Never hand write a page at a generated name: `api/index.md`, `api/<module>/errors.md`, `reference/{authentication,callbacks,error-codes}.md`, or anything under `api/**/endpoints/`. Those carry `generated: true` and the build overwrites them.

## Page type and word budget

Inferred from the path, or set explicitly with `page_type:` when the path gets it wrong. Counted over prose only: code blocks, tables, headings, frontmatter and JSX are stripped before counting.

| Page type | Where it lives | Prose budget |
| --- | --- | --- |
| Module overview | `api/<module>/index.mdx` | 600 |
| Concept | `concepts/` | 900 |
| Use case, how to, everything else | anywhere else | 700 |
| Endpoint | `api/**/endpoints/` | 400 |
| Reference | `reference/`, `errors.md` | none, it is data |

A page over budget is too wide in scope, not too fat in prose. **The fix is to split the page or cut its scope. Never compress the sentences to fit.** Going over budget does not fail CI today: it is reported on its own list, separate from warnings, because a split is a different piece of work from an edit. It is a warning, not an error, even far over budget.

## Structure

Do not invent a section scheme per page. Every page answers the same six questions, in whatever headings suit it:

1. What this is and why it exists
2. Who needs it
3. When and where in the flow it happens
4. How to do it
5. How you know it worked
6. What to do when it does not

Write as though the reader arrived from search having read nothing else, because most of them did. Spell names out, link every concept, never write "as mentioned above".

**Never a first heading called Introduction or Overview.** Readers skip anything so labelled. Open with the answer. This is checked by the linter and fails CI.

**Nobody checks the six questions or the one page, one job rule.** They are editorial judgement, not lint. A page that drifts from them will pass CI clean and still be the wrong page.

## Mandatory frontmatter

```yaml
---
description: One sentence, 160 characters or fewer, that makes sense standing alone.
sidebar_position: 2
page_type: concept       # optional, overrides the path-inferred type
sidebar_custom_props:
  roles: ['phr']          # optional, see Roles below
---
```

- **`description` is mandatory and 160 characters or fewer.** It is what search results, link previews and the retrieval index show, so it has to work standing alone. A missing description is a warning, not an error. An oversized one is an error.
- **`## In short` is required on any page over 300 prose words, and banned below it.** Three to five bullets, the answer first. Above the threshold, a missing block is a warning. Below the threshold, the linter does not check for a wrongly present block, but the paradigm still forbids it: on a short page it repeats the title and steals the space a reader looks at first.

## Sentences and paragraphs

| Rule | Limit | Tier |
| --- | --- | --- |
| Sentence length | 25 words | warning |
| Sentence length | 35 words | error |
| Sentences per paragraph | 5 | warning |
| Em dash | none | error |

A list of three or more parallel things is a bulleted list, not a sentence joined with commas. Most sentences over 35 words are a list in disguise, and splitting them out is usually the whole fix.

## What CI fails on and what it only warns about

`npm run lint:content` runs on every pull request. Two tiers, and a page carrying `generated: true` drops every error below to a warning, because the fix belongs in the generator or the specification, not the page.

**Errors, fail the build:**
- `description` over 160 characters
- a sentence over 35 words
- first heading is Introduction or Overview
- an em dash anywhere in the body
- frontmatter that is not valid YAML

**Warnings, reported and do not block:**
- over the word budget
- missing `description`
- missing `## In short` above 300 words
- a sentence over 25 words
- a paragraph over 5 sentences

A contributor who cannot tell an error from a warning treats every rule as blocking or every rule as optional. Both are wrong: fix the errors before merging, and fix a warning when you are already in the file.

## Roles are a facet, not a folder

Nothing lives under a role directory: a module can serve several roles at once, so a folder per role would duplicate every shared page. Declare the role in frontmatter instead:

```yaml
sidebar_custom_props:
  roles: ['phr']
```

Declaring nothing means every role sees the page, which is right for most pages. Only opt in when a page is genuinely not another role's to read. Nothing in `lint-content.mjs` checks this frontmatter; it is read by the site at render time, not linted.

## Generated pages

Pages carrying `generated: true` in frontmatter come from `scripts/build-api-reference.mjs`, which is the OpenAPI build. `scripts/build-skills.mjs` writes no documentation pages at all: its outputs are one `SKILL.md` per module under `site/static/skills` plus `site/src/data/skills.json`. **Never hand edit a generated page.** The guard is `writeGenerated` at `scripts/build-api-reference.mjs:26`: a file already at a generated name without the flag is left alone, collected, and reported at the end with a non-zero exit, so a hand written file there stops the build rather than getting silently replaced. A hand edit to an existing generated page is not caught by anything and is simply lost on the next build. Fix the specification or the generator.

## Common mistakes

| Mistake | Why it fails | Do instead |
| --- | --- | --- |
| Compressing prose to fit the budget | The paradigm's claim is that a wide page is the problem, not fat prose | Split the page or cut its scope |
| `## In short` on a 150 word page | Below 300 words it repeats the title and wastes the top of the page | Leave it out |
| First heading "Overview" | The linter rejects it as a page's first heading, and CI fails | Open with the answer as the first heading |
| A 40 word sentence with three clauses joined by "and" | Over the 35 word error limit | Split into a bulleted list or separate sentences |
| Hand editing a file under `api/**/endpoints/` | Overwritten on every build with no warning beyond the diff | Edit the OpenAPI specification instead |
| A `roles/` folder per role | Duplicates every page a role shares with another | Declare `sidebar_custom_props.roles` in frontmatter |
| Em dash anywhere | CI blocks U+2014 repository wide | Full stop, comma or colon |

## Related

- The prose rules underneath this paradigm: `writing-guide`
- Site structure, tabs and the module page ladder: `docs-ux`
- The Scalar docs site and its build: `scalar-docs`
- Catalogue atoms, a different kind of file: `atom-authoring`
