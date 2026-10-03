---
name: uhi-blood-bank
description: "Use when building, debugging or testing UHI Blood Bank discovery: finding blood banks that hold a blood group and component, near a location or in a district. Carries the journeys as loops, the calls with their signing, the screen rules, the symptoms of a failed call, and the go-live checks, in references/."
type: skill
domain: blood-bank
agent_consumers:
  - uhi-integration-agent
  - uhi-call-debugger
requires:
  - uhi-subscriber-id
  - signing-key-pair
  - callback-url
  - hiecm-m2-complete
produces:
  - uhi-blood-stock-list
can_execute: true
can_orchestrate: false
---

# UHI Blood Bank discovery

Generated from the ABDM Developer Portal on 2026-09-16, catalogue version 2026.09.16. Every fact below comes from a page in that portal, which is the place to look when this file does not carry enough.

This file is a snapshot. Re-download the whole folder from https://nha-in.github.io/docs/pr-105/skills/uhi-blood-bank/ when it is older than the work you are doing: this router and every file under references/ that it links to.
If the abdm-docs MCP server is connected, trust its answers over this file: it serves the current catalogue and stamps every response with its catalogue_version.

## What you can do with Blood Bank discovery

- One search through the Gateway reaches every registered Blood Bank HSPA; aggregate their on_search answers by transaction_id within 10 to 15 seconds.

## Try asking

- "Show blood banks near the patient that hold the group they need"
- "What has to be in place before my first UHI Blood Bank discovery call?"
- "My UHI Blood Bank discovery call failed. Here is the response: what is wrong, and how do I fix it?"
- "Walk me through the UHI Blood Bank discovery test cases before go-live"

Loaded with no task? Say in three lines what this skill does. Offer the prompts above. Then ask what the person is building, and whether the code for it exists yet.

## What is in this folder

- **Scaffold.** Register on the network first, then build each journey as a loop that ends when its exit condition holds. [references/scaffold.md](references/scaffold.md)
- **Design.** What the service is on the network, what a search carries, and what the screens have to do. [references/design.md](references/design.md)
- **Integrate.** 5 operations, with their hosts, headers and signing. [references/integrate.md](references/integrate.md)
- **Debug.** The loop from a status, an error object or a missing callback to a named fix. [references/debug.md](references/debug.md)
- **Test.** The checks this service is held to, and the steps to production. [references/test.md](references/test.md)

This file is the map. Each line above is a file beside it, opened one at a time rather than read through.

## Before anything else

- Build an EUA for a patient-facing app or an HSPA for a provider system; HSPA is open only for Physical Consultation, Blood Bank and Ambulance. (`uhi.decision.choose-role`)
- The fixed values every Blood Bank search carries, context.domain nic2008:86906 and fulfillment type BloodStock, and the sandbox reference HSPA. (`uhi.concept.blood-bank-service-identity`)
- The EUA and HSPA sign every outbound call in Authorization; the UHI Gateway adds X-Gateway-Authorization to everything it forwards. (`uhi.concept.signing-headers`)
- The HTTP response to a UHI call is only an ACK receipt; the business answer arrives later as a separate call to your callback URL. (`uhi.concept.ack-then-answer`)
- Store transaction_id and message_id before you send, and look each callback up by transaction_id first; a mismatch hides every result. (`uhi.concept.match-transaction-id`)

## Where the detail is

- The service: /docs/uhi/v1/services/blood-bank
- Every operation: /docs/uhi/v1/api/network/blood-bank
- Messages, signing, routes and errors: /docs/uhi/v1/concepts/messages
- Terms: /docs/uhi/v1/getting-started/glossary
