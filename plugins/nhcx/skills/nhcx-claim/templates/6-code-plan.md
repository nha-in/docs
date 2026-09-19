# 6. Code plan

The transport, the configuration, the archive and the tests are the episode's: the first skill to run stage 6 writes them, and later skills use them. The modules table holds one row per module in ladder order; a skill adds its part to a module another skill placed.

## Modules

| Module | Skills and actions | Files | Depends on | Held to | Copy from | Tables | Screens |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 7.1 | | | | | | | |
| 7.2 | | | | | | | |
| 7.3 | | | | | | | |
| 7.4 | | | | | | | |
| 7.5 | | | | | | | |
| 7.6 | | | | | | | |
| 7.7 | | | | | | | |
| 7.8 | | | | | | | |
| 7.9 | | | | | | | |
| 7.10 | | | | | | | |
| 7.11 | | | | | | | |
| 7.12 | | | | | | | |
| 7.13 | | | | | | | |

## The transport

Kind: <existing | own | adapter, because the user asked for it>

| Function | Signature | Does |
| --- | --- | --- |
| send | | Seals and posts the bundle (`own`), calls the app's client (`existing`) or posts to the adapter (`adapter`); returns `txn_id`, `correlation_id`, `api_call_id` |
| receiving end | | Takes a delivery, answers the sender, hands the door `{meta, jwe_headers, fhir}` |
| policies, participants, token | | The participant service and the ABDM session |
| thread, fetch_missed | | The adapter's ledger when it is the transport; otherwise the per-case archive, and `unavailable` |

Stub for tests: the signature of `send`; records `(path, recipient, workflow_id, correlation_id, bundle)`; returns `{txn_id, correlation_id, api_call_id}`.

## Configuration

| Setting | Key or variable | Where read |
| --- | --- | --- |
| transport kind | | |
| ABDM client id and secret (own) | | |
| private key (own) | | |
| sessions, NHCX and registry addresses (own) | | |
| inbound authentication (own: the NHCX signing key; adapter: the callback secret) | | |
| adapter URL and API key (adapter only) | | |
| participant code | | |
| facility HFR id, name, phone | | |
| cases directory | | |
| workflow id overrides | | |

## Archive

Path: <from stage 4>. Outbound written by 7.1; inbound by 7.3.

## Tests

Location: <path>. Runner: <command>. Pin comparison: canonical JSON, `created` excluded, one per pin.

## Per skill

One short section per skill: the modules it touches, its action on each, and anything it changed in a module another skill placed.

### nhcx-<skill>
