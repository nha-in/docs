# P2 Consents Management

P2 is the mirror of [M2 Health Information Provider](/docs/pr-123/docs/hiecm/v3/milestones/m2). M2 is a provider publishing a record. P2 is the patient discovering it and linking it to their own [ABHA address](/docs/pr-123/docs/hiecm/v3/getting-started/glossary#abha-address).

## In short

- Discovery is for facilities the user visited without giving an ABHA address, and for old records.
- A [HIP](/docs/pr-123/docs/hiecm/v3/getting-started/glossary#hip) is expected to answer a discovery request within 10 seconds.
- Never show a [care context](/docs/pr-123/docs/hiecm/v3/getting-started/glossary#care-context) that is already linked.
- Send the data transfer request within 5 minutes of the user tapping Pull Records.

## What you build

Profile management, care context linking, user initiated linking, and scan and register at a facility.

## Scan and register at a facility

The facility displays a QR code holding a URL with two parameters: the HIP ID and a facility defined context such as a counter code. Your app scans it, then:

1. Shows the user what will be shared.
2. Takes consent in the specified wording. It covers sharing the ABHA address and profile with that facility for registration, and the facility linking any records it generates.
3. Calls the [HIE-CM](/docs/pr-123/docs/hiecm/v3/getting-started/glossary#hie-cm) to share the details.
4. Waits for the facility, currently expected to respond within 30 seconds.
5. Displays the token number if the facility returned one.

Counter names arrive in the QR code: 1 to 250 characters, letters, digits and spaces, with `.`, `-` and `_` allowed between them. A counter name cannot be the facility ID, the [HPID](/docs/pr-123/docs/hiecm/v3/getting-started/glossary#hpid), the HIP ID or the HIP name.

Records from that visit are linked to the person from the start, so discovery is never needed for them.

Notes for AI agents

**Before you start.** The person is signed in and holds an ABHA address. Your app can read a QR code and take the HIP ID and the counter context out of its URL.

**What happens.** Show what will be shared and take consent in the specified wording. Call `/api/hiecm/patient-share/v3/share` with `intent` set to `PROFILE_SHARE` and `metaData` carrying the `hipId` and the counter `context`. The facility's answer arrives on `/api/v3/hiu/patient/on-share`.

**How you know it worked.** The acknowledgement arrives with status SUCCESS and a `profile` block carrying `tokenNumber` and `expiry`. Show the token number, because it is what the person needs at the counter, and treat its validity as the facility's to set.

**When it goes wrong.** No answer within 30 seconds needs a screen that says so, not a spinner that never ends. A counter name that is really the facility ID or the HIP name leaves the person unable to tell counters apart. Consent taken in your own wording rather than the specified wording is a certification problem.

## Discovery and user initiated linking

The user searches for the facility by name. Only participating facilities appear, and the facility must be a HIP linked to an [HRP](/docs/pr-123/docs/hiecm/v3/getting-started/glossary#hrp). Your app sends a discovery request carrying the HIP ID and unverified identifiers of type `MR`, `MOBILE`, `ABHA_NUMBER` or `ABHA_ADDRESS`.

The user selects care contexts and confirms. The HIP sends an [OTP](/docs/pr-123/docs/hiecm/v3/getting-started/glossary#otp) to the registered mobile number, and on successful verification the care contexts link to the ABHA address.

The same flow works for government health programmes such as CoWIN, AB-PMJAY, e-Sanjeevani OPD, e-Sanjeevani HWC and RCH, each with a programme specific optional field.

Three failures have specified copy.

| Situation                           | Message                                                                                                   |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------- |
| The HIP is unreachable              | "Couldn't Connect: We are sorry. Unable to contact your hospital. Please try again later"                 |
| The user never visited the facility | "No health records found"                                                                                 |
| Everything is already linked        | "No new health record to link: Records of all visits are already linked and there is nothing new to link" |

Records should arrive within 2 hours.

Notes for AI agents

**Before you start.** The person is signed in and holds an ABHA address. Your search lists only facilities that are HIPs with an active bridge link. Discovery answers on a callback, so your app holds the request open across it.

**What happens.** Discover with `/api/hiecm/user-initiated-linking/v3/patient/care-context/discover`, carrying the `hip` and the `unverifiedIdentifiers`; the care contexts arrive on `/api/v3/hiu/patient/care-context/on-discover`. Show only those not already linked. Start the link with `/api/hiecm/user-initiated-linking/v3/link/care-context/init`, answered on `/api/v3/hiu/patient/care-context/on-init`, then confirm with the OTP at `/api/hiecm/user-initiated-linking/v3/link/care-context/confirm`, answered on `/api/v3/hiu/patient/care-context/on-confirm`.

**How you know it worked.** The on-confirm callback lists the linked care contexts, and discovery against the same facility now returns them as already linked rather than as new. A linked care context is not a record in hand: fetching it is a consent flow, see [P3](/docs/pr-123/docs/hiecm/v3/milestones/p3#p3-fetch-records).

**When it goes wrong.** The facility does not answer: show the specified unreachable message. Nothing comes back, often because the name or date of birth given at the facility differs from the profile. Everything comes back already linked: that is the third specified message, not an error. The OTP goes to the mobile the facility registered, which the person may no longer use.

## Where the citizen is the HIP

A citizen pushing a record into your app is the HIP. A health locker, where users upload their own records, puts you on that publishing side.

An uploaded record is shareable once you hold three things: a link token from the generate link token call, a care context added by HIP initiated linking from [M2 Attach](/docs/pr-123/docs/hiecm/v3/milestones/m2), and the M2 health information transfer APIs.

Set the health information type from the contents or from user input. Use `HealthDocumentRecord` when it cannot be determined.

## Profile, card and QR code

The signed in user manages their own profile from your app. Every call takes the user token from login as `X-token`.

| Element                  | What it holds                                                                                                                                   |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Profile screen           | Editable demographics, marked KYC Verified or Self-Declared                                                                                     |
| ABHA number              | Visible only on a KYC Verified profile                                                                                                          |
| ABHA address card, a PDF | Photo, full name, ABHA number, ABHA address, QR code, date of birth, gender, mobile number                                                      |
| Editable, KYC Verified   | Mobile number, with an OTP to the new number, and address                                                                                       |
| Editable, Self-Declared  | The same, plus photo, full name, gender and date of birth                                                                                       |
| Also on the profile      | Update the password, link an ABHA number by mobile OTP or Aadhaar OTP, switch between the profiles on one login, refresh the token, and log out |

## Certification

The cases a PHR application is tested against, each with its id, steps, expected result and the calls it exercises: [PHR application test cases](/docs/pr-123/docs/hiecm/v3/resources/test-cases/phr). Certification runs once, for the whole integration: [Go live](/docs/pr-123/docs/hiecm/v3/getting-started/going-live).

## Next

- The calls and base URLs: [P2 API reference](/docs/pr-123/reference/hiecm-p2).
- The next milestone: [P3 Subscription](/docs/pr-123/docs/hiecm/v3/milestones/p3).
