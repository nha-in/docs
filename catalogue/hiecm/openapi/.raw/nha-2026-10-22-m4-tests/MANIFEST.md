# NHA raw set nha-2026-10-22-m4-tests

The M4 functional test case sets, HFR and HPR, sent by NHA on 22 October 2026 with its request for a test skill that runs the cases and writes its results into the sheet. They are the same files the sandbox site's Test Cases page publishes (https://sandbox.abdm.gov.in/sandbox/v3/new-documentation?doc=TestCases), dated March 2024. They replace `nha-2026-10-02-m4-tests` as the source of `site/docs/hiecm/v3/resources/test-cases/m4.mdx`, written by `scripts/build-test-cases.py`, and of `skills-src/hiecm-m4-test/SKILL.md`, because they are the latest NHA gave.

Against the 2 October copies, the case ids and wording are the same except:

- HFR-027 and HFR-028, the facility building and board photographs, are Optional here and were Mandatory.
- HPR-060, name different in certificate, is Non-Mandatory here and was Mandatory.
- HPR-062, name of degree or diploma, is Mandatory here and was Non-Mandatory.
- HPR-076 reads "If Govt/Both so facility decalartion is mandatory", where the 2 October copy read "facility decalartion is mandatory".

What the sheets say that the page renders as written is as recorded for `nha-2026-10-02-m4-tests`: the repeated Bridge linkage ids (`HFR-118#2` to `HFR-123#2` in the workbook writer), the HPR row with no case id, and the swagger operation names in the HFR APIs column. Neither carries personal data; the only identifier is the placeholder `XXXXXXXXXXXX@hpr.abdm`.

| File | sha256 committed | sha256 original | Redactions |
| --- | --- | --- | --- |
| `HFR_Test_Cases.xlsx`, sent as `HFR_m4_16_mar_2024_674c27b80d_1_3f95f6ef40.xlsx` | `08073c49d97b0550078995d8ab3b4f5f1ce7f28f6deb6ce6109a34fc0efd474e` | `08073c49d97b0550078995d8ab3b4f5f1ce7f28f6deb6ce6109a34fc0efd474e` | none |
| `HPR_Test_Cases.xlsx`, sent as `HPR_Test_Cases_Final_13910227c8_2_4249f98bec.xlsx` | `257abae73f4c07d5d5145047fa34f63a792783de52dedfc8dd3f5892c52a4eea` | `257abae73f4c07d5d5145047fa34f63a792783de52dedfc8dd3f5892c52a4eea` | none |
