# Fetch certificate

`POST /fetch/certs`

Returns a participant's public encryption certificate (PEM X.509 or SPKI key) by participantid; cache it for 24 hours and use it to build the JWE.

### Business purpose

Every NHCX payload is encrypted end-to-end for exactly one recipient so that even the exchange cannot read the clinical and financial content it routes. That guarantee rests on each participant publishing a public certificate in the registry at onboarding. This call is how a sender obtains a counterparty's certificate before encrypting a request or a callback for it. It is item 3 of both sandbox-exit checklists and the endpoint the Integration Handbook names in its encryption steps.

### When to use

Call it before you encrypt the first message to a recipient, then cache the certificate for 24 hours. Fetch it again if encryption or decryption with that recipient fails.

### Preconditions

- You have a valid access token in the `bearer_auth` header.
- You send the recipient's code as `participantid`.
- The recipient has registered a certificate.

### Postconditions

You get the recipient's certificate or public key. Use it to encrypt messages to that recipient.

### Common mistakes

- Fetching the certificate before every request instead of caching it.
- Encrypting with your own certificate instead of the recipient's.
- Assuming the answer is always a full certificate. It may be a bare public key.
- Keeping a cached certificate after the recipient changed it.

### Best practices

- Cache per participantid with a 24-hour TTL, plus a negative path that evicts and re-fetches on encrypt or decrypt failures.
- Implement the import routine as X.509 first, SPKI fallback, treating the 400-byte size hint as diagnostic rather than a hard branch.
- Use the documented algorithm pair RSA-OAEP-256 and A256GCM.
- Re-fetch from the production registry at go-live; sandbox certificates do not carry over.
- Expect annual key rotation by counterparties; the 24-hour cache bounds exposure to a rotation you were not told about.

### Related scenario

A hospital is about to send its first pre-authorisation to payer 1518@hcx. The engine checks its certificate cache, finds no entry, and calls /fetch/certs with participantid 1518@hcx and a Bearer token. The response is a PEM X.509 certificate, which is parsed and cached for 24 hours. The engine builds the JWE protected header with x-hcx-sender_code, x-hcx-recipient_code 1518@hcx and the other x-hcx headers, encrypts the FHIR bundle with RSA-OAEP-256 and A256GCM using the fetched key, and POSTs to /v1/preauth/submit. Later that week the payer rotates its certificate; a PAYR-1001 on the next submission triggers eviction and a fresh fetch.

### Specification

Chapter [Finding participants and policies](/docs/nhcx/v1/getting-started/finding-participants-and-policies) of the NHCX integration specification.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/fetch/certs \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'bearer_auth: Bearer <access token>' \
  --header 'Content-Type: application/json' \
  --data '{
  "participantid": "1518@hcx"
}'
```

## Authorization

- `Authorization` (bearer token, required): On every NHCX call, the token goes in a header called `bearer_auth`, with the word `Bearer` and a space in front. The sources are not unanimous: the authentication page and the FAQ both write the example as `Authorization`, and the notification endpoint uses `Authorization`. The safe course, and what the adapter does, is to send both headers with the same value.

## Headers

- `bearer_auth` (string, required): It is `bearer_auth`, not `Authorization`, on NHCX's own endpoints.

## Body

- `participantid` (string)

## Responses

- `200`: HTTP 200 with a string body containing a PEM-encoded X.509 certificate or an SPKI public key, as uploaded by that participant.

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "_contentType": "string",
  "_body": "-----BEGIN CERTIFICATE-----\nMIIDdzCCAl+gAwIBAgIEbXq...\n-----END CERTIFICATE-----"
}
```
