# Design M1, ABHA identity

What the integration has to do to the journey around the calls: how many questions a patient is asked, where a failure is shown, and what a screen is forbidden to claim. Every rule below comes from a Catalogue atom, cited at the end.

## The branch that creates a duplicate ABHA, and how to close it

### In plain words

The expensive failure in M1 is a person ending up with two ABHA numbers. Nothing
merges them, so the mistake is permanent and the patient carries it.

It is caused by journey decisions rather than by any single call. Four of them
matter.

### What happens

**Every identifier starts on the login path, Aadhaar included.** Wiring Aadhaar
straight to enrolment, because enrolment is where Aadhaar is most discussed,
sends everybody who already holds an ABHA to make a second one.

**`ABDM-1114` is the only answer that means nobody holds an ABHA.** A refusal
that names a field is not the same thing. A stale certificate reads back
identically, and creating an account on that is how the duplicate happens.

**Never ask the patient whether they want to log in or to create.** They often
cannot answer. One screen, titled for both outcomes, takes an identifier and
lets the response decide.

**Read the token, not the account count.** A verification that returns a
`refreshToken` has already returned the final user token, so use it. One without
a `refreshToken` is a short lived transfer token and must be exchanged at the
account selection call, whatever the length of the accounts array. Branching on
`accounts.length` sends the Aadhaar path into an exchange it must not make, and
the refusal then blames the token's shape rather than saying the call was
unnecessary.

Creation is from Aadhaar. ABDM publishes a mobile enrolment route, and an
account created that way is address only and never verified against a
government identity document. No later desk can look it up before spending a one
time password, and the person carries the lesser account permanently. Write that
rule into code as a guard that refuses an unknown method by name, because a rule
the code merely happens to satisfy is one that regresses silently.

When the desk already knows there is no ABHA, ask only for Aadhaar. Offering a
mobile there offers a path that cannot finish. The lookup still runs first: a
patient saying they have never had one is not evidence, and creating on somebody's
word is how the second number appears.

### How you know it worked

Run a login for an identifier nobody holds. You receive `404` with `ABDM-1114`,
no one time password is sent, and only then does the journey offer creation.

Run the Aadhaar login path. The verify response carries a `refreshToken`, the
journey uses it directly, and no exchange call is made. Run the mobile path and
the exchange call is made, because no `refreshToken` came back.

### When it goes wrong

- A login is refused with a message naming a field, and the journey offers
  creation anyway. Only `ABDM-1114` means nobody holds an account. Treat
  anything else as a failure to answer the question.
- The Aadhaar path is refused `Invalid T-token` at the account selection call.
  The journey branched on the account count instead of on `refreshToken`, and
  made a call it did not need to make.
- Two patients a week arrive holding two numbers. Something in the journey is
  creating before it has looked, and the lookup is the cheapest call available.

## The ABHA step comes before the registration form and fills it

### In plain words

An ABHA is a patient's health account, and a verified one already holds their
name, date of birth, gender, mobile number, full address with its codes, and a
photograph. A desk that reads that profile types almost nothing.

Put the ABHA step first and the registration form opens already filled. Put it
second and you have spent the keystrokes the integration existed to save, then
filed an identifier on top of them.

The test is simple. Count what the receptionist typed. If a registration with an
ABHA took as many keystrokes as one without, the order of the screens is the
first thing to look at.

### What happens

Rank what is scarce at a counter. Calls are cheap. In order of cost:

1. **Questions put to the patient.** A third question costs more than three
   extra HTTP calls.
2. **One time passwords.** They fail, they expire, they lock a transaction, and
   they reach a handset the person may not be holding.
3. **API calls.** Last, and a long way last.

Rank routes by that list in order, and never let a call count outrank a
question.

| Route | Questions | One time passwords | Calls |
|---|---|---|---|
| Scan and share | 0 | 0 | 0 out, 2 in |
| Create, demographic authentication | 1 | 0 | 1 |
| Create, fingerprint | 1 | 0 | 1 to 3 |
| Create, face | 1 | 0 | 3 plus polling |
| Log in, any identifier | 1 | 1 | 3 to 4 |
| Create, Aadhaar one time password | 1 to 2 | 1 to 2 | 4 to 5 |

Two things fall out of that table.

Demographic authentication is one call and spends no one time password. A
government integrator is required to offer it and a private integrator is not
asked for it, so most integrators build the five call route instead, because it
is the one the specification leads with.

The cheapest journey involves no desk call at all. A registered facility with a
callback ABDM can reach can put a QR code at the counter, and the profile
arrives already consented.

Some lookups cost nothing. A login attempt on an identifier nobody holds is
refused `ABDM-1114` before any one time password is sent, so looking before
creating is free for exactly the people you would otherwise send to create a
duplicate.

### How you know it worked

A receptionist registering a patient who brought an ABHA types corrections only.
Every field the profile carries arrives filled, and the only screen asking for
input is the one confirming the form.

Count the one time passwords spent on a full registration. On the demographic
route and on scan and share that count is zero.

### When it goes wrong

- The form opens empty after a successful ABHA step. The profile was read and
  its result was not carried into the form. Hold it in the fact store rather
  than in a screen's own state, which
  the patient fact store covers.
- The desk asks for an identifier it already holds. Same cause, same fix.
- The journey offers login or creation as a question to the patient. They often
  cannot answer it, and
  avoiding a duplicate ABHA explains what to
  do instead.

## Ask the integrator about the deployment, not the patient about the journey

### In plain words

M1 has around forty operations and no deployment needs all of them. The routes
do not change from one integrator to the next. The context does: who they are,
what hardware sits on the desk, what their record already holds.

So the first thing to establish is not how the journey should look. It is six
facts about the deployment. Each answer adds a route rather than replacing one,
which is what keeps an integration from branching into a government variant and
a private variant that then drift apart.

### What happens

Ask these six. Each is a yes or a no.

| Ask | A yes adds |
|---|---|
| Are you a government integrator? | The demographic route: one call, no one time password |
| Does your record hold the patient's mobile at check in? | No route. It removes a screen, because the lookup is submitted from the number you already hold |
| Are you a registered facility with a callback ABDM can reach? | Scan and share, which then becomes the default counter experience |
| Is there a fingerprint or iris reader at the desk? | The biometric method |
| Do patients arrive with the ABHA app? | The face route, as a second method rather than a first |
| Which record types does your system actually produce? | The bundles worth generating, rather than all seven |

The answers give the route set. The route set gives the screen set. The
integrator then implements renderers for the screens that survive, rather than
implementing a flow.

The sixth question belongs here rather than with the record work, because
scaffolding all seven record types before knowing which two a system produces is
the most expensive guess available in this integration.

### How you know it worked

You can name, before any screen is drawn, which routes this deployment offers
and which it does not. Every screen in the build traces to a route that at least
one answer switched on, and no screen exists for a route no answer reached.

### When it goes wrong

- The build contains a government branch and a private branch. The answers were
  used to pick a variant rather than to light up routes. Each yes should add,
  never replace.
- A screen exists that no route uses. Something was built from the specification
  rather than from the answers.
- Seven record generators exist and the system produces two. The sixth question
  was not asked.

## Telling the truth on screen at the counter

### In plain words

An integration that overstates its own state is worse than one that reports a
gap, because the gap is then discovered by a patient at a counter rather than by
the person who could have fixed it.

Most of what follows was a defect before it was a rule.

### What happens

**An error must land on the screen the person is looking at.** A multi step
journey that writes a failure into a step the view has scrolled past shows the
desk nothing at all. Resolve the target to the active step rather than to a
fixed position on the page.

**Accepted is not done.** Anything asynchronous has at least five outcomes and
they must not look alike: sent, accepted and waiting, answered, refused before
it ever waited, and no answer inside the window. A refusal shown as a completion
is the worst of the five.

**A silence is not a failure.** Where no timeout is published, say that nothing
arrived in the window you chose, rather than saying it failed.

**Show the masked number the code went to.** A person with two handsets needs to
know which one to pick up.

**A resend button has two jobs either side of one boundary.** While the
transaction still has attempts left, reuse it, because starting a new one throws
away a live transaction. Once it is locked, only a fresh transaction recovers
and retrying cannot. Show a visible wait, because the fastest route to a locked
transaction is somebody pressing resend four times.

**Name the field, not the person.** When an encrypted value is refused, the
cause is usually the encryption, the headers or the clock. Telling a patient
their number is wrong is usually a lie.

Some of this is interface mechanics rather than ABDM, and it still costs real
failures. Off screen is not hidden: a translated step track leaves every step in
the tab order, so the first keypress walks into fields nobody can see, and
inactive steps need marking inert. State from one patient must not survive into
the next, and the field that leaks is always the one the desk typed rather than
the one the profile filled, because every other field is overwritten on the way
in.

### How you know it worked

Trigger a refusal on the last step of a long journey. The message appears on the
step in view, and the desk can read it without scrolling.

Trigger a synchronous refusal on an asynchronous call. The screen says refused,
not waiting, and not done.

Complete a journey for one patient and start another. No field carries a value
from the first, including the fields the desk typed by hand.

### When it goes wrong

- A green state is showing for a refusal. The success and failure paths are
  sharing a function that closes the waiter. Fix it in the shared function, not
  at each call site.
- A one time password transaction locks repeatedly. Resend is starting a new
  transaction while the old one still had attempts left.
- A patient is told their Aadhaar number is wrong when the clock or the
  certificate is at fault. Name the field that was refused and say what else
  can cause it.

## Never ask a patient the same thing twice, enforced by structure

### In plain words

A patient at a counter will be asked for an identifier, and then, two screens
later, for something they already gave. Nobody notices in review, because each
screen reads correctly on its own. It is only the journey that repeats itself.

Discipline does not fix this, because the mistake is invisible at the point it
is made. Structure does. Keep one store of what you know about the patient in
front of you, and generate every question from what is missing in it. A request
to collect a fact you already hold then cannot be constructed.

### What happens

Hold one store per patient, for the length of their visit:

```
facts:      { aadhaar, mobile, abhaNumber, name, dob, gender, ... }
provenance: { mobile: 'from the appointment', name: 'from the ABHA profile' }
tried:      [ { route, why it failed } ]
```

Three rules make it work.

1. **Facts are write once.** Nothing overwrites a fact silently.
2. **A failed route gives back everything it collected.** An Aadhaar typed for a
   login that then failed is already in the store when creation begins.
3. **Screens ask for one missing fact at a time**, and the question is generated
   from the store rather than hard coded into the screen.

Where this bites in practice: a patient identifies by mobile, turns out to have
no ABHA, and creation begins. Creation needs a mobile to attach to the new
account. An implementation that renders a fresh empty mobile field there has
asked the same question twice.

Show provenance. When a field is filled from something you already hold, say so
beside it: taken from what they already gave you, change it only if the new ABHA
should carry something different. A prefilled field with no explanation reads as
a guess.

### How you know it worked

Walk a patient through a route that fails and then through a second route. The
second route asks only for facts the first never collected, and the fields the
first collected arrive filled, each showing where it came from.

Search the interface for a question that is asked in two places. In a journey
built this way there is no such question to find, because the screen cannot name
a field, only request the next missing one.

### When it goes wrong

- A field arrives filled and wrong, and the desk cannot tell why. Provenance is
  missing. Show where each value came from.
- A fact changes under the desk between two screens. Something is overwriting
  rather than writing once. The store should refuse the second write.
- A route fails and the patient is asked everything again. The failed route
  discarded what it collected instead of returning it.

## The six counter screens, and what each is forbidden to ask

### In plain words

Six screens cover every ABHA route a desk offers. Each one declares three
things: what it collects, what it is forbidden to ask, and when it does not
appear at all.

The forbidden column is the one usually missing, and it is the one that stops a
journey asking the same question twice.

### What happens

| Screen | Collects | Must never ask | Skipped when |
|---|---|---|---|
| Identify | one identifier | anything already held | the desk holds a mobile or an ABHA number |
| Confirm it is them | yes or no to a masked number | the number itself | no free lookup ran |
| One time password | six digits | the identifier, again | the chosen route spends no one time password |
| Choose an account | which of several | anything the accounts array already carries | there is one account or none |
| Choose an address | pick or type | anything the profile carries | the route issues a default address |
| Confirm the form | corrections only | anything the profile carries | never. It is the destination |

The account chooser is not an edge case. One mobile carrying several ABHA
accounts is an ordinary shared family handset. A journey written as a straight
line from one time password to signed in has nowhere to put the second account,
and finds this out in production.

The last screen is the destination of the whole journey, which is why it is the
only one never skipped. Everything before it exists to arrive there with the
fields already filled.

### How you know it worked

Every screen in the build maps to a row above. For each one you can say what it
refuses to ask, and that refusal is enforced by the fact store rather than by a
comment.

Run a patient whose mobile carries two ABHA accounts. The account chooser
appears, offers both, and asks for nothing the accounts array already carries.

### When it goes wrong

- A second account signs the wrong person in, or the journey stalls. The account
  chooser was not built. It is not optional.
- A screen asks for the identifier again alongside the one time password. The
  screen is naming its own fields instead of requesting the next missing fact.
- The address screen appears on a route that issues a default address. The skip
  condition is not being checked.

## Where these came from

- `hiecm.concept.m1-avoiding-duplicate-abha`
- `hiecm.concept.m1-counter-journey-order`
- `hiecm.concept.m1-deployment-interview`
- `hiecm.concept.m1-honest-screen-states`
- `hiecm.concept.m1-never-ask-twice`
- `hiecm.concept.m1-screen-contract`
