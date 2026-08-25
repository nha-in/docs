# OpenAPI conventions

Rules for every file in this folder. They exist so the same document renders
in Scalar, compiles into agent skills, and indexes cleanly for retrieval,
without three different shapes of truth.

## One file per module

| File | Module | Gateway host |
|---|---|---|
| `hiecm-gateway.yaml` | Session token, used by all modules | `dev.abdm.gov.in` |
| `hiecm-m1.yaml` | ABHA identity | `abhasbx.abdm.gov.in` |
| `hiecm-m2.yaml` | Care context linking and HIP data sharing | `dev.abdm.gov.in` |
| `hiecm-m3.yaml` | Consent and HIU data fetch | `dev.abdm.gov.in` |
| `hiecm-m4.yaml` | HPR and HFR registration. Phase 2, nothing written | `apihspsbx.abdm.gov.in` |

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
under `webhooks`, keyed by the callback path with slashes removed, so
`/on-add-contexts` becomes `on_add_contexts`.

Keeping callbacks in the module file means one retrievable chunk per
callback, carrying its own `operationId`, indexed by the same pipeline as
the request operations.

## operationId

The join key for everything downstream, so it is stable and unique across
all files. Format:

```
<module>_<tag>_<action>
```

Lowercase, underscores only, no dots, at most 64 characters, because MCP
tool names must match `^[a-zA-Z0-9_-]{1,64}$` and generators derive tool
names from `operationId` directly. Examples:

```
gateway_sessions_create
m1_abha_creation_request_otp
m2_webhook_on_add_care_contexts
```

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

The whole vocabulary. Anything else is a mistake.

| Extension | Where | What it carries |
|---|---|---|
| `x-abdm-gateway` | `info` | `hiecm`, `uhi` or `shared`. Never `nhcx`. |
| `x-abdm-module` | `info` | `gateway`, `M1`, `M2`, `M3`, `M4` |
| `x-abdm-phase` | `info` | `1` for what ships now, `2` for declared but unwritten |
| `x-abdm-roles` | `info` | Which integrator roles call this module |
| `x-abdm-sources` | root | Where the content came from, with fetch status |
| `x-abdm-atom` | operation, webhook | The atom id that documents this operation |

Module facets sit on `info` once rather than being repeated on every
operation. Per-operation chunks lose document context, so the indexer copies
`info.x-abdm-*` into each chunk at index time. Repeating them by hand in the
file would be boilerplate that goes stale.

Verification status is deliberately absent here. The atom owns it, through
its `verified` block. The operation carries `x-abdm-atom` and the indexer
reads status from the atom, so there is one place to change when a
verification lands.

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
