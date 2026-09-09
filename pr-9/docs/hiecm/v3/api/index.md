# API references

Every endpoint below is generated from the specification that declares it. Each one has its own page with the headers, the body and a request you can send.

This page lists every module, including any that the role you have chosen does not use. The sidebar shows only yours.

In M2 and M3 a call is acknowledged now and answered later. The answer arrives as a callback, a POST from ABDM to the URL you registered, declared in the specification as a webhook. Each callback is shown on the call it belongs to, and has a page of its own under that module.

## Gateway session

11 endpoints across 4 use cases: Session and tokens, Gateway & Bridge, Bridge, Provider directory. Each endpoint has its own page in the sidebar.

[Read the whole specification](/reference/hiecm-gateway)

## M1 ABHA identity

44 endpoints across 14 use cases: ABHA creation, ABHA verification, Share patient profile, Profile update, ABHA QR code, Session and tokens, Fetch ABHA by mobile number, Fetch ABHA by Aadhaar number, Authentication, Login & Verification, ABHA Profile, PHR & ABHA Address, Gateway & Bridge, Scan & Share. Each endpoint has its own page in the sidebar.

[Read the whole specification](/reference/hiecm-m1)

## M2 Linking and sharing

20 endpoints across 5 use cases: Hip linking, Deep linking, User linking, Data transfer, Webhooks. Each endpoint has its own page in the sidebar.

[Read the whole specification](/reference/hiecm-m2)

## M3 Consent and fetching

14 endpoints across 3 use cases: Consent, Data retrieval, Webhooks. Each endpoint has its own page in the sidebar.

[Read the whole specification](/reference/hiecm-m3)

## M4 HPR and HFR

2 endpoints across 2 use cases: HPR login, HFR master data. Each endpoint has its own page in the sidebar.

[Read the whole specification](/reference/hiecm-m4)

## P1 PHR identity and profile

63 endpoints across 6 use cases: Login, Family_management, Global_collection, Profile, Registration, Digilocker_apis. Each endpoint has its own page in the sidebar.

[Read the whole specification](/reference/hiecm-p1)

## P2 PHR linking and records

49 endpoints across 4 use cases: Care_context_link, Health_locker, Scan_and_share, User_initiated_linking. Each endpoint has its own page in the sidebar.

[Read the whole specification](/reference/hiecm-p2)

## P3 PHR consent and notifications

35 endpoints across 2 use cases: Consent_management, Notification_collection. Each endpoint has its own page in the sidebar.

[Read the whole specification](/reference/hiecm-p3)

## PHR application services

61 endpoints across 7 use cases: Ambulance, Blood_bank, Nearby_health_search, Pmjay_panel_facility_discovery, Teleconsulting, Nhcx, Scan_and_pay. Each endpoint has its own page in the sidebar.

[Read the whole specification](/reference/hiecm-phr-services)

## Callbacks with no documented trigger

7 callbacks are declared at module level with no call named against them. Which call produces each one is not documented, so this page does not say.

| Module | Method | Arrives at | What it carries |
| --- | --- | --- | --- |
| M2 Linking and sharing | <span class="api-chip api-chip--post">POST</span> | [`/api-hiu/data/notification`](/docs/hiecm/v3/api/m2/endpoints/m2-on-data-notification) | The provider pushes encrypted health information to the URL named in the request. |
| M2 Linking and sharing | <span class="api-chip api-chip--post">POST</span> | [`/v3/hip/token/on-generate-token`](/docs/hiecm/v3/api/m2/endpoints/m2-on-generate-token-result) | The link token m2_generate_link_token generated, or why it failed |
| M2 Linking and sharing | <span class="api-chip api-chip--post">POST</span> | [`/v3/link/on_carecontext`](/docs/hiecm/v3/api/m2/endpoints/m2-on-carecontext-result) | The outcome of a care context linking call you made |
| M2 Linking and sharing | <span class="api-chip api-chip--post">POST</span> | [`/v3/links/context/on-notify`](/docs/hiecm/v3/api/m2/endpoints/m2-on-context-notify-result) | The outcome of a care context notify call you made |
| M2 Linking and sharing | <span class="api-chip api-chip--post">POST</span> | [`/v3/patients/sms/on-notify`](/docs/hiecm/v3/api/m2/endpoints/m2-on-sms-notify-result) | The outcome of an SMS deep link notify call you made |
| M3 Consent and fetching | <span class="api-chip api-chip--post">POST</span> | [`/api/v3/consent/request/hip/notify`](/docs/hiecm/v3/api/m3/endpoints/m3-on-consent-request-notify-hip) | The patient's decision, sent to the record holder |
| M3 Consent and fetching | <span class="api-chip api-chip--post">POST</span> | [`/health-information/transfer`](/docs/hiecm/v3/api/m3/endpoints/m3-on-health-information-transfer) | The encrypted health data itself, pushed to the URL you supplied |
