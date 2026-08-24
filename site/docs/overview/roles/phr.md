---
title: PHR applications
sidebar_label: PHR apps
sidebar_position: 1
description: What a personal health record app does in ABDM, the screens it needs, and the modules you have to build.
verification: unverified
source: ABDM__NewDocumant_PHR_app.md, ABDM__Proposed_Simplified_Milestone_1.md
---

# PHR applications

A [PHR](/docs/overview/glossary#phr) application is the patient's app in
[ABDM](/docs/overview/glossary#abdm). It holds a person's
[ABHA](/docs/overview/glossary#abha) address, finds their health records
across the hospitals and labs they have visited, asks them for consent, and shows
the records back to them. If you are building one, your work sits in
[M1](/docs/api/hie-cm/m1) for identity and [M3](/docs/api/hie-cm/m3) for consent
and record fetching, with a small amount of [M2](/docs/api/hie-cm/m2) work if you
let users upload their own records.

:::note[Documented, not verified]
This page follows NHA's published document for PHR applications. Nothing here has
been run against the ABDM sandbox from this repository, so treat request and
response shapes as unconfirmed.
:::

## What a PHR app does

Every user of your app must have an ABHA address. It looks like `username@abdm`.
It is the identity that consent, notifications and record sharing hang off.

NHA's document sets out six jobs for your app:

| Job | What the user sees |
| --- | --- |
| Create or link an ABHA address | Register with a mobile number, or with an existing 14 digit ABHA number |
| Log in | Mobile number, ABHA address, default `14digit@abdm` address, or ABHA number |
| Manage a profile | Demographics, photo, password, QR code, downloadable ABHA card |
| Share a profile at a facility | Scan the facility QR code, consent, receive a queue token |
| Find and link past records | Search a facility, discover [care contexts](/docs/overview/glossary#care-context), verify by [OTP](/docs/overview/glossary#otp), link |
| Hold records | Receive notifications, request consent, fetch records, store and display them |

## What you build in M1

M1 is the identity layer. NHA's ABHA base URLs are
`https://abhasbx.abdm.gov.in/abha/api/v3/` for sandbox and
`https://abha.abdm.gov.in/api/abha/v3/` for production. PHR enrolment uses
`https://abhasbx.abdm.gov.in/abha/api/v3/phr/app/enrollment/request/otp`.

### Creating an ABHA address

There are two creation paths, and your app needs both.

**With a mobile number.** The user enters a mobile number, validates an OTP, and
fills their own profile details: first name, year of birth, gender, address,
state, district and pin code are mandatory. Middle name, last name, day and month
of birth are optional. This produces a **Self-Declared** profile. No
[KYC](/docs/overview/glossary#kyc) has happened.

**With an ABHA number.** The user enters their 14 digit ABHA number and validates
it by Aadhaar OTP or mobile OTP. Profile details come back from the ABHA system
rather than from the user. This produces a **KYC Verified** profile.

In both paths, after validation you must show the ABHA addresses already linked to
that mobile number or ABHA number, so the user can pick one instead of creating a
duplicate. NHA's document is explicit that ABDM wants one address per person.

Address rules from the document:

- Allowed characters are letters, numbers and a dot.
- The address cannot begin with a number.
- It cannot begin or end with a dot.
- All numeric addresses are allowed only for the `14digit@abdm` form.
- Creating a `10digitmobile@abdm` address is currently blocked.
- Creating a `14digit@abdm` address is not allowed, but a user can log in with
  one. Every 14 digit ABHA number is issued a default address of this shape. NHA's
  document writes it as `14digit@sbx` or `14digit@abdm` and does not say which
  environment uses which suffix.

The minimum length is stated twice in NHA's document and the two statements
disagree. The prose and the ABHA number test cases say 4 characters. The mobile
number test case table says 8. We have not resolved this against the sandbox, so
validate against the API response rather than against a local rule.

Password rules, where you collect a password: 8 characters or longer, at least one
A to Z, one a to z, one digit and one symbol, no spaces, and no more than 2
consecutive characters or keyboard keys. NHA's document says password validation
has been made optional.

### Linking an ABHA number to an ABHA address

ABDM separates identity from consent. The ABHA number is the KYC verified
identity. The ABHA address is what shares records. A user can hold more than one
ABHA address but only one KYC verified ABHA number.

Your app needs a "Link ABHA number" action on a Self-Declared profile. The user
enters the 14 digit number and validates it by Aadhaar OTP or mobile OTP. After
that, profile details follow the ABHA number, the ABHA number becomes visible on
the profile, and the home screen status changes from Self-Declared to KYC
Verified.

### Login

Four login routes are described, and all four are marked mandatory:

- Mobile number, validated by mobile OTP, then the user picks which linked ABHA
  address to sign in as.
- An easy to remember address such as `name@abdm`, validated by password, mobile
  OTP or Aadhaar OTP depending on the auth mode.
- The default `14digit@abdm` address, validated by mobile OTP or Aadhaar OTP.
- The 14 digit ABHA number, validated by mobile OTP or Aadhaar OTP.

Resend OTP becomes available after 60 seconds in every flow. Your app also needs
a reset password screen behind login, and a message confirming the change.

NHA's document asks you to store the refresh token securely and use it to extend
the session, and to support more than one user profile in a single app install
with sign in and sign out.

### Profile, card and QR code

The profile screen shows demographics and lets the user edit them. It shows KYC
Verified with a green tick when an ABHA number is linked, and Self-Declared with
an exclamation mark when it is not. The ABHA number is visible only on a KYC
Verified profile.

The ABHA address card is downloadable as a PDF and carries: profile photo, full
name, ABHA number formatted as `91-0098-2416-3421` if one is linked, ABHA address,
QR code, date of birth, gender and mobile number.

Editable fields differ by profile type. A KYC Verified profile can update mobile
number, with an OTP to the new number, and address. A Self-Declared profile can
also update photo, full name, gender and date of birth.

### Scan and share at a facility

This is how a patient hands their identity to a hospital front desk without
typing anything.

The facility displays a QR code. Its content is a URL carrying two parameters: the
[HIP](/docs/overview/glossary#hip) ID and a facility defined context such as a
counter code. Your app scans it, then:

1. Shows the user exactly what will be shared.
2. Takes consent using ABDM's specified wording, which covers sharing the ABHA
   address and profile information with that facility for registration, and the
   facility linking any records it generates.
3. Calls the [HIE-CM](/docs/overview/glossary#hie-cm) API to share the details.
4. Waits for the facility, which is currently expected to respond within 30
   seconds.
5. Displays the token number if the facility returned one.

The document states two different time limits here. The functionality overview
says your app must not let the user generate a second token for 60 minutes. The
test cases say the token is displayed as valid for the next 30 minutes and that
this duration is configurable. Both are in the source and we have not tested
either.

Counter names, which arrive in the QR code, are up to 20 alphanumeric characters
with no special characters. Examples given are OPD, OPD1, OPD cardio, IPD1,
Pharmacy. A counter name is not allowed to be the [HFR](/docs/overview/glossary#hfr)
facility ID, the [HPID](/docs/overview/glossary#hpid), the HIP ID or the HIP name.

Your app should also handle being opened from a third party scanner or the phone
camera. If the user is signed in, go to the share profile screen. If not, go to
login and then to the share profile screen.

## What you build in M3

Every PHR application must also implement the
[HIU](/docs/overview/glossary#hiu) role. That is M3.

### Subscriptions and notifications

A subscription is how your app hears about changes to a user's ABHA address.

Set one up when you create an ABHA address, and again when a user logs in with an
ABHA address your install has not seen. Ask the user for consent explicitly first.
NHA's document is direct about this: users must be asked before a subscription is
set up.

Once the subscription is approved, your app receives notifications for:

- A new care context
- A modified care context
- A new consent request
- A new subscription request

You are responsible for surfacing these as device notifications, for example
through Firebase on Android. You also need screens to list subscriptions, approve
them, deny them, and edit an active one. Editing covers health information types,
types of visit and the time period.

### Auto approval

Most users do not want to approve a consent request every time a hospital adds a
record. The flow for that:

1. Ask the user to confirm that your app may retrieve new linked records
   automatically.
2. Set up an auto approval policy with the HIE-CM.
3. Save the auto approval ID the HIE-CM returns.
4. On a new or updated care context notification, raise a consent request.
5. The HIE-CM grants it immediately because the policy is active.
6. Fetch the record with the granted consent and store it.

The user must be able to disable an auto approval policy. After that, a request
arrives for each record.

### Consent management

The consent screens are the core of a PHR app. NHA's document lists five
capabilities:

| Capability | What it covers |
| --- | --- |
| View requests | Requesting HIU, purpose, data types, date range, validity, status |
| Modify a request | Access duration, record date range, data categories, validity period |
| Grant or deny | The decision goes back to the HIE-CM |
| View active consents | Who currently has access, and to what |
| Revoke | Withdraw at any time. Sharing under that consent stops immediately |

Both the Consents tab and the Subscriptions tab need the same state grouping: a
Requests section holding Requested, Denied and Expired, and an Approved section
holding Granted and Revoked.

### Fetching and displaying records

Once a care context is linked to the user's ABHA address:

1. Your app receives the notification.
2. Your app creates a consent request for that record and sends it to the HIE-CM.
3. The consent is granted, automatically if a policy exists, otherwise by the
   user.
4. Your app raises a health information request with the approved
   [consent artefact](/docs/overview/glossary#consent-artefact).
5. The HIP sends the records across the network.
6. Your app stores them for long term access and displays them, preferably in
   chronological order.

The test cases in NHA's document exercise fetching for each health information
type in both structured and unstructured form: diagnostic report, prescription,
discharge summary, consultation note, immunisation record, wellness record and
health document record.

## Discovery and user initiated linking

This is what a user does when they visited a facility without giving an ABHA
address, or when they want old records.

The user searches for the facility by name. Only facilities participating in ABDM
appear, and the facility must be a HIP linked to an
[HRP](/docs/overview/glossary#hrp) for discovery to work. Your app then sends a
discovery request to the HIE-CM carrying: name, year or date of birth, gender,
verified mobile number, ABHA address, and optionally a patient registration number
issued by that provider. The HIE-CM forwards it to the HIP, which is expected to
respond within 10 seconds.

Care contexts that are already linked must not be shown again. When everything is
already linked, NHA's document asks for the message "All your existing records are
linked. No additional records available for linking".

The user selects care contexts and confirms. The HIP sends an OTP to the
registered mobile number. On successful verification the care contexts are linked
to the ABHA address.

The same flow works for government health programmes such as CoWIN, AB-PMJAY,
e-Sanjeevani OPD, e-Sanjeevani HWC and RCH, with a programme specific optional
field such as the PMJAY ID or the CoWIN registered mobile number.

Three failures have specified copy:

| Situation | Message |
| --- | --- |
| The HIP is unreachable | "Couldn't Connect: We are sorry. Unable to contact your hospital. Please try again later" |
| The user never visited the facility | "No health records found" |
| Everything is already linked | "No new health record to link: Records of all visits are already linked and there is nothing new to link" |

Two timings are stated for the pull. Your app should send the data transfer
request within 5 minutes of the user tapping Pull Records, and records should
arrive within 2 hours.

## Deep links

If a patient registers at a facility without an ABHA address, ABDM sends them an
SMS containing a deep link of the form `phr.abdm.gov.in/uhi/(hipcode)`. Tapping it
lists approved ABHA mobile applications in random order, filtered to the user's
operating system.

Your app has two obligations here. It must accept the HIPCODE parameter. And when
it is launched through a deep link it must skip its normal login or home screen
and go straight into the discovery flow for that HIPCODE, guiding the user to
enter the same name, date of birth, gender and mobile number they gave the
facility. A mismatch stops the records being found.

To be listed, you submit three things at sandbox exit: application name, Play
Store URL and App Store URL.

## Where a PHR app also acts as a HIP

Letting users upload their own records, a health locker, puts you briefly on the
HIP side of the network.

NHA's document asks PHR apps to let users scan and upload physical records, and
output from devices such as BP meters, glucose meters, fitness trackers and
smartwatches. Your app decides the health information type from the contents or
from user input. When it cannot be determined, use `HealthDocumentRecord`.

To make an uploaded record shareable you need three things: a linking token,
obtained with the M1 APIs; a care context added to the user's ABHA address using
HIP initiated linking from [M2](/docs/api/hie-cm/m2); and support for the M2 health
information transfer APIs so the record can be sent when consent is granted.

## What you do not need to build

- **Facility side clinical records.** You are not producing
  [FHIR](/docs/overview/glossary#fhir) bundles from a hospital or lab system. The
  exception is records your users upload themselves.
- **[HPR](/docs/overview/glossary#hpr) and HFR registration.** M4 covers
  professional and facility registries. It is Phase 2 and it is not a PHR app's
  job.
- **[UHI](/docs/overview/glossary#uhi).** Booking consultations, ambulances and
  pharmacy orders is a separate gateway, and it is Phase 2.
- **[NHCX](/docs/overview/glossary#nhcx).** Claims and insurance exchange is out
  of scope for V1.

## What to read next

- [M1 overview](/docs/api/hie-cm/m1) for ABHA creation, login and session APIs,
  and the [M1 API reference](/reference/hiecm-m1).
- [M3 overview](/docs/api/hie-cm/m3) for consent, subscriptions and data fetch,
  and the [M3 API reference](/reference/hiecm-m3).
- [M2 overview](/docs/api/hie-cm/m2) if you are building a health locker, and the
  [M2 API reference](/reference/hiecm-m2).
- [Get started](/docs/overview/get-started) for sandbox signup and your first
  call.
- [Hospital, lab and pharmacy systems](/docs/overview/roles/his) for the other
  side of every flow on this page.
