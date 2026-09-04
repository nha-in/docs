---
name: hiecm-p1-build
description: "Use when scaffolding the patient side of ABDM Milestone 1 in a PHR application (creating an ABHA address, the four login routes, the profile): builds each P1 flow as an observe-orient-decide-act loop, citing the Catalogue atom behind every step."
---
# HIE-CM P1 build

Scaffolds an ABDM P1 integration one flow at a time. P1 covers registration in a PHR application, the four login routes, and the profile the person holds.

## How this skill runs

Every flow below is an OODA loop, not a recipe: observe the actual state (last response, last error), orient against the flow step matched below, decide the cheapest next action, act, and return to observe. A flow step is done only when its exit condition is observed against the sandbox, never because it "should have worked."

Loop limit: 8 passes per flow step. Hitting the limit is an escalation: state what was observed, what was tried, and which atom to read, then ask one question.

## Flows

### Create an ABHA address in a PHR application (`hiecm.flow.p1-create-abha-address`)

**Before you start**

Four things must already be true, each checkable:

- You hold a gateway session token. See
  the gateway session.
- You can send and verify an OTP, and
  your screens keep resend locked for 60 seconds in every flow.
- You can store a refresh token securely, because login follows
  immediately and the application holds the session from here on.
- You know which path the user is on. A mobile number produces a
  Self-Declared profile with no KYC; an
  existing 14 digit ABHA number
  produces a KYC Verified one.

**Act: the calls in this flow, in order**

The Catalogue does not yet record this flow's calls as endpoint atoms, so this skill cannot give you the exact requests. Read the operations under /docs/hiecm/v3/api/p1 before acting, and treat the exit condition below as the thing to observe.

**Exit condition (Observe until this is true)**

The user holds an ABHA address in the form `username@abdm`, and the
profile screen shows it marked Self-Declared or KYC Verified according to
the path they took. The ABHA number is visible only on a KYC Verified
profile.

Listing the addresses linked to that mobile number or ABHA number now
returns the address the user ended with, which is what proves the
creation landed rather than the screen merely closing.

**If it goes wrong**

The failures these sources document, in rough order of frequency:

- A duplicate address, because step 3 was skipped and the user created a
  second one rather than picking the one they had.
- A mandatory demographic field missing on the mobile number path, which
  is rejected as validation. The mandatory set is narrower than it looks:
  day and month of birth are not in it.
- An expired OTP, where the user waited out the window. Resend is locked
  for 60 seconds by design, so the screen must say so rather than appear
  broken.

### Sign a user in to a PHR application (`hiecm.flow.p1-login`)

**Before you start**

Four things must already be true, each checkable:

- The person holds an ABHA address.
  See create an ABHA address.
- You hold a gateway session token. See
  the gateway session.
- You can store a refresh token securely, and you have a sign out that
  clears it.
- Your application supports more than one user profile per install, with
  sign in and sign out between them.

**Act: the calls in this flow, in order**

The Catalogue does not yet record this flow's calls as endpoint atoms, so this skill cannot give you the exact requests. Read the operations under /docs/hiecm/v3/api/p1 before acting, and treat the exit condition below as the thing to observe.

**Exit condition (Observe until this is true)**

The application holds a session for one named ABHA address, and the
profile screen shows that address rather than a chooser. Signing out and
back in returns the user to the same address without repeating the
choice, which is what proves the session was stored rather than held in
memory.

**If it goes wrong**

The failures these sources document, in rough order of frequency:

- The wrong auth mode offered for an address, so the user is asked for a
  password they never set. Read the modes rather than defaulting.
- A mobile number carrying several addresses and no chooser shown, which
  signs the person in as the wrong one of their own identities.
- An expired OTP where the screen offered resend before the 60 seconds
  were up, or did not say the wait was deliberate.

## Where the detail is

- Every operation in this milestone, with its body fields and responses: /docs/hiecm/v3/api/p1
- The flows as diagrams: /docs/hiecm/v3/milestones/p1
- Every error code across milestones: /docs/hiecm/v3/reference/error-codes
- Terms: /docs/hiecm/v3/getting-started/glossary

