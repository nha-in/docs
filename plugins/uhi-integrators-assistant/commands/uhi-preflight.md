---
description: Check what must be true before any UHI call, so a later failure is about the flow.
argument-hint: '[consultation|ambulance|pmjay-hem|blood-bank|jan-aushadhi|notto]'
---

Check the preconditions for `$ARGUMENTS` before building anything. With no argument, check what every service needs.

Each item below can fail in a way that reads as something else, which is why they are checked first rather than diagnosed later. Load the service's skill, `uhi-integrators-assistant:uhi-pmjay-hem` for example, for the values each item is checked against.

## Every service

- **A subscriber ID and a public key ID**, from sandbox registration. The signature's `keyId` carries both, as `<subscriber-id>|<pub-key-id>|ed25519`.
- **An Ed25519 key pair, with only the public key shared.** The public key was submitted at sandbox registration. The private key sits in server-side secret storage, never in a mobile or browser build, a repository or a log.
- **A callback URL that is public over HTTPS.** For an EUA it is `consumer_uri`, and it shares a domain name with `consumer_id`. Call it from outside your network. It answers `200` with the `ACK` body at once, before any processing.
- **A fresh `message_id` per call**, and one `transaction_id` per exchange, created at `search` and reused on every call through `confirm`. Store both before the call leaves.
- **`timestamp` in RFC 3339 format**, set when the request is generated, as in `2022-11-14T07:20:54.005277Z`.
- **A signature built fresh for every request**, retries included, over the exact bytes you send. Run `/uhi-prove-signing` before the first flow.
- **The Gateway host for the environment.** `https://uhigatewaysandbox.abdm.gov.in` in the sandbox.

## Consultation and ambulance

Both go direct between EUA and HSPA after discovery: consultation from its second search onwards, ambulance for `init` and `on_init`.

- **The counterparty's key, from the network registry lookup.** Trust it only while `status` is `SUBSCRIBED` and the current time falls between `valid_from` and `valid_until`.
- **`provider_uri`**, taken from the `context` of the `on_search` the patient chose. Direct calls go there, never to the Gateway, which has no endpoint for them.
- **The header by route.** A forwarded call carries `X-Gateway-Authorization`. A direct call carries the sender's `Authorization`.
- **For a consultation HSPA, the four audit copies**, one each for `on_confirm`, `on_status`, `on_update` and `on_cancel`, each an exact copy of the body sent to the EUA. The consultation skill names the audit endpoints.

## An EUA, for any service

- **Milestone 2 on HIE-CM, completed.** An app without it cannot be onboarded onto any UHI service. The `abdm-integrators-assistant` plugin carries it, in its `abdm-m2` skill.

## Output

One line per item: what was checked, and what was observed. Name anything you could not check rather than passing it silently.
