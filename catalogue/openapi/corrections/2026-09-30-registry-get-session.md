# Registry review, 30 September 2026

One change to the ported NHCX participant registry specification. It departs
from what the NHCX package's port wrote, so a fresh `make ekadocs` port would
undo it unless the package carries the same change. Nothing was fixed silently.

## `/get/session` removed from the registry reference

`nhcx-registry.yaml` no longer carries `POST /get/session`. The participant
service's token call was listed beside the registry calls, under the same name
other documents use for the ABDM gateway session, and the overview page needed
a warning section to keep the two apart. The gateway sessions call is the one
integrators use by default, and it has its own module, `nhcx-session.yaml`.
The registry now lists 20 operations, and its overview page no longer links the
call or carries the warning.

The module description and the tag description restated the removed call's
business purpose. Both now carry the registry's own summary sentence. The
`/participant/update` scenario named `/get/session` as the token call; it now
says a session token was fetched, without naming the call.

The [Session token](/docs/nhcx/v1/getting-started/session-token) guide still
describes `/get/session` and how it differs from the gateway sessions call, and
the sandbox exit use cases still name it. The Catalogue atom
`nhcx.endpoint.get-session` stays, with its sources, because the call exists;
it has no generated API page any more. A redirect sends the old endpoint page
to the guide.

The package still holds `apis/10-registry/get-session.bru`, and the live
specification is stored untouched at
`catalogue/openapi/.raw/nhcx-site-2026-09-14/swagger/participanthcxservice.json`.
A re-port brings the operation back; remove it again, or teach the port to skip
it.
