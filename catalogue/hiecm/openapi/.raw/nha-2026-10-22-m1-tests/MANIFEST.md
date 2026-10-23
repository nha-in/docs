# NHA raw set nha-2026-10-22-m1-tests

The M1 functional test case set, ABHA creation, verification, scan and share, revised by NHA on 21 October 2026 and sent on 22 October 2026 with NHA's request for a test skill that runs the cases and writes its results into the sheet. It replaces `nha-2026-09-29-m1-tests` as the source of `site/docs/hiecm/v3/resources/test-cases/m1.mdx`, written by `scripts/build-test-cases.py`. `skills-src/hiecm-m1-test/SKILL.md` still walks the 29 September set until it is updated to this one.

One tab, ABHA CREATION AND VERIFICATION, 99 rows carrying a test case id. Columns S.No, Function, Applicable To, Mandatory/Optional, Test Case ID, Functionality, Test Case, Steps, Expected Result, Suggestions for the Functional Tester, Response of Request with Code, Status(PASS/FAIL), Iterations, Remarks, APIs. The four result columns are empty; NHA asked for them to be filled by the test run. It carries no personal data; its two images are the NHA and ABDM logos.

Against the 29 September set:

- New: ABHA creation by face authentication (`CRT_ABHA_101_FA` to `117_FA`), login by face authentication (`VRFY_ABHA_301_FA` to `305_FA`), `CRT_ABHA_116` returning patient, `CRT_ABHA_211`, `VRFY_ABHA_306`, and verification regrouped as login by ABHA number, ABHA address, mobile and Aadhaar.
- Gone: `PROF_ABHA_602` to `605` (including delete, deactivate and reactivate) and `VRFY_ABHA_502`.
- Creation by document reads Driving License only; the earlier set read Driving License / PAN.

What the sheet says that the page renders as written, kept here:

- `SHARE _PATIENT_PROFILE_701` and `702` carry a space in the id. The page anchors them without it.
- `CRT_ABHA_115` and `CRT_ABHA_309` are marked "Either of the test cases ... is mandatory for Government", paired with `114` and `308`.

Every file NHA supplied, with the sha256 of the bytes committed here.

| File | sha256 committed | sha256 original | Redactions |
| --- | --- | --- | --- |
| `M1_ABHA_CREATION_VERIFICATION_SCAN_AND_SHARE.xlsx`, sent as `M1_ABHA Creation_Verification_Scan__share.xlsx` | `4e88209c90761a1b9424f857426559b2541f2d3dc6a1e8004cb654b93bbbacab` | `4e88209c90761a1b9424f857426559b2541f2d3dc6a1e8004cb654b93bbbacab` | none |
