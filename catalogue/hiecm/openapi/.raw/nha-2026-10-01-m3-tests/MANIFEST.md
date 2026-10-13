# NHA raw set nha-2026-10-01-m3-tests

The M3 functional test case set, Building HIU, updated August 2022, as supplied on 1 October 2026. One sheet, 16 rows carrying a test case id, columns S.No, Function, Applicable To, Mandatory/Optional, Test Case ID, Functionality, Test Case, Steps, Expected Result, Suggestions, V2 APIs, V3 APIs, Actual Result, Status, Remarks. The page and the skill read the V3 APIs column. It carries no personal data. It is the source of `site/docs/hiecm/v3/resources/test-cases/m3.mdx` and `skills-src/hiecm-m3-test/SKILL.md`.

What the sheet says that the page or the skill could not use as written, kept here rather than in either:

- The V3 APIs cell and the "Any one of them is mandatory" marking are merged across the fetch cases. The page gives each case the merged value.
- The S.No of `HIU_FLOW_110` reads 1.1, which is 1.10 stored as a number. Its steps in `HIU_FLOW_301` are numbered 1, 2, 3, 3.
- The tester note on `HIU_FLOW_103` describes v0.5 calls (`patients`, consent request list) that v3 does not have. The M3 specification has no patient lookup, so `HIU_FLOW_101` is checked on screen.
- `HIU_FLOW_102` says seven health information types. The specification's `hiTypes` has eight, including `Invoice`. "CosultingNote" is `OPConsultation`, and "Health Record" is `HealthDocumentRecord`.
- `HIU_FLOW_201`, `202` and `301` read "No API" in both API columns.
- Typos kept as written: "DiagnostocReport", "dispclay", "recieved", "inititated", and the repeated "patient patient PHR app".

Every file NHA supplied, with the sha256 of the bytes committed here. Each row records the sha256 of the original bytes so a reissued file can be matched.

| File | sha256 committed | sha256 original | Redactions |
| --- | --- | --- | --- |
| `M3_BUILDING_HIU_APIS_UPDATED_AUG_22.xlsx` | `9e64025851e615d18ab10d59b89596c8ba0f97c5f2fbdca334600484471d6682` | `9e64025851e615d18ab10d59b89596c8ba0f97c5f2fbdca334600484471d6682` | none |
