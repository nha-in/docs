# NHCX review, 24 September 2026

Changes made to the ported NHCX specifications after NHA's review of the
published pages. Each one departs from what the NHCX package's port wrote, so a
fresh `make ekadocs` port would undo it unless the package carries the same
change. Where the package's Bruno request was changed too, that is said.
Nothing was fixed silently.

## R1: `/get/linked/registry/mst` removed from the registry reference

`nhcx-registry.yaml` no longer carries `POST /get/linked/registry/mst`. The
participant service's own specification marks it for internal use, and the
package's request says "Do not call it. It is for NHCX internal use." It was
removed from the integrator reference the same way the 14 `/internal/v1/`
twins were. The registry now lists 21 operations, and its overview page no
longer links the call.

The package still holds `apis/10-registry/get-linked-registry-mst.bru`, and
the live specification is stored untouched at
`catalogue/openapi/.raw/nhcx-site-2026-09-14/swagger/participanthcxservice.json`.
A re-port brings the operation back; remove it again, or teach the port to skip
it.

## R2: environment labels and per-operation servers

The package's requests state which environment these calls belong to. The port
kept the specification-wide pair of servers on each of them, so the generated
cURL sent a production-only call to the sandbox host. Each now carries its own
`servers` entry, and its description starts with the environment.

| Specification | Operation | Environment | Host |
| --- | --- | --- | --- |
| `nhcx-registry.yaml` | `POST /participant/update` | Sandbox | `apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice` |
| `nhcx-registry.yaml` | `POST /v2/participant/update` | Production | `apisprod.nha.gov.in/pmjay/hcx/participanthcxservice` |
| `nhcx-onboarding.yaml` | `POST /participant/create` | Sandbox | `apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice` |
| `nhcx-onboarding.yaml` | `POST /v2/participant/create` | Production | `apisprod.nha.gov.in/pmjay/hcx/participanthcxservice` |
| `nhcx-onboarding.yaml` | `GET /validate` | Production | `apisprod.nha.gov.in/pmjay/hcx/participanthcxservice` |
| `nhcx-onboarding.yaml` | `GET /update/validate` | Production | `apisprod.nha.gov.in/pmjay/hcx/participanthcxservice` |

The sources are the requests' own docs: `participant-update.bru` and
`participant-create.bru` give the sandbox address from the FAQ, and
`v2-participant-update.bru`, `v2-participant-create.bru`, `validate.bru` and
`update-validate.bru` give the production address. The "When to use" sections
now carry those addresses again; the port had shortened them away. The
requests' summaries in the package were changed to start with the same
environment label. The `servers` entries have no package counterpart, because
the requests take their host from the sandbox environment.

## R3: `Accept` on the participant service calls

Every participant service request in the package sends `Accept:
application/json` from the collection headers, and its docs list it. The port
did not carry it. `nhcx-registry.yaml` and `nhcx-onboarding.yaml` now declare
a shared `Accept` header parameter on every operation except `/get/session`,
whose request does not list it.

## R4: error responses on the two product lookups

The live specification gives `/product/getowner` and
`/participant/getProductIdName` a `400`, `404` and `500` response, each with
the participant service's `ErrorResponse` body. The port kept only the `200`.
Both now carry the three error responses, and `components.schemas` holds
`ErrorResponse` as the live specification defines it. `/product/getowner`'s
"When to use" carries the caller sentence from its request again: payers use
it after `/product/link` or `/product/delink` to confirm the registry state.

## R5: the session token goes in `bearer_auth` only

The session specification's `bearerAuth` description, postconditions and best
practices said to send the token in both `bearer_auth` and `Authorization`.
They now say `bearer_auth`, which every NHCX call reads. The package's
`apis/01-session/session-token.bru` was changed the same way, and its summary
and preconditions name the credentials themselves, the client ID and secret
from ABDM sandbox registration, in place of a milestone.

## R6: the coverage eligibility receipts

The two webhook receipts in `nhcx-eligibility.yaml` gave `entity_type`
`preauth`, copied from a shared template. They now give
`coverageeligibility`, as the package's own responses for the two calls do.
The "When to use" sections of the check and its callback are bullet lists in
both the specification and the package requests.

## Update ABHA number moved to the PMJAY payer APIs

`POST /update/abhanumber` moved from `nhcx-registry.yaml` to `nhcx-adjudicator.yaml`, under the tag "PMJAY payer APIs". Its operationId is now `adjudicator_update_abhanumber`. It keeps its own `servers:`, the participant service hosts, because the call does not go to the payer service hosts. A redirect sends the old registry page to the new one. The package's Bruno request moved from `apis/10-registry` to `apis/12-adjudicator` to match.
