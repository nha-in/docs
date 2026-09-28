# Reprocess, cancel and shortfall

Claims are often not fully approved first time, for mundane reasons: missing documents, policy interpretation differences, package or pricing discrepancies.

One pair of calls carries every request a provider makes after a decision. `Task.code` and its reason say which one it is, and [one endpoint, five requests](/docs/pr-54/docs/nhcx/v1/reference/fhir/cancel-reprocess-and-shortfall#one-endpoint-five-requests) lists the valid combinations.

## APIs

| Call                                                                                                           | Called by | Method and path           | What it does                                                                                                                                             |
| -------------------------------------------------------------------------------------------------------------- | --------- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Provider: submit a reprocess or cancel task](/docs/pr-54/docs/nhcx/v1/api/task/endpoints/task-v1-task-submit) | Provider  | `POST /v1/task/submit`    | Provider sends a FHIR Task asking the payer to reprocess a rejected or short-paid claim or to cancel a preauth; Task.code and reasonCode set the intent. |
| [Payer: send the task outcome](/docs/pr-54/docs/nhcx/v1/api/task/endpoints/task-v1-task-on-submit)             | Payer     | `POST /v1/task/on_submit` | Payer returns a Task bundle with Task.status completed whose Task.output references a ClaimResponse carrying the reprocess or cancellation outcome.      |

The callback does not carry the decision as its leading resource. It carries a `Task` whose output points at the `ClaimResponse`, as [the answer is nested](/docs/pr-54/docs/nhcx/v1/reference/fhir/cancel-reprocess-and-shortfall#the-answer-is-nested-unlike-every-other-callback) sets out.

## Callbacks you host

The exchange posts these to the `endpoint_url` you registered. Answer each with HTTP 202 first.

| Path                 | Hosted by    |
| -------------------- | ------------ |
| `/v1/task/submit`    | The payer    |
| `/v1/task/on_submit` | The provider |

## Base URLs

| Environment             | Base URL                          |
| ----------------------- | --------------------------------- |
| Sandbox, NHCX exchange. | `https://apisbx.abdm.gov.in/hcx`  |
| Production.             | `https://apisprod.nha.gov.in/hcx` |

## Guides that use these calls

- [Building and sending a JWE](/docs/pr-54/docs/nhcx/v1/getting-started/building-and-sending-a-jwe)
- [Cancel, reprocess and shortfall](/docs/pr-54/docs/nhcx/v1/reference/fhir/cancel-reprocess-and-shortfall)

Each call has its own page in the sidebar, with a request you can send from it. The whole specification downloads as [YAML](/docs/pr-54/assets/files/nhcx-task-947746022c676488b140e50e1ac1086f.yaml) or [JSON](/docs/pr-54/assets/files/nhcx-task-800878fc03c734def8c9f01e4db526a6.json).
