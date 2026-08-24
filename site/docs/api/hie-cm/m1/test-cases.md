---
title: M1 test cases
sidebar_label: Test cases
sidebar_position: 9
description: What to run before you call M1 done, each test stated once in plain words and once as exact pass and fail conditions.
verification: unverified
source: ABDM__M1_ABHA_Collection.postman_collection.md
---

# M1 test cases

These are the checks worth running before you say Milestone 1 ([M1](/docs/api/hie-cm/m1)) of [ABDM](/docs/overview/glossary#abdm) is done. Each test is stated twice. First in plain words, so anyone on the team can say whether it passed. Then as exact conditions, so your test code can decide without a human. Run them in order, because most tests need the token or the [ABHA](/docs/overview/glossary#abha) number the previous one produced.

:::note[Documented, not verified]
This page follows NHA's published document for the M1 ABHA Postman collection. Nothing here has been
run against the ABDM sandbox from this repository, so treat request and
response shapes as unconfirmed.
:::

The pass conditions below name response fields the Postman collection's own test scripts read, and status codes those scripts assert. Where a field is not named in any script or saved example, the test says so rather than guessing. Sandbox test identities are in the [data dictionary](/docs/api/data-dictionary).

## Group A: session and encryption

### A1. Your credentials work

**In plain words.** Your system can prove who it is to [NHA](/docs/overview/glossary#nha). If this fails, nothing else in M1 can run, so fix it before reading further.

**Technically.** Call [Get an access token](/docs/api/hie-cm/m1/apis#get-an-access-token) with your sandbox client ID and secret and `grantType: "client_credentials"`.

- **Pass:** HTTP 200, and the body has a non empty `accessToken` string.
- **Fail:** any non 200. A 401 with `{"code": "900901"}` means the credentials are wrong, not the request. Check the `X-CM-ID: sbx` header, which the sessions call needs and no other M1 call has.

### A2. A call without a token is rejected

**In plain words.** NHA turns you away when you do not identify yourself. Worth proving, because a system that accidentally works without a token is reading a cached response somewhere.

**Technically.** Call [Get the profile](/docs/api/hie-cm/m1/apis#get-the-profile) with the `Authorization` header removed.

- **Pass:** HTTP 401, and the body carries `code` of `900901` or an `error.code`. See [errors](/docs/api/hie-cm/m1/errors).
- **Fail:** HTTP 200. Stop and find out what is answering you.

### A3. Encryption produces something different from the input

**In plain words.** The Aadhaar number, mobile number and OTP that leave your system are scrambled, not readable.

**Technically.** Call [Encrypt a field](/docs/api/hie-cm/m1/apis#encrypt-a-field) with a known plain mobile number.

- **Pass:** HTTP 200, `encryptedData` is present, is not equal to the input, and is longer than the input.
- **Fail:** `encryptedData` equals the input, or is absent. Also treat as a fail any place in your own code where a plain Aadhaar number, mobile number or OTP reaches a request body. Grep for it.

## Group B: ABHA creation

### B1. A new ABHA number is created from an Aadhaar OTP

**In plain words.** A person hands over their Aadhaar number, types the code that arrives on their phone, and comes out the other side with a 14 digit ABHA number. This is the core of M1.

**Technically.** Run steps 1 and 2 of [sequence 1](/docs/api/hie-cm/m1/api-sequence#sequence-1-create-an-abha-by-aadhaar-otp).

- **Pass, step 1:** HTTP 200 from [Request an enrolment OTP](/docs/api/hie-cm/m1/apis#request-an-enrolment-otp) with `scope: ["abha-enrol"]`, and a non empty `txnId` in the body.
- **Pass, step 2:** HTTP 200 from [Enrol by Aadhaar](/docs/api/hie-cm/m1/apis#enrol-by-aadhaar), and the body carries `ABHAProfile.ABHANumber`, `tokens.token` and `tokens.refreshToken`. The ABHA number matches `91-\d{4}-\d{4}-\d{4}` and passes the Luhn checksum on its 14 digits.
- **Fail:** a 400 whose body key is `txnId` means you sent the wrong transaction ID. A 422 with `ABDM-1204` means Aadhaar itself rejected the attempt, and the code from the Unique Identification Authority of India (UIDAI) inside the message says why.

### B2. A wrong OTP does not create an ABHA

**In plain words.** Typing the wrong code fails, and fails cleanly, with nothing half created.

**Technically.** Repeat B1 step 1, then call [Enrol by Aadhaar](/docs/api/hie-cm/m1/apis#enrol-by-aadhaar) with a deliberately wrong encrypted OTP value.

- **Pass:** a non 200 response, and no ABHA number in the body. The exact code for a wrong Aadhaar OTP is not transcribed in either source, so assert on the absence of `ABHAProfile.ABHANumber` and on the status not being 200, rather than on a specific code.
- **Fail:** HTTP 200, or an ABHA number in the body.
- **Also check:** your own database. A failed enrolment must leave no partial patient record that a later successful enrolment then duplicates.

### B3. A reused transaction ID is rejected

**In plain words.** You cannot replay yesterday's attempt.

**Technically.** Take a `txnId` from a completed B1 run and send it again to [Enrol by Aadhaar](/docs/api/hie-cm/m1/apis#enrol-by-aadhaar).

- **Pass:** HTTP 400 with a body key of `txnId` and the value `Invalid Transaction Id`, or an equivalent rejection.
- **Fail:** HTTP 200 and a second ABHA number.

### B4. The person picks an ABHA address and it sticks

**In plain words.** The address the person chose is the address they end up with.

**Technically.** Run steps 7 and 8 of [sequence 1](/docs/api/hie-cm/m1/api-sequence#sequence-1-create-an-abha-by-aadhaar-otp), then read the profile back.

- **Pass:** HTTP 200 from [Link an ABHA address](/docs/api/hie-cm/m1/apis#link-an-abha-address) with `healthIdNumber` in the body, and a later [Get the profile](/docs/api/hie-cm/m1/apis#get-the-profile) whose `preferredAbhaAddress` starts with the address you sent.
- **Fail:** the profile shows a different address, or an auto generated one built from the ABHA number.
- **Note:** the suggestion call's response shape is not transcribed. If your code cannot parse the suggestions, let the person type an address instead. That path is fully specified.

## Group C: mobile verification

### C1. The communication mobile number is verified end to end

**In plain words.** After the ABHA number exists, the person names the mobile number they want health messages on, types the code that arrives, and that number is now on their profile.

**Technically.** Run steps 3 and 4 of [sequence 1](/docs/api/hie-cm/m1/api-sequence#sequence-1-create-an-abha-by-aadhaar-otp), then read the profile.

- **Pass, step 3:** HTTP 200 from [Request an enrolment OTP](/docs/api/hie-cm/m1/apis#request-an-enrolment-otp) with `scope: ["abha-enrol","mobile-verify"]`, `loginHint: "mobile"`, `otpSystem: "abdm"` and the `txnId` from enrolment. A non empty `txnId` comes back.
- **Pass, step 4:** HTTP 200 from [Verify an enrolment OTP](/docs/api/hie-cm/m1/apis#verify-an-enrolment-otp) at `enrollment/auth/byAbdm` with the same scope.
- **Pass, readback:** [Get the profile](/docs/api/hie-cm/m1/apis#get-the-profile) returns `mobile` equal to the number you sent.
- **Fail:** any non 200, or a profile whose `mobile` is still the Aadhaar linked number.

### C2. The two OTP systems are not confused

**In plain words.** The code from Aadhaar and the code from NHA are different things and go to different places. This test proves your code knows which is which. It is the mistake most first day integrations make.

**Technically.** Take a valid mobile OTP, obtained with `otpSystem: "abdm"`, and send it to [Enrol by Aadhaar](/docs/api/hie-cm/m1/apis#enrol-by-aadhaar) instead of to `enrollment/auth/byAbdm`.

- **Pass:** a non 200 response. Your integration correctly failed a wrong pairing, which means the routing in your code is by scope and not by accident.
- **Fail:** HTTP 200. Something in your code is sending both OTPs to the same endpoint and getting away with it in sandbox. It will not get away with it in production.

### C3. A mobile number that is not the Aadhaar one still works

**In plain words.** A person can receive health messages on a number that is not the one Aadhaar has. Family phones and changed numbers make this normal, not an edge case.

**Technically.** Run C1 using a mobile number different from the one the Aadhaar OTP went to.

- **Pass:** HTTP 200 on both calls, and the profile's `mobile` is the new number.
- **Fail:** a rejection that names `loginId`. That points at your encryption, not at the number.

### C4. The updated mobile number on an existing profile

**In plain words.** A person who already has an ABHA can change their number later.

**Technically.** Run [sequence 8](/docs/api/hie-cm/m1/api-sequence#sequence-8-update-the-mobile-number-on-an-existing-profile) against a logged in account.

- **Pass:** HTTP 200 from [Request a profile OTP](/docs/api/hie-cm/m1/apis#request-a-profile-otp) with a `txnId` in the body, HTTP 200 from [Verify a profile change](/docs/api/hie-cm/m1/apis#verify-a-profile-change), and a profile readback showing the new `mobile`.
- **Fail:** a 400 with `{"message": "Invalid X-token"}` means you sent the gateway token where the user token belongs. Both headers are needed here.
- **Note:** the verify response body is not transcribed. Assert on HTTP 200 and on the profile readback, not on a field in the verify response.

## Group D: login

### D1. Login by mobile number, all three calls

**In plain words.** A person types their mobile number, types the code that arrives, picks their ABHA from the list, and is logged in.

**Technically.** Run [sequence 3](/docs/api/hie-cm/m1/api-sequence#sequence-3-log-in-by-mobile-number).

- **Pass, call 1:** HTTP 200 from [Request a login OTP](/docs/api/hie-cm/m1/apis#request-a-login-otp), with `txnId` and a `message` naming a masked mobile number.
- **Pass, call 2:** HTTP 200 from [Verify a login](/docs/api/hie-cm/m1/apis#verify-a-login).
- **Pass, call 3:** HTTP 200 from [Verify the user](/docs/api/hie-cm/m1/apis#verify-the-user), carrying the transaction token in the `T-token` header, with `token` and `refreshToken` in the body.
- **Fail:** a 400 on call 3 usually means `T-token` is missing. It is the only M1 call that uses that header, so it is easy to leave out.

### D2. Login by ABHA number, both OTP routes

**In plain words.** A person who knows their 14 digit number can log in with either the code from Aadhaar or the code from NHA.

**Technically.** Run [sequence 4](/docs/api/hie-cm/m1/api-sequence#sequence-4-log-in-by-abha-number) twice, once with `scope: ["abha-login","aadhaar-verify"]` and `otpSystem: "aadhaar"`, once with `scope: ["abha-login","mobile-verify"]` and `otpSystem: "abdm"`.

- **Pass:** both runs give HTTP 200 on the verify call, with `authResult` of `success`, and a non empty `token`, `refreshToken` and numeric `expiresIn`.
- **Fail:** a 400 naming `scope` means the two scope values do not match between the request and the verify call. They must be identical.

### D3. A wrong login OTP is rejected

**In plain words.** Typing the wrong code does not log you in.

**Technically.** Request a login OTP, then call [Verify a login](/docs/api/hie-cm/m1/apis#verify-a-login) with a wrong encrypted OTP value.

- **Pass:** a non 200 response with no `token` in the body.
- **Fail:** HTTP 200, or any `token` present.
- **Also check:** your session store holds nothing for that person afterwards.

### D4. An expired user token is refused, and refresh fixes it

**In plain words.** A login does not last forever, and your system notices when it runs out instead of showing an error to the person.

**Technically.** The saved login example gives `expiresIn` of 1800 seconds. Log in, wait past that, then call [Get the profile](/docs/api/hie-cm/m1/apis#get-the-profile).

- **Pass, part 1:** a non 200 response. A 400 with `{"message": "Invalid X-token"}` is one shape the sources show.
- **Pass, part 2:** [Refresh the user token](/docs/api/hie-cm/m1/apis#refresh-the-user-token) with the refresh token in the `R-token` header returns HTTP 200 with a new `token` and a new `refreshToken`. The profile call then succeeds with the new token.
- **Fail:** your system shows the person a raw error instead of refreshing, or it refreshes but keeps storing the old refresh token.

### D5. Logout ends the session

**In plain words.** When the person logs out, their token stops working.

**Technically.** Call [Log out](/docs/api/hie-cm/m1/apis#log-out), then call [Get the profile](/docs/api/hie-cm/m1/apis#get-the-profile) with the same user token.

- **Pass:** HTTP 200 from logout with `{"message": "You have been logged out"}`, then a non 200 from the profile call.
- **Fail:** the profile call still returns HTTP 200 and profile data.

## Group E: profile fetch

### E1. The profile comes back and matches what was created

**In plain words.** Read the person's details back, and they are the details you created a moment ago. This is the test that proves the whole chain worked, not only the last call.

**Technically.** After a successful D1 or D2, call [Get the profile](/docs/api/hie-cm/m1/apis#get-the-profile) with the gateway token in `Authorization` and the user token in `X-token`.

- **Pass:** HTTP 200, and the body carries `ABHANumber` equal to the number from B1, `preferredAbhaAddress` equal to the address from B4, and `mobile` equal to the number from C1. `name`, `gender` and the three date of birth fields are present and non empty.
- **Fail:** HTTP 200 with an ABHA number that is not the one you logged in as. That means the user token in `X-token` belongs to a different session. Check that you are not reusing a token across test runs.
- **Note:** the field list above comes from a saved example on the PATCH of the same path, not on the GET. If a field is absent on the GET, record what you observed rather than treating this page as authoritative.

### E2. The profile needs both tokens

**In plain words.** Your system's permission and the person's permission are two separate things, and the profile call needs both.

**Technically.** Call [Get the profile](/docs/api/hie-cm/m1/apis#get-the-profile) three times: with both headers, with `Authorization` only, and with `X-token` only.

- **Pass:** HTTP 200 with both headers. Non 200 for each of the other two.
- **Fail:** HTTP 200 with only one header. If `X-token` alone works, your gateway token is being read from somewhere else, such as a proxy that injects it.

### E3. The ABHA card and QR code render

**In plain words.** The person can see their card and their quick response (QR) code.

**Technically.** Call [Get the ABHA QR code](/docs/api/hie-cm/m1/apis#get-the-abha-qr-code), [Generate the ABHA card](/docs/api/hie-cm/m1/apis#generate-the-abha-card) and [Download the ABHA card](/docs/api/hie-cm/m1/apis#download-the-abha-card).

- **Pass:** HTTP 200 from each, with a non empty body.
- **Fail:** any non 200.
- **Note:** the response shapes for all three are not transcribed in either source, because NHA's document shows them as screenshots. Assert on the status and on a non empty body, then record what you actually received. That observation is worth more than this page.

## Group F: deliberate failures

Run these on purpose. A system that has never seen an M1 failure has never been tested.

| Test | Do this | Expect |
|---|---|---|
| F1. Bad path | Call `profile/lo/verify` instead of `profile/login/verify` | HTTP 404 with `"No matching resource found for given API Request"` |
| F2. Empty body | POST an empty body to [Verify a login](/docs/api/hie-cm/m1/apis#verify-a-login) | HTTP 400 with both `scope` and `authData` as keys in the response |
| F3. Bad token | Send a malformed `Authorization` value | HTTP 401 with `code` of `900901` |
| F4. Short ABHA number | Send a 13 digit ABHA number to any endpoint that takes one | HTTP 400 with `ABDM-1013`, Invalid ABHA Number |
| F5. Restricted endpoint | As a private integrator, call a `profile/benefit/` endpoint | HTTP 401 with `ABDM-1094` |

Each expected result above is quoted from a saved example in NHA's collection. See [errors](/docs/api/hie-cm/m1/errors) for the full set and for the four different body shapes your parser has to handle.

## What these tests do not cover

- **The optional routes.** Face authentication, fingerprint, IRIS and demographic auth all need real capture hardware or a government entitlement, and their request bodies are not transcribed. If your build includes them, write the tests from what you observe against sandbox and record the shapes.
- **Rate limits.** Neither source says how many OTPs a number can request in a window. Find out before production rather than in it.
- **Child ABHA and benefit programmes.** Restricted to specific government integrators. Skip unless NHA has enabled them for you.

When you have run these, record what you observed. A page that says "we ran this on 24 August and here is the response" is worth more than this one, which only says what NHA's document implies.
