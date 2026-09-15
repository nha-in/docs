# 2026-09-05: four M2 callbacks say which call produces them, in prose only

`catalogue/openapi/hiecm/v3/hiecm-m2.yaml` declares ten webhooks. Five carried
`x-abdm-answered-by`, five carried neither pairing key, and the five unpaired
ones are exactly the callbacks that deliver the result of an M2 call. So an
integrator reading `POST /hiecm/hip/v3/link/carecontext` saw `202 Accepted`,
no body, and nothing on the page saying where the answer arrives.

The pairing was not missing from the specification. It was written in prose
and never encoded. Four of the five name their producing operation by its
exact `operationId`, in their own summary or description:

| Callback | Names, and where |
| --- | --- |
| `m2_on_generate_token_result` | `m2_generate_link_token`, in `info.description`, its summary, its description, and the producer's own 202 |
| `m2_on_carecontext_result` | `m2_hip_link_care_context` |
| `m2_on_context_notify_result` | `m2_link_care_context_notify` |
| `m2_on_sms_notify_result` | `m2_sms_deep_link_notify` |

`x-abdm-triggered-by` was added to those four, naming the operation the
specification already names. This records a statement the file makes rather
than deciding one it does not: no schema changed, no pairing was inferred from
a path resembling another path, and the extension is this repo's own namespace
rather than NHA content.

`m2_on_data_notification` names no operation anywhere in the file. It was left
unpaired and still renders under "Callbacks with no documented trigger", which
is the honest answer.

The pages were already able to show this. `callbackSection` in
`scripts/build-api-reference.mjs` has rendered the reverse link since the
pairing keys existed; it had nothing to read. Each of the four operations now
carries a Callbacks section naming its callback and linking to it.

Not done here: the other gateways were not surveyed for the same gap, and the
202 descriptions on the producing calls still read "accepted and queued"
rather than naming the callback the way `m2_generate_link_token` does.
