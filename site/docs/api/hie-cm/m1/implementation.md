---
title: M1 implementation methodology
sidebar_label: Implementation
sidebar_position: 5
description: The mandatory path through M1, the optional path, and how to decide which parts you build.
verification: unverified
source: ABDM__Proposed_Simplified_Milestone_1.md
---

# M1 implementation methodology

Milestone 1 (M1) of [ABDM](/docs/overview/glossary#abdm) looks larger than it is. NHA documents five ways to create an [ABHA](/docs/overview/glossary#abha), four ways to log in and a handful of profile actions, but most integrators are obliged to build a small subset of that. This page separates the parts NHA marks mandatory from the parts it marks optional, and gives you an order to build them in.

:::note[Documented, not verified]
This page follows NHA's published document for Proposed Simplified Milestone 1. Nothing here has been
run against the ABDM sandbox from this repository, so treat request and
response shapes as unconfirmed.
:::

## First, answer one question

Are you a private integrator or a government integrator? NHA's markings differ, and the difference is not cosmetic. Two capabilities are government only, and one more is mandatory for government and not required for private. Every marking on this page is NHA's, taken from the headings in its M1 document. Full detail per capability is on the [use cases](/docs/api/hie-cm/m1/use-cases) page.

## The mandatory path

This is the shortest route to a complete M1 for a private integrator. A government integrator builds the same path plus one more creation route.

### Step 1: Session and tokens

Get an access token from the session API with your sandbox client ID and client secret. Add the refresh token call, because tokens expire and you do not want a re-login in the middle of an enrolment. Fetch NHA's public certificate and wire up RSA encryption, because the Aadhaar number, the [OTP](/docs/overview/glossary#otp) value, the mobile number and the email address are sent encrypted rather than in plain text.

Nothing else in M1 runs until this works. Build it first and test it on its own.

### Step 2: ABHA creation by Aadhaar OTP

Mandatory for private and government integrators. The six steps are on the [user journey](/docs/api/hie-cm/m1/user-journey) page: generate Aadhaar OTP, verify it, set the communication mobile number, verify the email if you want it, link an ABHA address, create the ABHA.

Two of those six are easy to underestimate. The communication mobile number is a separate OTP pair, and it is not the same number as the Aadhaar linked one in every case. The ABHA address needs a suggestion call and a link call before the create call, so the person can pick an address that is free.

### Step 3: ABHA login

Mandatory for private and government integrators, on all four entry points: mobile number, Aadhaar number, ABHA number and ABHA address. Every one is a request and a verify. Build the mobile number route first, because it also carries the account picker for a person with more than one ABHA on the same number, and that picker is the part most integrations get wrong.

Note the version split before you start. Login by Aadhaar number with a fingerprint or an iris scan uses the v3.1 APIs at `https://abhasbx.abdm.gov.in/abha/api/v3.1/` in sandbox. Everything else in M1 uses v3 at `https://abhasbx.abdm.gov.in/abha/api/v3/`, and `https://abha.abdm.gov.in/api/abha/v3/` in production.

### Step 4: Profile and ABHA card

Mandatory for private and government integrators. Fetch the profile, download the card, render the quick response (QR) code. These are plain reads against a token you already hold, so they are the least risky part of M1 and a good way to prove your token handling from step 1 is sound.

### Step 5, government integrators only: demographic authentication

Mandatory for government integrators, not required for private ones. Create an ABHA by checking name, date of birth and gender against Aadhaar, with explicit consent and no OTP.

## The optional path

Everything below is marked optional by NHA for both private and government integrators. Skip all of it and you still complete M1.

| Optional capability | Build it when |
|---|---|
| Creation by face authentication | Your users are on phones and you want to avoid typing an OTP. Note that they must install the ABHA app and the Aadhaar RD Service app first. |
| Creation by fingerprint or iris | You run assisted desks with an Aadhaar Registered Device already on the counter. |
| Email verification during creation | You send anything by email. It sits inside the creation flow either way. |
| Mobile number management | Your users change numbers and you would rather not send them to another app. |
| Re-KYC | You hold accounts long enough that a KYC refresh becomes a support request. |

Two more capabilities are not a choice at all. Benefit programmes are government only. Child ABHA is restricted to specific government integrators with NHA leadership approval, so if you have not been told you have it, you do not.

## How to choose

Three questions decide almost every case.

1. **Are you government or private?** Government adds demographic authentication as mandatory, and opens benefit programmes. Private stops at the four mandatory steps.
2. **Where does enrolment physically happen?** A counter with an Aadhaar Registered Device makes biometric creation worth the work. A person on their own phone makes face authentication worth the work. A web form makes neither worth it, and Aadhaar OTP covers you.
3. **How long will you hold the account?** A long lived account justifies mobile number management and re-KYC. A one visit registration flow does not.

If you cannot answer question two yet, build the mandatory path and ship it. The optional creation routes attach to the same enrolment and profile calls afterwards, so choosing later costs you very little.

## What done looks like

M1 is done when the [test cases](/docs/api/hie-cm/m1/test-cases) pass for every capability you decided to build. The order of calls per capability is on the [API sequence](/docs/api/hie-cm/m1/api-sequence) page. The sandbox test identities are in the [data dictionary](/docs/api/data-dictionary).

After M1, records come next. [M2](/docs/api/hie-cm/m2) links a person's records at your facility to their ABHA. [M3](/docs/api/hie-cm/m3) fetches records with consent.
