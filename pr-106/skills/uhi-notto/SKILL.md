---
name: uhi-notto
description: "Use when building, debugging or testing UHI NOTTO hospital discovery: finding hospitals authorised for an organ or tissue transplant, by state. Carries the journeys as loops, the calls with their signing, the screen rules, the symptoms of a failed call, and the go-live checks, in references/."
type: skill
domain: notto
agent_consumers:
  - uhi-integration-agent
  - uhi-call-debugger
requires:
  - uhi-subscriber-id
  - signing-key-pair
  - callback-url
  - hiecm-m2-complete
produces:
  - uhi-notto-hospital-list
can_execute: true
can_orchestrate: false
---

# UHI NOTTO hospital discovery

Generated from the ABDM Developer Portal on 2026-09-16, catalogue version 2026.09.16. Every fact below comes from a page in that portal, which is the place to look when this file does not carry enough.

This file is a snapshot. Re-download the whole folder from https://nha-in.github.io/docs/pr-106/skills/uhi-notto/ when it is older than the work you are doing: this router and every file under references/ that it links to.
If the abdm-docs MCP server is connected, trust its answers over this file: it serves the current catalogue and stamps every response with its catalogue_version.

## What you can do with NOTTO hospital discovery

- A search by organ or tissue, nationally or in one state, reaches the NOTTO HSPA through the Gateway and returns hospitals with capabilities and contacts.

## Try asking

- "Show hospitals authorised for a kidney transplant in a state"
- "What has to be in place before my first UHI NOTTO hospital discovery call?"
- "My UHI NOTTO hospital discovery call failed. Here is the response: what is wrong, and how do I fix it?"
- "Walk me through the UHI NOTTO hospital discovery test cases before go-live"

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
- The fixed values every NOTTO search carries, including context.domain nic2004:86100, fulfillment type NOTTO_HOSPITAL and the notto.hspa provider id. (`uhi.concept.notto-service-identity`)
- The EUA and HSPA sign every outbound call in Authorization; the UHI Gateway adds X-Gateway-Authorization to everything it forwards. (`uhi.concept.signing-headers`)
- The HTTP response to a UHI call is only an ACK receipt; the business answer arrives later as a separate call to your callback URL. (`uhi.concept.ack-then-answer`)
- Store transaction_id and message_id before you send, and look each callback up by transaction_id first; a mismatch hides every result. (`uhi.concept.match-transaction-id`)

## Where the detail is

- The service: /docs/uhi/v1/services/notto
- Every operation: /docs/uhi/v1/api/network/notto
- Messages, signing, routes and errors: /docs/uhi/v1/concepts/messages
- Terms: /docs/uhi/v1/getting-started/glossary
