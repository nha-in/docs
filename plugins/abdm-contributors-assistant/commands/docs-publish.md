---
description: Generate navigation, preview and publish the Scalar documentation site for the ABDM Catalogue.
argument-hint: '[--preview|--nav-only|--check]'
---

Publish the ABDM docs site. Load the `scalar-docs` skill and follow the procedure below. Mode: `$ARGUMENTS`. Default to `--preview` unless the user explicitly asked to publish live, and confirm before any live publish.

## Usage

```
/docs-publish --preview        # preview deployment, the default for a pull request
/docs-publish                  # publish to the live site, main only
/docs-publish --nav-only       # run scripts/build-nav.mjs and stop
/docs-publish --check          # verify what would publish without publishing
```

## Sequence

1. Generate navigation with `scripts/build-nav.mjs`, which walks the folder tree under `site/docs` and the `_platform.json` beside each platform's version folders. It does not read atom frontmatter, so nothing here groups by gateway, milestone or type
2. Check the rendered page carries its own phase and verification wording. Depth labels in the sidebar and verification banners for `unverified` and `stale` atoms were both designed and neither is built. Nothing under `site/src` renders one, so a page that needs the warning has to say it in its own body
3. Build, then preview or publish. `site/docusaurus.config.ts` reads `catalogue/VERSION` and stamps it into the footer copyright as part of the build

Steps 1 and 3 run for you: `site`'s `prebuild` and `prestart` call `sync-specs.mjs`, `build-api-reference.mjs`, `build-nav.mjs` and `build-skills.mjs` in that order. Step 2 is review, not a script.

## Preconditions

Publishing to live requires: lint passing, skills compiling and validating, and being on main. A preview deployment requires only that the build succeeds, which is the point of previews.

## Reviewing a preview

Read the rendered page, not the diff. Dummy-proofness is a property of rendered output: whether the page says what is unverified in words a skimming reader will see, whether a diagram makes the sequence obvious. No banner or depth label appears for you, so this is the only place either gets caught.

## Never hand-edit navigation

There is no `scalar.config.json` in this repository. Navigation is Docusaurus sidebars plus `site/src/data/platforms.json` and `reference-links.json`, all build outputs of `scripts/build-nav.mjs`. If a page is grouped wrongly, it is in the wrong folder: move the file. Editing a generated data file is the same class of mistake as editing a compiled skill.
