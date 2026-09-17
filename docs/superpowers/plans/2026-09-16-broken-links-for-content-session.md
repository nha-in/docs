# Links the final-set reset broke: closed

## What was broken

With `onBrokenLinks: 'throw'`, the build of 17 September 2026 reported 59 broken links on 17 source pages and no broken anchors. Once the links were fixed, 11 broken anchors on 8 pages showed up.

- The generated API index linked 30 callbacks to flat endpoint routes. No page exists at those routes because a journey names each callback.
- Milestone pages M1 to M4 and `resources/index.mdx` linked to the testing pages. `resources/testing/index.mdx` linked to four module pages that had already been deleted.
- `milestones/m1`, `registries/abha`, `registries/nhpr/{index,hpr,hfr}` and `milestones/m4` linked to `api/m1/apis` and `api/m4/undocumented`, both deleted.
- `milestones/m1`, `milestones/m2` and `troubleshooting/callback-never-arrives` linked to operation slugs from the retired specifications.
- `milestones/p1` to `p3` and their `ApiLinks` cards linked to `api/p1` to `api/p3`, which have no overview page, and to `api/p3/errors`, which does not exist.
- Two retired What's New entries linked to deleted pages.
- Glossary anchors `#emr`, `#hmis` and `#lmis` were raw `<span id>` elements, which the anchor check does not collect.

## What changed

- `scripts/build-api-reference.mjs`: an operation or callback that a journey names is routed to the first journey step naming it. The API index and `api-routes.json` follow that change.
- `ApiLinks` opens a module with no overview on its first endpoint page. It shows the errors card only when the module has an errors page.
- `LegacyAnchor` registers its id with the anchor check. The glossary headings use it in place of `<span id>`.
- Each broken link on a hand-written page now points at the page that holds the target: the journey step, the module overview or the Scalar reference. Otherwise the link and the sentence promising it came out. Operations were matched by method and path.
- `resources/testing/` is deleted, and so is every sentence pointing readers to testing pages or test cases in the milestone pages, `resources/index.mdx` and `build-with-ai.mdx`.
- The `x-abdm-requirement` paragraph in `api/README.md` and the proposed simplified flow sentence in `milestones/m1.mdx` are gone.
- The six What's New entries from `2026-08-24` to `2026-09-10` are gone. `2026-09-16.mdx` replaces them.
- `site/docusaurus.config.ts` sets `onBrokenLinks: 'throw'` with no environment override.

## Open for the content session

Nothing from the reset. The build passes with links set to throw and reports no broken anchors. Wording concerns that fall outside link repair are listed in `.superpowers/sdd/2026-09-17-reset-handovers/task-5-report.md`.
