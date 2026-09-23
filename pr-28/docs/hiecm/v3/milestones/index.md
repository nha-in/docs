# Milestones

ABDM integration is divided into milestones. These cover creation and verification of ABHA, linking of health records with an ABHA Address, consent-based exchange of health records, and native registration through the National Healthcare Professionals Registry. Integrators should implement the milestones applicable to their software.

## In short

[M1 IdentityCreate and verify ABHA](/docs/pr-28/docs/hiecm/v3/milestones/m1)[M2 Health Information ProviderCreate and link records](/docs/pr-28/docs/hiecm/v3/milestones/m2)[M3 Health Information UserFetch data with consent](/docs/pr-28/docs/hiecm/v3/milestones/m3)[M4 Registry IntegrationRegister facilities and professionals](/docs/pr-28/docs/hiecm/v3/milestones/m4)

Three workflows sit on top of the milestones and start at your counter QR code. [Scan and Register](/docs/pr-28/docs/hiecm/v3/use-cases/scan-and-register) belongs to M1, [Patient record share](/docs/pr-28/docs/hiecm/v3/use-cases/patient-record-share) to M3 and [Scan and Pay](/docs/pr-28/docs/hiecm/v3/use-cases/scan-and-pay) to M2. All are under [Use cases](/docs/pr-28/docs/hiecm/v3/use-cases).

M2 needs a facility ID and registration in the HIP role before it can share a record. That ID does not have to come from M4. A facility can be registered by hand on the NHPR portal, and many products do exactly that and never build M4. Build M4 when you want to register facilities or professionals from your own software instead. Either way, get the facility ID early, because M2 cannot be tested end to end without one.

## One patient, four milestones

Meera arrives at your clinic. Each card below is one thing your system has to be able to do for her, and one milestone that gives you it.

1. Milestone 1 · IdentityRegister Meera's ABHA

   Meera walks in without a health ID. Create her ABHA so every record from today onwards links to one identity.

   [Build M1](/docs/pr-28/docs/hiecm/v3/milestones/m1)

2. Milestone 2 · Health Information ProviderAttach today's visit to her ABHA

   Her consultation note and her blood test are yours to hold. Group them into care contexts, link them to her ABHA address, and answer when her app comes looking.

   [Build M2](/docs/pr-28/docs/hiecm/v3/milestones/m2)

3. Milestone 3 · Health Information UserRetrieve the scan from another hospital

   Meera mentions a scan done last year, somewhere else. Ask her for consent, wait for her answer, then fetch and decrypt what she granted.

   [Build M3](/docs/pr-28/docs/hiecm/v3/milestones/m3)

4. Milestone 4 · Registry IntegrationEnrol the clinic and its doctors

   None of the above leaves sandbox until the clinic is a registered facility and its doctors hold professional IDs. Enrol both, then link your software to the facility.

   [Build M4](/docs/pr-28/docs/hiecm/v3/milestones/m4)

## The same story from Meera's own app

Building the patient's app ([PHR](/docs/pr-28/docs/hiecm/v3/getting-started/glossary#phr))? Implement the applicable ABHA and PHR services to allow individuals to manage their ABHA details, discover and link health records, and manage consent for sharing health information. The work splits into three, and each part mirrors a milestone on the provider side.

1. PHR 1 · Identity and profileMeera signs up and holds her own profile

   She registers with a mobile number or an existing ABHA number, logs in four different ways, and manages her card, her QR code and her family members.

   [Build P1](/docs/pr-28/docs/hiecm/v3/milestones/p1)

2. PHR 2 · Linking and recordsShe finds records she never linked

   She searches for the hospital she visited last year, sees what it holds, verifies by one time password, and pulls those care contexts onto her ABHA address.

   [Build P2](/docs/pr-28/docs/hiecm/v3/milestones/p2)

3. PHR 3 · Consent and notificationsShe decides who sees what

   A clinic asks for her records. She reads the request, narrows it, grants or denies it, and revokes it later. Your app tells her each time.

   [Build P3](/docs/pr-28/docs/hiecm/v3/milestones/p3)

## Select milestones based on the requirement of your software

The milestones required for integration depend on the role of the software. A Health Information Provider holds health records and makes them available for consent-based sharing. A Health Information User requests access to health records after obtaining the individual's consent. A software application may perform one or both roles. Applicable milestones depend on the functions and services offered.

| Who you build for                                                                                                                                                                                 | M1                                                              | M2                                                              | M3                                                              | M4                                                                                                     |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| **Health Facility or Health Facility Software.** May create and verify ABHA, link and share health records, access records with consent, and support NHPR registration.                           | Required                                                        | The bulk of your build                                          | Where it also reads records it did not create                   | Required                                                                                               |
| **Health Information User**, such as an insurer, a referral service or an analytics service. May request and view health records held by another entity after receiving the individual's consent. | Required                                                        | Not needed                                                      | The bulk of your build                                          | [Confirm at onboarding](/docs/pr-28/docs/hiecm/v3/concepts/participants/insurer#confirm-at-onboarding) |
| **Personal Health Record Application.** Enables individuals to manage their ABHA details, discover and link health records, and control consent for sharing them.                                 | [P1](/docs/pr-28/docs/hiecm/v3/milestones/p1), the patient side | [P2](/docs/pr-28/docs/hiecm/v3/milestones/p2), the patient side | [P3](/docs/pr-28/docs/hiecm/v3/milestones/p3), the patient side | Not needed                                                                                             |

## What each milestone gets you

| Milestone                                                                                                       | What you get                                | Who needs it                                                   |
| --------------------------------------------------------------------------------------------------------------- | ------------------------------------------- | -------------------------------------------------------------- |
| [M1 Identity: ABHA Creation and Verification](/docs/pr-28/docs/hiecm/v3/milestones/m1)                          | Identity and the session token              | Everyone                                                       |
| [M2 Health Information Provider: Health Information Provider Services](/docs/pr-28/docs/hiecm/v3/milestones/m2) | Linking and sharing records                 | A facility publishing records, and a citizen pushing their own |
| [M3 Health Information User: Health Information User Services](/docs/pr-28/docs/hiecm/v3/milestones/m3)         | Consent and record fetching                 | Anyone reading records they did not create, and every PHR app  |
| [M4 Registry Integration: National Healthcare Providers Registry](/docs/pr-28/docs/hiecm/v3/milestones/m4)      | A facility ID and professional registration | Anyone going live as a facility                                |

These pages give the steps, the order to build them in and the failure modes. Every request URL, header and body sits on the [API reference](/docs/pr-28/docs/hiecm/v3/api) pages, one page per call.

## Next

Start with [M1 Identity](/docs/pr-28/docs/hiecm/v3/milestones/m1), or read [Go live](/docs/pr-28/docs/hiecm/v3/getting-started/going-live) for what happens after the fourth certificate.
