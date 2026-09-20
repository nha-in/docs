---
description: Prove the JWE seal and open round trip offline, with a test key pair, before blaming the payer.
argument-hint: '[path to the sealing module]'
---

Prove that the seal in `$ARGUMENTS` produces a JWE the recipient can open, offline, with a test key pair. A payer that refuses a message cannot tell you whether the seal or the bundle was at fault. This can.

## What a correct seal is

| Part | Value |
|---|---|
| `alg`, `enc` | `RSA-OAEP-256`, `A256GCM`. Not `RSA-OAEP` |
| Plaintext | the bundle as JSON |
| Key | the recipient's public key, from its certificate. Never your own |
| Protected header | `alg`, `enc` and every `x-hcx-` routing field |
| Serialisation | compact: five parts, four dots |
| Body posted | `{"payload": "<jwe>"}` |

## The proof

1. Generate a throwaway RSA key pair and a self-signed certificate for it. This stands in for the recipient. Never use a real participant key.
2. Seal a pinned bundle from the NHCX package with the test certificate, through the app's own sealing function, not a copy of it.
3. Count the parts. Five parts and four dots, or the serialisation is wrong.
4. Decode the first part as base64url JSON without decrypting. It must carry `RSA-OAEP-256`, `A256GCM` and the `x-hcx-` fields. If it carries `RSA-OAEP`, stop: that is the fault.
5. Open the JWE with the test private key. The plaintext must equal the bundle you sealed, byte for byte once both are parsed as JSON.
6. Open it with a second, unrelated key. It must fail. A seal any key can open is not a seal.

## Output

Each step, its command and its output. Then one line: proven, or the first step that failed and what it names.

Step 6 is the one that makes the rest mean something. A round trip that cannot fail proves nothing about the key. The sealing contract is in any NHCX skill's `references/transport-knowledge.md`, section 3.
