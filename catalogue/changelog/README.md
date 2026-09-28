# The changelog's record

What's New is computed, not written:

    entries = rules(facts(now) - facts(last published))

- `facts/` is the last published snapshot of everything a reader can act on:
  one file per module (its operations' contracts, its upstream files and
  their hashes, its roles, its error codes) and `_site.json` for the skills,
  plugins, Docs MCP tools, and what pages declare. `npm run changelog` diffs
  the working tree against it and then moves it. `npm run check:changelog`
  fails in CI when it is behind.
- `entries/<date>.json` is the durable record: the entries the rules produced
  that day, with the facts behind each one. The pages under
  `site/docs/whats-new/` are rendered from these files and carry
  `generated: true`. A person may still edit an entries file, to drop an
  entry a revert made moot or merge two; the rendered words always come from
  the templates in `scripts/lib/changelog-render.mjs`.

What earns an entry, and what never does, is the `changelog` skill of the
contributors' assistant. Two facts a person declares in a page's frontmatter
reach the changelog by the same diff: `page_type: procedure` for a procedure
documented for the first time, and `corrections:` with `was` and `now` for a
wrong fact in prose.
