# NHA raw set nha-2026-10-01-phr-tests

The PHR mobile application functional test case set, as supplied on 1 October 2026. Four tabs: ABHA address creation, PHR App Functionality, Building HIU Service for PHR and Locker, read as P1 to P4. Columns S. No, Test Title, Test Scenario, Optional / Mandatory, Test Summary / Steps, Expected Result. The sheet gives its rows no case ids and names no APIs, so a case is named by its milestone and row number, such as `P1 1.1`: 200 rows in all. It carries no personal data; the one Aadhaar-like number is the example `1234 5678 9012`. It is the source of `site/docs/hiecm/v3/resources/test-cases/phr.mdx` and `skills-src/hiecm-p1-test/` to `hiecm-p4-test/`.

What the sheet says that the page or the skill could not use as written, kept here rather than in either:

- Row numbers typed as 2.10 or 1.10 are stored as 2.1 and 1.1. The page puts the zero back from the order of the rows.
- A row number merged down several rows marks one case that runs over them, not several cases.
- The P1 3.x group, creating an ABHA number, belongs to M1. The P1 skill points each case at its `CRT_ABHA` counterpart.
- P1 1.10 gives a minimum address length of 8, where P1 2.10 and 3.14 give 4. P1 2.13 uses `@abdm` where sandbox addresses use `@sbx`.
- P1 9.3's step is about terms and conditions, but its check and result describe a resend. P1 3.8 and 3.16 are duplicates.
- Several rows carry a note or a field list in the marking column, or no marking at all.
- P2 13 and 14 repeat P3 1.1.5 and 1.2.3, and appear again as P4 8 and 9.
- P2 5.2.9 and 19.4 name commercial PHR apps.
- P3 1.4.2 says approved where it means denied. P3 1.1.4 gives a two hour window that no specification states.
- P4 has a heading 3.5 with no case under it, and two unnumbered heading rows between P4 10.2 and 10.3.
- P4 5.1.2 says the person approves a locker's subscription, where a locker subscription is approved automatically. The skill records which happened.

Every file NHA supplied, with the sha256 of the bytes committed here. Each row records the sha256 of the original bytes so a reissued file can be matched.

| File | sha256 committed | sha256 original | Redactions |
| --- | --- | --- | --- |
| `PHR_MOBILE_APP_TEST_CASES.xlsx` | `a8fb8ae05a0d4be70122cb4d9f417ab7461c05a50eb0865e5acb7fae01694750` | `a8fb8ae05a0d4be70122cb4d9f417ab7461c05a50eb0865e5acb7fae01694750` | none |
