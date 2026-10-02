---
name: uhi-jan-aushadhi
description: "Use when building, debugging or testing UHI Jan Aushadhi: finding Jan Aushadhi Kendras, finding a medicine, and finding the Kendras that stock it. Carries the journeys as loops, the calls with their signing, the screen rules, the symptoms of a failed call, and the go-live checks, in references/."
type: skill
domain: jan-aushadhi
agent_consumers:
  - uhi-integration-agent
  - uhi-call-debugger
requires:
  - uhi-subscriber-id
  - signing-key-pair
  - callback-url
  - hiecm-m2-complete
produces:
  - uhi-kendra-list
  - uhi-medicine-availability
can_execute: true
can_orchestrate: false
---

# UHI Jan Aushadhi

Generated from the ABDM Developer Portal on 2026-09-16, catalogue version 2026.09.16. Every fact below comes from a page in that portal, which is the place to look when this file does not carry enough.

This file is a snapshot. Re-download the whole folder from https://nha-in.github.io/docs/main/skills/uhi-jan-aushadhi/ when it is older than the work you are doing: this router and every file under references/ that it links to.
If the abdm-docs MCP server is connected, trust its answers over this file: it serves the current catalogue and stamps every response with its catalogue_version.

## What you can do with Jan Aushadhi

- A search of type JANAUSHADHI through the Gateway reaches the PMBI HSPA, which returns Kendras by location or Kendra code in one on_search.
- A medicine search turns a name into a medicineId, and a second, separate search with that id returns the Kendras that stock it with a stock flag.

## Try asking

- "Let patients find a Jan Aushadhi Kendra that stocks their medicine"
- "What has to be in place before my first UHI Jan Aushadhi call?"
- "My UHI Jan Aushadhi call failed. Here is the response: what is wrong, and how do I fix it?"
- "Walk me through the UHI Jan Aushadhi test cases before go-live"

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
- One domain, nic2008:47721, and three fulfillment types that select Kendras, medicines or stock, with the PMBI HSPA's id, URL and key id. (`uhi.concept.jan-aushadhi-service-identity`)
- The EUA and HSPA sign every outbound call in Authorization; the UHI Gateway adds X-Gateway-Authorization to everything it forwards. (`uhi.concept.signing-headers`)
- The HTTP response to a UHI call is only an ACK receipt; the business answer arrives later as a separate call to your callback URL. (`uhi.concept.ack-then-answer`)
- Store transaction_id and message_id before you send, and look each callback up by transaction_id first; a mismatch hides every result. (`uhi.concept.match-transaction-id`)

## Where the detail is

- The service: /docs/uhi/v1/services/jan-aushadhi
- Every operation: /docs/uhi/v1/api/network/jan-aushadhi
- Messages, signing, routes and errors: /docs/uhi/v1/concepts/messages
- Terms: /docs/uhi/v1/getting-started/glossary
