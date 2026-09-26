# PMJAY adjudicator

A PMJAY case is not decided over NHCX.

## APIs

The calls fall in two groups. The dummy payer calls drive the sandbox's test payer. The PMJAY payer calls read and act on a PMJAY case in the State Health Agency's Transaction Management System, and replace a placeholder ABHA number.

### Dummy payer APIs

| Call                                                                                                                                      | Called by | Environment  | Endpoint                                                                        | What it does                                                                                                                                              |
| ----------------------------------------------------------------------------------------------------------------------------------------- | --------- | ------------ | ------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Provider: make the dummy payer act on a request](/docs/pr-50/docs/nhcx/v1/api/adjudicator/endpoints/adjudicator-process-request)         | Provider  | Sandbox only | `POST https://apisbx.abdm.gov.in/pmjay/sbxhcx/dummyhcxpayer/process/request`    | Makes the sandbox dummy payer, participant `1000003538@hcx`, approve, reject or query a pre-authorisation or claim you have submitted, by correlation ID. |
| [Provider: make the dummy payer send a payment notice](/docs/pr-50/docs/nhcx/v1/api/adjudicator/endpoints/adjudicator-paymentnotice-init) | Provider  | Sandbox only | `POST https://apisbx.abdm.gov.in/pmjay/sbxhcx/dummyhcxpayer/paymentNotice/init` | Makes the sandbox dummy payer send a payment notice to the provider named, on `/v1/paymentnotice/request`.                                                |

### PMJAY payer APIs

Read the role first, then act on the case as that role. Those two calls sit on different hosts. Update ABHA number replaces a placeholder ABHA number and goes to the participant service.

| Call                                                                                                                                                       | Called by                                                  | Environment            | Endpoint                                                                               | What it does                                                                                                                                                        |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- | ---------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Adjudicator: get the user role for a case](/docs/pr-50/docs/nhcx/v1/api/adjudicator/endpoints/adjudicator-pmjay-sbxhcx-nhcxpayerservice-v1-get-user-role) | Integrator driving a PMJAY case                            | Sandbox                | `POST https://apisbx.abdm.gov.in/pmjay/sbxhcx/nhcxpayerservice/v1/get/user-role`       | Asks the NHCX Payer Service which role in the State Health Agency's Transaction Management System holds a PMJAY case, and so which actions may be taken on it next. |
| [Adjudicator: act on a case](/docs/pr-50/docs/nhcx/v1/api/adjudicator/endpoints/adjudicator-pmjay-hcx-nhcxpayerservice-wrapper-process-case)               | Integrator driving a PMJAY case, as the role that holds it | Sandbox                | `POST https://apisbeta.nha.gov.in/pmjay/hcx/nhcxpayerservice/wrapper/process/case`     | Approves, rejects, queries, forwards or pends a PMJAY case in the State Health Agency's Transaction Management System, as the role that currently holds it.         |
| [Update ABHA number](/docs/pr-50/docs/nhcx/v1/api/adjudicator/endpoints/adjudicator-update-abhanumber)                                                     | Any participant                                            | Sandbox and production | `POST https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/update/abhanumber` | Replaces a placeholder (dummy) ABHA number with the beneficiary's real ABHA number.                                                                                 |

## Base URLs

| Environment                                          | Base URL                                                        |
| ---------------------------------------------------- | --------------------------------------------------------------- |
| Sandbox, Dummy payer.                                | `https://apisbx.abdm.gov.in/pmjay/sbxhcx/dummyhcxpayer`         |
| Sandbox, PMJAY payer service, role lookup.           | `https://apisbx.abdm.gov.in`                                    |
| Sandbox, PMJAY payer service, act on a case.         | `https://apisbeta.nha.gov.in`                                   |
| Production, PMJAY payer service.                     | Not published. Confirm at onboarding.                           |
| Sandbox, Participant service, update ABHA number.    | `https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice` |
| Production, Participant service, update ABHA number. | `https://apisprod.nha.gov.in/pmjay/hcx/participanthcxservice`   |

The dummy payer exists only in the sandbox, so it has no production address.

## Guides that use these calls

- [Receiving a callback](/docs/pr-50/docs/nhcx/v1/getting-started/receiving-a-callback)
- [Get your sandbox credentials](/docs/pr-50/docs/nhcx/v1/getting-started/get-your-sandbox-credentials)
- [PMJAY sandbox run](/docs/pr-50/docs/nhcx/v1/roles/provider/pmjay-sandbox-run)
- [PMJAY adjudication APIs](/docs/pr-50/docs/nhcx/v1/roles/provider/pmjay-adjudication-apis)

The whole specification, with a request you can send from the page, is the [PMJAY adjudicator API reference](/docs/pr-50/reference/nhcx-adjudicator).
