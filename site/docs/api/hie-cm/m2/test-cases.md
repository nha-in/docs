---
title: M2 test cases
sidebar_label: Test cases
sidebar_position: 6
description: What to run before you claim M2 is done, each test stated functionally then technically.
verification: unverified
source: ABDM__Proposed_Simplified_Milestone_2.md
---

# M2 test cases

Ten tests cover Milestone 2 (M2) of [ABDM](/docs/overview/glossary#abdm). Each one is written twice: functionally, which is what a person doing the test observes, and technically, which is what your system has to do for that observation to happen. Run them in order. The later ones depend on the earlier ones working.

:::note[Documented, not verified]
This page follows NHA's published document for Proposed Simplified Milestone 2. Nothing here has been
run against the ABDM sandbox from this repository, so treat request and
response shapes as unconfirmed.
:::

Two of these tests are [NHA](/docs/overview/glossary#nha)'s own. Test 6 is the FHIR validation procedure from NHA's document, and test 9 is NHA's end to end script for verifying data transfer, step for step. The other eight are derived from obligations the same document states. NHA does not publish a numbered M2 test suite, so treat this page as a working checklist rather than a certification script. The certification checklist comes from NHA when you apply.

## What you need first

- A [sandbox](/docs/overview/glossary#sandbox) client ID and client secret, and a working session call from [M1](/docs/api/hie-cm/m1).
- A Facility ID and registration in the [HIP](/docs/overview/glossary#hip) role.
- An [ABHA address](/docs/overview/glossary#abha-address) you control in sandbox, and the ABHA [PHR](/docs/overview/glossary#phr) app signed in with it.
- Your endpoints reachable from NHA's gateway. The discovery and link steps are inbound.

## Test 1: Care context grouping

**Functional.** Create two visits for the same patient on different days. Open the patient's records in a PHR app. You see two separate entries, each named so the patient can tell which visit it was, and neither name says anything about their diagnosis or results.

**Technical.** Your system assigns every new health record to a [care context](/docs/overview/glossary#care-context) at the moment the record is created. One care context per outpatient visit and one per inpatient admission, which is NHA's recommendation. Each care context has a reference number that is unique in your system and resolves to the records behind it. The display name carries no clinical or sensitive content.

## Test 2: Link token lifecycle

**Functional.** Register a patient who gives their ABHA address. Nothing visible happens. Come back six months later and linking still works, or fails in a way you can see and fix.

**Technical.** Your system generates and stores a [link token](/docs/overview/glossary#link-token) at registration. Before every link attempt it decodes the token and checks the expiry, which NHA currently sets at six months. An expired or missing token triggers regeneration through demographic authentication, not a link attempt. Confirm the failure path by decoding a stored token with a tool such as jwt.io and comparing what you see against what your code decided.

## Test 3: HIP initiated linking

**Functional.** Register a patient with their ABHA address, create a record, and watch it appear in their PHR app without them doing anything.

**Technical.** Your system calls the link API with the patient reference and the care context, authorised by the link token. The link is acknowledged. NHA then notifies every PHR app subscribed to that ABHA address. Run the test twice: once linking a new care context, and once adding a record to a care context that already exists. NHA's document says the notification fires in both cases, so look for both in the app.

Watch for ABDM-1038, ABDM-1062 and ABDM-1063 on failure. All three mean the link token does not match the patient or facility you sent. See [errors](/docs/api/hie-cm/m2/errors).

## Test 4: Notification to mobile

**Functional.** Register a patient with a mobile number, name, age and gender, and no ABHA address. Create a record. The patient receives an SMS with a link. Tapping it opens a PHR app, or offers to install one.

**Technical.** Your system calls the notification API once the record is ready to share. You do not send the SMS. NHA does. Your side of this test is the one call and the record being ready behind it. If the SMS never arrives, check for ABDM-1004 and ABDM-1008, which are NHA's SMS gateway being unavailable or disabled.

## Test 5: Discovery match and response

**Functional.** From a PHR app, search for records at your facility as a patient who has visited. The correct visits come back, named recognisably. Then repeat as a patient who has never visited. Nothing comes back.

**Technical.** Your discovery endpoint receives verified identifiers, which are ABHA address, mobile number, name, gender and year of birth, plus unverified identifiers such as your own patient ID. Your matching logic weights the verified ones higher. Your response is a list of care contexts and nothing else.

Two failure conditions to test on purpose.

- **A near miss returns nothing.** Try a patient whose name and gender match but whose year of birth does not. A guess here hands one patient another patient's records.
- **No clinical data leaks.** Inspect the response body. No diagnosis, no test result, no report content, in any field, including the display name.

## Test 6: FHIR bundle validation

**Functional.** Nothing a patient sees. This one runs on your machine before anything reaches NHA.

**Technical.** Export a bundle your system produced. Run NHA's validation procedure with the [FHIR](/docs/overview/glossary#fhir) validator command line tool, version 6.2.1, against the NRCeS implementation guide.

```shell
java -jar validator_cli.jar <YOUR_EXPORTED_BUNDLE>.json -ig https://nrces.in/ndhm/fhir/r4
```

The validator checks structural correctness, compliance with the NRCeS profiles, and required fields and constraints. Run it against one bundle per [HI type](/docs/overview/glossary#hi-type) you support, not one bundle overall.

Check two things the validator will not catch for you.

- Every reference resolves inside the bundle, and no reference is an absolute URL.
- `Composition.attester.party` points at an Organization in the same bundle whose identifier is registered in the sandbox facility registry.

## Test 7: Consent and date range validation

**Functional.** A request arrives for records outside what the patient agreed to. Nothing is sent.

**Technical.** Before you retrieve any record, your system checks that the consent ID is valid and active, that the requested date and time range sits inside the range the [consent artefact](/docs/overview/glossary#consent-artefact) permits, and that the encryption parameters are usable. Test each check with a request that fails it. NHA's list has codes for the first two checks: ABDM-1061 for an expired artefact, ABDM-1062 for consent not granted, ABDM-1063 for an invalid date range. It has no code for bad encryption parameters, so record what your own system does when they do not validate.

## Test 8: Encryption round trip

**Functional.** Nothing a patient sees. Data that leaves your system is unreadable to anyone but the requester.

**Technical.** Take a request's public key and nonce. Run your encryption path. Then decrypt the output with the matching private key and confirm you get the original bundle back byte for byte. NHA's [ECDH](/docs/overview/glossary#ecdh) steps are on the [use cases](/docs/api/hie-cm/m2/use-cases) page, and [Fidelius](https://github.com/sukreet/fidelius) is the reference implementation to check yourself against.

Confirm your payload is signed with your long term private key, not the session key.

## Test 9: End to end transfer to a PHR app

This is NHA's own verification script, in NHA's order.

**Functional.** A record you created in your system shows up, readable, in the ABHA PHR app, without you touching the app in between.

**Technical.**

1. Log in to the PHR app with a sandbox ABHA address.
2. Register a patient in your HIP system with that same ABHA address.
3. Create a new health record for that patient.
4. Link a care context for the record using HIP initiated linking.
5. The PHR app makes the request for the health record with the appropriate consents. You do not trigger this.
6. Your system prepares the record, encrypts it, and transfers it to the data push URL the PHR app supplied.
7. The record displays in the ABHA PHR app.

If step 7 fails, the fault is usually in step 6. Check that you pushed to the data push URL from the request rather than to a URL you looked up, because NHA allows the two to differ.

## Test 10: Completion notification and timing

**Functional.** A transfer that succeeded is recorded as succeeded on both sides.

**Technical.** After a successful push, your system calls `health-information/notify` to tell the [HIE-CM](/docs/overview/glossary#hie-cm) the transfer is complete. Measure the time from the request arriving to the push finishing. NHA's current timeout is 20 minutes. Test with a large record too, such as an imaging study, and confirm your split or streaming path keeps you inside the window.

## Recording results

Nothing on this page has been run from this repository. When you run these tests, record the date, the environment and the observed response, not the expectation. "The record appeared in the PHR app on 24 August" is a result. "It should work" is not.
