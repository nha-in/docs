---
name: uhi-ambulance
description: "Use when building, debugging or testing UHI Ambulance Booking: finding an ambulance for a pickup, and getting a quote with its terms. Carries the journeys as loops, the calls with their signing, the screen rules, the symptoms of a failed call, and the go-live checks, in references/."
type: skill
domain: ambulance
agent_consumers:
  - uhi-integration-agent
  - uhi-call-debugger
requires:
  - uhi-subscriber-id
  - signing-key-pair
  - callback-url
  - hiecm-m2-complete
produces:
  - uhi-ambulance-quote
can_execute: true
can_orchestrate: false
---

# UHI Ambulance Booking

Generated from the ABDM Developer Portal on 2026-09-16, catalogue version 2026.09.16. Every fact below comes from a page in that portal, which is the place to look when this file does not carry enough.

This file is a snapshot. Re-download the whole folder from https://nha-in.github.io/docs/pr-96/skills/uhi-ambulance/ when it is older than the work you are doing: this router and every file under references/ that it links to.
If the abdm-docs MCP server is connected, trust its answers over this file: it serves the current catalogue and stamps every response with its catalogue_version.

## What you can do with Ambulance Booking

- An emergency search with the pickup location reaches every ambulance HSPA; those serving the area answer with ambulances, arrival windows and prices.
- The EUA sends the patient's details directly to the chosen HSPA, which returns a quote and five terms; the provider then calls to arrange dispatch.

## What is in this folder

- **Scaffold.** Register on the network first, then build each journey as a loop that ends when its exit condition holds. [references/scaffold.md](references/scaffold.md)
- **Design.** What the service is on the network, what a search carries, and what the screens have to do. [references/design.md](references/design.md)
- **Integrate.** 7 operations, with their hosts, headers and signing. [references/integrate.md](references/integrate.md)
- **Debug.** The loop from a status, an error object or a missing callback to a named fix. [references/debug.md](references/debug.md)
- **Test.** The checks this service is held to, and the steps to production. [references/test.md](references/test.md)

This file is the map. Each line above is a file beside it, opened one at a time rather than read through.

## Before anything else

- Build an EUA for a patient-facing app or an HSPA for a provider system; HSPA is open only for Physical Consultation, Blood Bank and Ambulance. (`uhi.decision.choose-role`)
- The fixed values every Ambulance Booking call carries, including context.domain nic2008:86909, item code AMBULANCE and fulfillment type EMERGENCY. (`uhi.concept.ambulance-service-identity`)
- The EUA and HSPA sign every outbound call in Authorization; the UHI Gateway adds X-Gateway-Authorization to everything it forwards. (`uhi.concept.signing-headers`)
- The HTTP response to a UHI call is only an ACK receipt; the business answer arrives later as a separate call to your callback URL. (`uhi.concept.ack-then-answer`)
- Store transaction_id and message_id before you send, and look each callback up by transaction_id first; a mismatch hides every result. (`uhi.concept.match-transaction-id`)
- From init onwards the EUA calls the HSPA's provider_uri and the HSPA calls back on the consumer_uri, each signing with its own key. (`uhi.concept.direct-calls`)

## Where the detail is

- The service: /docs/uhi/v1/services/ambulance
- Every operation: /docs/uhi/v1/api/ambulance
- Messages, signing, routes and errors: /docs/uhi/v1/concepts/messages
- Terms: /docs/uhi/v1/getting-started/glossary
