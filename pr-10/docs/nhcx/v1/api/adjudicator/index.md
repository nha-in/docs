# PMJAY adjudicator

A PMJAY case is not decided over NHCX.

## Calls

| Call | Method and path | What it does |
| --- | --- | --- |
| [Adjudicator: role for a case](/docs/nhcx/v1/api/adjudicator/endpoints/adjudicator-adjudicator-role) | `POST /pmjay/sbxhcx/nhcxpayerservice/v1/get/user-role` | Asks the NHCX Payer Service which role in the State Health Agency's Transaction Management System holds a PMJAY case, and so which actions may be taken on it next. |
| [Adjudicator: act on a case](/docs/nhcx/v1/api/adjudicator/endpoints/adjudicator-adjudicator-process) | `POST /pmjay/hcx/nhcxpayerservice/wrapper/process/case` | Approves, rejects, queries or forwards a PMJAY case in the State Health Agency's Transaction Management System, as the role that currently holds it. |
| [Dummy payer, act on a request](/docs/nhcx/v1/api/adjudicator/endpoints/adjudicator-dummy-payer-process-request) | `POST /process/request` | Makes the sandbox dummy payer, participant `1000003538@hcx`, approve, reject or query a pre-authorisation or claim you have submitted, by correlation ID. |
| [Dummy payer, send a payment notice](/docs/nhcx/v1/api/adjudicator/endpoints/adjudicator-dummy-payer-paymentnotice-init) | `POST /paymentNotice/init` | Makes the sandbox dummy payer send a payment notice to the provider named, on `/v1/paymentnotice/request`. |

## Base URLs

| Environment | Base URL |
| --- | --- |
| Sandbox, Dummy payer. | `https://apisbx.abdm.gov.in/pmjay/sbxhcx/dummyhcxpayer` |

## Guides that use these calls

- [Receiving a callback](/docs/nhcx/v1/getting-started/receiving-a-callback)
- [PMJAY sandbox run](/docs/nhcx/v1/roles/provider/pmjay-sandbox-run)
- [PMJAY adjudication APIs](/docs/nhcx/v1/roles/provider/pmjay-adjudication-apis)

The whole specification, with a request you can send from the page, is the [PMJAY adjudicator API reference](/reference/nhcx-adjudicator).
