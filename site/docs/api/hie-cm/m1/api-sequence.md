---
title: M1 API sequence
sidebar_label: API sequence
sidebar_position: 6
description: The M1 calls in the order you make them, from the session token to reading a profile.
verification: unverified
source: ABDM__M1_ABHA_Collection.postman_collection.md
---

# M1 API sequence

This page puts the Milestone 1 ([M1](/docs/api/hie-cm/m1)) calls of [ABDM](/docs/overview/glossary#abdm) in the order your system makes them. Each step names the call and links to its section on the [APIs](/docs/api/hie-cm/m1/apis) page, where the headers, fields and a curl sample live. Read this page to see the shape of a flow. Read the APIs page to write the code.

:::note[Documented, not verified]
This page follows NHA's published document for the M1 ABHA Postman collection. Nothing here has been
run against the ABDM sandbox from this repository, so treat request and
response shapes as unconfirmed.
:::

## M1 has no callbacks

M2 and M3 are asynchronous. You make a request, [NHA](/docs/overview/glossary#nha)'s gateway answers with an acknowledgement, and the real answer arrives later at a callback address your system hosts.

M1 is not like that. Every call in the M1 collection is a plain request and response over HTTPS. Your system does not need to host a callback endpoint for M1, and NHA's gateway never calls you. That makes M1 the easier milestone to start on, and it is why the sequences below read as straight lines.

One call comes close to being asynchronous without being a callback. During the optional face authentication route, the person completes a step in the ABHA app on their phone, and your system finds out by asking for the personal identity data (PID) block with [Poll PID capture](/docs/api/hie-cm/m1/apis#poll-pid-capture) until the status changes. Your system drives that loop. NHA does not push anything to you.

## Sequence 0: before any flow

Do this once at the start, and again whenever the token expires.

1. [Get an access token](/docs/api/hie-cm/m1/apis#get-an-access-token). Send your client ID and client secret to the [HIE-CM](/docs/overview/glossary#hie-cm) gateway sessions endpoint. Keep the `accessToken` from the response. Every call after this one carries it in the `Authorization` header.

Before you send any Aadhaar number, mobile number, email address, [OTP](/docs/overview/glossary#otp) value or password, encrypt it. Two options.

2. [Encrypt a field](/docs/api/hie-cm/m1/apis#encrypt-a-field). Post the plain value to NHA's encryption endpoint and use the `encryptedData` it returns. This is the option the Postman collection uses for the find ABHA flow.

Or fetch NHA's public certificate and encrypt locally. NHA's M1 document names a `public/certificate` API for this, but gives the curl and the response only as screenshots, so the full URL and the response body are not transcribed. Local encryption is the better choice for production because the plain value never leaves your system.

## Sequence 1: create an ABHA by Aadhaar OTP

This is the mandatory creation route for private and government integrators alike. Eight calls, of which two are optional.

1. [Request an enrolment OTP](/docs/api/hie-cm/m1/apis#request-an-enrolment-otp) with `scope: ["abha-enrol"]`, `loginHint: "aadhaar"` and `otpSystem: "aadhaar"`. NHA asks Aadhaar to send an OTP to the mobile registered against that Aadhaar. Keep the `txnId`.
2. [Enrol by Aadhaar](/docs/api/hie-cm/m1/apis#enrol-by-aadhaar) with the `txnId` and the encrypted OTP. This is the call that issues the [ABHA](/docs/overview/glossary#abha) number. Keep `ABHAProfile.ABHANumber`, `tokens.token` and `tokens.refreshToken`, and the new `txnId`.
3. [Request an enrolment OTP](/docs/api/hie-cm/m1/apis#request-an-enrolment-otp) again, this time with `scope: ["abha-enrol","mobile-verify"]`, `loginHint: "mobile"` and `otpSystem: "abdm"`. This is the communication mobile number, which may differ from the Aadhaar linked one. NHA sends this OTP itself.
4. [Verify an enrolment OTP](/docs/api/hie-cm/m1/apis#verify-an-enrolment-otp) with the same scope and the encrypted OTP. The mobile number is now attached.
5. [Request an enrolment OTP](/docs/api/hie-cm/m1/apis#request-an-enrolment-otp) with `scope: ["abha-enrol","email-verify"]`. **Optional.** Skip it if you are not collecting an email address.
6. [Verify an enrolment OTP](/docs/api/hie-cm/m1/apis#verify-an-enrolment-otp) with the email scope. **Optional**, and only if you did step 5.
7. [Get ABHA address suggestions](/docs/api/hie-cm/m1/apis#get-abha-address-suggestions). Pass the transaction in the `TRANSACTION_ID` header, not in a body. Show the list to the person, or let them type their own address.
8. [Link an ABHA address](/docs/api/hie-cm/m1/apis#link-an-abha-address) with the chosen address and `preferred: 1`. Enrolment is done.

Note the two OTP systems in this sequence. Step 1 uses `otpSystem: "aadhaar"`, so the OTP comes from Aadhaar. Steps 3 and 5 use `otpSystem: "abdm"`, so the OTP comes from NHA. They are verified at different endpoints: the Aadhaar OTP at `enrol/byAadhaar`, the NHA OTP at `auth/byAbdm`. Sending one to the other's endpoint is a common first day mistake.

## Sequence 2: create an ABHA by face authentication

Optional for private and government integrators. It replaces steps 1 and 2 of sequence 1 with four calls. Steps 3 to 8 above then run unchanged.

1. [Start a face or biometric transaction](/docs/api/hie-cm/m1/apis#start-a-face-or-biometric-transaction) with `scope: ["abha-enrol","face-auth"]`. Turn the `txnId` you get back into a quick response (QR) code and show it.
2. The person opens the ABHA app, taps Portal Face Auth, scans your QR code, and completes face authentication through the Aadhaar registered device service. Nothing arrives at your system during this step.
3. [Poll PID capture](/docs/api/hie-cm/m1/apis#poll-pid-capture) on a loop. It answers HTTP 200 every time, so branch on the `status` field: `PENDING`, then `VERIFIED`, then `COMPLETE`. Stop when you see `COMPLETE`.
4. [Enrol by Aadhaar](/docs/api/hie-cm/m1/apis#enrol-by-aadhaar) with `authMethods: ["face_auth"]` and the transaction ID. From here, continue at step 3 of sequence 1.

The biometric routes, fingerprint and IRIS, follow the same shape with a signed data block captured from an Aadhaar registered device. NHA's M1 document shows those request bodies only as screenshots, so the fields are not transcribed.

## Sequence 3: log in by mobile number

Mandatory for private and government integrators. Three calls, because one mobile number can have several ABHA accounts behind it.

1. [Request a login OTP](/docs/api/hie-cm/m1/apis#request-a-login-otp) with `scope: ["abha-login","mobile-verify"]`, `loginHint: "mobile"` and `otpSystem: "abdm"`. The response message names the masked mobile the OTP went to, which is worth showing the person.
2. [Verify a login](/docs/api/hie-cm/m1/apis#verify-a-login) with the `txnId` and the encrypted OTP.
3. [Verify the user](/docs/api/hie-cm/m1/apis#verify-the-user) with the ABHA number the person picked. This call carries the transaction token in a `T-token` header, which appears nowhere else in M1. The response gives you the user token and the refresh token for that account.

The collection has no shortcut for a mobile number with exactly one ABHA behind it, so build for all three calls. Neither source says whether NHA's service lets you skip step 3 in that case.

## Sequence 4: log in by ABHA number

Mandatory for private and government integrators. Two calls. The person can authenticate with an Aadhaar OTP or a mobile OTP, and the difference is one field.

1. [Request a login OTP](/docs/api/hie-cm/m1/apis#request-a-login-otp) with `loginHint: "abha-number"`. For the Aadhaar route use `scope: ["abha-login","aadhaar-verify"]` and `otpSystem: "aadhaar"`. For the mobile route use `scope: ["abha-login","mobile-verify"]` and `otpSystem: "abdm"`.
2. [Verify a login](/docs/api/hie-cm/m1/apis#verify-a-login) with the same scope, the `txnId` and the encrypted OTP. You receive `token`, `refreshToken` and `expiresIn`.

There is also a password route. It is a single call to [Verify a login](/docs/api/hie-cm/m1/apis#verify-a-login) with `scope: ["abha-login","password-verify"]` and an `authData.password` object holding the ABHA number and the encrypted password. No OTP request comes first.

## Sequence 5: log in by Aadhaar number

Mandatory for private and government integrators. Two calls, and this one uses the v3.1 base URL at `https://abhasbx.abdm.gov.in/abha/api/v3.1/`.

1. [Request a login OTP](/docs/api/hie-cm/m1/apis#request-a-login-otp) with `scope: ["abha-login","aadhaar-verify","aadhaar-otp-verify"]`, `loginHint: "aadhaar"` and `otpSystem: "aadhaar"`.
2. [Verify a login](/docs/api/hie-cm/m1/apis#verify-a-login) with the same three scope values.

NHA's M1 document also says the fingerprint and IRIS routes for login by Aadhaar number use v3.1.

## Sequence 6: find an ABHA, then log in

For a person who knows their mobile number but not their ABHA number. Four calls.

1. [Encrypt a field](/docs/api/hie-cm/m1/apis#encrypt-a-field) to encrypt the mobile number.
2. [Search for an ABHA](/docs/api/hie-cm/m1/apis#search-for-an-abha) with `scope: ["search-abha"]`. Keep the transaction ID from the result. The response shape here is contradictory across the two pieces of evidence in the collection, and the APIs page explains what to expect and why to confirm it against sandbox.
3. [Request a login OTP](/docs/api/hie-cm/m1/apis#request-a-login-otp) with `scope: ["abha-login","search-abha","mobile-verify"]`, `loginHint: "index"`, and the search transaction ID in `txnId`.
4. [Verify a login](/docs/api/hie-cm/m1/apis#verify-a-login) with `scope: ["abha-login","mobile-verify"]`. You receive the user token.

## Sequence 7: read the profile

One call, and it is the fastest way to prove your login actually worked.

1. [Get the profile](/docs/api/hie-cm/m1/apis#get-the-profile). Send the gateway token in `Authorization` and the user token in `X-token`. Both are required. You get the ABHA number, the ABHA address, name parts, date of birth, gender, mobile and photo.

The ABHA card and QR code calls sit alongside it and take the same two headers.

2. [Get the ABHA QR code](/docs/api/hie-cm/m1/apis#get-the-abha-qr-code).
3. [Generate the ABHA card](/docs/api/hie-cm/m1/apis#generate-the-abha-card).
4. [Download the ABHA card](/docs/api/hie-cm/m1/apis#download-the-abha-card).

## Sequence 8: update the mobile number on an existing profile

Optional for private and government integrators. Two calls, and both need the user token.

1. [Request a profile OTP](/docs/api/hie-cm/m1/apis#request-a-profile-otp) with `scope: ["abha-profile","mobile-verify"]` and the new number, encrypted.
2. [Verify a profile change](/docs/api/hie-cm/m1/apis#verify-a-profile-change) with the same scope and the encrypted OTP.

The email update, password change, re-[KYC](/docs/overview/glossary#kyc), delete and deactivate flows use the same two calls with a different second scope value.

## Sequence 9: keeping the session alive

The one saved login example gives the user token an `expiresIn` of 1800 seconds. A clinic session that runs longer than half an hour needs this.

1. [Refresh the user token](/docs/api/hie-cm/m1/apis#refresh-the-user-token). Put the refresh token in the `R-token` header, not `X-token` and not the body. You get a new `token` and a new `refreshToken`. Store both. Neither source says whether the old refresh token keeps working, so treat it as spent.
2. [Log out](/docs/api/hie-cm/m1/apis#log-out) when the person is done. You get back `{"message": "You have been logged out"}`.

## What to build first

If you want one thread through the whole milestone, build sequence 0, then sequence 1, then sequence 3, then sequence 7. That is create, log in, read back. It exercises the session token, both OTP systems, the user token, and the two header positions tokens live in. Everything else in M1 is a variation on those four.

The [test cases](/docs/api/hie-cm/m1/test-cases) page turns that thread into checks you can run. The [errors](/docs/api/hie-cm/m1/errors) page covers what comes back when a step fails.
