# Submit the dummy payer, act on a request

`POST /process/request`

Makes the sandbox dummy payer, participant `1000003538@hcx`, approve, reject or query a pre-authorisation or claim you have submitted, by correlation ID.

### Business purpose

The sandbox hosts a payer that answers back, and this hook decides what it answers. It closes the loop on the first message a new integration sends. Whichever answer comes back proves the token works, the participant record is live, the exchange can reach the provider's address, the dummy payer could open the message, and the provider could read its reply.

### When to use

Sandbox testing only, after submitting a pre-authorisation or claim addressed to the dummy payer. `action` is `Approve`, `Reject` or `Query`. `method` is `Preauth` or `Claim`. `correlationId` is the correlation ID of the request you sent.

### Preconditions

- A pre-authorisation or claim has been sent to the dummy payer, `1000003538@hcx`, and you hold its correlation ID.
- Your callback address is registered, reachable by the exchange, and answers 202 within 30 seconds.
- An ordinary ABDM session token on `bearer_auth`.

### Postconditions

The answer arrives on your callback for the request's family, `/v1/preauth/on_submit` for a pre-authorisation, as a sealed `ClaimResponse` or as a `ProtocolResponse` carrying a refusal, on the correlation ID you sent. A `Query` makes the dummy payer raise a communication request instead, which you answer on `/v1/communication/on_request` before the decision comes back on `on_submit`.

### Common mistakes

- Passing the correlation ID of a request that was not addressed to the dummy payer.
- Waiting for the decision after a `Query` without answering the communication request first.
- Treating a refusal of the empty smoke-test bundle as a failure. The dummy payer rejects it because there is no `Claim` inside, and that rejection is the expected answer.

### Best practices

- Test all three outcomes of each flow, not only approval.
- Make the callback handler idempotent, since the exchange retries a missed receipt.
- Keep this hook out of production code paths. It exists only in the sandbox.

### Related scenario

A new provider integration sends the empty bundle from its smoke test to the dummy payer on `/v1/preauth/submit` and gets 202. It posts this hook with `action` `Approve`, `method` `Preauth` and that request's correlation ID. A `ProtocolResponse` refusing the empty bundle lands on its `/v1/preauth/on_submit`, the handler answers 202, and the base framework is proven end to end.

### Specification

Chapter [Building and sending a JWE](/docs/nhcx/v1/getting-started/building-and-sending-a-JWE) of the NHCX integration specification.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/pmjay/sbxhcx/dummyhcxpayer/process/request \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'bearer_auth: Bearer <access token>' \
  --header 'Content-Type: application/json' \
  --data '{
  "action": "Approve",
  "method": "Preauth",
  "correlationId": "<correlation id>"
}'
```

## Authorization

- `Authorization` (bearer token, required): On every NHCX call, the token goes in a header called `bearer_auth`, with the word `Bearer` and a space in front. The sources are not unanimous: the authentication page and the FAQ both write the example as `Authorization`, and the notification endpoint uses `Authorization`. The safe course, and what the adapter does, is to send both headers with the same value.

## Headers

- `bearer_auth` (string, required): It is `bearer_auth`, not `Authorization`, on NHCX's own endpoints.

## Body

- `action` (string)
- `method` (string)
- `correlationId` (string)

## Responses

- `200`: The answer arrives on your callback for the request's family, `/v1/preauth/on_submit` for a pre-authorisation, as a sealed `ClaimResponse` or as a `ProtocolResponse` carrying a refusal, on the correlation ID you sent.
