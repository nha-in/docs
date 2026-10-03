---
id: hiecm.concept.m1-abha-consent
type: concept
gateway: hiecm
milestone: M1
version: abdm-v3
title: The terms and conditions a person agrees to before an ABHA is created
summary: The full consent text to show before sending an Aadhaar number, how to
  collect and record agreement, and the consent block enrol/byAadhaar sends.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/milestones/m1.mdx
    status: page
    note: Generated from site/docs/hiecm/v3/milestones/m1.mdx#m1-abha-consent. Edit
      the page, never this file.
related:
  flows:
    - hiecm.flow.m1-create-abha-aadhaar-otp
    - hiecm.flow.m1-create-abha-face-auth
    - hiecm.flow.m1-create-abha-demographic-auth
  endpoints:
    - hiecm.endpoint.m1-enrolment-request-otp
    - hiecm.endpoint.m1-enrolment-by-aadhaar
---

# The terms and conditions a person agrees to before an ABHA is created

## In plain words

Before your system sends a person's Aadhaar number, show them the terms and
conditions below and collect their agreement, through an "I agree" checkbox or
another form of signature. Keep a record that they agreed. Every journey that
creates an ABHA from Aadhaar starts here, and functional testing checks it.

Show the text exactly as written:

<div className="consent-text">

**Terms and Conditions**

I, hereby declare that I am voluntarily sharing my Aadhaar number and demographic information issued by UIDAI, with National Health Authority (NHA) for the sole purpose of creation of ABHA number. I understand that my ABHA number can be used and shared for purposes as may be notified by ABDM from time to time including provision of healthcare services. Further, I am aware that my personal identifiable information (Name, Address, Age, Date of Birth, Gender and Photograph) may be made available to the entities working in the National Digital Health Ecosystem (NDHE) which inter alia includes stakeholders and entities such as healthcare professionals (e.g. doctors), facilities (e.g. hospitals, laboratories) and data fiduciaries (e.g. health programmes), which are registered with or linked to the Ayushman Bharat Digital Mission (ABDM), and various processes there under. I authorize NHA to use my Aadhaar number for performing Aadhaar based authentication with UIDAI as per the provisions of the Aadhaar (Targeted Delivery of Financial and other Subsidies, Benefits and Services) Act, 2016 for the aforesaid purpose. I understand that UIDAI will share my e-KYC details, or response of “Yes” with NHA upon successful authentication. I have been duly informed about the option of using other IDs apart from Aadhaar; however, I consciously choose to use Aadhaar number for the purpose of availing benefits across the NDHE. I am aware that my personal identifiable information excluding Aadhaar number / VID number can be used and shared for purposes as mentioned above. I reserve the right to revoke the given consent at any point of time as per provisions of Aadhaar Act and Regulations.

</div>

The `consent` block in the `enrol/byAadhaar` request records the agreement:
`code` is `abha-enrollment` and `version` is `1.4`. Offering the text in other
languages is optional.

## Before you start

A screen that shows the full terms and conditions above, with nothing truncated, before any field that takes the Aadhaar number is submitted.

## What happens

Display the text verbatim, require an explicit "I agree" before the OTP request is sent, and store who agreed and when. Send the `consent` block with `code` `abha-enrollment` and `version` `1.4` in `enrol/byAadhaar`.

## How you know it worked

The OTP request cannot be sent until the person has agreed, and your records show the agreement for every ABHA your system created.

## When it goes wrong

A creation flow that sends the Aadhaar number before consent is collected fails functional testing, whatever the API returns.
