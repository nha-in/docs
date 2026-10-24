---
id: hiecm.concept.m1-screens-create-abha-aadhaar-otp
type: concept
gateway: hiecm
milestone: M1
version: abdm-v3
functionality: create-abha-aadhaar-otp
title: What the screens of ABHA creation by Aadhaar OTP must do
summary: >
  The screen requirements the Aadhaar OTP creation cases are judged on: the
  published consent with a language choice, the Aadhaar and OTP fields, resend,
  a wrong OTP, the communication mobile, an Aadhaar that already holds an ABHA,
  the address step, the profile, the card and a returning patient.
sources:
  - file: catalogue/hiecm/openapi/.raw/nha-2026-10-22-m1-tests/M1_ABHA_CREATION_VERIFICATION_SCAN_AND_SHARE.xlsx
    status: nha-2026-10-22
    note: Each requirement cites the case whose Expected Result, Steps or tester note it comes from.
  - url: https://sandboxcms.abdm.gov.in/uploads/Consent_Language_ABDM_1_25c394153b.png
    status: published-2026-10-24
    note: >
      The approved consent language, on the sandbox site under Milestone 1,
      Creation of ABHA Number, Consent Language. The declarations below are
      transcribed from it word for word, and its two notes advise a patient
      facing screen and the local language.
  - url: https://sandbox.abdm.gov.in/sandbox/v3/new-documentation?doc=consentLanguage
    status: published-2026-10-24
    note: >
      The Consent Language page, read from its content entry at
      https://sandboxcms.abdm.gov.in/api/newmenus (label Consent Language).
      It states three points: private entities remove the word government,
      the second point is unchecked when ABHA is created using Aadhaar, and the
      beneficiary's name reflects the patient's name dynamically.
  - file: docs/superpowers/plans/2026-10-24-test-run-findings.md
    status: decided-2026-10-24
    note: Findings I2, I3, I4, I9 and I12, and the decision that the skill states no limit on ABHA addresses.
related:
  concepts:
    - hiecm.concept.m1-abha-consent
    - hiecm.concept.abha-address-policy
    - hiecm.concept.m1-avoiding-duplicate-abha
  flows:
    - hiecm.flow.m1-create-abha-aadhaar-otp
---

# What the screens of ABHA creation by Aadhaar OTP must do

## In plain words

Every call in this journey can succeed while the screen around it fails its
case. The requirements below are what the cases are judged on. Each one names
the cases it comes from. Several of them, the consent, the OTP field, resend
and a wrong OTP, hold on every screen in M1 that asks for consent or an OTP,
and the other functionalities point back here for them.

## What happens

### Consent, before the Aadhaar number is sent

Two texts apply, and both are shown before the Aadhaar number leaves your
system.

The terms and conditions for ABHA enrolment are the text in
`hiecm.concept.m1-abha-consent`, under the next heading. The `consent` block
in `enrol/byAadhaar`, `code` `abha-enrollment` and `version` `1.4`, records
agreement to those terms.

The consent language is the facility's own consent screen: five declarations,
each with its own checkbox, then two confirmations. Show it word for word:

> I hereby declare that:
>
> - [x] I am voluntarily sharing my Aadhaar Number / Virtual ID issued by the Unique Identification Authority of India (“UIDAI”), and my demographic information for the purpose of creating an Ayushman Bharat Health Account number (“ABHA number”) and Ayushman Bharat Health Account address (“ABHA Address”). I authorize NHA to use my Aadhaar number / Virtual ID for performing Aadhaar based authentication with UIDAI as per the provisions of the Aadhaar (Targeted Delivery of Financial and other Subsidies, Benefits and Services) Act, 2016 for the aforesaid purpose. I understand that UIDAI will share my e-KYC details, or response of “Yes” with NHA upon successful authentication.
> - [ ] I intend to create Ayushman Bharat Health Account Number (“ABHA number”) and Ayushman Bharat Health Account address (“ABHA Address”) using document other than Aadhaar. (Click here to proceed further)
> - [x] I consent to usage of my ABHA address and ABHA number for linking of my legacy (past) government health records and those which will be generated during this encounter.
> - [x] I authorize the sharing of all my health records with healthcare provider(s) for the purpose of providing healthcare services to me during this encounter.
> - [x] I consent to the anonymization and subsequent use of my government health records for public health purposes.
>   - [ ] I, (name of healthcare worker- depending on the username used for logging in into the system), confirm that I have duly informed and explained the beneficiary of the contents of consent for aforementioned purposes.
>   - [ ] I, (beneficiary name), have been explained about the consent as stated above and hereby provide my consent for the aforementioned purposes.

| Requirement | Cases |
|---|---|
| Show the terms and conditions word for word, with nothing cut, and require an explicit "I agree" before the Aadhaar number is sent | CRT_ABHA_102 |
| Each of the five declarations of the consent language has its own checkbox. In an Aadhaar flow the second one, creation with a document other than Aadhaar, is left unchecked; checking it leads to creation by driving licence | CRT_ABHA_102 |
| The healthcare worker's confirmation names the person logged in to your system, filled from that login. The beneficiary's confirmation shows the patient's name dynamically, from what the screen already holds. Nobody types either name | CRT_ABHA_102 |
| A private entity removes the word "government" from the consent language. A government entity shows it as written | CRT_ABHA_102 |
| Nothing is sent until the terms are agreed and the declarations and both confirmations are in. Store who agreed, who confirmed and when, against the patient | CRT_ABHA_102 |
| Offering the consent in a language other than English is optional, and is what CRT_ABHA_103, an optional case, tests. Where you offer it, the screen has a language choice and the text in another language is the facility's approved translation, loaded as supplied and never machine translated | CRT_ABHA_103 |
| `enrol/byAadhaar` carries the `consent` block with `code` `abha-enrollment` and `version` `1.4`, which records agreement to the terms and conditions | CRT_ABHA_102 |

Advised, not tested: show the consent language on a second screen that faces
the patient, so they can read it, and in the local language.

### Entry, the Aadhaar number and the OTP

| Requirement | Cases |
|---|---|
| Registration offers "Create ABHA", with Aadhaar OTP as a method | CRT_ABHA_101 |
| The Aadhaar field takes 12 digits and nothing else. Fewer or more digits, a letter or a special character shows "Aadhaar Number is not valid" on the screen, and no call is sent. Show the number masked once it is entered | CRT_ABHA_104 |
| The OTP screen names where the OTP went with the masked mobile the `request/otp` response carries in `message`, as the sheet writes it, `*******XXXX`. Never a mobile your system typed in | CRT_ABHA_105 |
| The OTP field takes six digits and nothing else. The verify button enables itself once six digits are in | CRT_ABHA_105, CRT_ABHA_107 |
| An incomplete, wrong or expired OTP shows the message ABDM returned, as it came. On every M1 screen, a message ABDM returns is never replaced by your own wording. The fixed texts the cases quote, such as "Aadhaar Number is not valid" or the not found message of VRFY_ABHA_303, are your product's own and are shown as the cases write them | CRT_ABHA_105, CRT_ABHA_107, VRFY_ABHA_307, VRFY_ABHA_402 |
| A wrong OTP keeps the transaction. The person enters the OTP again on the same screen, and the retry carries the same `txnId`. They never re-enter the Aadhaar number, and the right OTP then succeeds. This holds on every OTP screen in M1 | CRT_ABHA_107, VRFY_ABHA_201, VRFY_ABHA_307, VRFY_ABHA_402 |

### Resend

One rule for every OTP screen in M1.

| Requirement | Cases |
|---|---|
| Resend stays disabled for 60 seconds after each send, and enables itself after that | CRT_ABHA_106, CRT_ABHA_109, VRFY_ABHA_101, VRFY_ABHA_201, VRFY_ABHA_405 |
| At most two resends. A third attempt does not call ABDM and shows "Maximum OTP resend attempts reached. Please try again after 30 mins". Only the Resend control counts toward this limit. A second press of Send OTP is not a resend | CRT_ABHA_106, VRFY_ABHA_304, VRFY_ABHA_405 |
| The tester note asks that the "OTP Counter should be visible". A Resend control that does nothing visible gives the person no answer at all | CRT_ABHA_106, VRFY_ABHA_405 |
| A resend reuses the `txnId` of the first send | CRT_ABHA_106 |

### The communication mobile

| Requirement | Cases |
|---|---|
| A communication mobile that is the Aadhaar linked one goes straight on to creation, with no second OTP | CRT_ABHA_108 |
| A different one is verified by OTP, with the resend and wrong OTP rules above | CRT_ABHA_109 |
| The communication mobile, whichever it is, is the one the ABHA card and profile show | CRT_ABHA_109 |

### An Aadhaar that already holds an ABHA

`enrol/byAadhaar` answers an Aadhaar that already holds an ABHA with a 200,
`isNew` `false`, the message `This account already exist`, a `txnId`, user
`tokens` and the full `ABHAProfile`.

| Requirement | Cases |
|---|---|
| `isNew` `false` is not a stop and not an error screen. Carry on from that response exactly as for a new account | CRT_ABHA_112, CRT_ABHA_113, CRT_ABHA_114 |
| Show the profile from `ABHAProfile`, the card with `tokens.token` as `X-token`, and the address step with the same `txnId` | CRT_ABHA_112, CRT_ABHA_113, CRT_ABHA_114 |
| The address step stays open for an existing account. A person can create more than one ABHA address for the same ABHA number, so never refuse a new one because one exists, and never state a limit | CRT_ABHA_112 |

### The ABHA address

| Requirement | Cases |
|---|---|
| Show at least three suggestions from `enrol/suggestion` to pick from | CRT_ABHA_112 |
| Offer a free field for an address of the person's own, with the rules printed beside it: 8 to 18 characters including `@sbx` or `@abdm`, letters and digits, at most one dot and one underscore, neither first nor last. Each rule shows green when met and red when not | CRT_ABHA_112 |
| An address already in use shows "ABHA address already exists." with two choices: go on with the existing address, or create a new one | CRT_ABHA_112 |

### The profile, the card and a returning patient

| Requirement | Cases |
|---|---|
| After creation, show the 14 digit ABHA number and the ABHA address together with the profile details | CRT_ABHA_113 |
| Show the ABHA card as the API returned it, and let the person download it. A non-KYC ABHA address cannot download a card; say so rather than showing a broken one | CRT_ABHA_114 |
| A system that prints its own programme or scheme card instead prints the ABHA number and the ABHA address on it, both required | CRT_ABHA_115 |
| Before registering, search your own records by mobile, name, gender and age, and by your own beneficiary id when one is given. A full match links this visit to the existing id. A new id is created only when no match holds | CRT_ABHA_116 |

## How you know it worked

Each case named above passes on its Expected Result, judged on the screen. The
consent screen shows the five declarations and both confirmations with the
logged in user's name filled, and a stored record of who agreed and when.

## When it goes wrong

- The terms alone, without the consent language declarations and
  confirmations, fail CRT_ABHA_102 whatever the API returns.
- A creation that stops at "account already exists" leaves CRT_ABHA_112 to 114
  unreachable for an Aadhaar that already holds an ABHA.
- A wrong OTP that starts a new transaction makes the right OTP fail next.
