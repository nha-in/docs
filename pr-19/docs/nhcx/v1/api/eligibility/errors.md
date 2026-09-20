# Coverage eligibility errors

A Coverage eligibility code arrives sealed inside the callback, not in the response to your call. These are the codes the Catalogue records on this module's paths.

## Codes

| Code        | What it means                                                                                       | Arrives on                                                          |
| ----------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `PAYR-1001` | The recipient could not decrypt your request                                                        | `/v1/coverageeligibility/on_check`                                  |
| `PAYR-1002` | The payer could not encrypt its answer to you                                                       | `/v1/coverageeligibility/on_check`                                  |
| `PAYR-1004` | Your facility is not registered with the payer for the policy, or the FHIR bundle is malformed      | `/v1/coverageeligibility/check`, `/v1/coverageeligibility/on_check` |
| `PAYR-1005` | The beneficiary is not a covered member of the policy, or the request is more than 24 hours old     | `/v1/coverageeligibility/check`, `/v1/coverageeligibility/on_check` |
| `PAYR-1006` | The policy does not exist, or a name in the request is not valid                                    | `/v1/coverageeligibility/check`, `/v1/coverageeligibility/on_check` |
| `PAYR-1007` | The policy has expired, or the gender in the request is not valid                                   | `/v1/coverageeligibility/check`, `/v1/coverageeligibility/on_check` |
| `PAYR-1014` | The date of birth is after the date of service, or the provider Organization identifier has no type | `/v1/coverageeligibility/check`, `/v1/coverageeligibility/on_check` |
| `PAYR-1029` | The bundle id is invalid                                                                            | `/v1/coverageeligibility/check`, `/v1/coverageeligibility/on_check` |
| `PAYR-1031` | A bundle entry has an invalid URL                                                                   | `/v1/coverageeligibility/check`, `/v1/coverageeligibility/on_check` |
| `PAYR-1032` | The eligibility check has an invalid purpose                                                        | `/v1/coverageeligibility/check`, `/v1/coverageeligibility/on_check` |
| `PAYR-1033` | The eligibility check has no items for its purpose                                                  | `/v1/coverageeligibility/check`, `/v1/coverageeligibility/on_check` |
| `PAYR-1035` | The policy code is invalid                                                                          | `/v1/coverageeligibility/check`, `/v1/coverageeligibility/on_check` |
| `PAYR-1040` | A reference points at a resource that is not in the bundle                                          | `/v1/coverageeligibility/check`, `/v1/coverageeligibility/on_check` |
| `PAYR-1043` | A date is in the wrong format                                                                       | `/v1/coverageeligibility/check`, `/v1/coverageeligibility/on_check` |
| `PAYR-1044` | A date and time is in the wrong format                                                              | `/v1/coverageeligibility/check`, `/v1/coverageeligibility/on_check` |
| `PAYR-1049` | The payer cannot accept the bundle                                                                  | `/v1/coverageeligibility/check`, `/v1/coverageeligibility/on_check` |
| `PAYR-1090` | The coverage has no identifier                                                                      | `/v1/coverageeligibility/check`, `/v1/coverageeligibility/on_check` |
| `PAYR-1091` | The coverage identifier has no type                                                                 | `/v1/coverageeligibility/check`, `/v1/coverageeligibility/on_check` |
| `PAYR-1092` | The payer failed while processing your request                                                      | `/v1/coverageeligibility/check`, `/v1/coverageeligibility/on_check` |
| `PAYR-1097` | The request arrived with no encrypted payload                                                       | `/v1/coverageeligibility/check`, `/v1/coverageeligibility/on_check` |
| `PAYR-1101` | The eligibility purpose is not valid                                                                | `/v1/coverageeligibility/check`, `/v1/coverageeligibility/on_check` |
| `PAYR-1102` | The id you searched with is not valid                                                               | `/v1/coverageeligibility/check`, `/v1/coverageeligibility/on_check` |
| `PAYR-1103` | The care plan id is not valid                                                                       | `/v1/coverageeligibility/check`, `/v1/coverageeligibility/on_check` |
| `PAYR-1104` | More than one beneficiary record matches                                                            | `/v1/coverageeligibility/check`, `/v1/coverageeligibility/on_check` |
| `PAYR-1105` | The payer has no configuration for your hospital                                                    | `/v1/coverageeligibility/check`, `/v1/coverageeligibility/on_check` |
| `PAYR-1106` | The payer has no details for a requested procedure                                                  | `/v1/coverageeligibility/check`, `/v1/coverageeligibility/on_check` |
| `PAYR-1107` | The check carries no billable item                                                                  | `/v1/coverageeligibility/check`, `/v1/coverageeligibility/on_check` |
| `PAYR-1108` | The payer has no details for the requested stratification                                           | `/v1/coverageeligibility/check`, `/v1/coverageeligibility/on_check` |
| `PAYR-1109` | The payer has no details for a requested investigation                                              | `/v1/coverageeligibility/check`, `/v1/coverageeligibility/on_check` |
| `PAYR-1110` | The payer has no details for a requested implant                                                    | `/v1/coverageeligibility/check`, `/v1/coverageeligibility/on_check` |
| `PAYR-1111` | A payer rule rejected the request                                                                   | `/v1/coverageeligibility/check`, `/v1/coverageeligibility/on_check` |
| `PAYR-1112` | The payer id is not valid                                                                           | `/v1/coverageeligibility/check`, `/v1/coverageeligibility/on_check` |
| `PAYR-1113` | An item code is not valid                                                                           | `/v1/coverageeligibility/check`, `/v1/coverageeligibility/on_check` |
| `PAYR-1114` | An item's speciality code is not valid                                                              | `/v1/coverageeligibility/check`, `/v1/coverageeligibility/on_check` |
| `PAYR-1115` | An item's quantity is not valid                                                                     | `/v1/coverageeligibility/check`, `/v1/coverageeligibility/on_check` |
| `PAYR-1116` | Your hospital is not authorised under the policy                                                    | `/v1/coverageeligibility/check`, `/v1/coverageeligibility/on_check` |
| `PAYR-1117` | The payer has no details for the policy                                                             | `/v1/coverageeligibility/check`, `/v1/coverageeligibility/on_check` |
| `PAYR-1118` | The payer has no details for the requested items                                                    | `/v1/coverageeligibility/check`, `/v1/coverageeligibility/on_check` |
| `PAYR-1119` | The payer received no details for the payer id from the exchange                                    | `/v1/coverageeligibility/check`, `/v1/coverageeligibility/on_check` |
| `PAYR-1120` | The reference id has been used before                                                               | `/v1/coverageeligibility/check`, `/v1/coverageeligibility/on_check` |
| `PAYR-1121` | The policy is not found for this beneficiary                                                        | `/v1/coverageeligibility/check`, `/v1/coverageeligibility/on_check` |
| `PAYR-1122` | The beneficiary has no policy with the payer                                                        | `/v1/coverageeligibility/check`, `/v1/coverageeligibility/on_check` |
| `PAYR-1123` | The beneficiary is not covered by this payer                                                        | `/v1/coverageeligibility/check`, `/v1/coverageeligibility/on_check` |
| `PAYR-1512` | A patient reference does not lead to a Patient resource                                             | `/v1/coverageeligibility/check`, `/v1/coverageeligibility/on_check` |
| `PAYR-1513` | A diagnosis is not sent as a coded concept                                                          | `/v1/coverageeligibility/check`, `/v1/coverageeligibility/on_check` |
| `PAYR-1515` | An organisation in your bundle has no name                                                          | `/v1/coverageeligibility/check`, `/v1/coverageeligibility/on_check` |

Every code above is recorded in the Catalogue. The aggregated list across modules is at [error codes](/docs/pr-19/docs/nhcx/v1/reference/error-codes).

[Next Still stuck? Ask for help Where to file what you hit, so the answer lands back in these pages.](/docs/pr-19/docs/support)
