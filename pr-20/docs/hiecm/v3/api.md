# API references

Every endpoint below is generated from the specification that declares it. Each one has its own page with the headers, the body and a request you can send.

This page lists every module, including any that the role you have chosen does not use. The sidebar shows only yours.

In M2 and M3 a call is acknowledged now and answered later. The answer arrives as a callback, a POST from ABDM to the URL you registered, declared in the specification as a webhook. Each callback is shown on the call it belongs to, and has a page of its own under that module.

## Gateway session

11 endpoints across 2 use cases: Bridge and providers, Session and certificates. Each endpoint has its own page in the sidebar.

[Read the whole specification](/docs/pr-20/reference/hiecm-gateway)

## M1 ABHA creation and verification

122 endpoints across 10 use cases: Create ABHA, Child ABHA, Login, Profile, ABHA Card & Profile, Find ABHA, Forgot ABHA, Benefit, Access Tokens & Encryption, ABHA Address Login. Each endpoint has its own page in the sidebar.

[Read the whole specification](/docs/pr-20/reference/hiecm-m1)

## M2 Health information provider services

20 endpoints across 5 use cases: Link token, HIP initiated linking, User initiated linking, Consent and data flow, Callbacks. Each endpoint has its own page in the sidebar.

[Read the whole specification](/docs/pr-20/reference/hiecm-m2)

## M3 Health information user services

12 endpoints across 2 use cases: Consent and data flow, Callbacks. Each endpoint has its own page in the sidebar.

[Read the whole specification](/docs/pr-20/reference/hiecm-m3)

## M4 HPR and HFR

100 endpoints across 4 use cases: HPID, HFR, HRP bridge services, HPR. Each endpoint has its own page in the sidebar.

[Read the whole specification](/docs/pr-20/reference/hiecm-m4)

## P1 Registration and login

40 endpoints across 4 use cases: Create ABHA address, PHR login, PHR certificate and session token, Other operations. Each endpoint has its own page in the sidebar.

[Read the whole specification](/docs/pr-20/reference/hiecm-p1)

## P2 Management

47 endpoints across 5 use cases: PHR profile, Link ABHA number, Patient share, User initiated linking, Consent manager. Each endpoint has its own page in the sidebar.

[Read the whole specification](/docs/pr-20/reference/hiecm-p2)

## P3 Subscription

8 endpoints across 1 use case: Subscription approval and management, PHR side. Each endpoint has its own page in the sidebar.

[Read the whole specification](/docs/pr-20/reference/hiecm-p3)

## P4 Locker

4 endpoints across 1 use case: Locker. Each endpoint has its own page in the sidebar.

[Read the whole specification](/docs/pr-20/reference/hiecm-p4)

## Subscriptions

6 endpoints across 1 use case: Subscription request and notifications, HIU side. Each endpoint has its own page in the sidebar.

[Read the whole specification](/docs/pr-20/reference/hiecm-subscription)

## Scan and Register

2 endpoints across 1 use case: Scan and register. Each endpoint has its own page in the sidebar.

[Read the whole specification](/docs/pr-20/reference/hiecm-scan-and-register)

## Patient scan and record share

11 endpoints across 1 use case: Record share. Each endpoint has its own page in the sidebar.

[Read the whole specification](/docs/pr-20/reference/hiecm-record-share)

## Scan and Pay

18 endpoints across 2 use cases: Scan and pay, Scan and pay details and version update. Each endpoint has its own page in the sidebar.

[Read the whole specification](/docs/pr-20/reference/hiecm-scan-and-pay)

## Callbacks with no documented trigger

4 callbacks are declared at module level with no call named against them. Which call produces each one is not documented, so this page does not say.

| Module                                  | Method | Arrives at                                                                                                                                                                       | What it carries                                                                                               |
| --------------------------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| M2 Health information provider services | POST   | [`/api/v3/hip/token/on-generate-token`](/docs/pr-20/docs/hiecm/v3/api/m2/endpoints/m2-callbacks/01-m2-post-v3-hip-token-on-generate-token)                                       | This is a call back API of \[/api/hiecm/v3/token/generate-token].                                             |
| M3 Health information user services     | POST   | [`/api/v3/hiu/consent/request/on-init`](/docs/pr-20/docs/hiecm/v3/api/m3/endpoints/m3-callbacks/01-m3-post-v3-hiu-consent-request-on-init)                                       | Callback API of consent request for patient HIU.                                                              |
| Scan and Register                       | POST   | [`/api/v3/hip/patient/share`](/docs/pr-20/docs/hiecm/v3/api/scan-and-register/endpoints/scan-and-register-abdm-patient-share-hip/01-scan-and-register-post-v3-hip-patient-share) | This API will be invoked to the HIP for sharing the response of HIECM's /api/hiecm/patient-share/v3/share API |
| Scan and Pay                            | POST   | [`/v3/patient/share/open-order`](/docs/pr-20/docs/hiecm/v3/api/scan-and-pay/endpoints/scan-and-pay-abdm-scan-pay-hip/01-scan-and-pay-post-v3-patient-share-open-order)           | This is an API is called by HIU to check the status of reports.                                               |
