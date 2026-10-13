# NHA raw set nha-2026-10-01-m2-tests

The M2 functional test case set, Building HIP, updated August 2022, as supplied on 1 October 2026. One sheet, 36 rows carrying a test case id, columns S. No, Function, Applicable To, Mandatory/Optional, Test Case ID, Functionality, Test Case, Steps, Expected Result, v0.5 APIs, V3 APIs, Actual Result, Status, Remarks. The page and the skill read the V3 APIs column. It carries no personal data; its one image is the NHA logo. It is the source of `site/docs/hiecm/v3/resources/test-cases/m2.mdx` and `skills-src/hiecm-m2-test/SKILL.md`.

What the sheet says that the page or the skill could not use as written, kept here rather than in either:

- `Health_RECORD_CREATION_101` is mixed case, and `HIP_INIT_GRANT_CONSENT_` ends in an underscore. Both are kept as written.
- The section numbers run 1, 2, 3, 4, 4.6, 4.8, 4.1, 8, 6, 7, 8. "Exprire" is the sheet's spelling.
- The HIP initiated linking groups by mobile OTP, Aadhaar OTP and Direct Auth (`HIP_INTI_LINK_201` to `206`, `301` to `306`, `401` to `405`) read "No APIs" in the V3 column. The M2 specification publishes no operation for them, so the skill records them not run.
- The grant, revoke and expire consent cases are marked mandatory only with Direct Auth. The skill runs them with `HIP_INIT_SHARE_CARECONTEXT`, which depends on the stored consent.
- `USER_INIT_LINK_601` has no marking, and its V3 cell lists calls that belong to 603 to 605.
- `HIP_INTI_LINK_501` lists demographic fields the v3 `generate-token` body does not carry, and calls that belong to other cases.
- `HIP_INIT_SHARE_CARECONTEXT` says records are decrypted with the HIP public key. The receiver decrypts with its own private key and the HIP's public key. Its V3 cell names "Data Push URL" with no path.

Every file NHA supplied, with the sha256 of the bytes committed here. Each row records the sha256 of the original bytes so a reissued file can be matched.

| File | sha256 committed | sha256 original | Redactions |
| --- | --- | --- | --- |
| `M2_BUILDING_HIP_WITH_APIS_UPDATED_AUG_22.xlsx` | `07744bcae16f4f717157bec9d9988a7aa3e49ab6561c6fddfc2a4d9b2aaa1abd` | `07744bcae16f4f717157bec9d9988a7aa3e49ab6561c6fddfc2a4d9b2aaa1abd` | none |
