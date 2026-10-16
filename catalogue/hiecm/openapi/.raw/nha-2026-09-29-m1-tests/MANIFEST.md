# NHA raw set nha-2026-09-29-m1-tests

The M1 functional test case set, ABHA creation and verification, version 1.1, as published on the sandbox content store at https://sandboxcms.abdm.gov.in/uploads/M1_ABHA_CREATION_AND_VERIFICATION_WITH_APIS_UPDATED_V1_1_f656c93440.xlsx and fetched on 29 September 2026. One sheet, 66 rows carrying a test case id, columns S.No, Function, Applicable To, Mandatory/Optional, Test Case ID, Functionality, Test Case, Steps, Expected Result, Suggestions, Status, Remark, V3 APIs. It carries no personal data. It is the source of `skills-src/hiecm-m1-test/SKILL.md`.

What the sheet says that the skill could not use as written, kept here rather than in the skill:

- `VRFY_ABHA_501` is the id of two rows, biometric verification (9.1) and reading the QR code (10.1). The skill records the QR row as `QR-read`.
- `VRFY_ABHA _301` to `_305` carry a space in the id. The skill writes them without it.
- Row 4.1 (CRT_ABHA_401) reads "using Aadhaar Biometrics" in its expected result and names `v3enrollment/auth/byAbdm` without a slash. The M1 specification publishes no enrolment by document operation, so the skill records the group not run.
- PROF_ABHA_605 names delete, deactivate and reactivate calls at `profile/account/request/otp` and `verify`. The M1 specification publishes no delete or deactivate operation.
- CRT_ABHA_110 and 111 do not exist; the numbering runs 109 then 112. Row 1.1 and row 1.10 share the S.No 1.1 in the sheet.
- The Session API row names `https://dev.abdm.gov.in/api/hiecm/gateway/v3/sessions`.

Every file NHA supplied, with the sha256 of the bytes committed here. Every one of them is redacted by the same rules, because sandbox tokens, mobile numbers, ABHA numbers and addresses, HPR identifiers, photographs and internal hostnames turned up across the set rather than in a few files. Each row records the sha256 of the original bytes so a reissued file can be matched, and the originals are held outside git.

| File | sha256 committed | sha256 original | Redactions |
| --- | --- | --- | --- |
| `M1_ABHA_CREATION_AND_VERIFICATION_WITH_APIS_UPDATED_V1_1.xlsx` | `eb181befcd5ab536048c6553774dae3ae6cbcbb6e96b4838b10bdd94e27201f6` | `eb181befcd5ab536048c6553774dae3ae6cbcbb6e96b4838b10bdd94e27201f6` | none |
