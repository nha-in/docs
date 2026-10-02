# The ABDM gateway

The gateway is the routing layer for [ABDM](/docs/pr-101/docs/hiecm/v3/getting-started/glossary#abdm). You never call a hospital, a lab or a [PHR](/docs/pr-101/docs/hiecm/v3/getting-started/glossary#phr) app directly. The answer to a call arrives later at an endpoint you expose, and the gateway issues the access token every other call carries.

## Gateway and HIE-CM are not the same thing

[HIE-CM](/docs/pr-101/docs/hiecm/v3/getting-started/glossary#hie-cm) is the service: patient identity, care context links and consent. Its four modules and who builds which are on [Integration milestones](/docs/pr-101/docs/hiecm/v3/milestones).

The gateway is its front door. It authenticates you, validates your headers, and routes each call. Your consent request goes to `/api/hiecm/consent/v3/request/init` on the gateway host, and the gateway puts it in front of the patient's consent manager.

## HIE-CM is data blind

It never holds a patient's health record, only identifiers, metadata about where records live, and consent artefacts. Once consent exists the record goes straight from the system that holds it to the system that asked, encrypted. Your system keeps the data. HIE-CM keeps the permission.

## A 200 means accepted, not done

Nothing goes participant to participant. Every request is addressed to the gateway, which forwards it. Two things follow.

- **You get an acknowledgement, not an answer.** In the [M3](/docs/pr-101/docs/hiecm/v3/getting-started/glossary#m3) consent flow the [HIU](/docs/pr-101/docs/hiecm/v3/getting-started/glossary#hiu) asks, the HIE-CM returns the consent request id on a callback, and the patient's decision comes back later. Each call's page in the [API reference](/docs/pr-101/docs/hiecm/v3/api) names the callback it produces.
- **You have to be reachable.** Half of [M2](/docs/pr-101/docs/hiecm/v3/getting-started/glossary#m2) is endpoints the gateway calls on your system.

One exception. In the health information flow the HIU supplies a data push URL, and the HIP encrypts the records and pushes them there. That URL may differ from the HIU's registered gateway URL, to improve privacy. The permission came through the gateway. The bytes do not.

Match each callback to the call that caused it by `response.requestId`, which carries the `REQUEST-ID` you sent. Callbacks do not arrive in the order you sent the requests, and the same one can arrive twice, so a repeat must change nothing. Each callback is described in [the API reference](/docs/pr-101/docs/hiecm/v3/api).

Notes for AI agents

**Before you start.** A callback URL registered for your bridge and reachable over public HTTPS. Without it, no answer can arrive.

**What happens.** Send the call with a fresh `REQUEST-ID`, treat the 202 as receipt only, and wait for the callback. Key the handler on `response.requestId`, answer it quickly, and make a second delivery of the same request id a no-op.

**How you know it worked.** A callback reaches your URL whose `response.requestId` equals the `REQUEST-ID` you sent. Given three calls and two callbacks, the call whose request id has no callback is the one outstanding.

**When it goes wrong.** Nothing arrives: work through [the callback never arrives](/docs/pr-101/docs/hiecm/v3/troubleshooting/callback-never-arrives). A retry is appended as a new event: key on the request id. The code waits on the response body for the result: it never comes there, so the integration hangs.

## What moves through it

| Module                                  | What the gateway routes                                                                                                                                                                                                  | Reference                                           |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------- |
| [M1](/docs/pr-101/docs/hiecm/v3/api/m1) | Session tokens, and the calls that create and authenticate an ABHA identity                                                                                                                                              | [M1 API reference](/docs/pr-101/reference/hiecm-m1) |
| [M2](/docs/pr-101/docs/hiecm/v3/api/m2) | [Discovery](/docs/pr-101/docs/hiecm/v3/getting-started/glossary#discovery), care context linking, health information requests to a HIP                                                                                   | [M2 API reference](/docs/pr-101/reference/hiecm-m2) |
| [M3](/docs/pr-101/docs/hiecm/v3/api/m3) | Consent requests, consent notifications, artefact fetches, data flow requests                                                                                                                                            | [M3 API reference](/docs/pr-101/reference/hiecm-m3) |
| [M4](/docs/pr-101/docs/hiecm/v3/api/m4) | The [HPR](/docs/pr-101/docs/hiecm/v3/getting-started/glossary#hpr) and [HFR](/docs/pr-101/docs/hiecm/v3/getting-started/glossary#hfr) registry calls, which carry their own bearer token rather than the gateway session | [M4 API reference](/docs/pr-101/reference/hiecm-m4) |

The gateway holds no health record. It routes the permission and the metadata.

## The session endpoint

One endpoint issues the token every other call carries. It is the call [M1](/docs/pr-101/docs/hiecm/v3/getting-started/glossary#m1) uses. [M4](/docs/pr-101/docs/hiecm/v3/getting-started/glossary#m4) calls carry their own bearer token instead.

**POST** `/api/hiecm/gateway/v3/sessions`

Headers:

| Header         | Example value                          | What it is                                 |
| -------------- | -------------------------------------- | ------------------------------------------ |
| `REQUEST-ID`   | `18235d89-cb13-479d-ad71-7a57d5f669a8` | A fresh UUID for this call                 |
| `TIMESTAMP`    | `2022-10-06T15:10:00.587Z`             | The time you made the call, ISO 8601       |
| `X-CM-ID`      | `sbx`                                  | The consent manager. Use `sbx` for sandbox |
| `Content-Type` | `application/json`                     |                                            |

No `Authorization` header on this call. It is the one call with no token yet.

Body:

```json
{  "clientId": "<CLIENT_ID_FROM_SANDBOX_SIGNUP>",  "clientSecret": "<CLIENT_SECRET_FROM_SANDBOX_SIGNUP>",  "grantType": "client_credentials"}
```

Send the client id you were issued.

Response shape:

```json
{  "accessToken": "<JWT>",  "expiresIn": 1200,  "refreshExpiresIn": 1800,  "refreshToken": "<JWT>",  "tokenType": "bearer"}
```

The response carries the token in `accessToken`.

Send the token back as `Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>` on every other call. Headers per call, and the second token M1 login issues, are on [authentication](/docs/pr-101/docs/hiecm/v3/reference/authentication). Interactive: [gateway API reference](/docs/pr-101/reference/hiecm-gateway).

The session token says which application is calling, not which person. [M1](/docs/pr-101/docs/hiecm/v3/milestones/m1) profile calls also carry a user token in `X-token`, which login returns.

Notes for AI agents

**Before you start.** A client id and client secret from sandbox registration, held on your server. Never ship the secret in a mobile or browser build.

**What happens.** Call the session endpoint with `clientId`, `clientSecret` and `grantType` set to `client_credentials`. Send the `accessToken` it returns as `Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>` on every other gateway call. Renew before `expiresIn` runs out rather than on a fixed timer.

**How you know it worked.** The response carries `accessToken` and `expiresIn`, and the next gateway call with that token is not refused as unauthorised.

**When it goes wrong.** Every call returns 401: see [everything returns 401](/docs/pr-101/docs/hiecm/v3/troubleshooting/everything-returns-401). A profile call is refused while the session token is fresh: the `X-token` is missing, or it holds the short lived token from login verify, which the verify user call exchanges for the user token. `ABDM-1094` reads X-token expired, and the token sent is often the wrong kind rather than an old one.

## Which host

Two hosts serve gateway paths.

| Host                       | Environment |
| -------------------------- | ----------- |
| `https://dev.abdm.gov.in`  | Sandbox     |
| `https://apis.abdm.gov.in` | Production  |

Keep the host in configuration, not in code.

## Limits to code against

- **Callback retries.** Make your endpoint idempotent and assume a repeat.
- **Gateway token lifetime.** Read `expiresIn` from your own response rather than hard coding a value.
- **Rate limits.** Two codes enforce them: `ABDM-1022 Too many requests` and `ABDM-1027 You are blocked. Please try again after 24 hours.` The thresholds are not published, so back off on both.
- **Request signing.** The gateway request itself is not signed. Payload encryption and signing apply to health records, on the [M2](/docs/pr-101/docs/hiecm/v3/api/m2) side.

## Next

- [Authentication](/docs/pr-101/docs/hiecm/v3/reference/authentication), credentials and headers.
- [API references](/docs/pr-101/docs/hiecm/v3/api), every call and the callback it produces.
- [Integration milestones](/docs/pr-101/docs/hiecm/v3/milestones), the four modules and who builds which.
- [Registries](/docs/pr-101/docs/hiecm/v3/registries), who and what ABDM identifies.
- [Error codes](/docs/pr-101/docs/hiecm/v3/reference/error-codes), what a rejection means.
