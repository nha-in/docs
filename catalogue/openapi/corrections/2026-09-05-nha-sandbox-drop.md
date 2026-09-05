# 2026-09-05: NHA's September drop, and what was actually new in it

A 42 MB archive, "ABDM Sandbox Sept 5 2026.zip", carrying the set NHA has put
together for the documentation site. sha256 of the archive:
`d10594d8c921a3cab86a6c6eb4043a96550c864902faaabb029050c01e478c4d`.

Fifty files. Thirty two are byte for byte what this repository already
records, including every specification under `M 1-2-3 YAML/swagger`. The four
that matter most were checked individually:

| File | Against | Result |
| --- | --- | --- |
| `fixed/hiecm/gateway.yaml` | `.raw/nha-2026-09-01/fixed/hiecm/gateway.yaml` | identical |
| `fixed/hiecm/patient-share.yaml` | same folder | identical |
| `fixed/phr/phr-api.yaml` | same folder | identical |
| `fixed/abha/abha-api-v3.yaml` | same folder | identical |

So the specifications in this drop are the ones already ingested. Nothing was
re-ingested and no atom changed on their account.

## The one file worth taking

`ABDM/NewDocumant PHR app.docx` is not in the repository and is not the PHR
document the p1, p2 and p3 atoms cite. That one is
`.raw/nha-2026-09-04/ABHA-PHR-V3-Documents.docx`, 4.8 MB. This is a different
document, 6.8 MB, recorded as
`.raw/nha-2026-09-05/NewDocumant-PHR-app.docx`, sha256
`4f8b40b31e894520be49885260912586a3f665933958cc0680ce5a4675704542`.

It is not an API reference. 6.7 of its 6.8 MB is 63 embedded images, and the
images are slide diagrams and screen recordings of the PHR app with subtitles
burned in. The text is narrative: what an ABHA address is, the address policy,
which test cases cover which journey. Valuable for concept and flow atoms, and
it carries no request or response payloads, so it answers nothing about the
curls that still lack a body.

## Where the missing bodies actually are

The bodies are in the older `ABHA-PHR-V3-Documents.docx`, which was already
here. Its sections follow one shape:

```
URL: /abha/api/v3/phr/app/enrollment/request/otp
Request: POST
Header Parameters:  ...
Body Parameters:    ...
Request Body:
{ ... }
```

124 URL sections, 83 with a request body block, 42 of those parseable once the
non breaking spaces NHA uses for indentation are normalised to ordinary
spaces.

Only five of them belong to an atom still carrying `<REQUEST_BODY>`, and each
was matched on its full path rather than a tail, because tails like `v3/init`
are ambiguous across linking, consent and subscription:

- `p2-patient-share`, `/api/hiecm/patient-share/v3/share`
- `p2-profile-on-share`, `/api/hiecm/patient-share/v3/on-share`
- `p3-subscription-init`, `/api/hiecm/subscription-requests/v3/init`
- `p2-link-care-context-confirm`, `/api/hiecm/user-initiated-linking/v3/link/care-context/confirm`
- `p3-subscription-hiu-on-notify`, `/api/hiecm/subscription-requests/v3/hiu/care-context/on-notify`

Postman placeholders in those bodies were rewritten to this repository's own
form, so `{{ transactionId }}` becomes `<TRANSACTIONID>`.

## Still without a body

Thirty seven atoms. Eight are M4, whose paths appear in the HFR and HPR sheets
rather than in any PHR document. The rest have no parseable request body in
any source recorded here. None was guessed at: a wrong request body on a
health API reads exactly like a right one until it fails in production.

## Not taken from the drop

The UHI onboarding documents and the NHCX spreadsheet were left where they
are. UHI is Phase 2 and NHCX is out of scope, so recording them would add
40 MB to the repository for content nothing may write against yet. They are in
the archive if that changes.
