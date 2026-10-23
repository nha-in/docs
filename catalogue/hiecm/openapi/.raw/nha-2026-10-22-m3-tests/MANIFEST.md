# NHA raw set nha-2026-10-22-m3-tests

The M3 functional test case set, Building HIU, revised by NHA on 21 October 2026 and sent on 22 October 2026 with NHA's request for a test skill that runs the cases and writes its results into the sheet. It replaces `nha-2026-10-01-m3-tests` as the source of `site/docs/hiecm/v3/resources/test-cases/m3.mdx`, written by `scripts/build-test-cases.py`. `skills-src/hiecm-m3-test/SKILL.md` still walks the 1 October set until it is updated to this one.

One tab, Building HIU, 16 cases. Columns S.No, Function, Applicable To, Mandatory/Optional, Test Case ID, Functionality, Test Case, Steps, Expected Result, Suggestions for the Functional Tester, Response of Request with Code, Status(PASS/FAIL), Iterations, Remark, APIs. The four result columns are empty; NHA asked for them to be filled by the test run. It carries no personal data; its two images are the NHA and ABDM logos.

Against the 1 October set: `HIU_FLOW_101` is gone, `HIU_FLOW_114` (invoice) is new, the fetch cases are mandatory for private integrators rather than any one of them, and `HIU_FLOW_301` is now a request the patient never answers expiring, not a granted consent expiring.

What the sheet says that the page renders as written, kept here:

- `HIU_FLOW_107` to `114` have no Functionality. Each names its HI type in the Test Case column, diagnostic report to invoice, and `114` is the invoice. The page titles each by its id.
- The groups are numbered 1, 3, 3, 4, 5: Consent Request Denied and Consent Request Granted are both 3.
- `HIU_FLOW_107` to `114` are marked Mandatory for private.

Every file NHA supplied, with the sha256 of the bytes committed here.

| File | sha256 committed | sha256 original | Redactions |
| --- | --- | --- | --- |
| `M3_BUILDING_HIU_TEST_CASES.xlsx`, sent as `M3_Building_HIU_Test_Cases.xlsx` | `e19fe4740f82910832b4d00a5fc276ebf4f9707aadf0807cb583f028291a0a2d` | `e19fe4740f82910832b4d00a5fc276ebf4f9707aadf0807cb583f028291a0a2d` | none |
