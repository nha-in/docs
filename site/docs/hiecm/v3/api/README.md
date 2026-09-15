# API references

Module guide pages live here, one folder per module. The endpoint pages, each
module's `_category_.json` and everything under `endpoints/` are generated
from `catalogue/openapi/hiecm/v3/` on every build; never edit them by hand.

The Mandatory and Conditional badges on endpoint pages come from
`x-abdm-requirement`, which `scripts/build-requirements.mjs` joins from the
certification sheets. Only the calls a case names carry one, so a page with no
badge is a call no sheet names, not a call anyone has called optional. The
reader-facing wording of that is on the generated `index.md` for this section.

Hand-written pages for a module (overview `index.md`, `user-journey`, `apis`,
`sequence`) sit in the module's folder next to the generated content and are
ordered by `sidebar_position` (10, 20, 30; generated errors pages use 98).

