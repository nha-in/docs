# Provider: make the dummy payer send a payment notice

`POST /paymentNotice/init`

Makes the sandbox dummy payer send a payment notice to the provider named, on `/v1/paymentnotice/request`.

### Business purpose

A payment notice only follows a settled claim, which is slow to reach in a test. This hook makes the sandbox's dummy payer, `1000003538@hcx`, send one on demand, so a provider can build and test its payment notice handling and acknowledgement without waiting for a settlement.

### When to use

Use it in the sandbox to make the dummy payer send you a payment notice. Put your own participant code in `providerId`.

### Preconditions

- Your participant is registered with a reachable callback address.
- You host `/v1/paymentnotice/request` and answer it `202` within 30 seconds.
- A valid ABDM session token.

### Postconditions

The notice arrives on `/v1/paymentnotice/request`. You acknowledge it on `/v1/paymentnotice/on_request`.

### Common mistakes

- Triggering the notice before your `/v1/paymentnotice/request` handler is ready.
- Sending another participant's code in `providerId`.
- Never sending the acknowledgement on `/v1/paymentnotice/on_request`.

### Best practices

- Test both the receipt and the acknowledgement.
- Keep this hook out of production code paths. It exists only in the sandbox.

### Related scenario

A provider has built its payment notice handler. It posts this hook with its own participant code in `providerId`. A payment notice from the dummy payer arrives on its `/v1/paymentnotice/request`. The handler answers 202, opens and records the notice, and sends the acknowledgement on `/v1/paymentnotice/on_request`.

### Specification

Chapter [NHCX Use Cases](/docs/nhcx/v1/concepts/nhcx-use-cases) of the NHCX integration specification.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/pmjay/sbxhcx/dummyhcxpayer/paymentNotice/init \
  --header 'bearer_auth: Bearer <access token>' \
  --header 'Content-Type: application/json' \
  --data '{
  "providerId": "<participant code>",
  "claimNumber": ""
}'
```

## Authorization

- `bearer_auth` (apiKey, required): Every NHCX call carries the access token from the session call in a header named `bearer_auth`, as the word `Bearer`, a space and the token. NHCX reads `bearer_auth`, not `Authorization`.

## Body

- `providerId` (string)
- `claimNumber` (string)

## Responses

- `200`: The dummy payer sends a payment notice to the provider named, arriving on `/v1/paymentnotice/request`.
