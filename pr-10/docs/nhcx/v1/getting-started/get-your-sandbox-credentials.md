# Get your sandbox credentials

Every National Health Claims Exchange (NHCX) call carries a session token, and every token starts with an [ABDM](/docs/pr-10/docs/nhcx/v1/getting-started/glossary#organisations-and-programmes) client ID and client secret. This chapter gets you those credentials, your NHCX sandbox roles, and a payer to test against.

## In short

- Register your organisation first: a hospital in the [Health Facility Registry (HFR)](/docs/pr-10/docs/nhcx/v1/getting-started/glossary#identity-and-registration), an insurer or [TPA](/docs/pr-10/docs/nhcx/v1/getting-started/glossary#organisations-and-programmes) with its [IRDAI](/docs/pr-10/docs/nhcx/v1/getting-started/glossary#organisations-and-programmes) registry id.
- Apply for ABDM sandbox credentials, then register the same client on the NHCX sandbox.
- Your software must support ABDM [Milestone 1](/docs/pr-10/docs/nhcx/v1/getting-started/glossary#identity-and-registration), [ABHA](/docs/pr-10/docs/nhcx/v1/getting-started/glossary#identity-and-registration) creation and verification.
- Test against the [dummy payer](/docs/pr-10/docs/nhcx/v1/getting-started/glossary#messages), participant code `1000003538@hcx`.
- The reviews have no fixed turnaround time, so start them first.

## Prerequisites

- Your organisation, and a mobile number for its registry record that you can receive messages on.

## 1. Register the organisation

| You are              | Register in                                                            | Your registry id             |
| -------------------- | ---------------------------------------------------------------------- | ---------------------------- |
| A hospital or clinic | The Health Facility Registry (HFR), at <https://facility.abdm.gov.in/> | The HFR ID                   |
| A payer or TPA       | IRDAI, or the relevant authority                                       | The id that authority issues |

Keep the mobile number on the registry record current. Participant creation checks it and sends a passcode to it.

## 2. Apply for ABDM sandbox credentials

1. Apply at <https://sandbox.abdm.gov.in/sandbox/v3/>.
2. Select "Providers and Payer" and Milestone 1 as your intent.
3. Wait for review. On approval you receive a client ID and a client secret.

The review is semi-manual. It filters out repeat requests from one organisation, organisations missing from every registry, technology providers without a valid website, and spam. Send one application only.

Store the secret the way you store any production credential. Never commit it, and never write it to a log.

## 3. Build Milestone 1

Your software must support ABDM Milestone 1 before it joins NHCX. It creates an ABHA number through Aadhaar or a driving licence. It verifies an ABHA number or ABHA address at patient registration.

## 4. Register on the NHCX sandbox

Register at <https://sandbox.abdm.gov.in/sandbox/v3/sandbox-registration> with your ABDM sandbox client ID and secret. When the form is submitted, NHCX sandbox roles are assigned to your client.

Decide your role before you create your participant. A wrong role and registry pair leads to access errors, rejected requests or misrouted messages.

| Role     | Role code | Registry | Registry code |
| -------- | --------- | -------- | ------------- |
| Provider | `10001`   | HFR      | `10001`       |
| Payer    | `10002`   | Payer    | `10004`       |
| TPA      | `10003`   | Payer    | `10004`       |

## 5. Meet the dummy payer

A provider needs a payer to send requests to. The sandbox has one: the dummy payer, participant code `1000003538@hcx`.

| Use case                  | What you do                                                                                                                                                                                             |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Coverage eligibility      | Send the check. It answers on its own.                                                                                                                                                                  |
| Insurance plan            | Send the request with provider id `32722` and policy number `100217` in the bundle. It answers on its own.                                                                                              |
| Preauthorisation or claim | Send the submit, then choose its answer with the [dummy payer action call](/docs/pr-10/docs/nhcx/v1/api/adjudicator/endpoints/adjudicator-dummy-payer-process-request): `Approve`, `Reject` or `Query`. |
| Payment notice            | Start it with the [payment notice trigger](/docs/pr-10/docs/nhcx/v1/api/adjudicator/endpoints/adjudicator-dummy-payer-paymentnotice-init).                                                              |

The provider id and policy number apply to the dummy payer only. Codes such as `100001@sbx` and `1000002090@hcx` in examples show the format. Before you address any other code, look it up in [the participant list](/docs/pr-10/docs/nhcx/v1/api/registry/endpoints/registry-fetch-participants-list).

## What you see when it works

- A [session token call](/docs/pr-10/docs/nhcx/v1/getting-started/session-token) with your client ID and secret returns an access token.
- The NHCX sandbox registration form is submitted, and roles are assigned to your client.
- [Fetching the certificate](/docs/pr-10/docs/nhcx/v1/getting-started/fetching-a-recipient-certificate) of `1000003538@hcx` returns a PEM certificate.

## When it goes wrong

| What you see                                                    | What to do                                                                                                   |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| The sandbox application is still in review                      | Wait. A second application is filtered out as a repeat. Ask about a stalled request at the address below.    |
| "No user role found/associated for sender code."                | Your client has no NHCX role yet. Confirm the sandbox registration form went through, then write to support. |
| Participant creation fails the mobile number check              | The number must match the HFR record, or the payer record. Update the registry record first.                 |
| Requests are rejected or misrouted after registration           | Check the role and registry codes you registered with.                                                       |
| The dummy payer sends nothing after a preauthorisation or claim | It waits for the action call. Send it with the correlation ID of your submit.                                |

## Where to get help

| Topic                                                                                                                                                                                                                      | Write to                         |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| Fast Healthcare Interoperability Resources (FHIR) bundle validation at sandbox exit, and the internal and [Health Tech Committee (HTC)](/docs/pr-10/docs/nhcx/v1/getting-started/glossary#identity-and-registration) demos | `hcx.integration@nha.gov.in`     |
| Building a FHIR bundle, and the [NRCeS](/docs/pr-10/docs/nhcx/v1/getting-started/glossary#organisations-and-programmes) specifications                                                                                     | `nrc-help@cdac.in`               |
| ABDM Milestone 1 integration                                                                                                                                                                                               | `integration.support@nha.gov.in` |
| Facility registration in the HFR                                                                                                                                                                                           | `facility@nha.gov.in`            |

Put your participant code, the environment, the use case and the path in the message. Add the `x-hcx-correlation_id`, `x-hcx-api_call_id` and `x-hcx-timestamp` of the failing request. Quote the error exactly as returned. Replies have no fixed turnaround time.

## Next steps

- [Quickstart](/docs/pr-10/docs/nhcx/v1/getting-started/quickstart): your first three calls, with nothing but these credentials.
- [Base URLs](/docs/pr-10/docs/nhcx/v1/getting-started/base-urls): every address in the sandbox and in production.
- [Creating and Updating a Participant](/docs/pr-10/docs/nhcx/v1/getting-started/creating-and-updating-a-participant): your own participant code.
