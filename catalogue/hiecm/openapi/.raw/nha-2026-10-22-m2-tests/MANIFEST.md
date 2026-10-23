# NHA raw set nha-2026-10-22-m2-tests

The M2 functional test case set, Building HIP, revised by NHA on 21 October 2026 and sent on 22 October 2026 with NHA's request for a test skill that runs the cases and writes its results into the sheet. It replaces `nha-2026-10-01-m2-tests` as the source of `site/docs/hiecm/v3/resources/test-cases/m2.mdx`, written by `scripts/build-test-cases.py`. `skills-src/hiecm-m2-test/SKILL.md` still walks the 1 October set until it is updated to this one.

One tab, Building HIP, 13 cases. Columns S.No, Function, Applicable To, Mandatory/Optional, Test Case ID, Functionality, Test Case, Steps, Expected Result, Suggestions for the Functional Tester, Response of Request with Code, Status(PASS/FAIL), Iterations, Remark, APIs. The sheet has one APIs column, V3 only. The four result columns are empty; NHA asked for them to be filled by the test run. It carries no personal data; its two images are the NHA and ABDM logos.

Against the 1 October set:

- Gone: HIP initiated linking by mobile OTP, Aadhaar OTP and Direct Auth (`HIP_INTI_LINK_201` to `206`, `301` to `306`, `401` to `405`), the demographic authentication cases `501` to `503`, and the grant, revoke and expire consent groups. HIP initiated linking is now `504` to `506` only.
- Every case is marked Mandatory.

What the sheet says that the page renders as written, kept here:

- Group 1 has a banner row, Health Record Creation, then a numbered row naming only who it applies to, HIP. The generator takes the banner as the group's name.
- `Health_RECORD_CREATION_101` is mixed case, kept as written.

Every file NHA supplied, with the sha256 of the bytes committed here.

| File | sha256 committed | sha256 original | Redactions |
| --- | --- | --- | --- |
| `M2_BUILDING_HIP_TEST_CASES.xlsx`, sent as `M2_Building_HIP_Test_Cases.xlsx` | `e443643c7e36eab97b34721fade4462a68d5aa61a35eee3a3ce36b822bd956bb` | `e443643c7e36eab97b34721fade4462a68d5aa61a35eee3a3ce36b822bd956bb` | none |
