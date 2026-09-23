# Coverage eligibility errors

A Coverage eligibility code arrives sealed inside the callback, not in the response to your call. These are the codes the Catalogue records on this module's paths.

## Codes

| Code        | What it means                                                                                       |
| ----------- | --------------------------------------------------------------------------------------------------- |
| `PAYR-1001` | The recipient could not decrypt your request                                                        |
| `PAYR-1002` | The payer could not encrypt its answer to you                                                       |
| `PAYR-1004` | Your facility is not registered with the payer for the policy, or the FHIR bundle is malformed      |
| `PAYR-1005` | The beneficiary is not a covered member of the policy, or the request is more than 24 hours old     |
| `PAYR-1006` | The policy does not exist, or a name in the request is not valid                                    |
| `PAYR-1007` | The policy has expired, or the gender in the request is not valid                                   |
| `PAYR-1014` | The date of birth is after the date of service, or the provider Organization identifier has no type |
| `PAYR-1029` | The bundle id is invalid                                                                            |
| `PAYR-1031` | A bundle entry has an invalid URL                                                                   |
| `PAYR-1032` | The eligibility check has an invalid purpose                                                        |
| `PAYR-1033` | The eligibility check has no items for its purpose                                                  |
| `PAYR-1035` | The policy code is invalid                                                                          |
| `PAYR-1040` | A reference points at a resource that is not in the bundle                                          |
| `PAYR-1043` | A date is in the wrong format                                                                       |
| `PAYR-1044` | A date and time is in the wrong format                                                              |
| `PAYR-1049` | The payer cannot accept the bundle                                                                  |
| `PAYR-1090` | The coverage has no identifier                                                                      |
| `PAYR-1091` | The coverage identifier has no type                                                                 |
| `PAYR-1092` | The payer failed while processing your request                                                      |
| `PAYR-1097` | The request arrived with no encrypted payload                                                       |
| `PAYR-1101` | The eligibility purpose is not valid                                                                |
| `PAYR-1102` | The id you searched with is not valid                                                               |
| `PAYR-1103` | The care plan id is not valid                                                                       |
| `PAYR-1104` | More than one beneficiary record matches                                                            |
| `PAYR-1105` | The payer has no configuration for your hospital                                                    |
| `PAYR-1106` | The payer has no details for a requested procedure                                                  |
| `PAYR-1107` | The check carries no billable item                                                                  |
| `PAYR-1108` | The payer has no details for the requested stratification                                           |
| `PAYR-1109` | The payer has no details for a requested investigation                                              |
| `PAYR-1110` | The payer has no details for a requested implant                                                    |
| `PAYR-1111` | A payer rule rejected the request                                                                   |
| `PAYR-1112` | The payer id is not valid                                                                           |
| `PAYR-1113` | An item code is not valid                                                                           |
| `PAYR-1114` | An item's speciality code is not valid                                                              |
| `PAYR-1115` | An item's quantity is not valid                                                                     |
| `PAYR-1116` | Your hospital is not authorised under the policy                                                    |
| `PAYR-1117` | The payer has no details for the policy                                                             |
| `PAYR-1118` | The payer has no details for the requested items                                                    |
| `PAYR-1119` | The payer received no details for the payer id from the exchange                                    |
| `PAYR-1120` | The reference id has been used before                                                               |
| `PAYR-1121` | The policy is not found for this beneficiary                                                        |
| `PAYR-1122` | The beneficiary has no policy with the payer                                                        |
| `PAYR-1123` | The beneficiary is not covered by this payer                                                        |
| `PAYR-1512` | A patient reference does not lead to a Patient resource                                             |
| `PAYR-1513` | A diagnosis is not sent as a coded concept                                                          |
| `PAYR-1515` | An organisation in your bundle has no name                                                          |

Every code above is recorded in the Catalogue. The aggregated list across modules is at [error codes](/docs/main/docs/nhcx/v1/reference/pmjay-error-codes).

[Next Still stuck? Ask for help Where to file what you hit, so the answer lands back in these pages.](/docs/main/docs/support)
