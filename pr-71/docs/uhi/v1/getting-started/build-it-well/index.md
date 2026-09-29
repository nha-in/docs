# Build it well

A [UHI](/docs/pr-71/docs/uhi/v1/getting-started/glossary#uhi) call can be made correctly and still leave you with an app that shows nothing. What separates the two is handling: how you match an answer that arrives later, how you sign, how long you wait, and what the person sees while they wait.

## In short

- Match every callback on `transaction_id`. A mismatch is the most common reason an app never sees results.
- Sign every request fresh, over the exact bytes you send.
- Expect many `on_search` answers to one search, and group them.
- Nothing tells you the last answer has arrived. Set a timeout and render as results arrive.
- `on_search` is not paginated. Paginate on your side.

## Match on transaction\_id

Every call carries a `transaction_id` in its `context`. The [HSPA](/docs/pr-71/docs/uhi/v1/getting-started/glossary#hspa) echoes it, with `message_id`, in `on_search`. Store both before you send, and look each callback up by `transaction_id` first.

| Value            | Spans                                         | Use it to                                                 |
| ---------------- | --------------------------------------------- | --------------------------------------------------------- |
| `transaction_id` | One exchange, from `search` through `confirm` | Group every callback for one patient's search and booking |
| `message_id`     | One request and its callback                  | Tie one callback to the request that caused it            |

[Messages and callbacks](/docs/pr-71/docs/uhi/v1/concepts/messages#match-on-transaction-id-and-message-id) sets out the whole `context` block.

## Sign every request fresh

Every outbound request carries an Ed25519 signature in `Authorization`, and the body hash in `Digest: BLAKE-512=<base64>`. A signature carries `created` and `expires` timestamps, so a reused header fails with an expired signature or a `401`.

| Rule                                                 | What it costs to skip                                                            |
| ---------------------------------------------------- | -------------------------------------------------------------------------------- |
| Sign each request when you send it, retries included | A reused header fails with an expired signature or a `401`                       |
| Send the body byte for byte as you signed it         | A reformatted or re-serialised body breaks the digest, which shows up as a `401` |
| Keep the private key on your server                  | Share only the public key. Nothing else ever needs the private one               |

The [Header Generation Utility](https://github.com/NHA-ABDM/UHI/tree/main/header_generator_utility) signs each payload, so you do not implement Ed25519 and BLAKE-512 from scratch. See [Signing](/docs/pr-71/docs/uhi/v1/concepts/signing).

## Aggregate the answers

The [UHI Gateway](/docs/pr-71/docs/uhi/v1/getting-started/glossary#uhi-gateway) broadcasts a search to every HSPA registered for the domain. Each matching HSPA replies separately, so group them by the shared `transaction_id`.

| Service                         | What to expect                                                                               |
| ------------------------------- | -------------------------------------------------------------------------------------------- |
| PM-JAY HEM, Jan Aushadhi, NOTTO | One HSPA, so one `on_search` per search                                                      |
| Blood Bank                      | Several HSPAs. Aggregate within a 10 to 15 second window                                     |
| Physical Consultation           | One catalog per HSPA with doctors, fees and `provider_uri`                                   |
| Ambulance Booking               | Only HSPAs that serve the pickup area answer. Silence means no coverage, not a network fault |

## Time out, and render as results arrive

A search has no end signal. Nothing tells you the last answer has arrived.

- Set a timeout for each search, and keep it a configuration value.
- Render each `on_search` as it arrives. Do not wait for all of them.
- When the timeout passes with nothing received, stop waiting and offer a retry. Never leave the screen loading.
- An empty result is a result. Show a fallback message and suggest a wider search.

Blood Bank's window is 10 to 15 seconds. No figure is set for the other services, so agree one at onboarding.

## Paginate on your side

`on_search` is not paginated. Handle a large payload without blocking the screen, and page through it in your own UI.

## What the screens must do

The service pages carry each service's own rules. The rules below are checked at sign-off or required of every app.

| Rule                                                                                                         | Service                                                                                                                                 |
| ------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| Reach the feature within 3 taps, under a health or insurance category                                        | [PM-JAY HEM](/docs/pr-71/docs/uhi/v1/services/pmjay-hem#concepts-explored)                                                              |
| Show "Powered by UHI" with PM-JAY and [ABDM](/docs/pr-71/docs/uhi/v1/getting-started/glossary#abdm) branding | PM-JAY HEM                                                                                                                              |
| Show a fallback message on empty results                                                                     | PM-JAY HEM                                                                                                                              |
| Display "Please confirm the hospital location by calling ahead, as details may change."                      | PM-JAY HEM                                                                                                                              |
| Show the phone number and a "call to confirm" disclaimer, because counts are indicative                      | [Blood Bank](/docs/pr-71/docs/uhi/v1/services/blood-bank)                                                                               |
| Show the terms from `on_init` before enabling any confirm action                                             | [Physical Consultation](/docs/pr-71/docs/uhi/v1/services/consultation), [Ambulance Booking](/docs/pr-71/docs/uhi/v1/services/ambulance) |
| Keep the 4-digit PIN in memory only, never in a database or a log                                            | Physical Consultation                                                                                                                   |
| Show no driver or vehicle details in Phase 1                                                                 | Ambulance Booking                                                                                                                       |
| Show the transplant coordinator's phone first                                                                | [NOTTO](/docs/pr-71/docs/uhi/v1/services/notto)                                                                                         |
| Scope the screen to discovery. Do not build booking where the service has none                               | PM-JAY HEM, Blood Bank, Jan Aushadhi, NOTTO                                                                                             |

## Checked for every service

Each service's go-live checklist carries these items. Work through them before you request sign-off.

| # | Item                                                                                                                                                                                                      |
| - | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 | For an [EUA](/docs/pr-71/docs/uhi/v1/getting-started/glossary#eua), [Milestone 2](/docs/pr-71/docs/hiecm/v3/milestones/m2) on [HIE-CM](/docs/pr-71/docs/uhi/v1/getting-started/glossary#hie-cm) completed |
| 2 | Ed25519 key pair generated with the Header Generation Utility; public key submitted                                                                                                                       |
| 3 | Sandbox registration form completed and sandbox access received                                                                                                                                           |
| 4 | HTTPS callback URL live and reachable from the public internet                                                                                                                                            |
| 5 | Request signing implemented: Ed25519 and BLAKE-512                                                                                                                                                        |
| 6 | Asynchronous answers handled. Nothing blocks on a synchronous reply to `search`                                                                                                                           |
| 7 | Every test case for your service passed in sandbox                                                                                                                                                        |
| 8 | Sign-off requested with sandbox test evidence                                                                                                                                                             |

[Physical Consultation](/docs/pr-71/docs/uhi/v1/services/consultation#go-live-checklist) carries its full twenty item checklist.

Notes for AI agents

**Before you start.** Your service page, with its own test cases and go-live checklist, and your role for that service.

**What happens.** Treat each row as a pass or fail item that needs evidence. Items 1 to 4 are set up before you build. Items 5 and 6 live in your code. Items 7 and 8 close the list.

**How you know it worked.** Each row has evidence: the Milestone 2 completion, the submitted public key, the sandbox access, a callback received on your public HTTPS URL, a signed call that is not refused, and every test case passed.

**When it goes wrong.** An EUA without Milestone 2 cannot be onboarded onto any service, so item 1 blocks the rest. A callback URL reachable only inside your network fails item 4. A handler that waits on the reply to `search` for results fails item 6. For Physical Consultation, pass its twenty item list as well.

## Next

[Go live](/docs/pr-71/docs/uhi/v1/getting-started/going-live).
