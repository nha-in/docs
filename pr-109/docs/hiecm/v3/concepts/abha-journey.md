# Designing the ABHA journey

ABDM publishes operations, not a user experience. How your registration screen looks and what it asks first is yours to decide. This page gives one default that gets a person through a desk, and the facts that constrain any design you build instead.

## In short

- Put the ABHA step before your registration form, and let the profile fill it.
- Send every identifier to login first. Creation is the branch taken only when no account comes back.
- Exchange the login token for the user token before any profile call.
- Never block care on an ABHA.

## A suggested journey, and what holds regardless

A front desk adopts ABHA because the receptionist stops typing. A verified ABHA profile already carries the name, date of birth, gender, mobile, address and photograph. So the ABHA step comes before your registration form, and fills it.

The suggested journey, in five steps:

1. **Start registering the patient** in your own system, under your own number.
2. **Ask whether they have an ABHA.** No means the form is typed by hand, and the patient is treated exactly the same.
3. **Take one identifier.** Aadhaar is the one to recommend, because it is the only route that ends in a KYC verified ABHA number. Mobile sits beside it. Under Aadhaar only, ask how they prove it: an OTP, a face scan, or a fingerprint or iris reader.
4. **Log in or create, decided by the answer.** Every identifier starts on the login path. One account signs the person in. Several need a chooser. None offers creation.
5. **Fill your form from what came back,** and let the receptionist confirm it rather than type it.

Whatever journey you build, these hold:

- **Look before you create.** Creating an ABHA for a person who already holds one leaves them with two ABHA numbers, and nothing in M1 merges them.
- **The login token is not the profile token.** Login verify returns a short lived token, which the verify user call exchanges for the `X-token` that profile calls accept.
- **An ABHA is optional to your record.** ABDM does not require a person to hold an ABHA to be treated. A journey that cannot finish without one blocks care.
- **The profile is what ABDM holds**, not what is in front of your clinician. Present the filled form for confirmation rather than saving it unseen.

Notes for AI agents

**Before you start.** A gateway session, the M1 certificate for encrypting identifiers, and a decision on what the desk does when the person has no ABHA and does not want one today.

**What happens.** Send every identifier, Aadhaar included, to the login OTP request first, never straight to enrolment. Read `accounts` on the verify response: one account, call verify user with its `ABHANumber` and the same `txnId`; several, show a chooser and do the same with the chosen one; none, offer creation. Then read the profile at `/abha/api/v3/profile/account` with the `X-token` and fill the form.

**How you know it worked.** A person with an ABHA registers with their details arriving from the profile and the receptionist correcting at most one field. A person who declines is still registered, with no error, and can be offered ABHA again from their chart. A person who already holds an ABHA, run through the path a new patient takes, ends signed in to the account they had.

**When it goes wrong.** Two ABHA numbers for one person: the journey branched into creation without reading `accounts`. The desk types everything and then links an ABHA: the order is wrong, fetch the profile first. A refused encrypted field shown to the person as a wrong number: check the padding before you blame the number, see [encryption](/docs/pr-109/docs/hiecm/v3/concepts/encryption).

## Next

- [M1 Identity](/docs/pr-109/docs/hiecm/v3/milestones/m1), every journey drawn call by call.
- [ABHA Registry](/docs/pr-109/docs/hiecm/v3/registries/abha), the number and the address.
- [Build it well](/docs/pr-109/docs/hiecm/v3/getting-started/build-it-well), the screens and the profile fields to map.
