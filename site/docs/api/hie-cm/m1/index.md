---
title: M1 ABHA identity
sidebar_label: Overview
sidebar_position: 0
description: What Milestone 1 gives you, what you need before your first call, and the order to read the M1 pages.
verification: unverified
source: ABDM__Proposed_Simplified_Milestone_1.md
---

# M1 ABHA identity

Milestone 1 (M1) is the identity milestone of [ABDM](/docs/overview/glossary#abdm). It is the set of APIs that let your system create an [ABHA](/docs/overview/glossary#abha) for a person, log that person in, and read or update their profile. An ABHA number is a 14 digit identifier issued to a person after a strong [KYC](/docs/overview/glossary#kyc) check. Every other ABDM flow assumes the person already has one, so M1 is where you start.

:::note[Documented, not verified]
This page follows NHA's published document for Proposed Simplified Milestone 1. Nothing here has been
run against the ABDM sandbox from this repository, so treat request and
response shapes as unconfirmed.
:::

## What M1 gives you

Four things, in the order you will build them.

| Capability | What your system can do |
|---|---|
| Session and tokens | Get an access token, refresh it, and fetch NHA's public certificate for encrypting fields |
| ABHA creation | Create an ABHA number after verifying the person against Aadhaar, then attach a communication mobile number and an ABHA address |
| ABHA login | Let an existing ABHA holder sign in by mobile number, Aadhaar number, ABHA number or ABHA address |
| Profile management | Read the profile, show the ABHA card and quick response (QR) code, update the mobile number, redo KYC |

M1 does not move health records. Linking records is [M2](/docs/api/hie-cm/m2), and consented fetching of records is [M3](/docs/api/hie-cm/m3).

## Building blocks used

- The [ABHA registry](/docs/overview/building-blocks/registries), which issues and holds the ABHA number, the ABHA address and the profile.
- The [HIE-CM](/docs/overview/glossary#hie-cm) gateway, which issues the session token your calls carry. See [HIE-CM gateway](/docs/overview/building-blocks/hie-cm).

Aadhaar itself is not an ABDM building block. NHA's ABHA service calls Aadhaar on your behalf. Your system never talks to Aadhaar directly.

## Before you start

You need three things.

1. **Sandbox credentials.** A client ID and client secret from the ABDM sandbox. [Get started](/docs/overview/get-started) covers the signup.
2. **An access token.** Call the session API with those credentials. Every M1 call carries the token. The session and refresh token calls are on the [API sequence](/docs/api/hie-cm/m1/api-sequence) page, and their headers and bodies are on the [APIs](/docs/api/hie-cm/m1/apis) page.
3. **NHA's public certificate.** Several M1 fields, including the Aadhaar number, the [OTP](/docs/overview/glossary#otp) and the mobile number, are sent encrypted. You fetch the public certificate from NHA and encrypt those fields with it. NHA's document points at the RSA tool at [devbeaver.com](https://devbeaver.com/rsa-encryption-decryption-tool) for checking your encryption by hand.

## Base URLs

| Environment | Base URL |
|---|---|
| Sandbox | `https://abhasbx.abdm.gov.in/abha/api/v3/` |
| Production | `https://abha.abdm.gov.in/api/abha/v3/` |

Two login routes are the exception. NHA's document says login by Aadhaar number using fingerprint or iris uses the v3.1 APIs, at `https://abhasbx.abdm.gov.in/abha/api/v3.1/` in sandbox. NHA's document gives no production v3.1 URL.

## Read M1 in this order

1. [User journey](/docs/api/hie-cm/m1/user-journey). The flows, one diagram each, so you can see the shape before the detail.
2. [Use cases](/docs/api/hie-cm/m1/use-cases). Every M1 capability, and which ones are mandatory for you.
3. [Agent skills](/docs/api/hie-cm/m1/agent-skills). How to give a coding agent the M1 context.
4. [Implementation methodology](/docs/api/hie-cm/m1/implementation). The mandatory path, the optional path, and how to choose.
5. [API sequence](/docs/api/hie-cm/m1/api-sequence). The calls in the order you make them.
6. [APIs](/docs/api/hie-cm/m1/apis). What to send and what comes back, per endpoint.
7. [Errors](/docs/api/hie-cm/m1/errors). What each failure means and what to do about it.
8. [Test cases](/docs/api/hie-cm/m1/test-cases). What to run before you claim M1 is done.

Sandbox test data for these flows is in the [data dictionary](/docs/api/data-dictionary). If you get stuck, [support](/docs/support) lists the channels.
