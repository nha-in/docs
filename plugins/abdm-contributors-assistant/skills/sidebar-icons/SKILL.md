---
name: sidebar-icons
description: 'How to choose and set the icon on a sidebar row in the ABDM Developer Portal: the four questions that pick an icon from a page''s subject rather than its wording, the three places a name is declared depending on what owns the row, the reuse and collision rules, and how the stylesheet is generated. Use when adding a page, folder or API module that will appear in the sidebar, when an icon looks wrong or generic, when a row shows the neutral fallback mark, or when check:icons fails.'
---

# Sidebar Icons

Every row in the sidebar carries a mark. A reader scanning the rail is looking for a shape, not reading labels, so the mark is doing navigation work and a wrong one costs more than none.

You name an icon. You never write CSS. `scripts/build-sidebar-icons.mjs` reads back every name the sidebar declares, resolves it against the installed lucide, and writes `site/src/css/sidebar-icons.css`. A name lucide does not have fails the build.

## Choose the icon before you know it exists

Do this in order. Stop at the first step that answers.

### 1. What is the page about, not what is it called?

Read the `description` in the front matter, which is one sentence about the page's subject. Name the subject in a noun. That noun is what you are looking for an icon of.

The title is the worse source, because a title is written for a reader already in the section. "M2 Attach" is about linking a record to an ABHA. "Accepted, then nothing" is about a flow that stalled. Neither icon is in its title.

| Page | Title suggests | Subject is | Mark |
| --- | --- | --- | --- |
| `troubleshooting/everything-returns-401.md` | a number | every call rejected at the door | `shield-x` |
| `milestones/m2.mdx` | a milestone number | attaching a record | `paperclip` |
| `concepts/callback-authenticity.md` | authenticity | ABDM signs what it sends | `signature` |
| `getting-started/going-live.mdx` | going somewhere | leaving the sandbox | `plane-takeoff` |

### 2. Does this subject already have a mark somewhere else?

**The same subject takes the same mark wherever it appears.** Check `references/vocabulary.md` first. The M1 testing page and the M1 milestone page are both about creating an ABHA, so both are `user-round-plus`. A reader who has learnt one mark should not have to learn it twice.

This is the step people skip, and skipping it is what turns a rail into forty unrelated pictures.

### 3. Is it a thing, or is it a state?

A page about a **thing** takes the thing: a pharmacy is `pill`, a laboratory is `flask-conical`, a blood bank is `droplet`.

A page about something **going wrong** takes the shape of the failure, not the thing that failed. `callback-never-arrives` is about nothing arriving, so it is `satellite-dish` rather than a callback icon. `consent-stuck-requested` is about a flow that stopped, so it is `circle-pause` rather than a consent icon.

Never use a generic warning triangle for a troubleshooting page. Five pages that all say "something is wrong" tell a reader nothing about which one to open, which is the only question they have.

### 4. Would a reader guess the page from the mark alone?

Cover the label and look at the row. If the mark could belong to four other pages in that section, it is too generic. Go back to step 1 and name a narrower subject.

## The rule about duplicates

**Uniqueness is required within one sidebar, not across the site.** Two sidebars are never on screen at once, so the Docs tab and the API references tab may both use `stethoscope`, and should when they mean the same thing.

Within one sidebar, two rows sharing a mark is a defect: it is the one thing a reader is entitled to read as "these are the same kind of thing".

The tightest case is siblings in one folder, which sit adjacent. `scripts/build-sidebar-icons.mjs` does not check this, because a shared mark is sometimes correct and a script cannot tell. Check it yourself by opening the section.

When two pages in one sidebar genuinely have the same subject, one of them is usually the wrong page rather than the wrong icon. `concepts/phr.md` and `concepts/participants/phr.md` are both about PHR apps and carry `app-window` and `smartphone` to keep them apart, which is a sign the two pages should probably be one.

## Where the name goes

Three places, decided by what owns the row.

| The row is | Declare it in | As |
| --- | --- | --- |
| A page | that page's front matter | `sidebar_class_name: sidebar-icon sidebar-icon--pill` |
| A folder, hand authored | that folder's `_category_.json` | `"className": "sidebar-icon sidebar-icon--database"` |
| An API module | its OpenAPI specification, under `info.x-portal` | `icon: shield-check` |

Both classes are needed on the first two: `sidebar-icon` is the box, `sidebar-icon--<name>` is the glyph.

The module case is different because `site/docs/<gateway>/<version>/api/` is generated. Editing a `_category_.json` under there is lost on the next build. `x-portal` already carries that module's label and position, so its icon belongs beside them, and `build-api-reference.mjs` writes the class out.

```yaml
info:
  x-portal:
    module: m3
    label: M3 Consent and fetching
    position: 4
    icon: shield-check
```

## Then rebuild

```sh
npm run build:icons
```

Commit `site/src/css/sidebar-icons.css` with the change. `npm run check:icons` runs in CI and fails when the stylesheet does not match the names the sidebar declares.

## What the levels look like

Size and weight come from the row's depth, not from the icon, so the same name looks right anywhere.

| Depth | Size | Opacity |
| --- | --- | --- |
| Top level section | 16px | 0.7 |
| A group inside one | 14px | 0.6 |
| A page | 14px | 0.55 |
| The page you are on | unchanged | 1, and the accent colour |

Endpoint rows under an API module carry no icon. They already carry a coloured method badge, and a second mark on the line reads as clutter.

## The neutral fallback

A top level section that names no icon renders a `list` mark rather than nothing, so its label stays on the same left edge as its siblings and the section reads as deliberate rather than half built.

**This is a safety net, not a default to leave in place.** A section showing `list` is a section nobody has chosen an icon for. If you are looking at one, that is the work.

A page or a nested group that names nothing renders no mark at all, which is correct: a leaf without an icon is a page in a list, not a broken row.

## Common mistakes

| Mistake | Why it fails | Do instead |
| --- | --- | --- |
| Choosing from the title | Titles are written for readers already in the section | Read the `description` and name the subject |
| A warning triangle on every troubleshooting page | Five identical marks answer none of the reader's question | Give each failure its own shape |
| A new mark for a subject that already has one | The reader has to learn the same thing twice | Check `references/vocabulary.md` first |
| Editing `site/src/css/sidebar-icons.css` | Generated, and overwritten on the next build | Name the icon and run `npm run build:icons` |
| Editing a `_category_.json` under `api/` | Generated from the specification | Set `x-portal.icon` in the YAML |
| Only `sidebar-icon--pill`, without `sidebar-icon` | The box never gets drawn, so no mark appears | Both classes, space separated |
| Inventing a name that reads right | lucide has `flask-conical`, not `flask` | Check https://lucide.dev/icons, or `ls node_modules/lucide-react/dist/esm/icons` |
| Leaving a section on the `list` fallback | It reads as finished and nobody comes back to it | Choose one now |

## Related

- The icons already in use, and what each one means: `references/vocabulary.md`
- Page front matter, and everything else in it: `page-authoring`
- Where a page sits in the tree in the first place: `docs-ux`
- The specification fields the generator reads: `openapi-ingest`
