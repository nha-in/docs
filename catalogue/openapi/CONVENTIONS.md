# OpenAPI conventions

Rules for every file in this folder. They exist so the same document renders
in Scalar, compiles into agent skills, and indexes cleanly for retrieval,
without three different shapes of truth.

## One file per module

| File | Module | Gateway host |
|---|---|---|
| `hiecm-gateway.yaml` | Session token, used by all modules | `dev.abdm.gov.in` |
| `hiecm-m1.yaml` | Create and verify ABHA | `abhasbx.abdm.gov.in` |
| `hiecm-m2.yaml` | Create and link records | `dev.abdm.gov.in` |
| `hiecm-m3.yaml` | Fetch data with consent | `dev.abdm.gov.in` |
| `hiecm-m4.yaml` | Register facilities and professionals | `apihspsbx.abdm.gov.in` |
| `hiecm-p1.yaml` | PHR registration and login | `abhasbx.abdm.gov.in` |
| `hiecm-p2.yaml` | PHR Consents Management. Its calls under `/abha/api/v3/phr/app` carry `abhasbx.abdm.gov.in` on the call | `dev.abdm.gov.in` |
| `hiecm-p3.yaml` | PHR subscriptions | `dev.abdm.gov.in` |
| `hiecm-p4.yaml` | Health lockers | `dev.abdm.gov.in` |
| `hiecm-scan-and-register.yaml`, `hiecm-record-share.yaml`, `hiecm-scan-and-pay.yaml` | The three counter QR use cases. `x-portal.section: use-cases` groups them in the API sidebar | `dev.abdm.gov.in` |

`scripts/ingest-nha.mjs` writes every HIE-CM file except
`hiecm-record-share.yaml`, which is written by hand. Change a generated file
by changing the script, never the YAML.

The NHCX files under `nhcx/v1/` are one per module of the exchange, and are
not written in this repository. The NHCX package writes them with
`make ekadocs` (`system/build-ekadocs.mjs`) from its Bruno collection, and
replaces them on every port, so a change goes into the package and is ported
again. The port sets `x-abdm-atom` on every operation and webhook whose method
and path an NHCX endpoint or callback atom names in its title.

| File | Module | Gateway host |
|---|---|---|
| `nhcx-session.yaml` | Session token, the ABDM gateway's | `dev.abdm.gov.in` |
| `nhcx-registry.yaml` | Participant registry: search, details, certificates, policies | `apisbx.abdm.gov.in` |
| `nhcx-onboarding.yaml` | Creating and validating a participant | `apisbx.abdm.gov.in` |
| `nhcx-eligibility.yaml` | Coverage eligibility | `apisbx.abdm.gov.in` |
| `nhcx-insurance-plan.yaml` | Insurance plan | `apisbx.abdm.gov.in` |
| `nhcx-preauth.yaml` | Pre-authorisation | `apisbx.abdm.gov.in` |
| `nhcx-claim.yaml` | Claim | `apisbx.abdm.gov.in` |
| `nhcx-payment-notice.yaml` | Payment notice | `apisbx.abdm.gov.in` |
| `nhcx-communication.yaml` | Communication | `apisbx.abdm.gov.in` |
| `nhcx-status.yaml` | Status and search | `apisbx.abdm.gov.in` |
| `nhcx-other.yaml` | Task, notification subscription, the error callback | `apisbx.abdm.gov.in` |
| `nhcx-biometric.yaml` | ABHA biometric authentication | `apisbx.abdm.gov.in` |
| `nhcx-adjudicator.yaml` | The PMJAY payer service and the sandbox dummy payer | `apisbx.abdm.gov.in` |

Every file is self-contained. No `$ref` reaches across files, because the
site serves each spec as a static file and an unresolvable reference renders
as a blank operation. The cost is that the shared header parameters are
repeated in each file. If that drift ever bites, add a bundle step rather
than cross-file references.

## Version

`openapi: 3.1.1`. Scalar upgrades 3.0 documents to 3.1 internally, so
authoring in 3.1 removes a translation step, and 3.1 gives us top-level
`webhooks`.

`info.version` is the NHA API version this file describes, for example
`abdm-v3`. It is not the catalogue version, which the build stamps from
`catalogue/VERSION`.

## Callbacks are webhooks

ABDM callbacks are HTTPS POSTs from the gateway to a URL you registered.
That is what OpenAPI 3.1 `webhooks` describes. Each callback is one entry
under `webhooks`, keyed by the full callback path as NHA's file writes it,
so `/api/v3/hiu/consent/request/on-init` is the key. That is the path ABDM
calls on the bridge URL you registered.

A webhook names the call it belongs to with `x-abdm-triggered-by` or
`x-abdm-answered-by`. See [extensions.md](extensions.md).

Keeping callbacks in the module file means one retrievable chunk per
callback, carrying its own `operationId`, indexed by the same pipeline as
the request operations.

## One operation per use case

Where one URL serves several use cases, as M1's do, each use case is its own
operation. The path key carries the use case after a `#`, and
`x-actual-path` carries the URL on the wire:

```yaml
paths:
  /abha/api/v3/enrollment/request/otp#aadhaar-otp:
    post:
      x-actual-path: /abha/api/v3/enrollment/request/otp
```

The `#` suffix is never sent to a server. The reference shows
`x-actual-path` on the page, in the curl and in the samples.

## operationId

The join key for everything downstream, so it is stable and unique across
all files. `scripts/ingest-nha.mjs` writes it as:

```
<module>_<method>_<pathslug>
```

The path slug is the path, `#` suffix included, with its leading
`/abha/api`, `/api/hiecm`, `/api` or `/apis` removed, the braces dropped
from each `{parameter}`, lowercased, and every run of other characters
turned into one underscore. The module keeps its hyphens. NHA's own id, where
the file gave one, is kept in `x-abdm-nha-operation-id`.

An id is at most 64 characters, because MCP tool names must match
`^[a-zA-Z0-9_-]{1,64}$` and generators derive tool names from `operationId`
directly. A longer id is cut to 57 characters and ends in `_` and the first
six hex digits of the full id's sha256. A repeated id gains `_2`, then `_3`.
Examples:

```
gateway_get_gateway_v3_bridge_services
m1_post_v3_enrollment_request_otp_aadhaar_otp
scan-and-pay_post_scan_gateway_v3_patient_selection
m2_post_user_initiated_linking_v3_patient_care_context_on_8c9340
```

The NHCX port writes its own ids, such as `claim_v1_claim_submit`.

Renaming an `operationId` is a breaking change for every compiled skill and
every indexed chunk. Treat it like renaming an atom id.

## Summary and description

An agent picks tools by reading these. Auto-generated text such as "Post
enrollment request OTP" makes an agent pick the wrong tool or skip the right
one, so both fields are written by a person:

- `summary`: one line, imperative, what the call does.
- `description`: what it is for, what must already be true, what comes back,
  and which callback follows if the call is asynchronous.

Same rule for parameters and responses. Describe the format, the
constraints and an example.

## Tags

Tags are the within-module facet for retrieval and the sidebar grouping in
Scalar. They follow NHA's own grouping of the module rather than a grouping
we invented, so an integrator reading NHA's material finds the same words
here.

Do not add `x-tagGroups`. Scalar has an open defect where webhooks disappear
from the sidebar when `x-tagGroups` is present, and one module per file is
already small enough not to need a second level.

## Extensions

An extension not listed in the reference below is a mistake.

Every extension in use, with a real example and what reads it, is in
[extensions.md](extensions.md). The six below are the ones every
specification must carry.

| Extension | Where | What it carries |
|---|---|---|
| `x-abdm-gateway` | `info` | `hiecm`, `uhi`, `nhcx` or `shared`. All four are accepted. |
| `x-abdm-module` | `info` | HIE-CM: `gateway`, `M1`, `M2`, `M3`, `M4`. NHCX: the module id, as `claim` or `registry` |
| `x-abdm-phase` | `info` | `1` for what ships now, `2` for declared but unwritten |
| `x-abdm-roles` | `info` | Which integrator roles call this module |
| `x-abdm-sources` | root | Where the content came from, with fetch status |
| `x-abdm-atom` | operation, webhook | The atom id that documents this operation |

Module facets sit on `info` once rather than being repeated on every
operation. Per-operation chunks lose document context, so the indexer copies
`info.x-abdm-*` into each chunk at index time. Repeating them by hand in the
file would be boilerplate that goes stale.

No verification status appears here or in the atom. The operation carries
`x-abdm-atom` so the indexer can join the two, and sandbox evidence for an
operation lives under `catalogue/verification/`, keyed by the atom id.

## Sources

Every file carries `x-abdm-sources` at the root, one entry per source, with
`url` or `file`, a `role` of `upstream` or `correction`, and a `status` of
`not-yet-fetched`, `not-yet-hashed` or a `sha256:` hash. A file whose
sources are all unhashed is scaffolding, not documentation.

Corrections to NHA files are recorded in `corrections/` and referenced from
`x-abdm-sources`. They are never applied silently.

## Indexing

The retrieval build dereferences `$ref` before chunking. A chunk that still
contains `$ref: '#/components/parameters/RequestId'` tells a retriever
nothing. Authoring stays DRY with components; the index gets the flattened
form.
