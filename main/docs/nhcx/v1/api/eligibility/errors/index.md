# Coverage eligibility errors

Codes any exchange call can meet are recorded once, in the [Other](/docs/main/docs/nhcx/v1/api/other) specification: the gateway's NHCX- codes, the standard payer codes, and the reference payer's structure and transport codes. The reference payer's other codes sit with the exchange they reject: coverage eligibility, preauthorisation, claim and insurance plan. [Reading error codes](/docs/main/docs/nhcx/v1/reference/error-code-guide) explains the code spaces.

## Reference Payer codes

Reference payer codes, PAYR-1001 to PAYR-1520. Sent by the PMJAY reference implementation; they arrive inside the sealed response.

| Code        | Message                                                                                                                                                                                   | What to do |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| `PAYR-1101` | Invalid purpose received as (%s) for beneficiary id (%s) from hospital id (%s). Hence no result will be returned. Please try again with a valid purpose.                                  |            |
| `PAYR-1102` | Invalid search parameter requested. Please try again with a valid id.                                                                                                                     |            |
| `PAYR-1103` | Invalid careplan id received. Please try again with valid careplan id.                                                                                                                    |            |
| `PAYR-1104` | Multiple records found for the beneficiary. Hence request will not be processed further.                                                                                                  |            |
| `PAYR-1105` | Hospital configuration not found. Please contact support team.                                                                                                                            |            |
| `PAYR-1106` | No details found for the requested procedures in the system.                                                                                                                              |            |
| `PAYR-1107` | No billable item received. Please try again with valid item data.                                                                                                                         |            |
| `PAYR-1108` | No details found for the requested stratification in the system.                                                                                                                          |            |
| `PAYR-1109` | No details found for the requested investigations in the system.                                                                                                                          |            |
| `PAYR-1110` | No details found for the requested implants in the system.                                                                                                                                |            |
| `PAYR-1111` | Rule failure.                                                                                                                                                                             |            |
| `PAYR-1112` | Invalid payer id received. Please try again ith valid payer details                                                                                                                       |            |
| `PAYR-1113` | Invalid item code received as %s. Please try again with valid data                                                                                                                        |            |
| `PAYR-1114` | Invalid speciality code received as %s for item %s. Please try again with valid data. Speciality code is available as the code of the category for specific cost of plan in isurance plan |            |
| `PAYR-1115` | Invalid procedure quantity received as %s for item %s. Please try again with valid data. Item quantity should be greater than 1                                                           |            |
| `PAYR-1116` | Hospital is not authorized to raise any case under policy %s. Hence request will not be processed further. Please connect with the support team to get the required authorization         |            |
| `PAYR-1117` | No policy details found for %s. Hence request will not be processed further                                                                                                               |            |
| `PAYR-1118` | No details found for requested items. Hence request will not be processed further                                                                                                         |            |
| `PAYR-1119` | No payer details received for payer id %s from HCX. Please try again with valid payer details.                                                                                            |            |
| `PAYR-1120` | Duplicate reference id found as %s. Please try again with valid reference details.                                                                                                        |            |
| `PAYR-1121` | No policy details found for %s for beneficiary %s. Hence request will not be processed further.                                                                                           |            |
| `PAYR-1122` | No policy details found for beneficiary %s. Hence request will not be processed further.                                                                                                  |            |
| `PAYR-1123` | Beneficiary is not a covered member for requested payer. Please enroll beneficiary for applicable policy of requested payer and try again.                                                |            |

Every code above is recorded in the specification that owns it. The aggregated list across modules is at [error codes](/docs/main/docs/nhcx/v1/reference/error-codes).

[Next Still stuck? Ask for help Where to file what you hit, so the answer lands back in these pages.](/docs/main/docs/support)
