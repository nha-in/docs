# API knowledge: the nhcx-adapter contract (optional transport) and the HMIS endpoints that face it

Read this file only when the transport is nhcx-adapter, and use nhcx-adapter only when the user has asked for it (`references/transport-knowledge.md` section 1). Otherwise the build reaches NHCX through the app's existing integration or its own transport, and `references/transport-knowledge.md` sections 3 and 4 replace everything here.

This file describes nhcx-adapter (https://github.com/nha-in/nhcx-adapter) as its release ships it, and the HMIS side a build needs to face it. A release carries the binary, `config.sample.json`, `serve.sh`, `stop.sh`, `update.sh` and `README.md`. `nhcx-package/docs/02-Getting Started/10-NHCX Adapter.md` covers the same adapter. When a detail matters, check the release README and `config.sample.json` for the version you run.

## 1. What the adapter is

One binary, one `config.json`, no database. You POST plain FHIR to it. It mints the protocol ids, fetches the recipient's certificate, encrypts a compact JWE, posts to the NHCX gateway, and records the exchange in a file ledger. NHCX callbacks reach it encrypted; it decrypts them and POSTs plain FHIR to your HMIS. Both directions are synchronous; there is no queue (release README, "How it works").

The same binary can front several participants at once. Inbound, `x-hcx-recipient_code` picks the profile whose key decrypts and whose callback receives. Outbound, `x-hcx-sender_code` picks who sends (release README, "Hosting several participants"). Encrypting for a code the same adapter holds is allowed. So one adapter can host a hospital and a test payer together, and a test between them needs no second gateway.

## 2. Configuration

File: `config.sample.json` in the release. `${NAME}` reads an environment variable; `@file` reads a file next to the config. Unknown keys are rejected.

| Key | Default | What it does |
| --- | --- | --- |
| `env` | `sandbox` | `sandbox` or `production`. Picks the gateway (`https://apisbx.abdm.gov.in/hcx/v1` or `https://apis.abdm.gov.in/hcx/v1`), registry, session endpoint and `X-CM-ID` (`sbx` or `abdm`). |
| `listen` | `127.0.0.1:8090` | The HTTP listener. |
| `publicUrl` | empty | How NHCX reaches the adapter. Register `<publicUrl>/in` as the participant's `endpoint_url`. |
| `apiKey` | `${NHCX_ADAPTER_API_KEY}` | The key your HMIS presents on `/out`, `/fhir/out`, `/ledger*`, `/token`. Demanded in production, honoured but not demanded in sandbox. `requireApiKey: true` closes a sandbox adapter. |
| `participant.participantId` | none; the sample carries an example code | Your registry code. `@hcx` is added if missing. |
| `participant.clientId`, `clientSecret` | `${NHCX_CLIENT_ID}`, `${NHCX_CLIENT_SECRET}` | ABDM credentials that mint the session token. |
| `participant.privateKey` | `@private_key.pem` | The RSA key of your registered certificate. |
| `participants[]` | `[]` | Further hosted identities. Each needs only `participantId` and `callback`; the rest is inherited. |
| `callback.url` | `http://127.0.0.1:8765/nhcx/callback` in the sample | Where decrypted messages are POSTed. |
| `callback.appendPath` | `true` | Appends the NHCX path: `.../callback` receives `v1/preauth/on_submit` at `.../callback/v1/preauth/on_submit`. |
| `callback.timeoutSeconds` | `20` | One delivery. NHCX wants its 202 within 30 seconds. |
| `callback.apiKey` | empty | Sent to your HMIS as `Authorization: Bearer <value>`. |
| `callback.routes` | `{}` | Per-path overrides, used exactly as written: `{"v1/preauth/on_submit": "http://preauth-svc/hook"}`. |
| `callback.also` | absent | Extra targets for the same delivery (two systems behind one participant code). Every target must accept or NHCX redelivers to all. |
| `ledger.enabled`, `ledger.dir`, `ledger.retentionDays`, `ledger.storeBodies` | `true`, `data/ledger`, `30`, `true` | The traffic ledger. A hand-written config that leaves out `retentionDays` keeps every day. |
| `maxBodyBytes` | 8 MiB in the v1.0.1 README | Caps request bodies on both surfaces. A PMJAY package master is far larger: set 100 MiB (`104857600`) explicitly. |
| `panel.password`, `panel.path` | empty, `/panel` | The browser console; off until a password is set. |
| `auth.mode`, `auth.tokenTtlSeconds` | `sessions`, `1200` | How the ABDM token is obtained. |

Minimal working config for one hospital:

```json
{
  "env": "sandbox",
  "listen": "127.0.0.1:8090",
  "publicUrl": "https://<YOUR_PUBLIC_HOST>/in",
  "apiKey": "${NHCX_ADAPTER_API_KEY}",
  "participant": {
    "participantId": "<YOUR_PARTICIPANT_CODE>@hcx",
    "clientId": "${NHCX_CLIENT_ID}",
    "clientSecret": "${NHCX_CLIENT_SECRET}",
    "privateKey": "@private_key.pem"
  },
  "callback": { "url": "http://127.0.0.1:<HMIS_PORT>/nhcx/callback", "appendPath": true, "apiKey": "<CALLBACK_SECRET>" }
}
```

Start it with `./nhcx-adapter serve`, or `./serve.sh` from the release archive; `./stop.sh` stops a background server. It checks token, participant record, certificate and registered endpoint first and offers to fix each in a terminal (release README, "Startup checks"). `./nhcx-adapter check --no-tui` is the same as a health gate. `serve --no-tui --skip-checks` starts it with no prompts and no checks, for a script that has already checked.

## 3. Routes

| Route | Auth | Does |
| --- | --- | --- |
| `POST /out/{path...}` | API key | Send. `path` is the NHCX API path, `v1/preauth/submit`. |
| `POST /fhir/out/{path...}` | API key | Same handler, hcxkit's prefix. The client in section 11 sends here. |
| `POST /in/{path...}` | none | NHCX delivers here. Register `<publicUrl>/in`. |
| `POST /v1/{path...}` | none | Alias of `/in` for a registry `endpoint_url` of `/`. |
| `GET /ledger` | API key | Newest first. Filters: `direction, entity, kind, status, sender, recipient, participant, correlation_id, workflow_id, since, until, before, limit` (1 to 500). `since` and `until` take RFC 3339, a date, or a duration such as `24h`. |
| `GET /ledger/stats` | API key | Counts by direction, status, entity. |
| `GET /ledger/thread/{cid}` | API key | Every message on one correlation id plus the derived state. |
| `GET /ledger/{id}` | API key | One message in full, bundle included. |
| `GET /token`, `POST /token/refresh` | API key | The ABDM session token, for calls the adapter does not make (registry, PMJAY payer service). `?participant=<code>` for a hosted identity. |
| `GET /healthz`, `GET /readyz` | none | Liveness; readiness is 503 until a token is held. |
| `GET /panel` | its own password | Operator console: Live, Ledger, Send, Lookup, Setup. |
| `/internal/*` | none | hcxkit-compatible console API, section 8. |

API key check: `Authorization: Bearer <key>` first, then `X-Api-Key: <key>`. Constant-time compare. A miss answers `401 {"ok":false,"error":{"code":"UNAUTHORIZED","message":"missing or invalid API key"}}`.

## 4. The outbound envelope

The body must be a JSON object. Header precedence, lowest to highest:

1. HTTP request headers named `x-hcx-*`.
2. The `jwe_headers` object (hcxkit spelling).
3. Top-level `x-hcx-*` keys.
4. Top-level short aliases: `sender`, `recipient`, `correlation_id`, `request_id`, `api_call_id`, `workflow_id`, `status`.

The payload is `fhir`, else `payload`, else the body itself when it carries `resourceType`. Otherwise `400 INVALID_ENVELOPE`.

The protected header names:

```
x-hcx-api_call_id  x-hcx-request_id  x-hcx-correlation_id  x-hcx-timestamp
x-hcx-status       x-hcx-sender_code x-hcx-recipient_code  x-hcx-workflow_id
```

Completion rules:

- Sender and recipient codes get `@hcx` appended if missing.
- `api_call_id`, `request_id`, `correlation_id` are kept only when they are plain 8-4-4-4-12 UUIDs; anything else is replaced with a fresh UUID. So a response must carry the request's `correlation_id` as a UUID or the thread is lost.
- `x-hcx-status` defaults to `request.initiated`, or `response.complete` when the last path segment starts with `on_`.
- `x-hcx-timestamp` defaults to now as `YYYY-MM-DDThh:mm:ss±hhmm`. The zone has no colon: `+0530`, not `+05:30`.
- An empty `x-hcx-workflow_id` is dropped, not sent.
- On an `on_` path with no usable correlation id, the adapter threads the message to the newest inbound request of that entity from that recipient. Do not rely on it; send the id.

What a hospital sends on a normal leg:

```json
{
  "jwe_headers": {
    "x-hcx-sender_code": "<YOUR_PARTICIPANT_CODE>@hcx",
    "x-hcx-recipient_code": "<PAYER_PARTICIPANT_CODE>@hcx",
    "x-hcx-workflow_id": "12"
  },
  "fhir": { "resourceType": "Bundle", "type": "collection", "...": "..." }
}
```

Add `"x-hcx-correlation_id": "<REQUEST_CORRELATION_ID>"` only on the two reply legs: the communication reply on `v1/communication/on_request` and the payment acknowledgement on `v1/paymentnotice/on_request`.

## 5. The outbound answer

The HTTP status is the NHCX gateway's own. Body:

```json
{
  "ok": true,
  "path": "v1/preauth/submit",
  "url": "https://apisbx.abdm.gov.in/hcx/v1/preauth/submit",
  "headers": { "x-hcx-correlation_id": "...", "x-hcx-api_call_id": "...", "x-hcx-request_id": "...", "x-hcx-workflow_id": "12", "x-hcx-status": "request.initiated", "x-hcx-timestamp": "...", "x-hcx-sender_code": "...", "x-hcx-recipient_code": "..." },
  "gateway_status": 202,
  "response": { "...": "the NHCX 202 body" },
  "duration_ms": 412,
  "ledger_id": "7UMV0007",
  "txn_id": "7UMV0007",
  "correlation_id": "...",
  "request_id": "..."
}
```

Store three things on the leg: `txn_id` (the ledger id), `correlation_id` (the thread), and `headers["x-hcx-api_call_id"]`. Store them on every send.

Local failures come back as `{"ok": false, "error": {"code", "message", "retryable"}, "request_id", "upstream_status", "upstream_body"}` with these statuses: `400` for `INVALID_ENVELOPE`, `INVALID_PAYLOAD`, `INVALID_BODY`, `INVALID_JWE`, `NO_PATH`, `NO_RECIPIENT`, `WRONG_RECIPIENT`, `BODY_READ`; `401` for the API key; `413` `BODY_TOO_LARGE`; `422` for `DECRYPT_FAILED`, `CERT_NOT_FOUND`, `SELF_ENCRYPTION_KEY`; `502` for any code starting `CALLBACK_`, `GATEWAY_`, `CERT_FETCH_`, `TOKEN_`; `501` `LEDGER_DISABLED`. A gateway refusal is recorded in the ledger as `rejected` with `GATEWAY_HTTP_<n>`.

## 6. The inbound callback your HMIS receives

The adapter POSTs to `callback.url` plus the NHCX path. Body:

```json
{
  "meta": {
    "type": "in",
    "payloadType": "fhir",
    "path": "v1/preauth/on_submit",
    "ip": "1.2.3.4",
    "time": "<RFC 3339 time, +05:30>",
    "redelivery": false,
    "participant": "<YOUR_PARTICIPANT_CODE>@hcx"
  },
  "jwe_headers": {
    "alg": "RSA-OAEP-256", "enc": "A256GCM",
    "x-hcx-api_call_id": "...", "x-hcx-correlation_id": "...", "x-hcx-request_id": "...",
    "x-hcx-sender_code": "<PAYER>@hcx", "x-hcx-recipient_code": "<YOU>@hcx",
    "x-hcx-status": "response.partial", "x-hcx-timestamp": "...", "x-hcx-workflow_id": "20"
  },
  "fhir": { "resourceType": "Bundle", "...": "..." }
}
```

`payloadType` is `fhir` for a bundle and `protocol` for a ProtocolResponse. A ProtocolResponse is a refusal. Then `fhir` is the plain JSON body with `type: "ProtocolResponse"`, `x-hcx-status: response.error` and `x-hcx-error_details` at its top level.

HTTP headers on the delivery:

| Header | Value |
| --- | --- |
| `X-Nhcx-Path` | `v1/preauth/on_submit` |
| `X-Nhcx-Payload-Kind` | `fhir` or `protocol` |
| `X-Nhcx-Correlation-Id` | the thread |
| `X-Nhcx-Api-Call-Id` | this delivery's id, stable across redeliveries |
| `X-Nhcx-Redelivery` | `true` when the ledger already holds this api_call_id (absent otherwise) |
| `X-Nhcx-Participant` | the hosted identity it was addressed to |
| `X-Hcxkit-Txn-Id` | equals `x-hcx-api_call_id` (what a kit-style backend dedupes on) |
| `X-Hcxkit-Type` | entity: `coverage`, `insurance`, `preauth`, `claim`, `task`, `payment`, `communication`, `status` |
| `X-Hcxkit-Flow` | `request` for an arriving response, `on_request` for an arriving request (inverted on purpose) |
| `X-Hcxkit-Payload-Kind` | same as `X-Nhcx-Payload-Kind` |
| `Authorization` | `Bearer <callback.apiKey>` when configured |

Contract: answer any 2xx quickly. The adapter then answers NHCX with the 202 acceptance body and an `X-Nhcx-Ledger-Id` header:

```json
{
  "timestamp": "11/09/2026 10:00:00:123",
  "api_call_id": "...", "correlation_id": "...",
  "result": { "sender_code": "...", "recipient_code": "...", "entity_type": "preauth", "protocol_status": "request.queued" },
  "error": { "code": "", "message": "" }
}
```

A non-2xx from your HMIS becomes `CALLBACK_HTTP_<n>` and NHCX redelivers. NHCX makes five attempts, then drops the correlation id. Your handler must therefore be idempotent on `x-hcx-api_call_id`. Do not do slow work inside the callback: store the envelope, answer 200, apply it after. Apply a delivery on a context detached from the incoming request, so a gateway that hangs up cannot roll the write back.

The HMIS callback handler:

- Routes `POST /callback`, `POST /callback/<path:route>` and `POST /nhcx/callback`.
- Takes an optional shared secret on the query string (`?token=`).
- Reads `X-Hcxkit-Type`, `X-Hcxkit-Flow` and `X-Hcxkit-Payload-Kind`.
- Archives the envelope before applying it.
- Answers `400` for an unreadable body, because redelivery cannot help. Anything unexpected becomes a 500, so the adapter retries.
- Returns `{"status": "settled" | "unmatched" | "ignored"}`.
- Routes by correlation id, never by path.

## 7. The ledger

Layout: `ledger.dir/<yyyy-mm-dd>/<id>.json`, one file per message, plus `<yyyy-mm-dd>/index.jsonl` with one summary line per message. Ids are eight base32 characters (alphabet `0-9A-V`), a day prefix and a counter that restarts each day: `7UMV0001` is the first message of its day. Pruned hourly by `retentionDays`.

Entry fields: `id, direction (out|in), created_at, path, entity, action, kind (request|response), format (fhir|protocol|json), sender, recipient, correlation_id, api_call_id, request_id, workflow_id, hcx_status, status, error{code,message}, redelivery, duration_ms, peer{url,status_code,response}, also[], headers{}, fhir{}, fhir_summary{resource_type,bundle_type,entries,resource_types,focus,identifier,patient,outcome}`.

`status` values: outbound `accepted`, `rejected`, `failed`; inbound `delivered`, `delivery_failed`, `rejected`.

Thread: `{correlation_id, entity, workflow_id, counterparty, role (initiator|responder), state, started, updated, messages[]}`. `state` is derived by walking the messages in order:

- `awaiting_response`: you sent a request.
- `awaiting_our_response`: a request reached you.
- `partial`: a `response.partial` arrived.
- `completed`: a response closed it.
- `error`: a rejection, a failed send or delivery, a protocol message, or an `error` status.
- `unknown`.

Two ledger behaviours you rely on. An outbound `on_` response with no `correlation_id` is threaded to the newest matching inbound request. An inbound whose `api_call_id` was seen before is flagged `redelivery: true`.

CLI, same data, no server needed for `follow`:

```sh
nhcx-adapter ledger list --since 24h --entity preauth --status rejected
nhcx-adapter ledger follow --direction in
nhcx-adapter ledger show 7UMV0007
nhcx-adapter ledger thread <CORRELATION_ID>
nhcx-adapter ledger stats
nhcx-adapter decrypt --file body.json
nhcx-adapter cert <PARTICIPANT_CODE>
nhcx-adapter send --path v1/preauth/submit --recipient <PAYER_CODE> --file bundle.json
```

## 8. hcxkit-compatible endpoints

A client written against hcxkit polls the adapter for the other side's answer instead of only waiting for its callback. The adapter serves the sliver of hcxkit's `/internal` API that such a client needs. None of these need the API key. Keep the adapter's port off any network you do not control (`nhcx-package/docs/02-Getting Started/10-NHCX Adapter.md`, "Before you expose it").

| Route | Body | Answers |
| --- | --- | --- |
| `GET /internal/config/get` | none | `{participant{participantId,name,callbackUrl}, participants[], CMID, env, urls{nhcx,participant,sessions}}` |
| `POST /internal/participants/search` | `{"participant_code": "<CODE>"}` | `{participants:[registry record + participant_code, participant_name, endpoint_url, status, roles]}`; an unknown code is `{participants: []}` |
| `POST /internal/txn/related` | `{"txnId": "<LEDGER_ID>"}` | every ledger row on the same correlation id, both directions, as `{id, direction, status, sender, recipient, correlation_id, api_call_id, type, flow, created_at}`; `404 TXN_NOT_FOUND` when the ledger no longer holds it |
| `POST /internal/txn/fhir` | `{"txnId": "<LEDGER_ID>"}` | `{meta{type,payloadType,path,time}, jwe_headers, fhir}`, the same envelope shape a delivery carries |
| `POST /internal/txn/dispatch` | `{"txnId": "<LEDGER_ID>"}` | `{txnId, status}` with `dispatch_failed` for a failed or rejected send, `dispatched` for accepted or delivered, plus `errorCode`, `errorMessage` |
| `GET /internal/txn/list?limit=200` | none | the recent ledger, newest first, same row shape |
| `POST /internal/policies/search` | `{"identifiertype": "MemberId", "MobileNo" or "AbhaNumber", "identifiervalue": "..."}` (also `mobile`, `abhaNo`) | the ABDM registry's `participant/get/policies` answer, status passed through; "No policies found" is an error the caller reads as empty |
| `POST /internal/policies/abha/link`, `.../delink` | forwarded verbatim | registry answer |
| `POST /internal/participants/list` | forwarded verbatim | registry roster |
| `POST /internal/participants/certs` | `{"participantid": "<CODE>"}` | `{participant_code, encryption_cert}` |
| `GET /internal/participants/saved` | none | the configured profiles |

The polling pattern:

1. After a send, call `/internal/txn/related` with the stored `txn_id`.
2. Take the inbound rows on the thread that were not sent by you. Keep only rows addressed to the participant the send came from.
3. Fetch each with `/internal/txn/fhir`, newest first.
4. Take the first whose bundle carries the resource the reply is made of (ClaimResponse, CoverageEligibilityResponse, InsurancePlan, Task).
5. Apply it through the same code path the callback uses. Dedupe on `x-hcx-api_call_id`.

A `404` from `txn/related` means the ledger was reset. Settle the leg as an error instead of spinning.

## 9. curl examples

Set these once. The address is the adapter's default `listen`:

```sh
export ADAPTER=http://127.0.0.1:8090
export KEY=<ADAPTER_API_KEY_FROM_CONFIG_JSON>
export ME=<YOUR_PARTICIPANT_CODE>@hcx
export PAYER=<PAYER_PARTICIPANT_CODE>@hcx
```

Liveness and readiness:

```sh
curl -s $ADAPTER/healthz
curl -s $ADAPTER/readyz
```

Send a coverage eligibility check. Write the envelope to a file first. The bundle is the package's validation request, `nhcx-package/fhir/B1/validation.json`, with your own identifiers substituted. Run this from the project root that holds `nhcx-package/`:

```sh
python3 - <<'EOF'
import json, os
bundle = json.load(open("nhcx-package/fhir/B1/validation.json"))
env = {"jwe_headers": {"x-hcx-sender_code": os.environ["ME"],
                       "x-hcx-recipient_code": os.environ["PAYER"],
                       "x-hcx-workflow_id": "<YOUR_CASE_NUMBER>"},
       "fhir": bundle}
json.dump(env, open("/tmp/coverage-out.json", "w"))
EOF
curl -s $ADAPTER/fhir/out/v1/coverageeligibility/check \
  -H "Authorization: Bearer $KEY" -H 'Content-Type: application/json' \
  --data-binary @/tmp/coverage-out.json
```

Read the answer back from the ledger with the `correlation_id` from that response:

```sh
curl -s -H "Authorization: Bearer $KEY" "$ADAPTER/ledger/thread/<CORRELATION_ID>"
curl -s -H "Authorization: Bearer $KEY" "$ADAPTER/ledger?direction=in&entity=coverageeligibility&since=1h"
curl -s -H "Authorization: Bearer $KEY" "$ADAPTER/ledger/<LEDGER_ID>"
```

Same thread through the kit endpoints (no key):

```sh
curl -s $ADAPTER/internal/txn/related -H 'Content-Type: application/json' -d '{"txnId":"<LEDGER_ID>"}'
curl -s $ADAPTER/internal/txn/fhir    -H 'Content-Type: application/json' -d '{"txnId":"<LEDGER_ID>"}'
```

A session token for the PMJAY payer service or a registry call:

```sh
curl -s -H "Authorization: Bearer $KEY" $ADAPTER/token
```

Simulate a delivery to your own callback while the adapter is not involved (useful for the callback handler's unit test). This is the exact shape the adapter posts. Wrap the package's bare payer bundle, here the pre-auth approval `nhcx-package/fhir/C5/C5-approved-wf21.json`, as `{"meta":{...},"jwe_headers":{...},"fhir":<bundle>}` first:

```sh
python3 - <<'EOF'
import json
bundle = json.load(open("nhcx-package/fhir/C5/C5-approved-wf21.json"))
env = {"meta": {"type": "in", "payloadType": "fhir", "path": "v1/preauth/on_submit"},
       "jwe_headers": {"x-hcx-correlation_id": "<CID>", "x-hcx-api_call_id": "<ACID>",
                       "x-hcx-sender_code": "<PAYER_PARTICIPANT_CODE>@hcx",
                       "x-hcx-recipient_code": "<YOUR_PARTICIPANT_CODE>@hcx",
                       "x-hcx-status": "response.complete", "x-hcx-workflow_id": "21"},
       "fhir": bundle}
json.dump(env, open("/tmp/delivery.json", "w"))
EOF
curl -s -X POST "http://127.0.0.1:<HMIS_PORT>/nhcx/callback/v1/preauth/on_submit" \
  -H 'Content-Type: application/json' -H 'X-Nhcx-Path: v1/preauth/on_submit' \
  -H 'X-Nhcx-Payload-Kind: fhir' -H 'X-Nhcx-Correlation-Id: <CID>' -H 'X-Nhcx-Api-Call-Id: <ACID>' \
  -H 'X-Hcxkit-Txn-Id: <ACID>' -H 'X-Hcxkit-Type: preauth' -H 'X-Hcxkit-Flow: request' -H 'X-Hcxkit-Payload-Kind: fhir' \
  -H 'Authorization: Bearer <CALLBACK_SECRET>' \
  --data-binary @/tmp/delivery.json
```

## 10. The HMIS-side endpoints a build exposes

Use these as the model for what your HMIS needs. `<cid>` is the claim episode id.

| Method | Path | Purpose | Leg |
| --- | --- | --- | --- |
| GET | `/claims`, `/claims/new`, `/claims/<cid>` | list, policy search, detail | none |
| POST | `/claims` | open an episode from a chosen policy | none |
| GET | `/claims/<cid>/state` | the whole episode as JSON after the page-load polls | none |
| POST | `/claims/<cid>/check` | coverage eligibility (validation, benefits, discovery) | `v1/coverageeligibility/check` |
| POST | `/claims/<cid>/plan` | fetch or refresh the package master | `v1/insuranceplan/request` |
| GET | `/claims/<cid>/plan/forms`, `.../forms/<fid>`, `.../plan/<bid>` | questionnaires and one package | none |
| POST | `/claims/<cid>/link`, `/unlink` | attach or detach the admission | none |
| POST | `/claims/<cid>/preauth` | save the dossier draft | none |
| GET, POST | `/claims/<cid>/lines`, `.../lines/quantities`, `.../lines/<lid>/delete` | procedure, implant and tier lines | none |
| POST | `/claims/<cid>/forms` | save questionnaire answers | none |
| POST | `/claims/<cid>/auth` | auth-requirements ruling | `v1/coverageeligibility/check` |
| POST | `/claims/<cid>/submit` | pre-auth 12, query answer 19, enhancement 13, enhancement answer 131 | `v1/preauth/submit` |
| POST | `/claims/<cid>/predetermination` | a quote | `v1/preauth/submit` |
| POST | `/claims/<cid>/cancel` | cancel Task PC01 | `v1/task/submit` |
| POST | `/claims/<cid>/status` | status enquiry Task | `v1/task/submit` |
| POST | `/claims/<cid>/reprocess`, `/release` | reprocess or balance release, 36 | `v1/task/submit` |
| POST | `/claims/<cid>/queries/<qid>/reply`, `.../acknowledge` | communication reply or notification acknowledgement | `v1/communication/on_request` |
| POST | `/claims/<cid>/discharge` | record how the stay ended | none |
| POST | `/claims/<cid>/claim` | claim 15, query answer 161 or 151, resubmit 16 | `v1/claim/submit` |
| POST | `/claims/<cid>/claim/documents`, `/documents`, `/documents/required`, `.../delete` | attachments | none |
| GET | `/claims/<cid>/documents/<did>` | view an attachment | none |
| POST | `/claims/<cid>/payments/<pid>/ack` | resend a payment acknowledgement | `v1/paymentnotice/on_request` |
| POST | `/v1/<path>` under the registered `endpoint_url` (own transport), or `/callback`, `/callback/<route>`, `/nhcx/callback` (nhcx-adapter) | a delivery | inbound |

The HMIS configuration a build needs:

- The transport's settings: for nhcx-adapter, its base URL (it listens on `127.0.0.1:8090` by default) and API key; for your own transport, the ABDM client id and secret, the private key, and the sessions, NHCX and registry addresses (`references/transport-knowledge.md` section 3).
- The payer's participant code (`1518@hcx` for the PMJAY SHA Himachal Pradesh sandbox) and the payer's name.
- The callback shared secret.
- A workflow-id override table, JSON, that overrides the per-payer table key by key, for example `cancel=122`.
- A map from payer code to payer adapter, for example `1518=pmjay,<payer participant code>=generic`.
- The archive folder for cases, and a switch to turn the archive off.

The sender code is not an environment variable. It is the facility's participant code, held in the HMIS's own settings.

## 11. What the adapter client looks like in code

The whole client is one function, `_api(path, payload, timeout, method, claim_id, use_case)`. It builds the URL from the base, adds `Authorization: Bearer` when a key is set, POSTs JSON, raises `GatewayError(message, status)` on any non-2xx or network failure, decodes JSON, and archives the envelope beside the case when `claim_id` is given. Every send in the module goes through it, which is what lets a test replace it with a stub:

```python
posted = {}
def _ack(path, payload=None, **kw):
    posted["path"], posted["payload"] = path, payload
    return {"txn_id": "01PLAN", "correlation_id": "corr-plan-1"}
claims._api = _ack
```

Give your HMIS the same single door.
