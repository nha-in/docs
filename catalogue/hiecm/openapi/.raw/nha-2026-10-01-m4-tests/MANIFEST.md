# NHA raw set nha-2026-10-01-m4-tests

The M4 functional test case sets, as supplied on 1 October 2026. The HFR sheet, dated 16 March 2024, has four tabs: Search facility, Registration, Facility update and Bridge linkage, with an APIs column of Swagger links on the sandbox facility host. The HPR sheet, Test Cases Final, has one tab with an APIs column of sandbox HPR paths. Together they hold 189 rows carrying a test case id. Neither carries personal data; the two example addresses in the HPR sheet are masked. It is the source of `site/docs/hiecm/v3/resources/test-cases/m4.mdx` and `skills-src/hiecm-m4-test/SKILL.md`.

What the sheet says that the page or the skill could not use as written, kept here rather than in either:

- `HFR-118` to `HFR-123` appear in two Bridge linkage blocks. The second adds the checks that a bridge id and an HIP name are not repeated. The page gives the second occurrence its own anchor.
- The Landline cases (`HFR-023`, `HFR-077`) carry the 10 digit mobile rule, and the Mobile cases (`HFR-024`, `HFR-078`) carry the landline rule. The skill applies the rule that fits each field.
- `HFR-054` and `HFR-108` name `countHDUBedsWithFunctionalVentilators`, which the M4 specification does not have. The skill records them not run.
- `HFR-048`, `HFR-102`, `HFR-063` and `HFR-117` read "no API", though their fields are in the detailed information and submit requests.
- The HFR APIs column holds Swagger page links on the sandbox facility host. The page shows each by its operation name.
- The HPR sheet names `/api/v1/registration/aadhaar/...` and `generateOtp`. The M4 specification has `/v2/registration/aadhaar/...` and no `generateOtp`, so the skill maps those cases to the hosted Aadhaar page. It names `update-professional` where the specification has `update-professional-new`.
- Many HPR field rows read "Use Master Data Sheet (Excel)" in the APIs column. `HPR-003` refers to "cell no -M5".
- The HPR ids have gaps, starting at `HPR-002`.

Every file NHA supplied, with the sha256 of the bytes committed here. Each row records the sha256 of the original bytes so a reissued file can be matched.

| File | sha256 committed | sha256 original | Redactions |
| --- | --- | --- | --- |
| `HFR_M4_MAR_16_2024.xlsx` | `08073c49d97b0550078995d8ab3b4f5f1ce7f28f6deb6ce6109a34fc0efd474e` | `08073c49d97b0550078995d8ab3b4f5f1ce7f28f6deb6ce6109a34fc0efd474e` | none |
| `HPR_TEST_CASES_FINAL.xlsx` | `257abae73f4c07d5d5145047fa34f63a792783de52dedfc8dd3f5892c52a4eea` | `257abae73f4c07d5d5145047fa34f63a792783de52dedfc8dd3f5892c52a4eea` | none |
