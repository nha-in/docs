---
title: PHR applications
sidebar_label: PHR apps
sidebar_position: 8
sidebar_custom_props:
  roles: [phr]
description: What a personal health record app does in ABDM, the screens it needs, and the modules you have to build.
covers: [hiecm.concept.phr-subscriptions]
verification: unverified
source: catalogue/openapi/hiecm/v3/hiecm-p1.yaml, catalogue/openapi/hiecm/v3/hiecm-p2.yaml, catalogue/openapi/hiecm/v3/hiecm-p3.yaml, catalogue/openapi/hiecm/v3/hiecm-p4.yaml, catalogue/openapi/hiecm/v3/hiecm-m1.yaml
sidebar_class_name: sidebar-icon sidebar-icon--app-window
---

# PHR applications

A [PHR](/docs/hiecm/v3/getting-started/glossary#phr) application is the patient's app in
[ABDM](/docs/hiecm/v3/getting-started/glossary#abdm): it holds a person's
[ABHA](/docs/hiecm/v3/getting-started/glossary#abha) address, finds their records, takes consent and
shows the records back. You build [M1](/docs/hiecm/v3/api/m1) for identity,
[M3](/docs/hiecm/v3/api/m3) for consent and record fetching, and some
[M2](/docs/hiecm/v3/api/m2) if users upload their own records.

## What a PHR app does

Every user needs an ABHA address, `username@abdm`. Consent, notifications and
record sharing hang off it. There are six jobs:

| Job | What the user sees |
| --- | --- |
| Create or link an ABHA address | Register with a mobile number, or with an existing 14 digit ABHA number |
| Log in | Mobile number, ABHA address, or ABHA number |
| Manage a profile | Demographics, photo, password, QR code, downloadable ABHA card |
| Share a profile at a facility | Scan the facility QR code, consent, receive a queue token |
| Find and link past records | Search a facility, discover [care contexts](/docs/hiecm/v3/getting-started/glossary#care-context), verify by [OTP](/docs/hiecm/v3/getting-started/glossary#otp), link |
| Hold records | Receive notifications, request consent, fetch records, store and display them |

## Your app needs a server

A PHR app is two parts, whatever it looks like to the user. The app on the
phone signs the person in, shows the screens and scans codes. A server you run
holds the client ID and secret, mints the [gateway session
token](/docs/hiecm/v3/concepts/gateway), and hosts the callback URL registered
for your bridge. Every answer to a linking, consent or data request arrives at
that URL as a POST, so an app with no server never hears the answer. Never
ship the client secret inside the app.

## What you build in M1

The ABHA sandbox base URL is `https://abhasbx.abdm.gov.in/abha/api/v3/`. PHR enrolment uses
`https://abhasbx.abdm.gov.in/abha/api/v3/phr/app/enrollment/request/otp`.

### Creating an ABHA address

Build both paths.

| Path | Validated by | Profile details | Result |
| --- | --- | --- | --- |
| Mobile number | Mobile OTP | The user types them | No [KYC](/docs/hiecm/v3/getting-started/glossary#kyc) |
| 14 digit ABHA number | Aadhaar OTP or ABHA OTP | Returned by the ABHA system | KYC verified |

After validation on either path, show the ABHA addresses already linked to that
mobile number or ABHA number, so the user picks one instead of creating a
duplicate.

Address rules:

- Letters, numbers, one optional dot and one optional underscore.
- Starts and ends with a letter or number, 8 to 18 characters long.
- Ends with `@abdm` or `@sbx`.
- Password, where you collect one: 8 characters or longer, one A to Z, one
  digit, and one special character from `!@#$%^&*-`.

### Linking an ABHA number to an ABHA address

The ABHA number is the KYC verified identity; the ABHA address is what shares
records. A user can hold several ABHA addresses but only one ABHA number.

A profile with no KYC needs a "Link ABHA number" action: enter the 14 digit
number and validate by ABHA OTP. Profile details then follow the ABHA number,
and the profile becomes KYC verified.

### Login

| Route | Validated by |
| --- | --- |
| Mobile number | Mobile OTP, then the user picks which linked ABHA address to sign in as |
| An easy to remember address such as `name@abdm` | Password, mobile OTP or Aadhaar OTP, by auth mode |
| The 14 digit ABHA number | Mobile OTP or Aadhaar OTP |

You also need secure storage of the refresh token to extend the session, and
more than one user profile per install with sign in and sign out.

### Profile, card and QR code

| Element | What it holds |
| --- | --- |
| Profile screen | Editable demographics, and whether the profile is KYC verified |
| ABHA address card | Downloaded through the PHR card call |
| QR code | Downloaded through the QR code call |

### Scan and share at a facility

The facility displays a QR code holding a URL with two parameters: the
[HIP](/docs/hiecm/v3/getting-started/glossary#hip) ID and a facility defined context such as a
counter code. Your app scans it, then:

1. Shows the user what will be shared.
2. Takes the user's consent to share the ABHA address and profile with that
   facility.
3. Calls the [HIE-CM](/docs/hiecm/v3/getting-started/glossary#hie-cm) API to share the details.
4. Waits for the facility's response.
5. Displays the token number if the facility returned one.

## What you build in M3

A citizen fetching records is the [HIU](/docs/hiecm/v3/getting-started/glossary#hiu), so every
PHR application must implement that side.

### Subscriptions and notifications

A subscription is how your app hears about changes to a user's ABHA address.

An approved subscription notifies your app when a care context is linked or
updated. Surface these as device notifications. You need screens to list
subscriptions, approve, deny, enable and disable them.

### Auto approval

So the user does not approve a request every time a hospital adds a record:

1. Ask the user to confirm your app may retrieve new linked records automatically.
2. Set up an auto approval policy with the HIE-CM.
3. Save the auto approval ID the HIE-CM returns.

While the policy is active, the consent request you raise on a new or updated care
context notification is granted immediately and you fetch and store the record.
The user must be able to disable a policy. A request then arrives for each record.

### Consent management

You build five capabilities:

| Capability | What it covers |
| --- | --- |
| View requests | Requesting HIU, purpose, data types, date range, validity, status |
| Modify a request | Access duration, record date range, data categories, validity period |
| Grant or deny | The decision goes back to the HIE-CM |
| View active consents | Who currently has access, and to what |
| Revoke | Withdraw a previously approved consent |

Consent requests and subscription requests carry the same five states:
Requested, Denied, Expired, Granted and Revoked.

### Fetching and displaying records

Once a care context is linked to the user's ABHA address:

1. Your app receives the notification.
2. It creates a consent request for that record and sends it to the HIE-CM.
3. The consent is granted, automatically if a policy exists, otherwise by the
   user.
4. It raises a health information request with the approved
   [consent artefact](/docs/hiecm/v3/getting-started/glossary#consent-artefact).
5. The HIP sends the records across the network.
6. Your app stores them for long term access and displays them.

## Subscriptions, and why you need one

A care context can be linked to a person's address by any facility they visit,
without your application being part of it. A subscription is how you find out:
a standing watch on one address, delivering to your callback whenever
something changes.

Once approved, a notification arrives when a care context is linked or
updated. Showing it on the device is your job.

A request sits in exactly one state, and the same five carry consent requests
and subscription requests, so one screen serves both.

| State | What it means |
| --- | --- |
| Requested | Sent, and the person has not acted |
| Denied | The person refused it |
| Expired | The request expired before the person acted |
| Granted | The person allowed it |
| Revoked | Allowed, then withdrawn |

A subscription is not consent and gives nobody a record. It tells you a record
exists. Reading it still needs a consent, which is why a subscription usually
runs alongside an auto approval policy.

## Discovery and user initiated linking

For a facility the user visited without giving an ABHA address, or for old
records.

The user searches for the facility by name. Only facilities participating in ABDM
appear, and the facility must be a HIP linked to an
[HRP](/docs/hiecm/v3/getting-started/glossary#hrp). Your app sends a discovery request to the
HIE-CM carrying name, year of birth, gender, verified identifiers such as mobile
number or ABHA address, and optionally unverified identifiers such as a medical
record number issued by that provider.

The user selects care contexts and confirms, the HIP sends an OTP to the
registered mobile number, and on successful verification the care contexts link to
the ABHA address.

The same flow works for government health programmes such as AB-PMJAY, listed
by the government programmes call.

## Where the citizen is the HIP

A citizen pushing a record into your app is the HIP. A health locker, where
users upload their own records, puts you on that publishing side. Your app sets
the health information type of each record, for example `HealthDocumentRecord`.

An uploaded record is shareable once you have three things: a linking token from
the M1 APIs, a care context added to the user's ABHA address by HIP initiated
linking from [M2](/docs/hiecm/v3/api/m2), and the M2 health information transfer
APIs.

## What you do not need to build

- **Facility side clinical records.** No [FHIR](/docs/hiecm/v3/getting-started/glossary#fhir)
  bundles from a hospital or lab system, other than records your users upload.
- **[HPR](/docs/hiecm/v3/getting-started/glossary#hpr) and HFR registration.** M4 covers the
  professional and facility registries.
- **[UHI](/docs/hiecm/v3/getting-started/glossary#uhi).** Consultation, ambulance and pharmacy
  booking runs on a separate gateway.
- **[NHCX](/docs/hiecm/v3/getting-started/glossary#nhcx).** Claims and insurance exchange runs on a
  separate gateway.

## What to read next

- [M1 overview](/docs/hiecm/v3/api/m1) for ABHA creation, login and session APIs,
  and the [M1 API reference](/reference/hiecm-m1).
- [M3 overview](/docs/hiecm/v3/api/m3) for consent, subscriptions and data fetch,
  and the [M3 API reference](/reference/hiecm-m3).
- [M2 overview](/docs/hiecm/v3/api/m2) if you are building a health locker, and the
  [M2 API reference](/reference/hiecm-m2).
- [Get started](/docs/hiecm/v3/getting-started/sandbox) for sandbox signup and your first call.
- [Hospital, lab and pharmacy systems](/docs/hiecm/v3/concepts/hip-hiu) for the
  other side of every flow on this page.
