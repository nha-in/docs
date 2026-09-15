---
description: Turn an ABDM response into the code, the cause and the named fix.
argument-hint: '<pasted response body, or an ABDM-nnnn code>'
---

Decode `$ARGUMENTS` into the error it names and the fix that clears it.

## Read the shape before the code

ABDM returns four error shapes and a parser written for one will miss three.

| Shape | Where the code is |
|---|---|
| `{"error": {"code": "ABDM-1204", ...}}` | `error.code`, from the service's business logic |
| `{"code": "ABDM-1094", "timestamp": ...}` | top level `code`, same family, no wrapper |
| `{"txnId": "Invalid Transaction Id", ...}` | no code. Every key but `timestamp` names a field you got wrong |
| `{"code": "900901", "description": ...}` | the API gateway in front of the service, before your request reached it |

Read `error.code` first and fall back to a top level `code`. A numeric code with a `description` field is an authorisation problem, not a business one.

## Then match it

Load the module's skill and read `references/debug.md`, which carries every recorded code for that module with its message and action. `abdm-m1` through `abdm-m4` on the provider side, `abdm-p1` for the patient side, where the PHR codes are recorded once for P1, P2 and P3 together.

## What a field validation body does not tell you

A body naming a field is reporting the field, not the cause. When the field carried an encrypted value, the encryption is the first thing to check and the value is the last. `{"loginId": "Invalid LoginId"}` on `/v3/enrollment/request/otp` is returned for every input, correct ciphertext included, so read no cause into it there.

## Output

1. The shape, and where the code was found
2. The code, its recorded message, and the atom id behind it
3. The named fix
4. The exit condition: the original call succeeding, not the fix being applied

Where no recorded code matches, say so and name the two most likely causes rather than picking one. Do not invent a code.
