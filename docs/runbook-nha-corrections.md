# NHA sent a correction

NHA's corrections arrive as Word documents or review ledgers. They are applied
to the docs pages, and only to the pages: every other surface is built from them.

**Who applies them:** OWNER TO FILL BEFORE HANDOVER (role, name, hours a week).

**Migration deadline:** OWNER TO FILL BEFORE HANDOVER (date, owner). If class 3 of the migration has not merged by then, no further class migrates and both kinds of atom stay as they are.

## Steps

1. For each correction, find the page and the section. Search the site, or run
   `grep -rn "<phrase from the correction>" site/docs`.
2. Edit the visible text of that section on the page.
3. If the section has an `<AgentOnly>` block in the page file, read it. These
   notes are hidden on the site and NHA does not review them, so you are the
   only person who will. If the correction makes any sentence in a note untrue,
   fix that sentence too. To see the notes on the site, use "Show notes for AI
   agents" at the very bottom of any page, or add `?agent-notes=1` to the URL.
4. Never rename a heading id: the `{#...}` after a heading, written
   `{/* #... */}` in an `.mdx` page. Reword the heading text freely.
5. Run:

   ```bash
   npm run build:sections && npm run check:sections && npm run lint:content
   ```

6. Open a pull request. CI names anything the edit broke and how to fix it.

## If a check fails

- "heading id ... is missing": you removed or renamed a `{#...}` or
  `{/* #... */}`. Put it back,
  or move the atom in `catalogue/map.yaml` to the section that now holds its words.
- "agent note introduces `...`": a note states an API detail the page and the
  specifications do not. Put it on the page, or take it out of the note.

## Where things stand

Content moves onto pages one class at a time. Whatever has moved is edited on
the page; whatever has not still lives in its `catalogue/` file.
`catalogue/registry.json` lists every atom and where its words are. If migration
stops, both kinds keep working.
