# Quickstart

You find [PM-JAY](/docs/pr-107/docs/uhi/v1/getting-started/glossary#pm-jay-hem) empanelled hospitals near a point here, in four steps: enter your IDs, sign, send, and see the hospitals arrive on your callback.

## Before you start

- **Your sandbox registration.** Your subscriber ID and public key ID, from [sandbox registration](/docs/pr-107/docs/uhi/v1/getting-started/sandbox).

- **The Header Generation Utility**, with your private key, on your own machine.

- **A callback.** Expose `POST <your consumer_uri>/on_search` on a public HTTPS URL. It replies 200 with this body at once, then stores the request:

  ```json
  { "message": { "ack": { "status": "ACK" } }, "error": {} }
  ```

1.
2.
3.
4.

### Enter your IDs

Type the two values your sandbox registration gave you.

Subscriber IDconsumer\_urihttps\://Your public HTTPS callback base URL.

Change location

Latitude17.3787973Longitude78.4368433Radius, km13.0

### Sign it

Copy this body, sign it on your own machine, and paste what the utility prints.

Enter your IDs in step 1 first.

### Send it

Run this in a terminal.

```bash
curl -X POST https://uhigatewaysandbox.abdm.gov.in/api/v1/uhi/search \  -H 'Content-Type: application/json' \  -H 'Authorization: <AUTHORIZATION_FROM_THE_HEADER_GENERATION_UTILITY>' \  -H 'Digest: BLAKE-512=<DIGEST_FROM_THE_HEADER_GENERATION_UTILITY>' \  --data-binary '<THE_BODY_FROM_STEP_2>'
```

You get 200 and ACK straight away.

### See the hospitals

Within seconds your callback receives on\_search, with the hospitals in message.catalog.providers\[].

Check `context.transaction_id` is `your id`.

One hospital, as it arrives. Sandbox data differs

```json
{  "id": "HOSP27G13867",  "descriptor": { "name": "General Hospital Wardha", "code": "G" },  "categories": [ { "descriptor": { "name": "Cardiology", "code": 100002 } } ],  "fulfillments": [    { "type": "Establishment Date", "start": { "time": { "timestamp": "1915" } } },    { "type": "Empaneled Date", "start": { "time": { "timestamp": "2018-09-14 16:03:16.0" } } }  ],  "location": { "gps": "15.497097,80.048688", "district": { "name": "PRAKASAM" } },  "contact": { "phone": "<MOBILE_NUMBER>", "tags": { "nodalOfficerNumber": "<MOBILE_NUMBER>" } }}
```

If it does not work

| Symptom                             | Likely cause                                                                           |
| ----------------------------------- | -------------------------------------------------------------------------------------- |
| 401 on step 3                       | Header signed over a different body, a reused or expired signature, or the wrong keyId |
| 403 on step 3                       | Public key not registered, or registration not yet active                              |
| ACK but no callback                 | consumer\_uri not publicly reachable over HTTPS, or your endpoint did not return 200   |
| Callback arrives but is not matched | Your code looked up the wrong transaction\_id                                          |
| Empty providers\[]                  | No empanelled hospital inside the radius. Widen it under Change location in step 1     |

## How this fits your product

Every UHI service your app adds later follows this exchange.

- **Signing, step 2.** Every outbound call carries a fresh signature. See [Signing](/docs/pr-107/docs/uhi/v1/concepts/signing).
- **The `ACK`, step 3.** The response to your call is only a receipt. See [Messages and callbacks](/docs/pr-107/docs/uhi/v1/concepts/messages).
- **The callback, step 4.** Results arrive on your [`consumer_uri`](/docs/pr-107/docs/uhi/v1/getting-started/glossary#consumer-uri), matched by `transaction_id`. Some services answer from many [HSPAs](/docs/pr-107/docs/uhi/v1/getting-started/glossary#hspa), so you aggregate.
- **Other services** change the domain and the filters. Physical Consultation and Ambulance Booking add [direct calls](/docs/pr-107/docs/uhi/v1/getting-started/glossary#direct-call-p2p) after `on_search`. See [Routes](/docs/pr-107/docs/uhi/v1/concepts/routes).

## If a call fails

Step 4 carries the symptom table. A `200` whose `error` is not empty carries the reason: [Errors on UHI](/docs/pr-107/docs/uhi/v1/concepts/errors) sets out the object and what to log.

Notes for AI agents

**What happens.** The search is sent to the sandbox Gateway, which returns `200` with an `ACK` at once. The results arrive later as `on_search` on the callback at your `consumer_uri`, matched by `transaction_id`. A failure shows at one of those two points.

**When it goes wrong.** Match the symptom, then fix its cause.

- A `401` on the send step: the header was signed over a different body, the signature was reused or has expired, or the key ID is wrong. Sign again and send the body byte for byte as signed.
- A `403` on the send step: the public key is not registered, or the registration is not yet active.
- An `ACK` but no callback: your `consumer_uri` is not publicly reachable over HTTPS, or your endpoint did not reply `200`.
- A callback arrives but is not matched: your code looked up the wrong `transaction_id`.
- An empty `providers` list: no empanelled hospital lies inside the radius. Widen the radius and search again.

## Next

[Build with AI](/docs/pr-107/docs/uhi/v1/getting-started/build-with-ai).
