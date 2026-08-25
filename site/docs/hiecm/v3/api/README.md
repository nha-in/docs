# API references

Module guide pages live here, one folder per module. The endpoint pages, each
module's `_category_.json` and everything under `endpoints/` are generated
from `catalogue/openapi/hiecm/v3/` on every build; never edit them by hand.

Hand-written pages for a module (overview `index.md`, `user-journey`, `apis`,
`sequence`) sit in the module's folder next to the generated content and are
ordered by `sidebar_position` (10, 20, 30; generated errors pages use 98).

