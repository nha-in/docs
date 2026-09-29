---
name: uhi-consultation
description: "Use when building, debugging or testing UHI Physical Consultation: finding a doctor near the patient, booking a slot, checking in with the PIN, and cancelling or messaging afterwards. Carries the journeys as loops, the calls with their signing, the screen rules, the symptoms of a failed call, and the go-live checks, in references/."
type: skill
domain: consultation
agent_consumers:
  - uhi-integration-agent
  - uhi-call-debugger
requires:
  - uhi-subscriber-id
  - signing-key-pair
  - callback-url
  - hiecm-m2-complete
produces:
  - uhi-appointment
can_execute: true
can_orchestrate: false
---

# UHI Physical Consultation

Generated from the ABDM Developer Portal on 2026-09-16, catalogue version 2026.09.16. Every fact below comes from a page in that portal, which is the place to look when this file does not carry enough.

This file is a snapshot. Re-download the whole folder from https://nha-in.github.io/docs/pr-83/skills/uhi-consultation/ when it is older than the work you are doing: this router and every file under references/ that it links to.
If the abdm-docs MCP server is connected, trust its answers over this file: it serves the current catalogue and stamps every response with its catalogue_version.

## What you can do with Physical Consultation

- A broadcast search through the Gateway returns doctors from every matching HSPA; a second search sent directly to the chosen HSPA returns slots.
- The EUA sends the patient and slot, the HSPA holds it and returns the order id and five terms, and confirm with every term AGREED returns the PIN.
- The patient checks in with the PIN, the HSPA pushes each state change in on_update, and the EUA calls status only when an update never arrives.
- The patient cancels through the EUA or the doctor through the HSPA, each with a reason code and who cancelled; either side can message the other.

## What is in this folder

- **Scaffold.** Register on the network first, then build each journey as a loop that ends when its exit condition holds. [references/scaffold.md](references/scaffold.md)
- **Design.** What the service is on the network, what a search carries, and what the screens have to do. [references/design.md](references/design.md)
- **Integrate.** 21 operations, with their hosts, headers and signing. [references/integrate.md](references/integrate.md)
- **Debug.** The loop from a status, an error object or a missing callback to a named fix. [references/debug.md](references/debug.md)
- **Test.** The checks this service is held to, and the steps to production. [references/test.md](references/test.md)

This file is the map. Each line above is a file beside it, opened one at a time rather than read through.

## Before anything else

- Build an EUA for a patient-facing app or an HSPA for a provider system; HSPA is open only for Physical Consultation, Blood Bank and Ambulance. (`uhi.decision.choose-role`)
- The fixed values every Physical Consultation call carries, including context.domain nic2004:85111 and the case-sensitive fulfillment type Physical. (`uhi.concept.consultation-service-identity`)
- The EUA and HSPA sign every outbound call in Authorization; the UHI Gateway adds X-Gateway-Authorization to everything it forwards. (`uhi.concept.signing-headers`)
- The HTTP response to a UHI call is only an ACK receipt; the business answer arrives later as a separate call to your callback URL. (`uhi.concept.ack-then-answer`)
- Store transaction_id and message_id before you send, and look each callback up by transaction_id first; a mismatch hides every result. (`uhi.concept.match-transaction-id`)
- From init onwards the EUA calls the HSPA's provider_uri and the HSPA calls back on the consumer_uri, each signing with its own key. (`uhi.concept.direct-calls`)
- A Physical Consultation HSPA sends the UHI Gateway an exact copy of each on_confirm, on_status, on_update and on_cancel it sends the EUA. (`uhi.concept.audit-copies`)

## Where the detail is

- The service: /docs/uhi/v1/services/consultation
- Every operation: /docs/uhi/v1/api/consultation
- Messages, signing, routes and errors: /docs/uhi/v1/concepts/messages
- Terms: /docs/uhi/v1/getting-started/glossary
