---
id: hiecm.concept.m1-journey-design
type: concept
gateway: hiecm
milestone: M1
version: abdm-v3
title: Designing the ABHA journey a person actually walks through
summary: >
  M1 is a set of calls, but a person at a counter meets it as one screen with
  one question on it. This is how to shape that, and which of the calls each
  shape needs.
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

# Designing the ABHA journey a person actually walks through

## In plain words

M1 gives you around forty operations. A person standing at a registration
counter should meet one screen with one question on it. Everything below is
about closing that gap, because an integration that exposes the operations
as a menu is the one that gets abandoned at the desk.

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

### One entry, not a menu

Do not ask "do you want to log in or create an ABHA?". The person at the desk
usually does not know. Take one identifier, then decide for them.

A single entry that resolves to either outcome is the default journey. Take a
mobile number, send an OTP, and read what comes back: an existing account
means sign in, no account means offer to create one. The person answers one
question and your code branches, rather than the other way round.

Offer a chooser only where the desk genuinely knows, for example a counter
that only ever registers new patients.

### Read the response before you create anything

This is the rule that prevents the worst outcome in M1, which is a person
holding two ABHA numbers.

After an OTP verification, the response tells you whether accounts already
exist for that identifier. When it does, sign the person into the existing
account rather than continuing into creation. Treat "create" as the branch you
take when the lookup came back empty, never as the branch you take by default.
A duplicate is not corrected by a later call, and the patient carries it.

### Make it skippable, and say so on the screen

A person may decline, may not have an Aadhaar-linked mobile to hand, or may be
in a queue. Registration must complete without an ABHA, and your screen should
say that before they feel cornered.

Your patient record is keyed by your own number, not by an ABHA. When the
journey is skipped, return the identifier you already had, mark the record as
having no ABHA, and offer the journey again later from the chart. See
[ABHA number and address](abha-number-and-address.md) for what you store when
it does complete.

### Five ways to create, and when each one is right

Show one. Choose it from what the desk holds, and keep the others behind a
"try another way" affordance for when the first fails.

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

An M1 surface is more than a registration form. Each of these is its own
placement in a product, and each is worth designing separately:

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

The OTP screen is where journeys are lost, so it carries its own rules. Show
which number the code went to, masked to the last four digits, because a
person with two phones needs to know. Provide a resend, and hold the
transaction id across it rather than starting again. State the wait before the
person starts pressing resend: repeated attempts lock the transaction, and the
error that follows names the attempt count rather than the wait. Never
persist the code, and never log it.

### Branding belongs in configuration

Colours, a logo and a language are configuration, not code. Read them from
whatever the deployment already uses. A journey that needs a rebuild to change
a colour will be forked by the first customer who asks.

## How you know it worked

Watch one person through the desk, twice.

The first completes the journey: they answer one question, receive one OTP, and
your patient record now carries an ABHA number and an ABHA address alongside
your own patient number. Nothing about the flow required your receptionist to
know which of the five creation methods was used.

The second declines. Registration completes anyway, the record is created
without an ABHA, and the offer is still available from their chart the next
time they attend. Nothing is blocked, and no error is shown.

If either person had to be told what an ABHA is before the screen made sense,
the screen is not finished.

## When it goes wrong

- A person ends up with two ABHA numbers. The journey branched into creation
  without reading the accounts already on the verification response. Fix the
  branch, not the data: nothing here merges two numbers afterwards.
- The OTP transaction locks part way through a queue. Attempts are counted per
  transaction, so a resend button with no wait state spends them in seconds.
  Show the wait, and start a fresh transaction rather than retrying a spent one.
- Registration stalls because the person has no Aadhaar-linked phone. Offer the
  next method rather than the same one again, and keep the skip visible.
- The desk is asked to choose a creation method. Choose it from what the desk
  holds, and offer the rest only after one fails.
- An encrypted field is refused and the screen shows the person that their
  number is wrong. It usually is not. See
  [why identifiers are encrypted](encrypted-identifiers.md) before you put that
  message in front of anybody.
