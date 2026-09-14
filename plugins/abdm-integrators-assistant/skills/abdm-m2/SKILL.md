---
name: abdm-m2
description: Use when building, debugging or testing ABDM Milestone 2: care contexts, HIP initiated linking, discovery, and pushing encrypted health records to a requester. Carries the endpoints, the prerequisites, every recorded error code and the M2 test matrix. Also carries the scaffolding loop that builds it flow by flow and the loop from a failed call to a named fix, in references/.
---

# ABDM M2, linking and sharing

Generated from the ABDM Developer Portal on 2026-09-14, catalogue version 2026.08.24. Every fact below comes from a page in that portal, which is the place to look when this file does not carry enough.

This file is a snapshot. Re-download it from the portal's /skills/abdm-m2/SKILL.md path when it is older than the work you are doing.
If the abdm-docs MCP server is connected, trust its answers over this file: it serves the current catalogue and stamps every response with its catalogue_version, which you can compare against the version above.

## What this skill covers

- **Scaffold.** Build it flow by flow against the sandbox, as a loop that ends on an observed result rather than on a call returning 200. [references/scaffold.md](references/scaffold.md)
- **Integrate.** 31 operations, with their hosts and headers. [references/integrate.md](references/integrate.md)
- **Debug.** The loop from a failed call to a named fix, and 120 recorded error codes. [references/debug.md](references/debug.md)
- **Test.** 46 test cases, each with the call it makes and what to see when it passes. [references/test.md](references/test.md)

Open one when the work calls for it. This file is the map, not the material.

## Before anything else

- Nothing here has been run against the ABDM sandbox. Treat request and response shapes as unconfirmed, and check a response before you rely on its shape.
- You act as the HIP. NHA requires a valid Facility ID and registration in the HIP role before you can create health records and share them.
- M2 is keyed to an ABHA address, so a working M1 integration comes first.
- Hold a link token per patient, stored at registration. NHA gives its validity as six months and says to validate it before use. If you hold no valid one, regenerate it using demographic authentication.
- Records go out as FHIR R4 conforming to the ABDM profiles at https://nrces.in/ndhm/fhir/r4/index.html.
- You are the side that encrypts, and the parameters arrive from the requester rather than from you. The health information request carries `keyMaterial` with `cryptoAlg: ECDH`, `curve: Curve25519`, the requester's `dhPublicKey` and a 32 byte `nonce`. Generate your own Curve25519 pair and your own 32 byte nonce, and send your public key and nonce back with the data so the requester can derive the same secret.
- The key derivation and the symmetric cipher applied over that shared secret are not yet published. Confirm both at onboarding before you ship, rather than inferring them from a sample.
- Four callbacks name a path and carry no payload in either of NHA sources: discovery, link init, link confirm and consent notify. Do not assume a body for those.

## Practices that hold across every call

- Read the body, not only the status. A refusal often names the field in its body while the status says nothing useful, and a bad clock can arrive as a 404.
- When ABDM publishes a parameter, read it rather than hard coding what it currently says. The certificate endpoints return the encryption algorithm beside the key; code that reads that field survives a rotation and code that assumes a constant fails silently on the day it changes. Refuse to act on a published value you do not recognise rather than falling back to a default.
- Read every field in a response, not the one you came for. The M1 certificate call returns the padding next to the key, and a catalogue that recorded only the key cost an integrator a day rediscovering it.
- Prove an assumption against a call that is able to disagree with you. An endpoint that refuses every input with one message cannot tell you which input was right, and testing against it turns a correct answer into a ruled out one.
- Suspect the transport before the data. When a call refuses a value you believe in, check the encryption, the headers and the clock before you doubt the number. Those failures are reported as if the value were wrong.
- Do not carry an encryption path from one module to another. The padding, the certificate and the key size belong to the registry you are calling, and a path that works in one module produces a value another cannot read.
- Never log a sensitive value before you encrypt it, and never send one to a remote service to be encrypted. Both move the leak rather than removing it.
- Generate a fresh REQUEST-ID for every call and log it before sending. Once a call has failed it is the only handle on it.
- Do not match an error code with string equality. ABDM returns codes carrying trailing punctuation and whitespace, observed as `"code": "ABDM-9999: "`. Trim and compare on the prefix, or the branch you wrote for that code never runs.
- Send TIMESTAMP in UTC with milliseconds and a trailing Z. Local time is refused, sometimes as a 404.
- Cache a public certificate with a validity window rather than forever. A rotation fails every encrypted call at once, and a cache with no expiry cannot recover on its own.

## Where the detail is

- Every endpoint, with its body fields and responses: /docs/hiecm/v3/api/m2
- The flows as diagrams: /docs/hiecm/v3/milestones/m2
- Every error code across modules: /docs/hiecm/v3/reference/error-codes
- Sandbox test data: /docs/hiecm/v3/reference/data-dictionary
- Terms: /docs/hiecm/v3/getting-started/glossary
