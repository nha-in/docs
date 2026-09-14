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
  endpoints: [hiecm.endpoint.m1-login-search, hiecm.endpoint.m1-login-verify, hiecm.endpoint.m1-login-select-account]
  errors: [hiecm.error.abdm-1107, hiecm.error.abdm-1094]
skills:
  - hiecm-m1-build
---

# A suggested ABHA journey, and what holds if you design your own

## In plain words

Start from why a front desk adopts ABHA at all, because it decides the shape
of everything else.

It is not the identifier. It is that the receptionist stops typing. A verified
ABHA profile carries the whole registration form already: given, middle and
family name, day, month and year of birth, gender, mobile, email, the full
address with its state, district, subdistrict, village and ward names and their
LGD codes, the pincode, and a photograph. A desk that reads that profile enters
nothing and corrects little.

So the ABHA step comes **before** your registration form, and fills it. A
journey that registers the patient first and offers ABHA afterwards has already
spent the keystrokes it existed to save, and leaves ABHA looking like an
identifier to file rather than the reason the queue moved faster. If you build
one thing from this page, build that order.

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
vendor build on top of them, so choosing one is a build or buy decision rather
than a question about ABDM. If nobody has built the hosted page for your
deployment, that row is not available to you whatever the table says.

The choice is per journey, not per integration. Driving login from the
operations while sending creation to a hosted page is a reasonable split, and
a common one: login is a handful of calls, and creation carries the identity
methods and the most screens.

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

### The flow, in full

Everything after this section is detail on one of these five steps. If you read
nothing else, read this.

1. **Start registering the patient.** Your own record, your own number. This
   completes whatever happens next.
2. **Ask whether they have an ABHA.** One question, yes or no. No means the
   form is typed by hand and the patient is treated exactly the same.
3. **Take one identifier.** Aadhaar or mobile, and where the desk knows, an
   ABHA number or address. Aadhaar is the one to recommend: it is the only
   route ending in a KYC verified ABHA number.
   **Then, under Aadhaar only, how they prove it is theirs:** an OTP to the
   linked phone, a face scan, or a fingerprint or iris reader. A mobile takes
   the OTP sent to it and offers no second question.
4. **Log in or create, decided by the answer and not by the person.** Every
   identifier starts on the login path, Aadhaar included. The response says
   whether an account exists: one or several means log in, none means offer to
   create. Never ask the person at the desk which of these they want.

   Two things here are load bearing and are covered below: an identifier wired
   straight to the enrolment path creates a second ABHA for anybody who already
   has one, and the token a login verification returns is not yet the token a
   profile call accepts.
5. **Fill your form from what came back.** The accounts array on the
   verification already carries the name, gender, date of birth and photograph,
   so the form can fill the moment the OTP verifies. The profile call adds the
   address and its codes. Either way the receptionist reads the form back and
   corrects it rather than typing it.

Step 5 is the reason the other four are worth doing. Step 4 is where a
duplicate ABHA is created if the branch is wrong.

### Holds regardless: the profile is the point, so fetch it before you type

Two ways the profile reaches your desk, and the first one asks nothing of your
receptionist at all.

**The patient scans your counter.** You display a QR carrying your facility id
and a counter id. The patient scans it with their own PHR application, consents
there, and ABDM posts their profile to your registered callback. Nobody at your
desk types, asks or verifies anything: the record simply arrives, already
consented. See [receive a shared patient profile](../endpoints/m1-receive-patient-share.md).
This needs a registered facility and a reachable callback, which is the price of
the cheapest desk experience available.

**Your desk asks for an identifier.** Where the patient has no PHR application,
or the queue will not wait for one, run the identifier journey below. It ends in
a token, and that token reads
[the profile](../endpoints/m1-profile-get-account.md).

Either way the registration form is the **destination**: it opens already
filled, and the receptionist confirms rather than enters. Manual entry is the
fallback for a person with no ABHA, not the default path with ABHA bolted on
afterwards.

One caution worth designing for. The profile is what ABDM holds, not what your
clinician sees in front of them. Names get transliterated, an address may be
years old, and a shared mobile may belong to a relative. Present the filled form
for confirmation rather than saving it unseen, and keep your own record editable
afterwards.

### Suggested: one screen that does not ask login or create

Asking "do you want to log in or create an ABHA?" puts a question to the person
that they often cannot answer. The shape that avoids it is one screen titled
for both outcomes, which takes an identifier and lets the response decide.

Worked shape for that first screen, in the order the person meets it:

1. **A step indicator showing the whole journey.** Four dots, the first one
   filled. A person who can see the end of a queue waits differently from one
   who cannot, and this is the cheapest thing on the screen.
2. **A title that covers both outcomes.** "Login or Create your ABHA" commits
   to neither and needs no decision from the person.
3. **Two identifier choices, one marked as recommended.** Aadhaar earns the
   recommendation because it is the only route that ends in a KYC verified ABHA
   number. Mobile sits beside it for the person who does not have their Aadhaar
   to hand. Two is a glance; five is a decision.
4. **The input shaped like the thing.** An Aadhaar number in three groups of
   four is easier to read back off a card than twelve unbroken digits. A mobile
   number gets a country prefix shown rather than typed.
5. **The rest behind a disclosure.** "Other login options" collapsed, holding
   ABHA number and ABHA address. They are there for the person who has one, and
   invisible to everyone else.
6. **Consent inline, not as a step.** One line above the button naming what
   proceeding agrees to.
7. **The button disabled until the input is valid.** The first OTP a person
   wastes is the one sent to a half typed number.

That is one question on screen one, and the ladder of identifier types is
three deep rather than flat: recommended, alternative, and disclosed.

A chooser up front is the better shape where the desk genuinely knows, for
example a counter that only ever registers new patients, or a kiosk placed
next to a sign that says what it is for.

### Holds regardless: Aadhaar is a login identifier too

An Aadhaar number identifies a person who may already hold an ABHA. Wiring it
to the enrolment path because enrolment is where Aadhaar is most discussed
sends every one of those people to create a second number, and `abha-enrol` in
the scope array is the signature of that mistake.

Send every identifier to the login path first and let the answer decide. The
scope pairs differ between the two paths, so getting this wrong surfaces as
`ABDM-1107`, invalid combinations of scopes, rather than as anything that
mentions duplicates. See [ABDM-1107](../errors/abdm-1107.md).

### Holds regardless: the login token is not the profile token

A login verification returns a token, and it is a transfer token rather than a
session token. Its JWT says `"typ": "Transfer"` and it lives five minutes.
Exchange it at the account selection call for the session token, and do that
whatever the length of the accounts array, including one.

A profile call sent the transfer token refuses it as `ABDM-1094`, "X-token
expired", or as "Invalid X-token" depending on the header shape. Neither says
the wrong kind of token was sent, and both were observed on a token one second
old. See [verify a login OTP](../endpoints/m1-login-verify.md).

### Holds regardless: look before you create, by whatever means

Creation with an account already in existence leaves the person holding two
ABHA numbers, and no operation in M1 merges them afterwards. The patient
carries the duplicate.

The rule is that you look first. It is not a rule about how you look, and the
mobile OTP journey suggested above is only one of the ways:

- Verify an OTP and read the accounts the response carries.
- Search for the person before you begin.
- Ask, where the desk can reasonably ask, and trust the answer enough to check
  it.

Any of these satisfies the rule. Whatever your journey looks like, creation is
the branch taken when the look came back empty.

The verification response is what most journeys branch on, and it carries
everything the branch needs:

```response
{
  "txnId": "<TXN_ID>",
  "authResult": "success",
  "token": "<TOKEN>",
  "expiresIn": 1800,
  "refreshToken": "<REFRESHTOKEN>",
  "accounts": [
    {"ABHANumber": "<ABHA_NUMBER>", "preferredAbhaAddress": "<ABHA_ADDRESS>",
     "name": "<NAME>", "status": "<STATUS>", "mobileVerified": true}
  ]
}
```

Read `accounts` before anything else:

| What you get | What it means | Where the person goes |
|---|---|---|
| One account | They have an ABHA and it is unambiguous | Signed in. Store the number and the address |
| More than one | One mobile carries several ABHA accounts | A chooser, then [select the account](../endpoints/m1-login-select-account.md) with the chosen `ABHANumber` and the same `txnId`, which returns the final token |
| None | Nobody holds an ABHA on that identifier | The create branch, if you offer one |

More than one account is common enough to design for rather than treat as an
edge case: a shared family handset is the ordinary cause.

One caution about the empty answer, which decides how much you can lean on it.
A lookup that finds no account and a lookup whose encrypted identifier the
service could not read can present the same way. So an empty result means
"nothing found for what the service received", which is only "this person has
no ABHA" once you know the service received what you sent. Prove the
encryption path first, once, and the empty answer becomes trustworthy. See
[why identifiers are encrypted](encrypted-identifiers.md).

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

### Identifiers and auth methods are two different questions

Listing "Aadhaar OTP" and "face authentication" side by side as though they
were alternatives is the mistake that makes this look like five choices. They
are two questions, and the second only appears under one answer to the first.

**Which identifier does the person have?** ABDM accepts four:

| Identifier | Ends in |
|---|---|
| Aadhaar | A KYC verified ABHA number, which is why it is the one to recommend |
| Mobile | An ABHA address, upgradeable to KYC later |
| ABHA number | Sign in to an account they already hold |
| ABHA address | Sign in to an account they already hold |

**How do they prove it is theirs?** That is `authMethods`, and ABDM's own values
are `otp`, `bio`, `face`, `iris`, `child` and `demo_auth`. Aadhaar accepts the
range; a mobile accepts the OTP sent to it and nothing else.

| Auth method | Reach for it when |
|---|---|
| OTP | The default. The Aadhaar linked phone is with them |
| Face | That phone is not with them, and a camera is |
| Fingerprint or iris | A reader is at the desk |
| Demographic | Nothing else is available. It is exact: a near miss on name, date of birth or gender is a refusal rather than a warning |

A child ABHA is created under a parent who is already signed in, so it is a
different journey rather than another method on this screen.

So the screen asks for an identifier, and offers the auth methods underneath it
only where there is more than one to offer. Most integrations ship Aadhaar with
OTP and mobile with OTP, and add the rest when a desk asks for them.

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
against the person, and a transaction has a limited number of them. The code is
never persisted and never logged.

That gives a resend button two different jobs either side of one boundary, and
getting them the wrong way round is how a receptionist reaches a dead
transaction:

| The person presses resend | What to do |
|---|---|
| The transaction still has attempts | Reuse the same transaction id. Starting a new one throws away a live transaction for no reason |
| The transaction is locked | The transaction is spent. Start a fresh one. Retrying this one cannot recover it |

The number of attempts a transaction allows is not published, and the refusal
names the attempt count rather than the wait remaining, so a client cannot
compute how long to disable the button. Read the refusal and start again rather
than counting attempts yourself.

**Suggested:** show which number the code went to, masked to the last four
digits, because a person with two phones needs to know. Put a visible wait on
the resend button rather than leaving it live, since the fastest route to a
locked transaction is a person pressing it four times.

### Suggested: let the response drive the next screen

A journey hard coded as a fixed sequence has to be edited every time ABDM adds
a branch. A journey that renders whichever screen the last response implies
does not.

The states worth having a screen for are the ones the responses can put you in:
an identifier is needed, an OTP is needed, an OTP needs confirming, an account
needs choosing, something needs creating, and the journey is finished. Name
them in your own code, map each response to one of them, and let the screen
follow the state rather than the call site.

The practical gain is the account chooser. A journey written as a straight line
from OTP to signed in has nowhere to put the second account, and the shared
family handset is where it is discovered.

### Suggested: branding as configuration

Colours, a logo and a language read from whatever the deployment already uses,
rather than compiled in. A journey that needs a rebuild to change a colour
gets forked by the first customer who asks. This is ordinary product practice
rather than anything ABDM requires.

## How you know it worked

Whatever journey you build, watch one person through the desk twice. These two
observations hold for any design, including one that looks nothing like the
suggestion above.

The first person completes it, and the test is what your receptionist typed.
Their name, date of birth, gender, mobile and address arrived from the profile
and appeared in your form already filled. The receptionist read them back,
corrected nothing or one field, and saved. Your patient record now carries an
ABHA number and an ABHA address alongside your own patient number.

Count the keystrokes. If that registration took as many as a patient with no
ABHA, the integration is filing an identifier rather than saving anybody time,
and the order of your screens is the first thing to look at.

The second declines. Registration completes anyway, the record is created
without an ABHA, and the offer is still reachable from their chart next time.
Nothing is blocked and no error is shown.

Then run the one case that catches the expensive mistake: put a person who
already holds an ABHA through the path a new patient takes. They should end up
signed in to the account they had. A second ABHA number here is the failure
that no later call repairs.

Run it twice more, because the two cases that produce a duplicate are not the
obvious one. Put a person whose ABHA sits on a mobile other than the one your
desk holds through the same path: a journey that reads "no account on this
number" as "no ABHA" sends them to create a second. And run it with the
encryption deliberately wrong, to see what your own screens do with a lookup
the service could not read.

Nothing above is a certification requirement. These are the observations that
tell you your own design works.

## When it goes wrong

- The desk types everything and then links an ABHA. The integration works, the
  certification passes, and nobody at the counter can say what it was for. This
  is the most common way an M1 integration disappoints the people who paid for
  it, and it is an ordering mistake rather than a technical one. Fetch the
  profile first and let it fill the form.
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
