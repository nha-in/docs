# NHCX review, 24 September 2026: the exchange modules

Changes made to the NHCX specifications under `catalogue/openapi/nhcx/v1/`
after NHA's review of the NHCX pages. Each one is listed here so that nothing
was changed silently. The NHCX package writes these files with `make ekadocs`,
so a port from the package undoes every change below until the package makes
the same change. The last section lists what the package still has to do.

## R1: the Springfox documentation routes removed from `nhcx-other.yaml`

Five operations were removed. They are the claim and status services' own
Springfox documentation routes, which Swagger UI reads. No integrator calls
them, and they are not part of any NHCX flow.

| Method and path | Operation removed |
| --- | --- |
| `GET /v3/api-docs` | `other_v3_api_docs` |
| `GET /v2/api-docs` | `other_v2_api_docs` |
| `GET /swagger-resources` | `other_swagger_resources` |
| `GET /swagger-resources/configuration/ui` | `other_swagger_resources_configuration_ui` |
| `GET /swagger-resources/configuration/security` | `other_swagger_resources_configuration_security` |

None of the five carried `x-abdm-atom`, so no atom loses its page. The
module's summary, tag description and operation count were updated to match,
and the five rows were taken out of `site/docs/nhcx/v1/api/other/index.md`.

`POST /v1/delete` stays. It is in the claim service's published specification,
and its description allows an integrator to call it when NHCX support asks.

## R2: Predetermination marked as unconfirmed

`nhcx-predetermination.yaml` keeps both operations and both callbacks.
Predetermination is not in the published NHCX swagger or the integration
handbook, so `info.description` and the module page now open by saying so and
asking integrators to confirm with the NHCX team before building against it.

R6 supersedes this: predetermination was then removed.

## R3: the PMJAY adjudicator split into two groups

`nhcx-adjudicator.yaml` had one tag, `PMJAY adjudicator`. It now has two:

| Tag | Operations |
| --- | --- |
| `Dummy payer APIs` | `adjudicator_process_request`, `adjudicator_paymentnotice_init` |
| `PMJAY payer APIs` | `adjudicator_pmjay_sbxhcx_nhcxpayerservice_v1_get_user_role`, `adjudicator_pmjay_hcx_nhcxpayerservice_wrapper_process_case` |

`info.x-abdm-roles` was `[provider]` and is now `[provider, payer]`. The PMJAY
payer APIs act on a case as the scheme's own adjudicating role, and
`PMJAY adjudication APIs` addresses scheme payers building their side as well
as providers testing in the sandbox.

## R4: example identifiers made synthetic

Examples in the specifications below carried values that could be read as a
real beneficiary or participant. They are now placeholders.

| Value | Replaced by | Files |
| --- | --- | --- |
| ABHA number `91711234567890` in `x-hcx-ben-abha-id` | `<14-digit ABHA number>` | preauth, claim, task, payment-notice, communication, status, other |
| Participant code `1000004446@hcx` | `<provider participant code>` | preauth, predetermination, claim, task, payment-notice, communication, status, insurance-plan, other |
| Participant code `1518@hcx` | `<payer participant code>` | the same files |
| JWE example headers that encoded `1000004446@hcx` or `1518@hcx` as the sender | the neutral header the pre-authorisation examples already used, `{"alg":"RSA-OAEP-256","enc":"A256GCM","x-hcx-sender_code":...}` | task, communication, status, insurance-plan |

The sandbox dummy payer, `1000003538@hcx`, is published for testing and was
kept.

## R5: callback hosts corrected

| Callback | Was | Now |
| --- | --- | --- |
| `/v1/on_status` in `nhcx-other.yaml` | Hosted by the provider | Hosted by every participant that sends `/v1/status` |
| `/v1/search/on_submit` in `nhcx-status.yaml` | Hosted by the provider | Hosted by the participant that sent the search, such as NHA or a regulator |

## R6: Predetermination removed

NHA's reviewer asked for predetermination to come out, because it is not in
the published NHCX swagger or the integration handbook.
`nhcx-predetermination.yaml` was deleted with its two operations and two
callbacks, and so were its API pages under `site/docs/nhcx/v1/api/` and its
four rows in `catalogue/titles.yaml`. Seven atoms went with it: the two
endpoints, the two callbacks, the flow, the glossary entry and the decision
`nhcx.decision.preauth-or-predetermination`.

The FHIR page `predetermination-status-and-search` is now `status-and-search`
and keeps only status and search. Use cases B9 and C11 were removed, which
leaves 38. The old page and module routes redirect.

The `Claim.use` value set still lists `predetermination`. It is a value of
the FHIR standard, and the FHIR reference states the set as it is.

## What the package still has to do

- Remove the five Springfox requests from `apis/13-other/`
  (`v3-api-docs.bru`, `v2-api-docs.bru`, `swagger-resources.bru`,
  `swagger-resources-configuration-ui.bru`,
  `swagger-resources-configuration-security.bru`), or have
  `system/build-ekadocs.mjs` skip them.
- Give `system/build-ekadocs.mjs` the two adjudicator tags, the adjudicator
  roles and the callback hosts in R5.
- Remove `apis/04-predetermination/`, or have `system/build-ekadocs.mjs` skip
  it, so a port does not bring predetermination back (R6).
- Replace `91711234567890`, `1000004446@hcx` and `1518@hcx` in the Bruno
  request headers, where the ported examples come from.
