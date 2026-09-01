# The `x-` extensions these specifications use

Fourteen vendor extensions carry the metadata that OpenAPI has no field for.
Four things read them: the site build, the skill compiler, the Go MCP server and
the linters. When four consumers read a vocabulary only its authors know, it
drifts, so every extension in use is listed here with a real example, and with
what actually reads it today rather than what it was meant for.

The allowed values for `x-abdm-gateway` and the rest of the frontmatter rules
live in [CONVENTIONS.md](CONVENTIONS.md). This page says what each extension is
for and who reads it.

## Document level

These sit in `info`, except `x-abdm-sources` and `x-abdm-errors`, which sit at
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
    label: M1 ABHA identity # sidebar label
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

### `x-abdm-errors`

The module's error documentation, as prose notes plus tables. Read by
`scripts/build-skills.mjs` to build a skill's Debug section, by
`scripts/build-api-reference.mjs` to generate the error pages, and by the Go MCP
server, which parses the table to answer error lookups. Two variants
appear once each where a module's errors do not fall into one table:
`x-abdm-errors-untagged` and `x-abdm-errors-uidai`.

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

### `x-abdm-use-case`

Groups generated endpoint pages into a sidebar section. Operations sharing a
value are rendered together under it. Where it is absent the build falls back to
the operation's `tags`.

```yaml
      operationId: m1_enrolment_verify_abdm_otp
      x-abdm-use-case: ABHA creation, Aadhaar OTP
```

### `x-abdm-nha-operation-id`

NHA's own name for the operation, kept when we renamed `operationId` to satisfy
the naming rules in CONVENTIONS.md. It lets you match a page back to NHA's
document when the two names differ.

```yaml
      x-abdm-nha-operation-id: updateBridgeUrl
```

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
