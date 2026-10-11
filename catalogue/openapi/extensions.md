# The `x-` extensions these specifications use

Vendor extensions carry the metadata that OpenAPI has no field for.
Four things read them: the site build, the skill compiler, the Go MCP server and
the linters. When four consumers read a vocabulary only its authors know, it
drifts, so every extension in use is listed here with a real example, and with
what actually reads it today rather than what it was meant for.

The allowed values for `x-abdm-gateway` and the rest of the frontmatter rules
live in [CONVENTIONS.md](CONVENTIONS.md). This page says what each extension is
for and who reads it.

## Document level

These sit in `info`, except `x-abdm-sources`, which sits at
the root of the document. A retrieval index chunks per operation and loses the
document around it, which is the reason these facets are declared once per
document rather than repeated on every operation.

### `x-portal`

Where the module lands on the documentation site. Without it the filename stem
becomes the module folder, `info.title` becomes the label, and modules sort
alphabetically.

```yaml
info:
  x-portal:
    module: m1              # folder under site/docs/<gateway>/<version>/api/
    label: M1 Identity # sidebar label
    position: 2             # order among this gateway's modules
```

Read by `scripts/build-api-reference.mjs` and by the Go MCP server, which takes
the module name from `info.x-portal.module` and falls back to the filename stem
(`mcp/internal/catalogue/operations.go`). This is the one extension a contributor
authoring a new module must write by hand, and it is documented in
[CONTRIBUTING.md](../../CONTRIBUTING.md) as well.

### `x-abdm-gateway`, `x-abdm-module`, `x-abdm-phase`, `x-abdm-roles`

The four facets that say which slice of the programme this document covers.

```yaml
info:
  x-abdm-gateway: hiecm     # allowed values in CONVENTIONS.md
  x-abdm-module: M1         # gateway, M1, M2, M3, M4
  x-abdm-phase: 1           # 1 ships now, 2 is declared and unwritten
  x-abdm-roles: [his]       # which integrator roles call this module
```

### `x-abdm-sources`

Where the document came from, with fetch status and hash. This is the provenance
half of the honesty rule: an answer can say which NHA artefact it rests on, and
`scripts/check-source-freshness.mjs` fails CI when a recorded hash no longer
matches the file under `catalogue/openapi/.raw/`.

## Operation level

### `x-abdm-atom`

The id of the atom that documents this operation. It is used 289 times, more
than any other extension here, and it is meant to be the join between the machine
contract and the prose.

Be accurate about what reads it today: only `scripts/lint-agent-readiness.mjs`,
and only to warn when it is missing, with the message that the chunk cannot join
to its atom. The MCP indexer does not follow it yet, so the join is declared and
recorded on every operation but not yet consumed. Write it anyway, because the
value is the thing that makes the join possible later, and a linter warning is
cheaper to fix now than 289 operations are to backfill.

```yaml
      operationId: p1_encryption_copy
      x-abdm-atom: hiecm.endpoint.p1-encryption-copy
```

### `x-abdm-nha-operation-id`

NHA's own name for the operation, kept when we renamed `operationId` to satisfy
the naming rules in CONVENTIONS.md. It lets you match a page back to NHA's
document when the two names differ.

```yaml
      x-abdm-nha-operation-id: updateBridgeUrl
```

### `x-actual-path`

The URL on the wire for an operation whose path key carries a `#` use case
suffix. M1 declares one operation per use case this way, so several keys share
one URL. [CONVENTIONS.md](CONVENTIONS.md) describes the pattern.

```yaml
  /abha/api/v3/enrollment/request/otp#aadhaar-otp:
    post:
      x-actual-path: /abha/api/v3/enrollment/request/otp
```

NHA's M1 swagger of 22 September 2026 carries it, and `scripts/ingest-nha.mjs`
keeps it as written. `scripts/build-api-reference.mjs` shows it on the page, in
the curl and in the samples, and strips the `#` suffix from the key where it is
absent.

### `x-abdm-title`

The name a heading, a sidebar row and a table cell show for the operation, used
as written. Without it, the title is derived from `summary` and starts with a
verb. A row in `catalogue/titles.yaml` for the same `operationId` takes
precedence.

```yaml
      x-abdm-title: Send Aadhaar OTP for ABHA enrolment
```

`scripts/ingest-nha.mjs` copies it from `summary` for M1, where NHA's summaries
are names rather than sentences. `scripts/build-api-reference.mjs` reads it.

## Webhook level

### `x-abdm-triggered-by`, `x-abdm-answered-by`

The `operationId` of the call a callback belongs to. `x-abdm-triggered-by`
names the call you make that produces the callback. `x-abdm-answered-by` names
the call you make in reply to it. The operation may sit in another module's
file of the same gateway version.

```yaml
webhooks:
  /api/v3/hiu/consent/request/on-init:
    post:
      x-abdm-triggered-by: m3_post_consent_v3_request_init
  /api/v3/hip/link/care-context/init:
    post:
      x-abdm-answered-by: m2_post_user_initiated_linking_v3_link_care_context_on_init
```

`scripts/ingest-nha.mjs` writes both for HIE-CM and fails when the named
operation does not exist. The NHCX port writes `x-abdm-triggered-by`.
`scripts/build-api-reference.mjs` reads them to list each callback on its
call's page and in `api-routes.json`. A webhook with neither is not paired by
guesswork: its page says the specification names no call.

### `x-abdm-source-folder`

Which folder of NHA's upstream collection an operation was ingested from. Used
only in the PHR specifications (`hiecm-p1`, `hiecm-p2`, `hiecm-p3`,
`hiecm-phr-services`), where one Postman collection supplied several modules and
the folder is the only thing distinguishing them.

```yaml
      x-abdm-atom: hiecm.endpoint.p1-encryption-copy
      x-abdm-source-folder: AS Login service
```

### `x-abdm-correction`

The id of a recorded correction in
[corrections/](corrections/), naming a place where NHA's file was wrong and we
diverged from it. The correction file carries the evidence and the reasoning;
the spec carries only the pointer, so no divergence is silent.

```yaml
        x-abdm-correction: C3   # corrections/2026-08-25-m1-m2-m3-ingest.md
```

## Adding one

Add the extension here in the same shape, with a real example taken from a
specification rather than an invented one, and say which script reads it. An
extension nothing reads is not metadata, it is a comment, and belongs in
`description`.
