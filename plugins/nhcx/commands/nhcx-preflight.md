---
description: Check everything an NHCX send depends on, offline, before the first message goes out.
argument-hint: '[path to the project, defaults to the current directory]'
---

Check that `$ARGUMENTS` has everything an NHCX send depends on, before any message goes out. Reading and offline commands only. Never send live traffic from this command.

Every row is answered with the file, the line or the command output that proves it. A row without proof is a gap, not a pass.

## The participant

| Check | Proof |
|---|---|
| A participant code is configured, and it is the one on the registry record | the config key, and the value |
| The private key the app holds matches the certificate on the participant record | a JWE that will not decrypt on arrival means these two disagree |
| Client id, secret and key reach the process the way the app's other secrets do | the loader, not a literal in source |

## The send path

| Check | Proof |
|---|---|
| One module sends. Not two transports side by side | the single `send` function, and that a test can replace it |
| The seal is `RSA-OAEP-256` with `A256GCM`, never `RSA-OAEP` | the protected header in code |
| The bundle is sealed with the recipient's certificate, not your own | where the recipient key is fetched |
| The recipient is the policy's `processingid`, kept as `recipient_code` | the policy lookup |
| `x-hcx-ben-abha-id` is optional: set it when the beneficiary has an ABHA number, and never block a send because it is absent | the header map |
| `txn_id`, `correlation_id` and `api_call_id` are stored before the POST | a failed POST can still have landed, and these are the only handle on it |

## The receiving end

| Check | Proof |
|---|---|
| One callback door, reachable from outside, with the auth middleware exempted | the route, and the proxy or deployment manifest that forwards it |
| `/v1/error` is hosted beside the other callbacks | the exchange reports undeliverable messages there. Without it you never find out |
| Inbound is matched on `x-hcx-correlation_id` first, the claim number second | never on path or arrival order |
| Deliveries are deduplicated on `x-hcx-api_call_id` | NHCX redelivers an unacknowledged message up to five times |
| The door answers 2xx before slow work | the exchange allows 30 seconds for the receipt |

## Output

One table: check, verdict (present, partial, absent), proof. Then the absent and partial rows in the order they block a first send. The detail behind every row is in any NHCX skill's `references/CORE.md` and its `gateway/` specs, `G11-startup-checks.md` first.
