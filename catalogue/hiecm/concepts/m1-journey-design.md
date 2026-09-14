---
id: hiecm.concept.m1-journey-design
type: concept
gateway: hiecm
milestone: M1
version: abdm-v3
title: A suggested ABHA journey, and what holds if you design your own
summary: >
  One worked default for the screens an M1 integration needs, offered as a
  starting point rather than a requirement, next to the short list of
  platform facts that constrain any design you build instead.
sources:
  - file: catalogue/openapi/hiecm/v3/hiecm-m1.yaml
    status: not-yet-hashed
    note: >
      The operations behind every journey below, and the response fields the
      duplicate rule and the skip rule are read from.
  - file: (private) review of shipped ABDM front ends, 2026-09-14
    status: not-publicly-citable
    role: corroboration
    note: >
      Patterns common to production ABHA registration surfaces: a single
      entry point, a skip affordance, and branding carried as configuration.
      Recorded as design corroboration only. Every rule below is grounded in
      an ABDM operation rather than in any one product.
verified:
  status: unverified
related:
  concepts: [hiecm.concept.abha-number-and-address, hiecm.concept.abha-address-policy, hiecm.concept.encrypted-identifiers]
  flows: [hiecm.flow.m1-create-abha-aadhaar-otp, hiecm.flow.m1-create-abha-by-document, hiecm.flow.m1-create-abha-face-auth, hiecm.flow.m1-create-child-abha, hiecm.flow.m1-login-by-mobile, hiecm.flow.m1-find-abha]
skills:
  - hiecm-m1-build
---

# A suggested ABHA journey, and what holds if you design your own

## In plain words

ABDM publishes operations, not a user experience. How your registration
screen looks and what it asks first is yours to decide, and a product that
knows its own counter will often beat the default below.

M1 gives you around forty operations, and the gap between that and one
screen at a desk is where most of the design work is. So this page carries
two different kinds of thing, and they are not weighted the same:

- **A suggested journey.** One worked default that gets a person through the
  desk. Take it as a starting point, change what does not fit, or ignore it.
- **What holds regardless.** A short list of platform facts that constrain
  any design. These are not suggestions, and a journey that ignores them
  fails whoever built it.

Read the second list even if you skip the first.

Three ways to put ABHA in a product, in increasing order of control and of
work:

| Shape | You write | Use it when |
|---|---|---|
| Redirect or QR to a hosted page | No frontend code | A counter, a kiosk, a poster, or a pilot |
| An embedded component in your own page | A mount point and callbacks | The journey sits inside your own registration screen |
| The operations directly | Every screen | A native app, or a journey nobody else's UI fits |

ABDM publishes the operations. The first two shapes are things you or a
vendor build on top of them, so choosing one is a build or buy decision
rather than a question about ABDM.

## Before you start

- A gateway session. See [the gateway session](gateway-session.md).
- The certificate and the algorithm it publishes, because every identifier on
  these screens travels encrypted. See
  [why identifiers are encrypted](encrypted-identifiers.md).
- The identifier your desk already holds. Most desks already have a mobile
  number, which decides the default journey below.
- A decision about what happens when the person has no ABHA and does not want
  one today. If you have not decided this, you are not ready to design the
  screen.

## What happens

### Suggested: one entry rather than a menu

Asking "do you want to log in or create an ABHA?" puts a question to the
person that they often cannot answer. One entry that resolves to either
outcome avoids it: take a mobile number, send an OTP, and read what comes
back. An existing account means sign in, none means offer to create one.

A chooser is the better shape where the desk genuinely knows, for example a
counter that only ever registers new patients, or a kiosk placed next to a
sign that says what it is for.

### Holds regardless: read the response before you create anything

After an OTP verification the response tells you whether accounts already
exist for that identifier. Continuing into creation when it does leaves the
person holding two ABHA numbers, and no operation in M1 merges them
afterwards. The patient carries the duplicate.

Whatever your journey looks like, creation is the branch taken when the
lookup came back empty.

### Holds regardless: an ABHA is optional to your record

A person may decline, may not have their Aadhaar-linked mobile to hand, or may
be in a queue. ABDM does not require that they hold an ABHA to be treated, and
your patient record is keyed by your own number rather than by one.

So a journey that cannot complete without an ABHA blocks care, which is a
product decision worth making deliberately rather than by omission. The
suggested shape is to return the identifier you already had, mark the record
as having none, and offer the journey again from the chart. See
[ABHA number and address](abha-number-and-address.md) for what you store when
it does complete.

### Five ways to create, and the condition each one answers

Which of these you offer, and how many at once, is yours. The suggestion is to
show one chosen from what the desk already holds and keep the rest behind a
"try another way" affordance, because a desk asked to pick a method has to
understand all five. A kiosk with time to explain may reasonably show them
all.

| Method | Gives you | Reach for it when |
|---|---|---|
| [Aadhaar OTP](../flows/m1-create-abha-aadhaar-otp.md) | A KYC verified ABHA number | The default. The person has their Aadhaar-linked phone |
| [Mobile OTP](../flows/m1-login-by-mobile.md) | An ABHA address, not KYC verified | No Aadhaar to hand. Upgrade to KYC later |
| [Face authentication](../flows/m1-create-abha-face-auth.md) | A KYC verified ABHA number | The Aadhaar-linked phone is not with them, and a camera is |
| [A document](../flows/m1-create-abha-by-document.md) | An ABHA from an accepted identity document | Neither Aadhaar nor its mobile is available |
| [Child ABHA](../flows/m1-create-child-abha.md) | An ABHA held under a parent | The patient is a minor |

Demographic authentication exists as a sixth path and is exact: a near miss on
name, date of birth or gender is a refusal rather than a warning. See
[create by demographic authentication](../flows/m1-create-abha-demographic-auth.md).

### The journeys that are not creation

An M1 surface is more than a registration form. These are the other placements
the operations support, listed so that a design of your own can account for
them rather than discovering them later:

- **Find an existing ABHA**, when the person has one and cannot remember it.
  See [find an ABHA](../flows/m1-find-abha.md).
- **Upgrade an address to KYC verified**, for an account made by mobile OTP.
- **Show the card and the QR code**, which is what a patient is asked for at a
  counter.
- **Share a profile at the counter**, by displaying a QR the patient scans with
  their own app, so your desk types nothing.
- **Update the profile**, including the mobile number, which changes often and
  is the most common reason a person returns to this surface.

### OTP screens

One platform fact and several suggestions, and it is worth knowing which is
which.

**Holds regardless:** attempts are counted against the transaction, not
against the person. Repeated sends lock that transaction, and the error names
the attempt count rather than the wait. A fresh transaction is the recovery,
not a retry of the spent one. The code is never persisted and never logged.

**Suggested:** show which number the code went to, masked to the last four
digits, because a person with two phones needs to know. Hold the transaction
id across a resend rather than restarting. Put the wait on the screen before
the person starts pressing the button.

### Suggested: branding as configuration

Colours, a logo and a language read from whatever the deployment already uses,
rather than compiled in. A journey that needs a rebuild to change a colour
gets forked by the first customer who asks. This is ordinary product practice
rather than anything ABDM requires.

## How you know it worked

Whatever journey you build, watch one person through the desk twice. These two
observations hold for any design, including one that looks nothing like the
suggestion above.

The first person completes it: your patient record now carries an ABHA number
and an ABHA address alongside your own patient number, and your receptionist
did not have to know which creation method produced them.

The second declines. Registration completes anyway, the record is created
without an ABHA, and the offer is still reachable from their chart next time.
Nothing is blocked and no error is shown.

Then run the one case that catches the expensive mistake: put a person who
already holds an ABHA through the path a new patient takes. They should end up
signed in to the account they had. A second ABHA number here is the failure
that no later call repairs.

## When it goes wrong

- A person ends up with two ABHA numbers. The journey branched into creation
  without reading the accounts already on the verification response. Fix the
  branch, not the data: nothing here merges two numbers afterwards. This is
  the one failure worth designing around before anything else.
- The OTP transaction locks part way through a queue. Attempts are counted per
  transaction, so a resend button with no wait state spends them in seconds.
  Show the wait, and start a fresh transaction rather than retrying a spent one.
- Registration stalls because the person has no Aadhaar-linked phone. Offer the
  next method rather than the same one again, and keep the skip visible.
- The desk is asked to choose a creation method and cannot. Either choose it
  from what the desk already holds, or make the screen explain the five well
  enough that choosing is reasonable. Both are valid; showing five unexplained
  options is the version that stalls.
- An encrypted field is refused and the screen shows the person that their
  number is wrong. It usually is not. See
  [why identifiers are encrypted](encrypted-identifiers.md) before you put that
  message in front of anybody.
