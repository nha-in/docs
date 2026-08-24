---
title: M1 use cases
sidebar_label: Use cases
sidebar_position: 3
description: Every capability M1 offers, and which ones NHA marks mandatory for private and for government integrators.
verification: unverified
source: ABDM__Proposed_Simplified_Milestone_1.md
---

# M1 use cases

Milestone 1 (M1) of [ABDM](/docs/overview/glossary#abdm) covers more than creating an [ABHA](/docs/overview/glossary#abha). It also covers login, profile reads, the ABHA card, mobile number changes and repeat [KYC](/docs/overview/glossary#kyc). NHA marks each one mandatory or optional, and the marking differs for private integrators and government integrators. This page lists them all with NHA's marking, so you can work out your own scope before you write code.

:::note[Documented, not verified]
This page follows NHA's published document for Proposed Simplified Milestone 1. Nothing here has been
run against the ABDM sandbox from this repository, so treat request and
response shapes as unconfirmed.
:::

## At a glance

| Use case | Private integrators | Government integrators |
|---|---|---|
| Session and tokens | Mandatory | Mandatory |
| Create ABHA by Aadhaar [OTP](/docs/overview/glossary#otp) | Mandatory | Mandatory |
| Create ABHA by Aadhaar face authentication | Optional | Optional |
| Create ABHA by Aadhaar biometrics | Optional | Optional |
| Create ABHA by Aadhaar demographic authentication | Not required | Mandatory |
| Create a child ABHA | Not available | By NHA approval only |
| ABHA login, all four entry points | Mandatory | Mandatory |
| User profile | Mandatory | Mandatory |
| ABHA card | Mandatory | Mandatory |
| Mobile number management | Optional | Optional |
| Re-KYC | Optional | Optional |
| Benefit programs | Not available | Government only |

Everything below expands one row. The order of calls inside each use case is on the [API sequence](/docs/api/hie-cm/m1/api-sequence) page.

## Session and tokens

**Mandatory for both private and government integrators.**

Every M1 call carries an access token. You get one from the session API using your sandbox client ID and client secret, and you renew it with the refresh token API. A third call fetches NHA's public certificate, which you need because several M1 fields travel encrypted rather than in plain text: the Aadhaar number, the OTP value, the mobile number and the email address among them.

Build this first. Nothing else in M1 works without it.

## Create an ABHA by Aadhaar OTP

**Mandatory for both private and government integrators.**

The person enters their Aadhaar number. NHA sends an OTP to the mobile number registered against that Aadhaar. After the OTP is verified and consent is recorded, a 14 digit ABHA number is issued. This is the route NHA expects every integrator to support, and it is the one drawn in [journey 1](/docs/api/hie-cm/m1/user-journey).

The full route has more steps than the OTP pair:

1. Generate Aadhaar OTP.
2. Verify Aadhaar OTP. This is the enrolment call.
3. Set the communication mobile number, described in the next section.
4. Verify the email address. NHA marks this step optional.
5. Ask for ABHA address suggestions, then link the address the person picks.
6. Create the ABHA with the profile details.

## Verify a mobile number by mobile OTP

**Part of every creation route. Not a separate way to create an ABHA.**

NHA's document does not describe an ABHA creation route that starts from a mobile number. Mobile OTP appears in two other places, and it is worth being clear about which is which:

- **Inside creation.** After enrolment, the person gives a communication mobile number and confirms it with an OTP. NHA repeats this step in the Aadhaar OTP route, the face authentication route and the biometric route. It is [journey 2](/docs/api/hie-cm/m1/user-journey).
- **At login.** An existing ABHA holder can sign in with a mobile OTP. That is the login section below.

If you are looking for a way to issue an ABHA to someone who has no Aadhaar, the only route in this document is child ABHA, and it is restricted.

## Create an ABHA by Aadhaar face authentication

**Optional for both private and government integrators.**

The person authenticates their face through the Aadhaar RD Service app on a phone, rather than typing an OTP. NHA's flow uses a quick response (QR) code as the handoff between your portal and the phone.

The steps NHA documents:

1. Your system generates a transaction ID and renders it as a QR code.
2. The person opens the ABHA app and taps the portal face authentication icon.
3. The person scans the QR code.
4. If the Aadhaar RD Service app is missing, the ABHA app sends them to the Play Store or App Store to install it.
5. The person completes face authentication in the RD Service app.
6. Both the app and your portal show a confirmation.
7. Your system fetches the profile details and continues with the same mobile number, address and create steps as the Aadhaar OTP route.

The person needs the ABHA app installed before they start. That is a real prerequisite, not a detail: plan the screen that tells them so.

## Create an ABHA by Aadhaar biometrics

**Optional for both private and government integrators.**

The person authenticates with a fingerprint or an iris scan captured on an Aadhaar Registered Device (RD). The device captures the biometric and produces an encrypted, digitally signed PID block. Your system sends that block with the Aadhaar details. On success, the profile is validated and an ABHA number is issued.

Fingerprint and iris are two separate flows in NHA's document, and they run against the same enrol by biometrics call. UIDAI publishes the list of approved devices at [uidai.gov.in](https://uidai.gov.in/en/ecosystem/authentication-devices-documents/biometric-devices.html).

After enrolment, this route continues with the same communication mobile number, optional email, address suggestion, address link and create steps as the Aadhaar OTP route.

## Create an ABHA by Aadhaar demographic authentication

**Mandatory for government integrators. Not required for private integrators.**

The person is verified against the demographic details held against their Aadhaar, such as name, date of birth and gender, with no OTP and no biometric. After the demographic check passes and the person gives explicit consent, a 14 digit ABHA number is issued.

If you are a private integrator, you can skip this one.

## Create a child ABHA

**Available to specific government integrators, by NHA leadership approval.**

A child ABHA is a 14 digit identifier for a child under six years old who does not yet have an Aadhaar number. It exists so that a health record can start at birth and stay continuous. It is issued with the consent of a parent or legal guardian, and the record links to the parent's ABHA number.

NHA states that this is currently reached through government health programmes integrated with ABDM, naming UWIN, RCH, POSHAN, iHMS and PCTS in Rajasthan. The document lists calls to create a child ABHA, count the children mapped to a parent ABHA number, update a child ABHA, and run KYC on one with an OTP pair.

Access is not open. If you are not one of those programmes, treat this as out of scope.

## ABHA login

**Mandatory for both private and government integrators, on all four entry points.**

An existing ABHA holder signs in to your system. NHA documents four entry points, and marks each of them mandatory:

| Entry point | What the person types | Challenge methods NHA documents |
|---|---|---|
| Mobile number | Their mobile number | Mobile OTP, then pick which account on that number |
| Aadhaar number | Their Aadhaar number | Aadhaar OTP, fingerprint, iris, face authentication |
| ABHA number | Their 14 digit ABHA number | Aadhaar OTP, mobile OTP, fingerprint, iris |
| ABHA address | Their ABHA address | Aadhaar OTP, mobile OTP, fingerprint, iris |

Every one of these is the same two beats: request a challenge, then verify it. Login by mobile number adds a third beat, because one mobile number can hold several ABHAs and the person has to say which one they mean.

NHA's document puts a fifth flow inside the mobile number section, called find ABHA. The person who has forgotten their ABHA gives a mobile number, your system finds the accounts on it, and the person then proves who they are with an Aadhaar OTP, a mobile OTP, a fingerprint, an iris scan or face authentication. Treat it as a variant of login by mobile number rather than a fifth entry point.

Two of these routes are on a different version. NHA's document says login by Aadhaar number with fingerprint or with iris uses the v3.1 APIs, at `https://abhasbx.abdm.gov.in/abha/api/v3.1/` in sandbox. The rest of M1 is on v3.

After a successful ABHA address login, a separate call fetches the ABHA address profile details.

## User profile

**Mandatory for both private and government integrators.**

Fetch the profile of the person whose token you hold. NHA groups this with the QR code and the card as one set of profile actions, drawn in [journey 4](/docs/api/hie-cm/m1/user-journey).

## ABHA card and QR code

**Mandatory for both private and government integrators.**

Download the ABHA card for the signed in person. NHA's document shows the card arriving inside the response rather than as a URL to fetch separately. The QR code is part of the same profile action set, and it is what lets a person share their ABHA at a facility desk by being scanned.

The exact response shapes for the card and the QR code were pasted as screenshots in NHA's document and did not convert to text. They are not yet transcribed, and the [APIs](/docs/api/hie-cm/m1/apis) page says the same for both calls. Do not assume a field name until you have called the endpoint yourself.

## Mobile number management

**Optional for both private and government integrators.**

Change the communication mobile number on an existing ABHA. Two calls: request an OTP on the new number, then verify it. This is the same pair as the post enrolment mobile step, pointed at an account that already exists.

## Re-KYC

**Optional for both private and government integrators.**

Run the KYC check again on an existing ABHA number, as an OTP request followed by an OTP verify. NHA documents it under profile management, so it acts on an account that already exists rather than creating one.

## Benefit programs

**Government integrators only.**

Search the benefit programmes associated with an ABHA number, and link or delink a programme. NHA documents linking and delinking through three different identifiers: an XML UID, an ABHA number, or an X-Token. Private integrators do not get this.

## Next

Once you know which rows apply to you, [implementation methodology](/docs/api/hie-cm/m1/implementation) puts them in build order. The failures each one can throw are on the [errors](/docs/api/hie-cm/m1/errors) page.
