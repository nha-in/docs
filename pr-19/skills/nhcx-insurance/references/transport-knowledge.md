# Transport knowledge: how the build reaches NHCX

Every NHCX message is a FHIR bundle sealed in a JWE, sent with an ABDM session token, and answered later on the sender's own callback. Something has to do that work. This file says which of three things does it for a build, what the rest of the build expects from it, and how to build it yourself.

Section 3 is drawn from NHA's published chapters: `nhcx-package/docs/02-Getting Started` (01 to 09, and 11), `nhcx-package/docs/01-Overview/04-JWE, Status and Errors.md` and `nhcx-package/docs/06-Reference/03-Envelope Fields.md`. Open them when a detail matters. Where they and this summary differ, they win.

## 1. Three transports

| Transport | Choose it when | The build |
| --- | --- | --- |
| `existing` | Stage 0 found the app already speaks NHCX: its own client that seals and posts JWEs, a vendor gateway or middleware, an HCX SDK, callbacks under `/v1/...` | Keeps it. Wraps it behind the contract in section 2 and closes the gaps section 4 lists. Never replaces a working one. |
| `own` | The app has no NHCX integration, and the user has not asked for nhcx-adapter. This is the default. | Builds the protocol into the app (section 3): the session token, the key and certificate, the participant record, the recipient's certificate, sealing and sending, the callback and its receipt. |
| `adapter` | Only when the user asks for nhcx-adapter, by name or by asking for "the adapter" | Downloads it (section 5) and talks plain FHIR to it. `references/api-knowledge.md` is its contract. |

The rules:

- Never propose nhcx-adapter, and never choose it because it is easier. Use it only when the user has asked for it, and write their words into `nhcx-build/1-idea.md`.
- An app with an NHCX integration of its own keeps it, even when it is partial. Extend it; never put a second transport beside it.
- The choice is made once per app, at stage 1, from stage 0's verdict on `foundation.transport`. Every skill after the first reads it from `1-idea.md`.

## 2. The contract every transport meets

The rest of the build (modules 7.2 to 7.13) never sees the transport, only these functions:

| Function | Takes | Gives | Notes |
| --- | --- | --- | --- |
| `send(path, bundle, recipient, workflow_id, correlation_id = null, ben_abha_id = null, claim_no, usecase)` | The NHCX path (`v1/preauth/submit`), the bundle, the recipient's participant code, the workflow id; a correlation id only when answering (the communication reply, the payment acknowledgement); the beneficiary's ABHA, else the episode's by `claim_no` | `{txn_id, correlation_id, api_call_id, raw}` | Raises `TransportError(code, message, protocol_response, retryable)` on a refusal. Archives the outbound message. Every leg stores the three ids. |
| The receiving end | A delivery from the exchange (`own`, `existing`) or from nhcx-adapter | Calls 7.3's `receive(envelope)` with `{meta: {path, payloadType, redelivery}, jwe_headers: {every x-hcx- field}, fhir: <the bundle, the ProtocolResponse body, or the /v1/error report>}`; `payloadType` is `fhir`, `protocol` or `error` | Answers the sender as its transport requires (section 3.9 for `own`). The door does the rest. |
| `policies(id_type, value)` | `AbhaNumber`, `MemberId` or `MobileNo`, and the value | The participant service's answer, raw | Module 7.4 normalises it (section 3.6). |
| `participants(role)` | `PAYER`, `PROVIDER` or `TPA` | The registry's list | Cached for the day. |
| `token()` | nothing | The ABDM session token | For calls the transport does not make itself, such as the PMJAY payer service. |
| `thread(correlation_id)`, `fetch_missed(txn_id)` | | The messages on one thread; a missed answer | Only nhcx-adapter keeps a ledger to answer these. With `own` and `existing`, `thread` reads the per-case archive and `fetch_missed` answers `unavailable`; a lost answer surfaces through `/v1/error` and the status exchange instead (section 3.10). |

Two values every transport needs from the build, both from the policy lookup (section 3.6). The recipient is the policy's `processingid`, kept on the episode as `recipient_code`. The insurer is its `payerid`, kept as `payer_code`: it goes inside the bundle and chooses the payer adapter (module 7.11). And every message carries the beneficiary's ABHA number in `x-hcx-ben-abha-id`.

A test replaces `send` with a stub of the same signature (stage 9). Nothing else in the build changes for a test.

## 3. Building it yourself (`own`)

Seven things, in this order (`01-The Base Framework.md`): a token, a key and certificate, a participant record, the payer and policy lookups, the recipient's certificate, sealing and sending, and the callback. The last two are the ones every message uses.

### 3.1 Before you start

| Need | Why |
| --- | --- |
| The facility's HFR id | The registry that vouches for a hospital |
| ABDM sandbox client id and secret, Milestone 1 completed | NHCX uses the same credentials; there is no separate login |
| A public HTTPS server in India with a domain name | The exchange calls your callback; it will not call an IP address or a port number |
| `openssl` where the private key will live | The key pair |
| A JOSE library | RSA-OAEP-256 with A256GCM: `jose` on Node, `jwcrypto` on Python, Nimbus on Java, `jose-jwt` on .NET |

Ask the user for the credentials. Never write them, the token or the private key into code, a log or `nhcx-build/`.

### 3.2 Addresses and headers

From `nhcx-package/baseurl.yaml`:

| Service | Sandbox | Production |
| --- | --- | --- |
| ABDM session token | `https://dev.abdm.gov.in/api/hiecm/gateway/v3/sessions` | `https://apis.abdm.gov.in` plus the same path; confirm it in the onboarding letter |
| NHCX exchange, every use-case call under `/v1` | `https://apisbx.abdm.gov.in/hcx` | Shared by NHA after sandbox exit |
| Participant service | `https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice` | `https://apisprod.nha.gov.in/pmjay/hcx/participanthcxservice` |

Keep every address in configuration. Every call to the participant service and the use-case endpoints carries `Accept: application/json`, `Content-Type: application/json` and `bearer_auth: Bearer <token>`. The header is `bearer_auth`, not `Authorization`; some NHA pages write `Authorization`, so send both with the same value.

### 3.3 The session token

`POST` to the sessions address with three headers, none optional: `REQUEST-ID` (a fresh UUID on every call), `TIMESTAMP` (UTC with milliseconds and a trailing `Z`, from the system clock) and `X-CM-ID` (`sbx` on the sandbox, `abdm` in production). The body is `{"clientId", "clientSecret", "grantType": "client_credentials"}`. The answer carries `accessToken` and `expiresIn`.

- NHA's documents give its life as 300, 1200 and 6000 seconds. Rely on none: keep the token and when you got it, and fetch a new one when it is a few minutes old.
- On any `401`, get a new token and retry that call once. Never retry with the same token.
- Put `Bearer` and a space before the token. Without it, `401`.

`03-Session Token.md` also shows the two timestamp shapes in ten languages: the gateway's UTC `...975Z`, the exchange's `+05:30`.

### 3.4 Your key and certificate

```bash
openssl genpkey -algorithm RSA -out private.key -pkeyopt rsa_keygen_bits:2048
openssl req -new -key private.key -out request.csr
openssl x509 -req -in request.csr -signkey private.key -out certificate.crt -days 365
base64 -w 0 certificate.crt > certificate.b64      # macOS: base64 -i certificate.crt -o certificate.b64
```

`private.key` never leaves the server that receives callbacks. `certificate.b64` goes on the participant record as `encryption_cert`. Note the expiry: a lapsed certificate stops every sender. Replace it yearly (`04-Your Certificate.md`).

### 3.5 The participant record

On the sandbox, `POST <registry>/participant/create` with:

| Field | Value |
| --- | --- |
| `linked_registry_codes` | `["10001"]` (HFR) |
| `registryid` | Your ABDM client id on the sandbox; the HFR id in production |
| `roles` | `["10001"]` (provider) |
| `participant_name`, `scheme_code`, `state`, `district`, `primaryEmail`, `phone`, `primaryMobile` | The facility's |
| `encryption_cert` | The base64 certificate |
| `endpoint_url` | The base of your callback server |

The answer is your `participant_code`: the `x-hcx-sender_code` on everything you send. `participant/update` changes the certificate or the address. Production takes four steps with a passcode to the mobile on the HFR record (`v2/participant/create`, `validate`, `v2/participant/update`, `update/validate`), and `v2/update/cert` rotates only the certificate (`05-Creating and Updating a Participant.md`).

The exchange appends the use-case path to `endpoint_url`: a pre-auth decision arrives at `<endpoint_url>/v1/preauth/on_submit`. Only the client id that created the record may change it; any other gets NHCX-1015.

This is the user's onboarding, not the build's. The build writes the script or the settings screen; the user runs it with their credentials. Check it worked by fetching your own certificate back (section 3.7).

### 3.6 The payer and the policy

- Payers: `POST <registry>/fetch/participants/list` with `role` (`PAYER`, `PROVIDER`, `TPA`), `fromdate` and `todate` (`dd/MM/yyyy`), and optionally `entitytype` (`Gov`). There is no server-side search by name: fetch, filter locally, and cache for the day.
- Policies: `POST <registry>/participant/get/policies` with `identifiertype` and `identifiervalue`. Try `AbhaNumber` (no hyphens), then `MemberId`, then `MobileNo`, and stop at the first that returns a policy. Each policy carries `payerid`, `processingid`, `memberid`, `productid` and `productname`. The published answer is a sketch: read a real one before writing the parser, and keep it raw on the episode.
- Send to the processor. `processingid` is the envelope's recipient and whose certificate seals the message; `payerid` is the insurer named inside the bundle. They are the same when the insurer processes its own claims and differ when a TPA does. Addressing the `payerid` is the portal's seventh most common mistake. A policy with no `processingid` cannot be addressed: stop and say so (`06-Finding Participants and Policies.md`).

### 3.7 The recipient's certificate

`POST <registry>/fetch/certs` with `{"participantid": "<processingid>"}`. The answer is PEM text: usually an X.509 certificate, sometimes a bare SPKI public key (anything under about 400 bytes). Load it as a certificate and take its key; if that fails, load it as a key. NHA does not publish the JSON envelope around it, so read one real answer first. Cache by participant code for 24 hours, and refresh early when the other side stops being able to open your messages (`07-Fetching a Recipient Certificate.md`).

### 3.8 Sealing and sending

The protected header (`08-Building and Sending a JWE.md`, `06-Reference/03-Envelope Fields.md`):

| Field | Value |
| --- | --- |
| `alg`, `enc` | `RSA-OAEP-256`, `A256GCM`; not `RSA-OAEP` |
| `x-hcx-sender_code` | Your participant code |
| `x-hcx-recipient_code` | The policy's `processingid` on a request; the request's sender on an answer |
| `x-hcx-api_call_id` | A fresh UUID on every message, answers included |
| `x-hcx-request_id` | A UUID per request; optional, send it |
| `x-hcx-correlation_id` | On a request, this message's own `api_call_id`. On an answer, the request's `correlation_id`, so the two ids differ on an answer |
| `x-hcx-workflow_id` | The step code (`references/flow-knowledge.md` section 2). Optional in the specification, but payers key on it: send it wherever the sheet gives one |
| `x-hcx-timestamp` | ISO 8601 with `+05:30`, no milliseconds, from the system clock |
| `x-hcx-status` | `request.initiated` on a request; `response.complete` on an answer (an `on_` path) |
| `x-hcx-ben-abha-id` | The beneficiary's ABHA number without hyphens. Mandatory on every exchange |
| `x-hcx-use_case` | Optional: `New`, `Enhancement` or `Resubmit` on a pre-auth; `New` or `Resubmit` on a claim |

Seal with the JOSE library: the bundle as plaintext, the recipient's public key, the header above as the protected header, compact serialisation (five parts, four dots). POST `{"payload": "<jwe>"}` to `<nhcx base>/v1/<path>` with the headers of section 3.2. The sandbox collection also repeats the `x-hcx-` fields as HTTP headers; send them both ways.

What comes back:

| Answer | Means | The build |
| --- | --- | --- |
| `202` with a receipt (`protocol_status: request.queued`) | The envelope was valid and is queued. It is not the decision | Store `api_call_id` and `correlation_id`, and the archive id as `txn_id`; the leg waits |
| `400` | The envelope failed validation | Raise with the gateway's body; nothing went to the payer |
| `401` | The token expired, or `Bearer` is missing | New token, retry once |
| A connection dropped after the request was written | Unknown: it may have landed | Do not resend at once (`references/errors-and-debugging.md` section 7) |

A correlation id that failed at the gateway is retired. The next attempt needs a fresh `api_call_id` and a fresh `correlation_id` (`01-Overview/04-JWE, Status and Errors.md`).

### 3.9 Receiving

Host these under `endpoint_url` (`09-Receiving a Callback.md`): `/v1/coverageeligibility/on_check`, `/v1/insuranceplan/on_request`, `/v1/preauth/on_submit`, `/v1/claim/on_submit`, `/v1/predetermination/on_submit`, `/v1/search/on_submit`, `/v1/communication/request`, `/v1/paymentnotice/request`, `/v1/task/on_submit`, `/v1/on_status` and `/v1/error`. Build one handler. The path gives the receipt's `entity_type`; the correlation id routes everything else (module 7.3).

- The address: a domain over HTTPS with TLS 1.2 or newer, hosted in India, reachable from the exchange's outbound addresses `3.109.99.210`, `13.126.152.0` and `13.200.129.223`.
- The body: `{"type": "JWEPayload", "payload": "<jwe>"}`; or, when the recipient refused your message, `{"type": "ProtocolResponse", "x-hcx-...": ..., "x-hcx-status": "response.error", "x-hcx-error_details": {code, message, trace}}` with the fields in the clear. `/v1/error` carries neither: it is a plain report of a request the exchange gave up on after five attempts. Store it whole and do not parse it against a fixed schema.
- Open a `JWEPayload` with your private key: the protected header comes out in the clear and the bundle is the plaintext. A failure to decrypt means the message was sealed for a certificate that is not the one on your participant record.
- Answer every delivery with `202` and the receipt within 30 seconds, `/v1/error` and unrecognised messages included. Not `200`, and not an empty body:

  ```json
  {"timestamp": "dd/MM/yyyy HH:mm:ss:SSS", "api_call_id": "<from the header>", "correlation_id": "<from the header>",
   "result": {"sender_code": "<theirs>", "recipient_code": "<yours>", "entity_type": "preauth", "protocol_status": "request.queued"},
   "error": {"code": "", "message": ""}}
  ```

  `entity_type` is the path's second-to-last segment, or the last where that is `v1`, with `on_` stripped.
- Hand the door `{meta: {path, payloadType, redelivery}, jwe_headers, fhir}`: `payloadType` `fhir` with the bundle, `protocol` with the ProtocolResponse body as `fhir`, `error` with the `/v1/error` report. The door dedupes on `x-hcx-api_call_id`, archives, matches and applies, fast and with no outbound calls, so the receipt still goes inside the 30 seconds.
- The exchange signs its calls to you with a JWT (RS256; claims `jti`, `iss`, `sub`, `iat`, `exp`). No published source gives the NHCX public key or the header the token arrives in. Build the check with the key in configuration. While no key is configured, log that at every start, accept calls only from the three addresses above, and ask NHA for the key at onboarding. Never leave the check off silently.

### 3.10 Status and the error endpoint

- `/v1/status` asks the exchange what became of a message you sent. The payload is empty; `x-hcx-correlation_id` is that message's `api_call_id`. The answer arrives on `/v1/on_status` with `request.queued`, `request.dispatched` or `request.stopped` (redelivery exhausted; the correlation is retired). Call it when a case has been quiet longer than the payer's turnaround, never on a timer (`11-Status and Search.md`). `references/flow-knowledge.md` section 2 records what the sandbox did with it; keep the path configurable. This is not the claim's status Task of module 7.9.
- `/v1/error` is how you learn a request died. Without it a lost message is silent.

With no ledger to poll, these two, the per-case archive and the receipts are what an `own` transport has. A leg with no answer stays waiting; it never turns into an error on a timer.

### 3.11 Proving it

The sandbox's dummy payer answers when you trigger it. Send it a bundle, then `POST https://apisbx.abdm.gov.in/pmjay/sbxhcx/dummyhcxpayer/process/request` with `{"action": "Approve" | "Reject" | "Query", "method": "Preauth" | "Claim", "correlationId": "<yours>"}`. Its answer reaching your `/v1/preauth/on_submit`, sealed or as a ProtocolResponse, proves the token, the participant record, the address, the sealing and the opening together (`09-Receiving a Callback.md`, "Closing the loop"). This is live traffic: stage 10, rung 3, started by the user.

### 3.12 Pseudo code

```
settings.nhcx = {sessions, base, registry, cm_id, client_id, client_secret,       # from configuration, never from code
                 private_key, signing_key}                                          # signing_key empty until onboarding gives it

function token():
    if cache.token and age(cache.at) < 240s: return cache.token
    r = http_post(settings.nhcx.sessions, json = {clientId: settings.nhcx.client_id, clientSecret: settings.nhcx.client_secret,
                                                  grantType: "client_credentials"},
                  headers = {"REQUEST-ID": uuid4(), "TIMESTAMP": utc_millis_z(), "X-CM-ID": settings.nhcx.cm_id})
    cache = {token: r.json().accessToken, at: now()}
    return cache.token

function authed_post(url, body, extra_headers = {}):
    for attempt in (1, 2):
        t = token()
        r = http_post(url, json = body, timeout = 90,
                      headers = {"Accept": "application/json", "Content-Type": "application/json",
                                 "bearer_auth": "Bearer " + t, "Authorization": "Bearer " + t} + extra_headers)
        if r.status != 401: return r
        cache.token = null                                      # one retry, with a fresh token
    return r

function registry(path, body): return authed_post(settings.nhcx.registry + "/" + path, body)

function recipient_key(code):                                   # cached for 24 hours
    if certs[code] and age(certs[code].at) < 24h: return certs[code].key
    pem = pem_in(registry("fetch/certs", {participantid: code}).json())   # read one real answer first
    key = try_certificate(pem).public_key() or load_public_key(pem)       # X.509 first, bare SPKI second
    certs[code] = {key, at: now()}
    return key

function send(path, bundle, recipient, workflow_id, correlation_id = null, ben_abha_id = null, claim_no = null, usecase = ""):
    abha = digits(ben_abha_id or ben_abha(claim_no))
    if not recipient or not workflow_id or not abha: raise ValueError("recipient, workflow id and beneficiary ABHA are required")
    answer = path.split("/")[-1].startswith("on_")
    api_call_id = uuid4()
    header = {"alg": "RSA-OAEP-256", "enc": "A256GCM",
              "x-hcx-sender_code": with_hcx(settings.participant_code), "x-hcx-recipient_code": with_hcx(recipient),
              "x-hcx-api_call_id": api_call_id, "x-hcx-request_id": uuid4(),
              "x-hcx-correlation_id": correlation_id if answer else api_call_id,
              "x-hcx-workflow_id": str(workflow_id), "x-hcx-timestamp": now_ist_seconds(),
              "x-hcx-status": "response.complete" if answer else "request.initiated",
              "x-hcx-ben-abha-id": abha}
    jwe = jose_encrypt_compact(to_json(bundle), recipient_key(with_hcx(recipient)), protected = header)
    r = authed_post(settings.nhcx.base + "/" + path, {"payload": jwe}, extra_headers = without(header, "alg", "enc"))
    txn = archive.record(claim_no, usecase, "out", {path, header, bundle, status: r.status, response: r.text})
    if r.status >= 300:
        raise TransportError(code = "GATEWAY_HTTP_" + r.status, message = r.text, retryable = r.status >= 500)
    return {txn_id: txn, correlation_id: header["x-hcx-correlation_id"], api_call_id: api_call_id, raw: r.json()}

route POST /v1/<path:any>             # under endpoint_url; exempt from session auth and CSRF; the exchange's addresses only
function inbound(request, path):
    verify_nhcx_jwt(request, settings.nhcx.signing_key)      # when the key is configured; else logged at start, never silent
    body = parse_json_or_null(request.body)
    if path == "error":
        env = {meta: {path: "v1/error", payloadType: "error"}, jwe_headers: {}, fhir: body}
    elif body and body.type == "ProtocolResponse":
        env = {meta: {path: "v1/" + path, payloadType: "protocol"}, jwe_headers: x_hcx_fields(body), fhir: body}
    else:
        try: header, plaintext = jose_decrypt_compact(body.payload, settings.nhcx.private_key)
        except: archive.record(null, "undecryptable", "in", request.body); return 202, receipt({}, path, error = "DECRYPT_FAILED")
        env = {meta: {path: "v1/" + path, payloadType: "fhir"}, jwe_headers: header, fhir: parse_json(plaintext)}
    receive(env)                                                # module 7.3: dedupe, archive, match, apply; fast, no sends
    return 202, receipt(env.jwe_headers, path)                  # within 30 seconds

function receipt(h, path, error = ""):
    return {"timestamp": now_ist("dd/MM/yyyy HH:mm:ss:SSS"),
            "api_call_id": h["x-hcx-api_call_id"], "correlation_id": h["x-hcx-correlation_id"],
            "result": {"sender_code": h["x-hcx-sender_code"], "recipient_code": h["x-hcx-recipient_code"],
                       "entity_type": entity_type(path), "protocol_status": "request.queued"},
            "error": {"code": error, "message": ""}}

function entity_type(path):                                     # "v1/preauth/on_submit" -> "preauth"; "v1/on_status" -> "status"
    parts = ("v1/" + path).split("/"); seg = parts[-2] if parts[-2] != "v1" else parts[-1]
    return seg.removeprefix("on_")
```

## 4. Using an existing integration (`existing`)

How stage 0 recognises one: `x-hcx-`, `JWEPayload`, `RSA-OAEP-256`, `A256GCM`, a JOSE library among the dependencies, `bearer_auth`, a sessions URL on the ABDM gateway, `participanthcxservice`, `fetch/certs`, `participant/get/policies`, routes ending in `on_submit`, `on_check` or `on_request`, a vendor's NHCX or HCX client library, a separate gateway service the app calls.

What it must do, checked by running it offline with the network stubbed and a test key pair for the seal:

| Contract item (section 2) | Look at | Common gap |
| --- | --- | --- |
| `send` emits the protected header of section 3.8 | What it seals or posts | No `x-hcx-ben-abha-id`; a request correlation id that is not its own `api_call_id`; UTC timestamps; `RSA-OAEP` |
| The recipient | Who it addresses | The `payerid` instead of the `processingid` |
| The three ids back to the caller | Its return value | Only a success flag; the ids stay inside it |
| Receiving: a `202` receipt within 30 seconds on every path, `/v1/error` included | Its callback handler | `200` or an empty body; no `/v1/error`; slow work before answering |
| Handing on the header and the bundle | What it gives the app | The bundle without the header; no ProtocolResponse path |
| Dedupe on `x-hcx-api_call_id` | Its store | None |
| A record of every message | Its logs | Bodies not kept |

The build wraps it. 7.1's `send` calls the existing client and returns the three ids. The existing callback handler, after its receipt, calls 7.3's `receive` with the envelope of section 2. Each gap is closed in the existing code, in its style (stage 7, action `extend`). The existing transport is not rewritten, and no second one is added beside it. If it cannot be made to hand on the ids or the header, record `partial` and ask the user whether to extend it further or, with their agreement, build `own` in its place.

## 5. nhcx-adapter, only when asked

nhcx-adapter is NHA's optional single binary that does section 3 for you (`nhcx-package/docs/02-Getting Started/10-NHCX Adapter.md`, titled "Optional"). Use it only when the user has asked for it. Then:

1. Get it, with the user's go-ahead, from https://github.com/nha-in/nhcx-adapter/releases (the latest). Each release carries one archive per platform, `nhcx-adapter_<version>_<os>_<arch>.tar.gz` (darwin, linux, windows, freebsd; amd64, arm64, 386), holding the binary, `config.sample.json`, `serve.sh`, `stop.sh`, `update.sh` and `README.md`. Put it in a folder of the user's, not in the skill.
2. Its contract is `references/api-knowledge.md`: configuration (section 2), routes (3), the outbound envelope and answer (4, 5), the delivery your HMIS receives (6), the ledger (7), the kit endpoints (8).
3. Onboarding is sections 3.1 to 3.5 again: credentials, a key, a participant record, a public address. The adapter can generate and register the key itself (`config init`, `cert generate`, its startup checks).
4. It does not queue or retry, does not build or validate bundles, and does not verify who sent an inbound message beyond decrypting it. Its `/internal/*` routes have no authentication: bind it to loopback.

How it maps onto section 2: `send` POSTs `{jwe_headers, fhir}` to `<adapter URL>/fhir/out/<path>`; the receiving end is the HMIS route the adapter posts to (`api-knowledge.md` section 6); `policies` is `/internal/policies/search`; `thread` and `fetch_missed` are its ledger and `/internal/txn/*`.
