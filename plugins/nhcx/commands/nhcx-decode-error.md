---
description: Turn an NHCX refusal into who refused it, what it means, and the named fix.
argument-hint: '<pasted ProtocolResponse, HTTP answer, or a PAYR-/NHCX- code>'
---

Decode `$ARGUMENTS` into who refused the message, what the refusal means, and the fix that clears it.

## Read who refused before you read the code

Three places refuse an NHCX message, and the family of the code says which. A parser written for one misses the others.

| What you hold | Who refused | Where it arrived |
|---|---|---|
| HTTP `400` or `401` on your own POST | the exchange, before the message went further | the answer to your call. A `401` is an expired token or a missing `Bearer` |
| A JWE your key will not open | your own receiving end | the certificate on your participant record is not the key you hold |
| `NHCX-*` | the exchange. The message never reached the payer | the HTTP answer to your call, or a `ProtocolResponse` on your callback later |
| `PAYR-*`, `ERR-PYR-*` | the payer. The message reached it | a `ProtocolResponse` on your callback, with `x-hcx-status: response.error` and `x-hcx-error_details {code, message}`, on the request's correlation id |

A `ProtocolResponse` is plain JSON, not a bundle. Read `type == "ProtocolResponse"` and `x-hcx-error_details`.

## Never match a PAYR code on its number alone

PAYR numbers are not unique. The same number means different things from different payers, and the sandbox reuses several with a meaning the published sheet does not give. Match on the code and the message text together, and log both.

## Then match it

If the nhcx-docs MCP server is connected, call `decode_error` with the code and trust it over any file. Otherwise read the code in the NHCX package's `nhcx-error.yaml`, which holds the gateway, standard payer and reference payer codes (any NHCX skill's `references/KNOWLEDGE.md` says how to fetch the package), or in the table at https://docs.abdm.gov.in/docs/nhcx/v1/reference/pmjay-error-codes. A PAYR code in PAYR-1001 to PAYR-1020 means different things from the standard payer and the PMJAY payer, so read it with its message.

## Output

1. Who refused, and where the code was found
2. The code, the message text beside it, and which meaning applies if the code collides
3. The named fix
4. The exit condition: the original leg settling, not the fix being applied

After an error the exchange retires the correlation id. The retry goes out on a fresh one.

Where no recorded code matches, say so and name the two most likely causes rather than picking one. Do not invent a code.
