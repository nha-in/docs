# The recipient cannot decrypt your message

The payer's answer is a clear-text `ProtocolResponse` carrying `PAYR-1001`: an error occurred while decrypting the payload. The recipient could not open your [JWE](/docs/pr-32/docs/nhcx/v1/getting-started/glossary#messages) with its private key. The fault is almost always on the sending side: the wrong certificate, the wrong algorithm or the wrong form.

## In short

- Seal with the certificate of the participant in `x-hcx-recipient_code`, fetched within the last 24 hours.
- Use `RSA-OAEP-256` with `A256GCM`, in compact form.
- Resend with a new correlation ID and a new API call ID.
- `PAYR-1002` is the reverse fault. Update your own registered certificate.

## Prerequisites

- You have the `ProtocolResponse`, including `x-hcx-error_details` and the correlation ID.
- You know which certificate you sealed with, and when you fetched it.

## Work through these in order

1. **Did you seal to the recipient you addressed?** The certificate must belong to the participant in `x-hcx-recipient_code`. [Fetch it](/docs/pr-32/docs/nhcx/v1/api/registry/endpoints/registry-fetch-certs), passing that code as `participantid`. When a [TPA](/docs/pr-32/docs/nhcx/v1/getting-started/glossary#organisations-and-programmes) processes the policy, that code is the `processingid`.
2. **Is your cached copy stale?** Cache a certificate for 24 hours at most. On `PAYR-1001`, fetch it again and resend. A recipient that rotated its key has a new certificate.
3. **Did the key import correctly?** The call can return a PEM X.509 certificate or a bare SubjectPublicKeyInfo (SPKI) public key. Try the X.509 import first, then fall back to the bare key.
4. **Are the algorithms right?** The protected header carries `alg` `RSA-OAEP-256` and `enc` `A256GCM`.
5. **Is the form right?** The body is `{"payload": "<JWE compact string>"}`, one compact string with four dots.
6. **Is the [protected header](/docs/pr-32/docs/nhcx/v1/getting-started/glossary#messages) complete?** Check every `x-hcx-` field against [Envelope Fields](/docs/pr-32/docs/nhcx/v1/reference/envelope-fields). The sender and recipient codes come from the registry. The API call ID and correlation ID are fresh.

The reverse fault has its own code. `PAYR-1002` means the payer could not seal its answer to you with the certificate registered for you. Update it with [the certificate update call](/docs/pr-32/docs/nhcx/v1/api/registry/endpoints/registry-v2-update-cert) or the participant update. The payer fetches the new one and sends its answer.

## What you see when it works

You resend with a new correlation ID and a new API call ID. The answer arrives as a sealed payload on your callback, not a `ProtocolResponse`. Your own code opens it with your private key.

## When it goes wrong

If every check passes and `PAYR-1001` persists, ask the recipient to confirm that its registered certificate matches the private key it decrypts with. Then write to `hcx.integration@nha.gov.in` with the recipient code and the correlation ID.

## Next steps

- [Fetching a Recipient Certificate](/docs/pr-32/docs/nhcx/v1/getting-started/fetching-a-recipient-certificate): which certificate, and how long to cache it.
- [Building and Sending a JWE](/docs/pr-32/docs/nhcx/v1/getting-started/building-and-sending-a-jwe): the algorithms and the compact form.
- [Your Certificate](/docs/pr-32/docs/nhcx/v1/getting-started/your-certificate): replacing yours when the payer reports `PAYR-1002`.
