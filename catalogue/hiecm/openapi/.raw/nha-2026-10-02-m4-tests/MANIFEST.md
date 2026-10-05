# NHA raw set nha-2026-10-02-m4-tests

The M4 functional test case sets, sent with NHA's review of 2 October 2026 for the M4 test cases page. Two workbooks:

- `HFR_Test_Cases.xlsx`, sent as `HFR_Test Cases (2).xlsx`. Four tabs: Search facility (HFR-001 to HFR-009), Registration (HFR-010 to HFR-063), Facility update (HFR-064 to HFR-117) and Bridge linkage (HFR-118 to HFR-123, twice). Columns S.No, Function, Applicable To, Mandatory/Optional, Test Case ID, Functionality, Actual Name of data fields on HFR portal, Steps, Expected Result, APIs, Status, Remarks, Suggestions for the Functional Tester.
- `HPR_Test_Cases.xlsx`, sent as `HPR_Test_Cases (4).xlsx`. One tab, HPR-002 to HPR-080. Columns S.No, Function, Applicable To, Mandatory/Optional, Test Case ID, Feature, Functionality, Test Case, Steps, Expected Result, APIs, Status, Remarks, Suggestions for the Functional Tester.

Neither carries personal data: the only identifier is the placeholder `XXXXXXXXXXXX@hpr.abdm`. They are the source of `site/docs/hiecm/v3/resources/test-cases/m4.mdx`, written by `scripts/build-test-cases.py`.

What the sheets say that the page renders as written, kept here:

- The Bridge linkage tab lists HFR-118 to HFR-123 twice, once for the first bridge and once under "Second Bridge linkage". The page anchors the second set as `hfr-118-2` and on.
- One HPR row, "Aadhaar collection and Error Message", has no case id. The page shows it as "No id".
- The HFR tabs name most calls by their sandbox swagger operation, such as `v15FacilityBasicInformationUsingPOST`, rather than by path. The page links the fourteen that are one M4 operation by name and shows the rest as their operation name. `v15SearchFacilitiesFuzzyPost` is one of the rest.
- The HPR tab names `/api/v1/registration/aadhaar/generateOtp`, `createHprIdWithPreVerified` and `demographicAuthViaMobile` on `hpridsbx.abdm.gov.in`, and `/apis/v1/doctors/update-professional`. The M4 specification publishes the last three as `/v2/registration/aadhaar/...` and `update-professional-new`, and no `generateOtp`, so none of the four links.
- Markings are Yes and No, which the page shows as Mandatory and Optional, plus conditional ones such as "Yes (if facilityId not present)".
- "Fetch Professionals details" heads two groups, the first holding the HPR ID creation cases.

Every file NHA supplied, with the sha256 of the bytes committed here.

| File | sha256 committed | sha256 original | Redactions |
| --- | --- | --- | --- |
| `HFR_Test_Cases.xlsx` | `db2b1b6f59d85534d782bc92d4164413a0a550a8c9d82d652e8171208542f515` | `db2b1b6f59d85534d782bc92d4164413a0a550a8c9d82d652e8171208542f515` | none |
| `HPR_Test_Cases.xlsx` | `67b14c4226a5abb9844de1e23ba8e7441dc50a362fe3c69eeb57d1cef2a20daa` | `67b14c4226a5abb9844de1e23ba8e7441dc50a362fe3c69eeb57d1cef2a20daa` | none |
