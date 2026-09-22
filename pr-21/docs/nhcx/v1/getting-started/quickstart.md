# Quickstart

Make your first three National Health Claims Exchange (NHCX) calls with nothing but your sandbox credentials. You get a session token, look up the dummy payer in the participant registry, and fetch the certificate you would seal its messages with.

## In short

- Three calls, in order: session token, participant search, fetch certificate.
- None of them changes anything and none has a callback, so you need no server yet.
- The two registry calls carry the token in `bearer_auth`, with `Bearer` and a space in front.
- The counterparty is the sandbox [dummy payer](/docs/pr-21/docs/nhcx/v1/getting-started/glossary#messages), `1000003538@hcx`.

## Prerequisites

- An [ABDM](/docs/pr-21/docs/nhcx/v1/getting-started/glossary#organisations-and-programmes) sandbox client ID and client secret, with NHCX sandbox roles assigned. [Get your sandbox credentials](/docs/pr-21/docs/nhcx/v1/getting-started/get-your-sandbox-credentials) if you do not have them.
- A terminal with `curl`, and a way to generate a universally unique identifier (UUID).
- A clock synchronised with NTP, because the session call carries the current time.

## 1. Get a session token

```bash
curl --location --request POST 'https://dev.abdm.gov.in/api/hiecm/gateway/v3/sessions' \  --header 'Content-Type: application/json' \  --header 'REQUEST-ID: <uuid>' \  --header 'TIMESTAMP: <iso timestamp>' \  --header 'X-CM-ID: sbx' \  --data-raw '{    "clientId": "<client id>",    "clientSecret": "<client secret>",    "grantType": "client_credentials"  }'
```

[Session token in the API reference](/docs/pr-21/docs/nhcx/v1/api/session/endpoints/session-session-token)

- `<client id>` and `<client secret>`: your ABDM sandbox client ID and client secret.
- `<uuid>` in `REQUEST-ID`: a fresh UUID you generate for this call. Generate a new one on every call.
- `<iso timestamp>` in `TIMESTAMP`: the current UTC time with milliseconds and a trailing `Z`, such as `2026-09-04T06:15:51.975Z`.

You receive HTTP `200` with a non-empty `accessToken` and an integer `expiresIn`. The token lasts `expiresIn` seconds from the moment it arrives. Keep it for the next two steps.

## 2. Look up the dummy payer

```bash
curl --location --request POST 'https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/participant/search' \  --header 'Accept: application/json' \  --header 'Content-Type: application/json' \  --header 'bearer_auth: Bearer <access token>' \  --data-raw '{    "participant_code": "1518@hcx"  }'
```

[Participant search in the API reference](/docs/pr-21/docs/nhcx/v1/api/registry/endpoints/registry-participant-search)

- The sample body carries `1518@hcx`. Replace it with the code of the participant you are looking up. For the sandbox dummy payer, that is `1000003538@hcx`.
- `<access token>`: the `accessToken` from step 1.

You receive HTTP `200` with a `participants` array. Its entry carries the code you sent, its roles and its status. A participant is ready to receive messages when its status is `Active`, and its `endpoint_url` and `encryption_cert` are filled.

## 3. Fetch its certificate

```bash
curl --location --request POST 'https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/fetch/certs' \  --header 'Accept: application/json' \  --header 'Content-Type: application/json' \  --header 'bearer_auth: Bearer <access token>' \  --data-raw '{    "participantid": "1518@hcx"  }'
```

[Fetch certificate in the API reference](/docs/pr-21/docs/nhcx/v1/api/registry/endpoints/registry-fetch-certs)

- The sample body carries `1518@hcx` in `participantid`. Replace it with the code you looked up in step 2, `1000003538@hcx` for the dummy payer.
- `<access token>`: the same `accessToken` from step 1, in the same header.

You receive HTTP `200` with PEM text in `encryption_cert`. Some participants register a bare SubjectPublicKeyInfo (SPKI) public key rather than a full X.509 certificate. Import the value as an X.509 certificate first, and fall back to SPKI if that fails.

## What you have now

A token that every NHCX call accepts, a counterparty you know is on the network, and the key that seals its messages. Those are items 1, 4 and 5 of [the base framework](/docs/pr-21/docs/nhcx/v1/getting-started/the-base-framework).

## When it goes wrong

| What you see                       | Cause                                                                          | What to do                                                                                                                  |
| ---------------------------------- | ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| The session call is refused        | `grantType` missing, `REQUEST-ID` reused, or `TIMESTAMP` from a drifting clock | Fix all three and call again                                                                                                |
| `401` on step 2 or 3               | The token expired, or went out without the `Bearer `prefix                     | Get a fresh token and retry once                                                                                            |
| `400` or an empty result on step 2 | The body used `participantid`                                                  | This call takes `participant_code`                                                                                          |
| `400` or no certificate on step 3  | The body used `participant_code`                                               | This call takes `participantid`                                                                                             |
| No entry for the code              | The code is wrong or not registered                                            | Pick it again from [the participant list](/docs/pr-21/docs/nhcx/v1/api/registry/endpoints/registry-fetch-participants-list) |

## Next steps

- [Your Certificate](/docs/pr-21/docs/nhcx/v1/getting-started/your-certificate): make your own key pair, the counterpart of the one step 3 fetched.
- [Creating and Updating a Participant](/docs/pr-21/docs/nhcx/v1/getting-started/creating-and-updating-a-participant): register your certificate and callback address.
- [Building and Sending a JWE](/docs/pr-21/docs/nhcx/v1/getting-started/building-and-sending-a-jwe): seal a message with the certificate from step 3.
