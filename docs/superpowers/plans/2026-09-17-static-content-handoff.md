# Static content handoff: claims the API session did not change

Date: 2026-09-17. Branch: `feat/final-nha-swagger`.

The reset session fixes only what the specifications decide: hosts, paths, headers, fields, enums, error codes, token sources and links into the generated reference. Static content on the hand-written pages belongs to the content session. This file lists what an audit of those pages found against NHA's final set (`catalogue/openapi/.raw/nha-2026-09-16/` and `catalogue/openapi/hiecm/v3/`), in two parts per page group:

- **Applied:** API-dependent corrections already committed. These lines moved.
- **Handoff:** claims with no source in the final set, or not contradicted by it but flagged, left for the content session to keep, re-source against the 15 September review, or delete. Line numbers are from the audit run; rows added on 17 September give line numbers at that commit. Each action carries its reason in brackets, and a QUESTION row asks the content session to decide.

Items the content session owns outright: `getting-started/security-audit.mdx`, the certification block in `getting-started/going-live.mdx`, `reference/data-dictionary.md`, timers and screen rules from the older PHR document, the private and government integrator tables, KYC label wording, and sandbox anecdotes.


## Page group 1

Pages: site/docs/hiecm/v3/ concepts/data-flow.md, concepts/fhir.md, concepts/how-it-fits.md, concepts/linking.md, registries/index.md, troubleshooting/accepted-then-nothing.md, callback-never-arrives.md, consent-stuck-requested.md, everything-returns-401.md, otp-never-arrives.md. Spec paths are catalogue/openapi/hiecm/v3/.

### Applied
| File:line (after) | Before | After | Spec evidence (file:line or grep count) |
|---|---|---|---|
| concepts/data-flow.md:n/a (was 70, between 68 and 70) | Two failures land here: `ABDM-1062`, consent not granted, and `ABDM-1063`, date range given is invalid. Both codes also appear against a linking message, so read the code with the message. | (paragraph deleted) | ABDM-1062: 0, ABDM-1063: 0 across hiecm-*.yaml |
| concepts/fhir.md:43 | The names come from M2, the codes from the M3 HI type table and the M2 error message for an invalid HI type. The two lists are not published as one table; they are paired here by name, one to one. Two mismatches. The M3 table displays `HealthDocumentRecord` as "Record artifact" ... omits `Invoice` ... Check the swagger before you send `Invoice` in a consent request. | The codes are the eight `hiTypes` values the linking and consent requests accept, `Invoice` included. | hiecm-m3.yaml:235-248 (consent/v3/request/init hiTypes enum, eight values incl. Invoice); hiecm-m2.yaml:169 (link/carecontext hiTypes); "Record artifact": 0 |
| concepts/fhir.md:86 | That is the skeleton. The full sample, with the Organization, the Encounter and the section entries, is on [M2 use cases](/reference/hiecm-m2). | That is the skeleton. | hiecm-m2.yaml: no bundle sample (ndhm.gov.in/sct 0, affinitydomain 0); only "Encrypted content of data packaged in FHIR bundle" at 4673 |
| concepts/fhir.md:127 | [M2 use cases], the full bundle sample and validation in context. | [M2 use cases], the transfer call that carries the encrypted bundle. | hiecm-m2.yaml:4631 (/health-information/transfer, application/fhir+json) |
| concepts/how-it-fits.md:94 | `hipId`, `hipName`, `hipType` | `bridgeId`, `hipName`, `type` | hiecm-m4.yaml:4420-4432 MultipleHRPRequest required active, bridgeId, hipName, type; hipType as field: 0 |
| concepts/how-it-fits.md:98 | `X-HIU-ID` in M2 and [M3] | `X-HIU-ID` in [M3] | X-HIU-ID in hiecm-m2.yaml: 0; present in m3, p2, subscription, scan-and-pay |
| concepts/how-it-fits.md:44 | Your system never calls another participant directly. | Apart from the transfer of the record itself, your system never calls another participant directly. | hiecm-m2.yaml:4631 (transfer to dataPushUrl "directly called by HIP Data Bridge and is not mediated via CM"). Applied per controller ruling (a) |
| concepts/linking.md:74,76 | What you are handed splits in two: / Verified identifiers, which you weight higher: ABHA address, mobile number, name, gender and year of birth. | What you are handed splits in two, alongside the patient's name, gender and year of birth: / Verified identifiers, which you weight higher, each typed as `MR`, `MOBILE`, `ABHA_NUMBER`, `ABHA_ADDRESS` or `EMAIL`. | hiecm-m2.yaml:3316-3340 (patient required id, verifiedIdentifiers, name, gender, yearOfBirth; type enum MR, MOBILE, ABHA_NUMBER, ABHA_ADDRESS, EMAIL) |
| concepts/linking.md:n/a (was 100) | `ABDM-1026` Invalid Link Token row | (row deleted) | ABDM-1026: 0 |
| concepts/linking.md:n/a (was 103) | `ABDM-1057` Invalid Care Contexts row | (row deleted) | ABDM-1057: 0 |
| concepts/linking.md:n/a (was 104) | `ABDM-1060` Invalid Patient Reference Number row | (row deleted) | ABDM-1060: 0 |
| concepts/linking.md:n/a (was 105) | `ABDM-1090` Duplicate HIP link request row | (row deleted) | ABDM-1090: 0 (combined grep of the four codes: 0) |
| concepts/linking.md:101 | This care contexts has been already linked | This care context has already been linked | hiecm-m2.yaml:3665-3666 |
| troubleshooting/accepted-then-nothing.md:35-36 | Your discovery call should produce an inbound discovery request callback to your bridge. | The patient's discovery should reach your bridge as an inbound `discover` request. | hiecm-m2.yaml:3259 /api/v3/hip/patient/care-context/discover (inbound to HIP) |
| troubleshooting/accepted-then-nothing.md:39-40 | Starting a link should produce an inbound link init callback. | The patient's link request should reach your bridge as an inbound link `init` request. | hiecm-m2.yaml:3469 /api/v3/hip/link/care-context/init |
| troubleshooting/accepted-then-nothing.md:59-61 | For linking, the care context appears when the patient's PHR app runs discovery against your facility, after the link confirm callback reports success. For discovery, your system answers the inbound discovery callback with the care contexts you hold for that patient. | For linking, the callback to your link request reports success. For discovery, your system answers the inbound discovery request with the unlinked care contexts you hold for that patient. | hiecm-m2.yaml:643 on-discover summary "only unlinked records of the patient" |
| troubleshooting/accepted-then-nothing.md:73-74 | a duplicate or invalid link reference, or a call made out of the logical sequence, both on the M2 errors reference | a duplicate discovery, init or confirm request, on the M2 errors reference | hiecm-m2.yaml:3413, 3688, 3828 (ABDM-1103/1104/1105 Duplicate Discovery/Init/Confirm request); invalid link reference error 0; sequence error 0 |
| troubleshooting/callback-never-arrives.md:51-53 | carrying the exact `REQUEST-ID` you generated for the original call | carrying in `response.requestId` the `REQUEST-ID` you generated for the original call | "The requestId that was passed": hiecm-m2.yaml 14, hiecm-m3.yaml 5 |
| troubleshooting/consent-stuck-requested.md:54-56 | The consent request status reports Granted or Denied rather than Requested. A Granted result also carries the id of at least one consent artefact, and a granted request can produce more than one. | The consent request notification reports GRANTED or DENIED rather than REQUESTED. A GRANTED notification carries `consentArtefacts`, an array of the generated consent artefact ids. | hiecm-m3.yaml:1880 on-status enum REQUESTED, DENIED, EXPIRED, REVOKED (no GRANTED); hiecm-m3.yaml:2095-2104 notify GRANTED with consentArtefacts array, DENIED |
| troubleshooting/everything-returns-401.md:42-43 | `sbx` on the sandbox, `abdm` in production. | `sbx` on the sandbox. | X-CM-ID "abdm": 0 (only consentManager.id example at hiecm-m3.yaml:2633, hiecm-m2.yaml:1968, not the header) |
| troubleshooting/everything-returns-401.md:64-65 | invalid timestamp, the wrong consent manager id, a missing session token, or | invalid timestamp, a missing session token, or | "consent manager id" error: 0 |
| troubleshooting/otp-never-arrives.md:60 | a rate limit code or the catch-all failure code, both on the | the catch-all failure code on the | hiecm-m1.yaml "429" / "too many": 0 |
| concepts/data-flow.md:108 | in the group the HIU specified | on the `curve` the HIU specified in `keyMaterial` | hiecm-m3.yaml:1096-1107 keyMaterial required `curve`, example curve25519 |
| concepts/linking.md:56 | notifies every PHR application subscribed to that ABHA address | notifies each HIU subscribed to that patient | hiecm-subscription.yaml:1217 notify summary "the subscribed HIU when a care context is linked or updated" |
| concepts/linking.md:58-66, 104 | "Three routes", Notification to mobile row and paragraph, "all three routes" | "Two routes", row and paragraph removed, "both routes" | hiecm-m2.yaml:482 sms/notify2 notifies that a care context is linked, body `phoneNo` and `hip` only (same correction as hip-hiu.md:77) |
| concepts/linking.md:73 | Unverified: patient ID or medical registration number | Unverified identifiers, patient declared, typed from the same set | hiecm-m2.yaml:3346-3362 unverifiedIdentifiers type enum MR, MOBILE, ABHA_NUMBER, ABHA_ADDRESS, EMAIL |
| concepts/linking.md:86 | Regenerate it through demographic authentication | Regenerate it with the generate link token call, which takes `abhaAddress`, `name`, `gender` and `yearOfBirth` | hiecm-m2.yaml:1313, 1358-1362 required fields |
| concepts/linking.md:92 | the table reuses some codes against more than one message | the specification returns `ABDM-9999` against more than one message | hiecm-m2.yaml:2334-2340 ABDM-9999 with three messages; ABDM-1038 and ABDM-1056 carry one message each |
| registries/index.md:28 | takes a professional token in its header | takes the HPR token in the `x-hprid-auth` header (password clause kept, controller ruling b) | hiecm-m4.yaml:629, 861 |
| troubleshooting/callback-never-arrives.md:29 | Confirm it with the update bridge callback URL call | Set it with the update bridge callback URL call | hiecm-gateway.yaml PATCH /gateway/v3/bridge/url sets the URL |
| troubleshooting/consent-stuck-requested.md:n/a (was 70-71) | This symptom can surface as an invalid or non-existent ABHA address on the error codes reference | (sentence deleted) | no ABHA address error code in hiecm-m3.yaml; ABDM-1051 is in hiecm-m2.yaml:4001 only |

### Handoff
| File:line (after) | Claim | raw hits | spec hits | Audit's suggested action |
|---|---|---|---|---|
| concepts/data-flow.md:20 | HIP validates the consent and signs | 73 (CM signature only) / 0 | - | QUESTION for the content session: keep, reword or delete? (who-validates flow prose and signing crypto) |
| concepts/data-flow.md:32 | HIU generates a 32 byte nonce | 0 | 0 | QUESTION for the content session: keep, reword or delete? (32 byte nonce, crypto) |
| concepts/data-flow.md:38 | HIP validates consent status, date range, encryption params | 0 | 0 | DELETE (who-validates flow prose) |
| concepts/data-flow.md:40 | HIP derives the session key | 0 | 0 | QUESTION for the content session: keep, reword or delete? (crypto) |
| concepts/data-flow.md:41 | Encrypt then sign with long term private key | 0 | 0 | QUESTION for the content session: keep, reword or delete? (crypto) |
| concepts/data-flow.md:45 | HIU derives the same session key | 0 | 0 | QUESTION for the content session: keep, reword or delete? (crypto) |
| concepts/data-flow.md:54 | Push URL may differ, improves privacy and anonymity | 0 | 0 | DELETE (not API) |
| concepts/data-flow.md:62-66 | HIP runs three checks | 0 | 0 | QUESTION for the content session: keep, reword or delete? (who-validates flow prose) |
| concepts/data-flow.md:68 | Sign with long term private key | 0 | 0 | QUESTION for the content session: keep, reword or delete? (crypto) |
| concepts/data-flow.md:78 | Timeout 20 minutes | 0 | 0 | DELETE (timer) |
| concepts/data-flow.md:79 | Split large datasets, hundreds of MB | 0 / 2 (pageCount) | 0 / 2 | CORRECT to "Split large datasets across pages with `pageNumber` and `pageCount`." (static: the size guidance is content; the paging fields exist) |
| concepts/data-flow.md:80 | Stream very large files | 0 relevant | 0 | DELETE (not API) |
| concepts/data-flow.md:86 | AES-GCM, HKDF, perfect forward secrecy | 0 | 0 | DELETE (crypto) |
| concepts/data-flow.md:94,97 | Nonce is 32 bytes | 0 | 0 | QUESTION for the content session: keep, reword or delete? (crypto) |
| concepts/data-flow.md:99 | Session key 256 bit AES-GCM | 0 | 0 | DELETE (crypto) |
| concepts/data-flow.md:100 | Long term private key signs payload | 0 | 0 | DELETE (crypto) |
| concepts/data-flow.md:102 | New key pair buys forward secrecy | 0 | 0 | DELETE (crypto) |
| concepts/data-flow.md:106 | Six steps | - | - | CORRECT to Four (depends on crypto deletions) |
| concepts/data-flow.md:109 | 32 byte random value RAND(P) | 0 | 0 | QUESTION for the content session: keep, reword or delete? (crypto) |
| concepts/data-flow.md:111 | XOR of nonces, 20 byte salt, 12 byte IV | 0 | 0 | DELETE (crypto) |
| concepts/data-flow.md:112 | 256 bit AES-GCM key via HKDF | 0 | 0 | DELETE (crypto) |
| concepts/data-flow.md:113 | Encrypt with that key and IV | - | - | QUESTION for the content session: keep, reword or delete? (crypto) |
| concepts/data-flow.md:115 | HIU derives session key with XOR salt/IV | yes / 0 | yes / 0 | QUESTION for the content session: keep, reword or delete? (crypto) |
| concepts/data-flow.md:119-121 | Fidelius repos, CLI examples, webinar | 0 | 0 | DELETE with heading (crypto references) |
| concepts/fhir.md:30 | Implementing all eight is mandatory for an HMIS | 1 (unrelated) | 1 | DELETE (business guidance) |
| concepts/fhir.md:107 | Identifier system hosts /nhpr/v4/home (Concern 3) | 0 / 3 | 0 / 1 | out of scope, flagged (FHIR content) |
| concepts/fhir.md:109 | section.code system affinitydomain in "the same sample" (Concern 3); now points at a sample the page no longer links | 0 | 0 | out of scope, flagged (FHIR content; note the sample link was removed by an applied edit) |
| concepts/how-it-fits.md:20,56-62 | Two integrator roles, IMS or PHR | 0 | 0 | KEEP, flagged (portal taxonomy) |
| concepts/how-it-fits.md:33 | HPR includes facility manager | 0 | 0 | QUESTION for the content session: keep, reword or delete? (role guidance) |
| concepts/how-it-fits.md:61 | EMR and PMS examples | 0, 0 | - | QUESTION for the content session: keep, reword or delete? (not API) |
| concepts/how-it-fits.md:110-111 | Diagnosis or result in display name not allowed | 0 relevant | - | QUESTION for the content session: keep, reword or delete? (content rule) |
| concepts/linking.md:23 | Display name: no clinical detail, no results, no diagnoses | 0 relevant | 0 | CORRECT to "Up to 255 characters" (static: the no clinical detail rule is content; the length is the spec regex {0,255}) |
| concepts/linking.md:25-38 | Illustrative JSON values (Concern 3) | 7; 0; 0 | 3; 0; 0 | KEEP, flagged (illustrative values, not fields the spec decides; Concern 3) |
| concepts/linking.md:40 | Good display name example; one care context per OPD visit / IPD admission | 0 | 0 | DELETE (example and business guidance) |
| concepts/linking.md:54 | Link as soon as ready to share | 0 | 0 | DELETE, rename heading (process) |
| concepts/linking.md:72 | Discovery mandatory for every HIP | 0 | 0 | DELETE (mandatory for every HIP) |
| concepts/linking.md:79 | Use unverified to sharpen not make a match; no diagnosis/result/report; somebody unproven reads it | 0 | 0 | DELETE / CORRECT (not API) |
| concepts/linking.md:87 | Link token generated and stored at registration | 0 | 0 | DELETE (process) |
| concepts/linking.md:89 | Validate with JWT.io | 0 | 0 | DELETE (not API) |
| concepts/linking.md:92 | Check it before you link | - | - | QUESTION for the content session: keep, reword or delete? (not API) |
| concepts/linking.md:108 | Call order for all three routes | - | - | CORRECT to "both routes" (tied to route deletion) |
| registries/index.md:23 | HPR includes facility manager | 0 | 0 | QUESTION for the content session: keep, reword or delete? (role guidance) |
| registries/index.md:29-30 | HPR ID with facility manager rights | 0 | 0 | QUESTION for the content session: keep, reword or delete? (role guidance) |
| troubleshooting/accepted-then-nothing.md:21-26 | Discovery is PHR app, another facility, insurer, referral service | 0/0 | 0/0 | CORRECT to patient via PHR app (flow/role prose) |
| troubleshooting/accepted-then-nothing.md:44-45 | Care context visible in PHR app only after confirm | 0 | 0 | DELETE (unsourced behaviour) |
| troubleshooting/accepted-then-nothing.md:53-55 | Callback URL problem more common than gateway failing | 0 | 0 | DELETE (frequency) |
| troubleshooting/accepted-then-nothing.md:68 | Support platform sandboxsupport.abdm.gov.in (Concern 2) | 0 | 11 | KEEP, flagged (support channel, only in the injected info.contact; contact details are content; Concern 2) |
| troubleshooting/callback-never-arrives.md:14-16 | Common report in HIE-CM integration | 0 | 0 | DELETE (frequency) |
| troubleshooting/callback-never-arrives.md:31-32 | Setting a URL in a console is not confirming | 0 | 0 | DELETE (no console, not API) |
| troubleshooting/callback-never-arrives.md:33 | Reachable over HTTPS | 0 | 0 | QUESTION for the content session: keep, reword or delete? (not contradicted, url is format: uri) |
| troubleshooting/callback-never-arrives.md:43-45 | Deliveries can repeat, treat as retry | only token retry | - | DELETE (not API) |
| troubleshooting/callback-never-arrives.md:59 | Support platform (Concern 2) | 0 | 11 | KEEP, flagged (support channel, as accepted-then-nothing.md:68; Concern 2) |
| troubleshooting/consent-stuck-requested.md:30-32 | Gateway notifies patient through ABHA App | 6 | 6 | DELETE (process/UI) |
| troubleshooting/consent-stuck-requested.md:32-35 | Third party PHR app needs approved subscription | - | - | DELETE (static: process note about third party PHR apps; subscription categories do not decide it) |
| troubleshooting/consent-stuck-requested.md:35-37 | ABHA App setup not confirmed | - | - | DELETE (process note) |
| troubleshooting/consent-stuck-requested.md:38-40 | Request carries a response window the requester sets | 0 | 0 | DELETE (static: a timer; the spec has no request expiry field, only dataEraseAt) |
| troubleshooting/consent-stuck-requested.md:40-42 | Link to two clocks | - | - | DELETE (depends on above) |
| troubleshooting/consent-stuck-requested.md:42-44 | Expiry of request window moves state to Expired | yes | yes | CORRECT to "A request nobody answers moves to `EXPIRED`." (the request window is a timer) |
| troubleshooting/consent-stuck-requested.md:45-47 | Malformed/non-existent address produces error | 1 | 1 (m2) | DELETE (static: no code is named, so no spec value decides it) |
| troubleshooting/consent-stuck-requested.md:47-50 | Valid address of other patient delivered to wrong person | 0 | 0 | DELETE (unsourced) |
| troubleshooting/consent-stuck-requested.md:64-66 | Support platform (Concern 2) | 0 | 11 | KEEP, flagged (support channel; Concern 2) |
| troubleshooting/everything-returns-401.md:32-33 | Sandbox token invalid against production | 0 | 0 | DELETE (environment behaviour, not an artefact) |
| troubleshooting/everything-returns-401.md:37-38 | TIMESTAMP tolerance not stated (Concern) | 100 | 99 | KEEP, flagged (the specs state no TIMESTAMP tolerance, so how to word the unknown is content) |
| troubleshooting/everything-returns-401.md:38-40 | Suspended container host usual cause | 0 | 0 | DELETE (not API) |
| troubleshooting/everything-returns-401.md:44-45 | Wrong X-CM-ID fails every call like missing token | 0 | 0 | DELETE (static: error behaviour with no code named) |
| troubleshooting/everything-returns-401.md:58 | Support platform (Concern 2) | 0 | 11 | KEEP, flagged (support channel; Concern 2) |
| troubleshooting/otp-never-arrives.md:33-38 | Rate limited after repeated OTP requests | 0 | 0 | DELETE (rate-limit prose) |
| troubleshooting/otp-never-arrives.md:47-49 | Phone receives an SMS carrying the OTP | 0 | 0 | QUESTION for the content session: keep, reword or delete? (not API) |
| troubleshooting/otp-never-arrives.md:53 | "are not rate limited" | - | - | DELETE (rate-limit residue) |
| troubleshooting/otp-never-arrives.md:55 | Support platform (Concern 2) | 0 | 11 | KEEP, flagged (support channel; Concern 2) |

## Page group 2

All paths under site/docs/hiecm/v3/. Specs are catalogue/openapi/hiecm/v3/. Raw is catalogue/openapi/.raw/nha-2026-09-16/.

### Applied

| File:line (after) | Before | After | Spec evidence (file:line or grep count) |
|---|---|---|---|
| concepts/encryption.md:14 | placeholder `<RSA_ENCRYPTED_AADHAAR_NUMBER>` | `{{encrypted aadhaar number}}` | hiecm-m1.yaml:100 `loginId: "{{encrypted aadhaar number}}"`; RSA_ENCRYPTED_AADHAAR 0 in every spec |
| concepts/encryption.md:40 | Mobile: 10 digits, no country code and no `+` | 10 digits, first digit 1 to 9, optionally prefixed with `+91` or `0` | raw abha/M1 ABHA Swagger 1.yaml:5 `(\\+91\|0)?[1-9][0-9]{9}` (raw 1, specs 0) |
| concepts/encryption.md:41 | OTP: the digits as sent, nothing else | Exactly 6 digits | raw abha/M1 ABHA Swagger 1.yaml:5 `[0-9]{6}`, "exactly 6 digits long" |
| concepts/encryption.md:68 | "...production path, and it is the only one that keeps the guarantee..." plus three paragraphs on the hosted helper, two third party sites and the `encrypt value endpoint` link | "This is the production path." | no encrypt path in hiecm-m1.yaml (`grep '^  /' \| grep -i encr` = 0; only cert path at 6870). Borderline: the third party websites sentence went with the helper sentence it shares |
| concepts/encryption.md:72 | link `m1-session/02-m1-get-v3-profile-public-certificate` | `m1-session/03-m1-get-v3-profile-public-certificate` | file exists: api/m1/endpoints/m1-session/03-m1-get-v3-profile-public-certificate.mdx; no 02 cert file in m1-session |
| concepts/encryption.md:76 | "every call needs, including the key and helper endpoints." | "every call needs." | residue of helper deletion (as above) |
| concepts/gateway.md:28 | Three things follow. | Two things follow. | count after ABDM-2406 bullet removal |
| concepts/gateway.md:30 | HIE-CM acknowledges with a consent request id | HIE-CM returns the consent request id on a callback | hiecm-m3.yaml:287-289 request/init returns 202 with no body; `consentRequest.id` at hiecm-m3.yaml:1729 under on-init (1678) |
| concepts/gateway.md:31 | "...fails on someone else's logs, as `ABDM-1028 HIP is unavailable`." | sentence removed | ABDM-1028 raw 0, specs 0 |
| concepts/gateway.md:n/a (was 32) | bullet `ABDM-2406 Invalid API sequence flow` | removed | ABDM-2406 raw 0, specs 0 |
| concepts/gateway.md:42 | M4 row: "Session tokens for the HPR and HFR registry calls" | "The HPR and HFR registry calls, which carry their own token from `POST /getManagementToken`" | hiecm-m4.yaml:4014 bearerAuth "The token from POST /getManagementToken."; :1821 path; `sessions` 0 in hiecm-m4.yaml. Audit had KEEP; applied under the brief's M4 token ruling |
| concepts/gateway.md:48 | "It is the same call in M1 and M4." | "It is the call M1 uses. M4 takes its token from `POST /getManagementToken` instead." | as above |
| concepts/gateway.md:58 | `X-CM-ID` "Use `sbx` for sandbox and `abdm` for production" | "Use `sbx` for sandbox" | X-CM-ID examples in hiecm-gateway.yaml are `sbx` only (75, 341, ...); "abdm" as value raw 0, specs 0 |
| concepts/gateway.md:93 | Four hosts serve gateway paths. | Three hosts | count after row removal |
| concepts/gateway.md:n/a (was 100) | row `https://live.abdm.gov.in` Production | removed | live.abdm.gov.in raw 0, specs 0 |
| concepts/hip-hiu.md:32 | M1 production `https://abha.abdm.gov.in/api/abha/v3/` | cell left empty | abha.abdm.gov.in raw 0, specs 0 |
| concepts/hip-hiu.md:77 | "Three routes ... notification to mobile when you hold only a mobile number, name, age and gender, and discovery" | "Two routes: HIP initiated with their ABHA address, and discovery" | hiecm-m2.yaml:482 sms/notify2 summary "send SMS notification to patient that a care context is linked", required body `phoneNo`, `hip` only |
| concepts/hip-hiu.md:120 | codes `ABDM-1026` invalid link token, `ABDM-1062`, `ABDM-1063` | removed; 1038 and 1056 kept | ABDM-1026/1062/1063 raw 0, specs 0 |
| milestones/m4.mdx:70-71 | Creating an HPID returns an `hprToken`, which the register call carries | returns a `token`, and the register call carries an `hprToken` | hiecm-m4.yaml:4149-4152 CreateAccountJwtResponse `token`; `hprToken` in register at 2699, 6618 |
| milestones/m4.mdx:80 | 111 operations | 100 operations | `grep -c operationId: hiecm-m4.yaml` = 100 |
| milestones/m4.mdx:n/a (was 115, 118-119) | participant HIE-CM gateway; `POST /gateway/v3/sessions` and `accessToken` messages | removed | hiecm-m4.yaml:4014 bearer from /getManagementToken; `sessions` 0 in M4 spec |
| milestones/m4.mdx:133 | Step 13 decides | Step 10 | diagram renumbered by the removal (10 messages, last is "The existing HPID, or none") |
| milestones/m4.mdx:151 | Create HPID returns an `hprToken`. Keep it: the register call needs it. | returns a `token`. The register call carries an `hprToken` in its payload. | as m4:70 |
| milestones/m4.mdx:157 | It needs the `hprToken` journey 1 returned. | It carries an `hprToken` in its payload. | as m4:70 |
| milestones/m4.mdx:165 | Note: Holds accessToken and hprToken | Holds hprToken | as m4 sessions removal |
| milestones/m4.mdx:172 | Upload documents, one call per document | as a list in one call | hiecm-m4.yaml:3034 upload-document body `document:` array |
| milestones/p1.mdx:87 | address login: Password, mobile OTP or Aadhaar OTP, by auth mode | Password, mobile OTP or email OTP, by the auth methods the address supports | hiecm-p1.yaml:1713-1715 authMethods MOBILE_OTP, PASSWORD, EMAIL_OTP; login flows for ABHA address are Mobile OTP (1408), Email OTP (1435), Password (1911), none by Aadhaar OTP |
| milestones/p2.mdx:54-55 | counter: up to 20 alphanumeric characters, no special characters | 1 to 250 characters, letters, digits and spaces, with `.`, `-` and `_` allowed between them | hiecm-p2.yaml:887 `^(?:[a-zA-Z0-9 ]\|[a-zA-Z0-9 ][a-zA-Z0-9.\\-_ ]*[a-zA-Z0-9 ]){1,250}$` |
| milestones/p2.mdx:63-65 | discovery request carrying name, year or date of birth, gender, verified mobile, ABHA address; registration number optional | carrying the HIP ID and unverified identifiers of type `MR`, `MOBILE`, `ABHA_NUMBER` or `ABHA_ADDRESS` | hiecm-p2.yaml:272 discover; body required `hip`, `unverifiedIdentifiers`, type enum MR/MOBILE/ABHA_NUMBER/ABHA_ADDRESS; no name, gender or birth fields |
| milestones/p2.mdx:91-92 | link token from the M1 APIs | from the generate link token call | `/api/hiecm/v3/token/generate-token` at hiecm-m2.yaml:1313; generate-token 0 in hiecm-m1.yaml |
| milestones/p3.mdx:45 | Editing covers health information types, types of visit and the time period | health information types, purpose, categories and the time period | hiecm-p3.yaml approve body (406): includedSources 469, hiTypes 481, purpose 497, categories 556, period 566; "visit" 0 in hiecm-p3.yaml |
| concepts/encryption.md:72 | listed again under developer utilities | (clause deleted) | no utilities section in the generated api/m1 tree |
| concepts/hip-hiu.md:81 | regenerated by demographic authentication | regenerated with the generate link token call | hiecm-m2.yaml:1313, 1358-1362 |
| concepts/hip-hiu.md:n/a (was 120-122) | The same code can arrive with more than one message | (sentence deleted) | ABDM-1038 (hiecm-m2.yaml:2734) and ABDM-1056 (:3666) carry one message each |
| concepts/gateway.md:48 | M4 takes its token from `POST /getManagementToken` instead | M4 declares bearer authentication, and its HPID calls publish `POST /getManagementToken` | raw M4/M4-HPID.json is the only raw file with getManagementToken; M4-HPR.json:5530 and M4-HFR.json:4809 declare BearerAuth with no source |
| concepts/gateway.md:93, n/a (was 98) | Three hosts; row `https://apissbx.abdm.gov.in` Sandbox, on the sessions call | Two hosts; row deleted | apissbx: specs 0 (servers are dev, apis, abhasbx, apihspsbx); raw only in M1 ABHA Collection.json |
| milestones/m4.mdx:62-63 | Three categories are open today: doctor, nurse and pharmacist. Others come later. | The `hprType` categories include doctor, nurse, pharmacist and facility manager. | hiecm-m4.yaml:6417-6426 hprType enum |
| milestones/m4.mdx:126 | mobile number masked | with the mobile number | verifyOTP examples show both `******1234` and null, no masking rule |
| milestones/m4.mdx:206 | Facility submitted for verification | Submit result | submit-facility has no response example |
| milestones/p1.mdx:36-37 | family members they manage on one account, and DigiLocker documents they pull in | (clauses deleted) | family and DigiLocker: 0 in hiecm-p1.yaml |
| milestones/p1.mdx:31 | All four login routes are mandatory | All eight login routes are mandatory (mandate left in handoff) | hiecm-p1.yaml:1785 "8 flows" |
| milestones/p1.mdx:51, 58, 76 | Aadhaar OTP or mobile OTP | Aadhaar OTP or ABHA OTP | hiecm-p1.yaml:534, 895 flows ABHA OTP and AADHAR OTP |
| milestones/p1.mdx:n/a (was 62-64) | mobile path mandatory and optional fields | (paragraph deleted) | hiecm-p1.yaml phrDetails declares no required list |
| milestones/p1.mdx:77, n/a (was 84), 84 | "any of four routes"; default `14digit@abdm` row; ABHA number "Mobile OTP or Aadhaar OTP" | "any of these routes"; row deleted; "ABHA OTP or Aadhaar OTP" | hiecm-p1.yaml:1785-1795 eight flows, none for a default address, ABHA number by ABHA OTP or Aadhaar OTP |
| milestones/p3.mdx:40-41 | new care context, modified care context, new consent request, new subscription request | when a care context is linked or updated | hiecm-subscription.yaml:1217 |
| milestones/p3.mdx:n/a (was 55) | 3. Save the auto approval ID the HIE-CM returns. | (step deleted) | auto approval returns 202 with no body |

### Handoff

| File:line (after) | Claim | raw hits | spec hits | Audit's suggested action |
|---|---|---|---|---|
| concepts/encryption.md:39 | Aadhaar 12 digits no spaces | 0 | 0 | DELETE (row) |
| concepts/encryption.md:43-47 | sandbox run 11 Sept, `LoginId is invalid` | 0 | 0 | DELETE (sandbox anecdote; no run is recorded in the set) |
| concepts/encryption.md:50-51 | shapes "as NHA's validation patterns describe" and "not failed deliberately from here" | 0 | 0 | DELETE (describes the documentation rather than ABDM, voice) |
| concepts/gateway.md:33 | push URL may differ from registered gateway URL "to improve privacy" | 0 | 0 | DELETE (privacy rationale, not in the set) |
| concepts/gateway.md:105 | callback retries, idempotent, assume a repeat | 0 relevant | 0 | DELETE (retry behaviour, not in the set) |
| concepts/gateway.md:108 | gateway request not signed; signing applies to health records. Borderline API | 0 / CM signature only | 0 | DELETE (static: the specs declare bearer authentication and say nothing about signing gateway requests, so no field or header decides it) |
| concepts/hip-hiu.md:37-54 | private vs government mandatory/optional capability table and lead-in | 0/2/0/0 | 0 | DELETE (private and government integrator table, owned by the content session) |
| concepts/hip-hiu.md:56 | "and the Aadhaar RD service" | 0 | 0 | QUESTION for the content session: keep, reword or delete? (remove) |
| concepts/hip-hiu.md:57-59 | registered device needed, UIDAI device list URL | 0 | 0 | DELETE (device certification, outside the set) |
| concepts/hip-hiu.md:61-62 | Luhn for ABHA, Verhoeff for Aadhaar | 0 | 0 | DELETE (checksum algorithms, not in the set) |
| concepts/hip-hiu.md:75-76 | one care context per outpatient visit, one per inpatient admission | scan-and-pay / HPR only | - | DELETE (care context granularity is business guidance) |
| concepts/hip-hiu.md:80-81 | link token "stored at registration" (the regeneration call is applied) | 0 | 0 | DELETE "stored at registration" (process, not in the set) |
| concepts/hip-hiu.md:83 | discovery mandatory for every HIP | 0 | 0 | DELETE (mandate, a certification rule) |
| concepts/hip-hiu.md:83-84 | match verified identifiers, weight above declared ones (request carries verifiedIdentifiers and unverifiedIdentifiers, hiecm-m2.yaml:3313,3346; weighting is guidance). Borderline API | yes/0 | yes/0 | QUESTION for the content session: keep "weight verified identifiers above unverified ones" as guidance? (static: both identifier lists exist, hiecm-m2.yaml:3313, 3346; the weighting is guidance, not a field) |
| concepts/hip-hiu.md:87-88 | sign with long term private key | 0 | 0 | DELETE (signing prose, not in the set) |
| concepts/hip-hiu.md:88-90 | 20 minute timeout, split CT/MRI, streaming | 0/0/unrelated | 0 | DELETE (timer and payload size guidance) |
| concepts/hip-hiu.md:99 | one care context per OPD visit / IPD admission | unrelated | - | QUESTION for the content session: keep one care context per visit and per admission as guidance, or delete? (business guidance) |
| concepts/hip-hiu.md:103 | inside 20 minutes | 0 | 0 | DELETE (timer) |
| concepts/hip-hiu.md:110-118 | single end to end sandbox check, 7 steps | 0 | 0 | DELETE (sandbox check procedure, not in the set) |
| milestones/m4.mdx:33-35 | M2/M3 need facility ID in production; NHPR portal alternative | 0 | 0 | DELETE (production onboarding rule, process) |
| milestones/m4.mdx:39-40 | samples show production host for sandbox (no production host in M4 spec). Borderline API | 0 | 0 | DELETE (static: a sandbox anecdote about samples; the M4 spec carries no production host to compare) |
| milestones/m4.mdx:53 | facility types incl. clinic, lab, pharmacy | 0 | 0 | CORRECT to "facility types such as hospital, imaging centre and blood bank" (the facility type examples in hiecm-m4.yaml name these three) |
| milestones/m4.mdx:59-61 | without HFR and bridge cannot share/fetch | 0 | 0 | DELETE (consequence prose, process) |
| milestones/m4.mdx:108 | hosted page URL valid five minutes, regenerate after | url yes; 0 | 0 | QUESTION for the content session: keep, reword or delete? (validity deleted) |
| milestones/m4.mdx:118 | txnId and temporary URL valid 5 minutes | as 108 | CORRECT to "The response carries a `txnId` and a URL." (the validity is a timer) |
| milestones/m4.mdx:135 | encrypt with `RSA/ECB/PKCS1Padding` | 1 (ABHA only) | 0 | DELETE (cipher name has 0 hits in hiecm-m4.yaml; crypto prose) |
| milestones/m4.mdx:176 | degree and registration certificates mandatory; proof of work for government | 0 | 0 | DELETE (document mandate, certification) |
| milestones/m4.mdx:184 | draft until submit, "invisible to ABDM" | yes / 0 | | CORRECT (invisible dropped) |
| milestones/m4.mdx:215 | detailed info sections "that apply to this facility type" | yes | | CORRECT (qualifier dropped) |
| milestones/m4.mdx:218 | mandatory fields depend on type; labs etc send no infrastructure counts | 0 | 0 | DELETE (per-type mandatory rules, not in the set) |
| milestones/m4.mdx:222 | OTP path serves government programmes | example AB-PMJAY only | | CORRECT (purpose dropped) |
| milestones/m4.mdx:240 | facility ID alone does not make records flow | 0 | 0 | QUESTION for the content session: keep "a facility ID alone does not make records flow", or delete? (process consequence) |
| milestones/m4.mdx:246 | HIP name 15 characters or fewer (diagram label) | 0 | 0 | QUESTION for the content session: keep, reword or delete? (label only) |
| milestones/m4.mdx:251 | HIP name shown to patients; 15 chars, no special, unique; worked example | 0 | 0 | DELETE (HIP name rules, not in the M4 schema) |
| milestones/m4.mdx:253 | linked HIP/HIU bridge enables M2/M3; step before production | 0 | 0 | DELETE (production step, process) |
| milestones/p1.mdx:29-30 | build both creation paths | yes | yes | CORRECT ("build" mandate removed) |
| milestones/p1.mdx:31 | all four login routes mandatory | 0 relevant | DELETE "mandatory" (mandate, a certification rule; the count is now eight, applied) |
| milestones/p1.mdx:32 | several addresses, only one ABHA number | examples | CORRECT to "A user can hold several ABHA addresses." (the one-number rule has no source) |
| milestones/p1.mdx:43-46,50 | Self-Declared, no KYC | 0 | 0 | CORRECT ("no ABHA number linked") |
| milestones/p1.mdx:51 | KYC Verified result | yes | yes | CORRECT (`kycStatus` `VERIFIED`) |
| milestones/p1.mdx:75-77 | Link ABHA number; status becomes KYC Verified | yes | yes | QUESTION for the content session: keep, reword or delete? (status change deleted) |
| milestones/p1.mdx:81-82 | four routes all mandatory | 0 | DELETE "all of them mandatory" (mandate; the count was dropped with the default address row, applied) |
| milestones/p1.mdx:91-93 | resend 60 s; reset screen, refresh storage, multi profile | 0 | 0 | DELETE (timer and screen rules) |
| milestones/p1.mdx:99-103 | profile/card/QR table per KYC state, card fields | endpoints only | QUESTION for the content session: which rows of the per-KYC profile, card and QR table stay? (screen guidance; the calls exist in hiecm-p2.yaml) |
| milestones/p2.mdx:27-28 | HIP answers discovery in 10 s | 1 (ABHA face auth) | DELETE (timer) |
| milestones/p2.mdx:29-31 | never show already linked care context | UX rule 0 | DELETE (screen rule) |
| milestones/p2.mdx:32-33 | data transfer within 5 minutes of Pull Records | 0 | 0 | DELETE (timer) |
| milestones/p2.mdx:42-43 | QR code URL with HIP ID and context (share body has hip id and context; QR not in spec). Borderline API | yes / 0 | CORRECT, remove the QR code clause (static: the QR code is a facility artefact; the share body fields are already right) |
| milestones/p2.mdx:45-48 | show what is shared; specified consent wording | 0 | 0 | DELETE (screen copy) |
| milestones/p2.mdx:51 | facility responds within 30 s | 0 | 0 | QUESTION for the content session: keep, reword or delete? (timing dropped) |
| milestones/p2.mdx:55-57 | counter cannot be facility ID, HPID, HIP ID or HIP name | yes | yes | QUESTION for the content session: keep, reword or delete? (exclusions deleted) |
| milestones/p2.mdx:61-63 | search by name; only participating; HIP linked to HRP | 0 | CORRECT to "Search facilities by name." (participation and HRP rules have no source) |
| milestones/p2.mdx:72-74 | government programmes CoWIN, e-Sanjeevani... with programme field | 0 | 0 | DELETE (programme list is content; the programme field is absent from the P2 discover body) |
| milestones/p2.mdx:76-82 | error copy table | 0 | 0 | DELETE (screen copy) |
| milestones/p2.mdx:84 | records within 2 hours | 0 | 0 | DELETE (timer) |
| milestones/p2.mdx:95-96 | HealthDocumentRecord fallback rule | enum only | DELETE (FHIR fallback guidance; the spec carries the enum only) |
| milestones/p3.mdx:20-23 | every PHR must implement HIU | yes (term) | | CORRECT ("must" removed) |
| milestones/p3.mdx:32 | set up subscription at creation and first login | 0 | DELETE (when to set up a subscription, process) |
| milestones/p3.mdx:35 | user must be able to disable any time | yes | yes | CORRECT to "The user can disable a subscription." (the disable call exists; "any time" and "must" are rules) |
| milestones/p3.mdx:39 | ask consent before subscription | 0 | DELETE (consent screen rule) |
| milestones/p3.mdx:51-52 | ask user to confirm auto retrieval | 0 | DELETE (screen rule) |
| milestones/p3.mdx:57-59 | granted immediately; request per record after disable | partial | QUESTION for the content session: keep "granted immediately" and "a request per record after disable"? (behaviour not in the P3 spec) |
| milestones/p3.mdx:69 | revoke any time, stops immediately | yes | CORRECT to "The user can revoke a consent." (immediacy has no source) |
| milestones/p3.mdx:71-73 | tabs grouping of statuses | 0 | DELETE (screen grouping) |
| milestones/p3.mdx:87-88 | store long term, chronological | 0 | 0 | QUESTION for the content session: keep long term chronological storage as guidance? (storage guidance) |

## Page group 3

Pages: site/docs/hiecm/v3/ milestones/m1.mdx, registries/abha.md, concepts/phr.md, concepts/consent.md, registries/nhpr/index.md, registries/nhpr/hpr.md, registries/nhpr/hfr.md. Spec paths are under catalogue/openapi/hiecm/v3/, raw under catalogue/openapi/.raw/nha-2026-09-16/. Line numbers are after the edits.

### Applied

| File:line (after) | Before | After | Spec evidence (file:line or grep count) |
| --- | --- | --- | --- |
| m1.mdx:187 | Paragraph after the route table: "Enrolment from an identity document is not in it ... because the call is in the specification and people find it there." | Deleted (it exists only to point at the document enrolment call) | `byDocument` / `INVALID_DEMOGRAPHIC_DETAILS` 0 in specs and raw; no document path in hiecm-m1.yaml |
| m1.mdx:281 | demo_auth block: "the full name as per Aadhaar, the date of birth and the gender." | "... the date of birth, the gender, `stateCode` and `districtCode`." | hiecm-m1.yaml:648-654 demo_auth required: aadhaarNumber, name, gender, dateOfBirth, districtCode, stateCode |
| m1.mdx:293-294 | "...is not published; `INVALID_DEMOGRAPHIC_DETAILS` is the error the specification names." | "...is not published." | INVALID_DEMOGRAPHIC_DETAILS: specs 0, raw 0 |
| m1.mdx:304 | "Three calls carry it, and a fourth is named by NHA and is not in the specification this portal holds:" | "Four calls carry it:" | Update, list and KYC calls all in hiecm-m1.yaml (PATCH /v3/profile/account, GET /v3/enrollment/profile/children, profile/account request/otp and verify) |
| m1.mdx:306-309 | child block "first and last name, day, month and year of birth and gender, and the parent's ABHA number or ABHA address. The parent is authenticated first, and must be 18 or older." | "`name`, day, month and year of birth, gender and `parentConsent`. The parent is authenticated first, and must be 18 or older. The parent's user token goes in the `X-token` header." (18+ kept, see HANDOFF) | hiecm-m1.yaml:737-752 child required dayOfBirth, monthOfBirth, yearOfBirth, gender, name, parentConsent; hiecm-m1.yaml:876-880 X-token "X-token of Parent user" |
| m1.mdx:318-320 (was 326-360) | Section "Create an ABHA from a document, not recommended" with three LegacyAnchors, diagram and restricted-account paragraph | Section and heading removed. FLAG: every sentence documents an endpoint absent from the specs; no inbound links in site/, plugins/, skills-src/ | `byDocument` 0/0; no document enrolment path in hiecm-m1.yaml |
| m1.mdx:422 | "proves the person against Aadhaar, or against an identity document on the route NHA no longer recommends, and the number..." | "proves the person against Aadhaar, and the number..." | Same as above (clause names the removed route) |
| m1.mdx:392 | "The search response names the masked mobile..." | "The login OTP response names the masked mobile..." | raw M1 ABHA Collection.json:4580,7544,8080 `0161` message is the response of `/api/v3/profile/login/request/otp` |
| m1.mdx:516 | `CM->>S: POST /patient-share/v3/share on your bridge` | `CM->>S: POST /api/v3/hip/patient/share on your bridge` | hiecm-m2.yaml:4109 `/api/v3/hip/patient/share` |
| m1.mdx:524 | "or `FAILURE` with an `error` code and message." | "or `FAILED` with an `error` code and message." | hiecm-m2.yaml:1536 "(SUCCESS\|FAILED)" |
| m1.mdx:528 | "mobile number, address and a KYC photo." | "mobile number and address." | hiecm-m2.yaml:4195-4270 profile.patient: abhaNumber, abhaAddress, name, gender, day/month/yearOfBirth, address, phoneNumber; no photo field (photo 0 in hiecm-m2.yaml) |
| m1.mdx:528 | counter context "up to 20 alphanumeric characters" | "1 to 250 characters" ("never the facility id..." kept, see HANDOFF) | hiecm-m2.yaml:1554,4181 context pattern `{1,250}` |
| abha.md:54 | "created on the [HIE-CM](...) from mobile number, name, age and gender" | "created from mobile number, name, year of birth and gender" | hiecm-p1.yaml:44 `/abha/api/v3/phr/app/enrollment/enrol` (ABHA service, not HIE-CM); phrDetails.yearOfBirth hiecm-p1.yaml:92 |
| abha.md:60 | "- Letters, numbers and a dot are allowed." / "- It cannot begin with a number." | "- Letters, numbers, one optional dot and one optional underscore are allowed." (begin-with-number bullet deleted) | raw M1 ABHA Swagger 1.yaml:5 Abha Address Validation regex `(^[a-zA-Z0-9]+[.]?[a-zA-Z0-9]*[_]?[a-zA-Z0-9]+$)\|...`, starts alphanumeric |
| abha.md:64 | "Minimum length differs by flow. Validate against the error the endpoint returns rather than assuming one rule across all of them." | "- It is 8 to 18 characters long." | raw M1 ABHA Swagger 1.yaml:5 "between 8 to 18 characters long" |
| abha.md:69-70 | "Letters, digits and a single dot are allowed, and beyond that: - It cannot begin with a digit." | "Letters, digits, a single dot and a single underscore are allowed, and beyond that:" (bullet deleted) | Same regex |
| abha.md:82-84 | password "one uppercase letter, one lowercase letter, one digit and one symbol, no spaces," | "one uppercase letter, one digit and one special character from `!@#$^*_-`, no spaces," | raw M1 ABHA Swagger 1.yaml:5 Password Validation `^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$^*_-])[A-Za-z\d!@#$%^&*_-]{8,}$` |
| abha.md:112 | `Production  https://abha.abdm.gov.in/api/abha/v3/` | Deleted | abha.abdm.gov.in raw 0, specs 0 |
| phr.md:49 | "ABHA base URLs are `...abhasbx...` for sandbox and `https://abha.abdm.gov.in/api/abha/v3/` for production." | "The ABHA sandbox base URL is `https://abhasbx.abdm.gov.in/abha/api/v3/`." | abha.abdm.gov.in raw 0, specs 0 |
| phr.md:59 | ABHA number path "Aadhaar OTP or mobile OTP" | "Aadhaar OTP or ABHA OTP" | hiecm-p1.yaml:534,895 flows "OTP Request - ABHA OTP, OTP Request - AADHAR OTP"; tags "via ABHA Number-ABHA OTP" / "via ABHA Number-Aadhaar OTP" |
| phr.md:71-72 | "- Letters, numbers and a dot only." / "- Cannot begin with a number, and cannot begin or end with a dot." | "- Letters, numbers, one optional dot and one optional underscore." / "- Starts and ends with a letter or number, 8 to 18 characters long." | raw M1 ABHA Swagger 1.yaml:5 Abha Address Validation |
| phr.md:79-80 | password "one A to Z, one a to z, one digit, one symbol, no spaces" | "one A to Z, one digit, one special character from `!@#$^*_-`, no spaces" | raw M1 ABHA Swagger 1.yaml:5 Password Validation |
| phr.md:89 | Link ABHA number "validate by Aadhaar OTP or mobile OTP" | "validate by Aadhaar OTP or ABHA OTP" | hiecm-p2.yaml tags "Link ABHA Number / P2 - via ABHA OTP" and "P2 - via Aadhaar OTP" (the audit's "ABHA OTP" alone would drop the Aadhaar route, which the set has) |
| phr.md:132-133 | counter names "up to 20 alphanumeric characters, no special characters" | "1 to 250 characters, letters, digits and spaces, with `.`, `-` or `_` allowed inside the name" | hiecm-m2.yaml:1554, hiecm-p2.yaml:887 `^(?:[a-zA-Z0-9 ]\|[a-zA-Z0-9 ][a-zA-Z0-9.\\-_ ]*[a-zA-Z0-9 ]){1,250}$` |
| phr.md:238-240 | discovery "name, year or date of birth, gender, verified mobile number, ABHA address, and optionally a patient registration number" | "name, year of birth, gender, verified identifiers such as mobile number or ABHA address, and optionally unverified identifiers such as a medical record number" | hiecm-m2.yaml:3259-3383 discover patient: verifiedIdentifiers, unverifiedIdentifiers (MR, MOBILE, ABHA_NUMBER, ABHA_ADDRESS, EMAIL), name, gender, yearOfBirth; no dateOfBirth |
| consent.md:93 | `PATRQT` display "Self-Requested" | "Self Requested" | hiecm-m3.yaml:108,2466 `Self Requested` |
| consent.md:110 | HI type table of seven | `Invoice` row added | hiecm-m3.yaml:248,2435 hiTypes enum includes Invoice |
| consent.md:112 | "The M2 error message for an invalid HI type lists these seven and adds `Invoice`. The two disagree by one value, so check the swagger before you send `Invoice`." | Deleted | Same |
| consent.md:116 | "Past it, the record holder rejects the request: `ABDM-1061` for an expired consent artefact, `ABDM-1112` for an artefact id that is invalid or already expired." | Deleted | ABDM-1061, ABDM-1112: specs 0, raw 0 |
| consent.md:120 | "That returns `ABDM-1062`, consent not granted." | Deleted | ABDM-1062: specs 0, raw 0 |
| consent.md:120 (was 121) | "Read every code with the message the gateway returns. The error table lists `ABDM-1061` and `ABDM-1062` against two different messages each..." | Deleted | Same |
| nhpr/index.md:19 | "The HFR create call carries an HPR token in the header" | "...an HPR token in the `x-hprid-auth` header" | hiecm-m4.yaml:629 x-hprid-auth on /v1.5/facility/basic-information |
| nhpr/index.md:25 | "Both registries share one set:" | "Both registries share one base URL:" (grammar after the production row went) | n/a |
| nhpr/index.md:28 (was 29) | `Production  https://apinhpr.abdm.gov.in/v4/int/` | Deleted | apinhpr.abdm.gov.in raw 0, specs 0 |
| nhpr/index.md:31 | "The session token that authorises them comes from the HIE-CM gateway, not from NHPR." | "The calls take a bearer token in the `Authorization` header. NHPR issues a token through its own `POST /getManagementToken` call." | hiecm-m4.yaml:1821 /getManagementToken, 4010-4014 bearerAuth "The token from POST /getManagementToken" |
| nhpr/hpr.md:33 | "Sent as `hpId` or `hprIdNumber`" | "Sent as `hpid` or `hprIdNumber`" | hpId raw 0, specs 0; hiecm-m4.yaml:4394,5350 `hpid` |
| nhpr/hpr.md:62 | "Nine calls follow the gateway session token" | "Nine calls follow the management token" | hiecm-m4.yaml:1821, 4014 |
| nhpr/hpr.md:74 | "The last returns the HPID and an `hprToken`, which the next call needs." | "The last returns the HPID and a `token`, which the next call takes as `hprToken`." | hiecm-m4.yaml:4149-4152 CreateAccountJwtResponse.token; 2699 register body `hprToken` |
| nhpr/hpr.md:76 | "and it is the one HPR write call with a published path: `POST ...`" | "at `POST ...`" | hiecm-m4.yaml:2688 register-professional-new, 2825 update-professional-new (both have paths) |
| nhpr/hpr.md:88 | "carrying the gateway access token in the `Authorization` header" | "carrying the bearer token in the `Authorization` header" | hiecm-m4.yaml:4010-4014 bearerAuth |
| nhpr/hpr.md:93-94 | Row `By mobile OTP, log in | /v4/int/api/v2/auth/login/userAuthorizedToken` | Row deleted | userAuthorizedToken raw 0, specs 0 |
| nhpr/hpr.md:109 | "client id and client secret for the gateway session call" | "the username and password for the management token call" | hiecm-m4.yaml:5275-5281 LoginDTO username, password (request body of /getManagementToken) |
| nhpr/hfr.md:55 | "Basic facility information takes an **HPR token in the header** ... Submit facility takes an **`x-hpird-auth` token in the header**." | "...an **HPR token in the `x-hprid-auth` header** ... Submit facility takes **`x-hprid-auth` and `x-hprid-auth-verifier` headers**." | hiecm-m4.yaml:629, 861, 866; x-hpird-auth 0 |
| nhpr/hfr.md:65 | "Bridge linkage, facility search, nearby search, send OTP to contact" | "Bridge linkage, facility search, send OTP to contact" | hiecm-m4.yaml:958 bygeoLocation: HFRSearchWithinRadiusRequest and response carry no facilityId (fac_unique_id only) |
| nhpr/hfr.md:97 | `v1.5/facility/fetchfacilitytype` | `/v1.5/facility/fetch-facility-type` | hiecm-m4.yaml:1084; fetchfacilitytype 0 |
| m1.mdx:224, 237 | through the Aadhaar registered device (RD) service; participant Aadhaar RD service | in the ABHA app; participant ABHA app face capture | hiecm-m1.yaml:431 auth/init: face capture happens in the ABHA app |
| m1.mdx:n/a (was 291-292) | The specification calls the programmes that use this route integrated programmes. | (sentence deleted) | specs 0; raw hits are the integrated_program gateway role |
| m1.mdx:440 | mobile address path mandatory and optional demographics | (sentence deleted) | P1 phrDetails declares no required list |
| abha.md:38 | face capture through the Aadhaar RD service | face capture in the ABHA app | hiecm-m1.yaml:431 |
| abha.md:n/a (was 62, 73-74) | all numeric address bullets | (bullets deleted) | raw M1 ABHA Swagger 1.yaml:5 address regex does not forbid all digits |
| abha.md:83 | one special character from `!@#$%^&*-` | one special character from `!@#$^*_-` | raw M1 ABHA Swagger 1.yaml:5 lookahead `(?=.*[!@#$^*_-])` |
| phr.md:78 | one special character from `!@#$%^&*-` | one special character from `!@#$^*_-` | same |
| phr.md:n/a (was 61-63), n/a (was 69) | mobile path mandatory fields; "All numeric is allowed only for the `14digit@abdm` form" | (deleted) | no required list; address regex |
| phr.md:31, 89, n/a (was 95), 95 | default `14digit@abdm` login; "All four routes"; default address row; ABHA number "Mobile OTP or Aadhaar OTP" | removed; "All these routes"; row deleted; "ABHA OTP or Aadhaar OTP" | hiecm-p1.yaml:1785-1795 |
| phr.md:93 | name@abdm: Password, mobile OTP or Aadhaar OTP, by auth mode | Password, mobile OTP or email OTP, by the auth methods the address supports | hiecm-p1.yaml:1713-1715 (as p1.mdx:87) |
| phr.md:147-148, 204-205 | four notification events | a care context is linked or updated | hiecm-subscription.yaml:1217 |
| phr.md:150 | types of visit | purpose, categories | hiecm-p3.yaml approve body purpose 497, categories 556; visit 0 |
| phr.md:247-248 | with a programme specific optional field such as the PMJAY ID or the CoWIN registered mobile number | (clause deleted; programme list left in handoff) | P2 discover body carries `hip` and `unverifiedIdentifiers` only |
| consent.md:72-73 | approve, reject and ignore. An ignored request | grant, deny, or let it expire (`GRANTED`, `DENIED`, `EXPIRED`). An unanswered request | hiecm-m3.yaml:2095-2104 |
| nhpr/index.md:31 | NHPR issues a token through its own `POST /getManagementToken` call. | M4 declares bearer authentication. The HPID calls publish `POST /getManagementToken`. | raw M4-HPID.json only; scripts/ingest-nha.mjs TOKEN_SOURCE.m4 reworded to match |
| nhpr/hfr.md:27 | two mandatory photographs | two photographs | no required list on the photograph fields |
| nhpr/hfr.md:55, 57 | Obtain both; Both come from a person | Obtain them; They come from a person | three headers named on the page (hiecm-m4.yaml:629, 861, 866) |
| nhpr/hfr.md:82 | ABDM enabled | `abdmSoftware` (ordering left in handoff) | hiecm-m4.yaml bygeoLocation request filter `abdmSoftware` |

### Handoff

| File:line (after) | Claim | raw hits | spec hits | Audit's suggested action |
| --- | --- | --- | --- | --- |
| m1.mdx:84-91 | "Mandatory" per build step; demo auth mandatory for government | 0 | 0 | QUESTION for the content session: keep, reword or delete? (annotations removed) |
| m1.mdx:93-95 | Everything else optional for both; split on API reference | 0 | 0 | DELETE (mandate table residue, certification) |
| m1.mdx:105-108 | No M1 certification; one exit process, four steps | 0 | 0 | DELETE (certification process) |
| m1.mdx:126,134,428,486,488 | Self-Declared / KYC Verified labels, heading "What Self-Declared costs" | 0; 0 (kycStatus 145/43) | 0; 0 | KEEP (concern); consolidation rewrote to "KYC on the profile: Verified / None" |
| m1.mdx:129 | Link `#which-creation-route-you-must-build` | - | - | QUESTION for the content session: keep, reword or delete? (retarget) |
| m1.mdx:151 | Flowchart "government integrators only" for demo auth | 0 | 0 | QUESTION for the content session: keep, reword or delete? (label trimmed) |
| m1.mdx:179-187 | Private/government route table and heading | 0 | 0 | DELETE (private and government integrator table) |
| m1.mdx:255 | PID block encrypted by the device and expires | 0 | 0 | DELETE (device behaviour, not in the set) |
| m1.mdx:261 | Government integrators build demo auth, private do not | 0 | 0 | DELETE (integrator category rule) |
| m1.mdx:281 | "full name as per Aadhaar" | - | - | CORRECT to "full name" (the as-per-Aadhaar qualifier has no source) |
| m1.mdx:287-288 | Claiming an address mandatory on other routes, optional here | 0 | 0 | DELETE (mandate) |
| m1.mdx:288-290 | Default address is 14 digits @sbx/@abdm | 0 | 0 | DELETE (default address rule, not in the spec) |
| m1.mdx:300-302 | Child ABHA on NHA leadership approval | 0; "approved by NHA" 6 | 0; 6 | QUESTION for the content session: keep, reword or delete? (tag wording) |
| m1.mdx:308-309 | Parent must be 18 or older | 0 | 0 | QUESTION for the content session: keep, reword or delete? (18+ deleted) |
| m1.mdx:316-317 | Refusal: parent under 18 | 0 | 0 | DELETE (refusal behaviour, not in the spec) |
| m1.mdx:367 | API reference lists which routes are mandatory | 0 | 0 | DELETE (the API reference lists no mandatory routes) |
| m1.mdx:394 | Do not send to a remote encryption helper or third party site (borderline API: advice, not an endpoint claim) | 0 in final set | 0 | DELETE (static: advice about where to encrypt; it names no endpoint or field) |
| m1.mdx:447 | Second address is the most common failure | 0 | 0 | DELETE (frequency claim) |
| m1.mdx:505 | QR URL with two parameters, `OPD1` | 0 | 0 | DELETE (QR URL shape, not in the set) |
| m1.mdx:526 | App holds screen 30 seconds | 0 | 0 | DELETE (timer) |
| m1.mdx:528 | Context never the facility id, HIP id or HIP name | 0 | 0 | DELETE (counter naming rule; the context pattern is applied) |
| m1.mdx (Concerns 6) | Journey-step links into the generated api tree may break on the next reorder | - | - | Concern only (route stability; no page change asked) |
| abha.md:29 | Luhn check digit, Verhoeff for Aadhaar (section) | 0 | 0 | DELETE (checksum algorithms, not in the set) |
| abha.md:35-40 | Private/government Mandatory/Optional columns | 0 | 0 | DELETE (columns) |
| abha.md:42 | Aadhaar OTP mandatory for everyone | 0 | 0 | DELETE (mandate) |
| abha.md:46 | Under six, legal guardian, from birth | 0 | 0 | DELETE (child ABHA policy, not in the spec) |
| abha.md:46 | Govt integrators approved by NHA leadership | 6 / 0 | 6 / 0 | CORRECT ("leadership" dropped) |
| abha.md:46 | UWIN, RCH, POSHAN | 0/0/2 | - | DELETE (programme names, not in the set) |
| abha.md:46 | Private integrators cannot use it | 0 | 0 | DELETE (integrator category rule) |
| abha.md:52 | `@sbx` sandbox / `@abdm` production mapping | 42/30 | - | QUESTION for the content session: keep, reword or delete? (env mapping) |
| abha.md:52 | Example `91**********27@sbx` | 0 | 0 | DELETE (example value with no source) |
| abha.md:54 | "self declared" label | 0 | 0 | consolidation (labels) |
| abha.md:63, 76-80 | 10 digit mobile restricted; three shapes that do not work | 0 | 0 | DELETE (address policy beyond the regex) |
| abha.md:68 | "NHA validates the address on creation" (voice) | 0 | 0 | DELETE ("NHA validates" reworded) |
| abha.md:84-86 | Password: no more than two consecutive characters or keyboard keys; enforcement optional | 0 | 0 | CORRECT (rule to Swagger set) |
| abha.md:89 | NHA asks suggestions from name and email | 0 | 0 | DELETE (voice, and the suggestion inputs have no source) |
| abha.md:118 | All four login methods mandatory | 0 | 0 | DELETE (mandate) |
| phr.md:31 | Log in with default `14digit@abdm` | 0 | 0 | QUESTION for the content session: keep, reword or delete? (row trimmed) |
| phr.md:58-59, 88-90, 112-116 | Self-Declared / KYC Verified labels | 0 | 0 | CORRECT ("No KYC" / "KYC verified") |
| phr.md:67 | ABDM wants one address per person | 0 | 0 | DELETE (policy, not in the set) |
| phr.md:73-78 | 14digit all numeric, 10digitmobile blocked, 14digit login, env suffix undocumented | 0 | - | CORRECT to "Starts and ends with a letter or number, 8 to 18 characters long, and ends in `@abdm` or `@sbx`." for the remaining `10digitmobile` and `14digit` bullets (policy beyond the regex; the all numeric bullet is applied) |
| phr.md:80-81 | Password: no more than 2 consecutive, validation now optional | 0 | 0 | QUESTION for the content session: keep, reword or delete? (M1 regex) |
| phr.md:94 | All four login routes mandatory | 0 | 0 | DELETE "mandatory" (mandate; the count is applied) |
| phr.md:103 | Resend OTP after 60 seconds | 0 | 0 | DELETE (timer) |
| phr.md:103-104 | Reset password screen, confirmation message | 0 | 0/2 | DELETE (screen rule) |
| phr.md:110-116 | Green tick, exclamation, card PDF contents, sample `91-0098-2416-3421`, editable fields by status | 0 | 0 | CORRECT (table cut to profile, PHR card call, QR code call) |
| phr.md:125-127 | ABDM specified consent wording | 0 | 0 | QUESTION for the content session: what consent wording, if any, stays? (screen copy, not in the set) |
| phr.md:129 | Facility responds within 30 seconds | 0 | 0 | CORRECT ("Waits for the facility's response") |
| phr.md:133-135 | Counter name examples and exclusions (HFR ID, HPID, HIP ID, HIP name) | 0 | 0 | DELETE (counter naming rule) |
| phr.md:137-138 | Third party scanner behaviour | 0 | 0 | DELETE (third party scanner behaviour, not in the set) |
| phr.md:147-149 | Set up subscription at creation / new login, ask consent | 0 | 0 | DELETE (process) |
| phr.md:153 | Firebase | 0 | 0 | DELETE (vendor example) |
| phr.md:179 | Sharing stops immediately | 0 | 0 | QUESTION for the content session: keep, reword or delete? (revoke description) |
| phr.md:181-183 | Consents/Subscriptions tab grouping | 0 | 0 | QUESTION for the content session: keep, reword or delete? (five states plainly) |
| phr.md:197-198 | Chronological order | 0 | 0 | DELETE (storage guidance) |
| phr.md:206-208 | NHA expects subscription at two moments | 0 | 0 | DELETE (voice and process) |
| phr.md:214-222 | Same five states for health locker requests; Group column (lockers exist in hiecm-p4.yaml, so not contradicted) | yes | yes | QUESTION for the content session: keep, reword or delete? (locker dropped, Group column dropped) |
| phr.md:222 | Expired inside requester's window | 0 | 0 | CORRECT to "`EXPIRED` when nobody answers" (the window is a timer) |
| phr.md:241 | HIP responds within 10 seconds | 1 | - | DELETE (timer) |
| phr.md:243-245 | Hide linked contexts, message copy | 0 | 0 | DELETE (screen rule) |
| phr.md:251-253 | CoWIN, AB-PMJAY, e-Sanjeevani, RCH, programme fields (borderline API: programme specific fields) | 0 / yes | - | QUESTION for the content session: keep the programme list (CoWIN, AB-PMJAY, e-Sanjeevani, RCH)? (programme names are content; the programme field clause is applied) |
| phr.md:255-261 | Failure copy table | 0 | 0 | DELETE (screen copy) |
| phr.md:263-264 | 5 minutes, 2 hours | 0 | 0 | DELETE (timers) |
| phr.md:266-278 | Deep links section, hipcode, random order, store URLs (borderline API: deep link URL shape) | 0 | 0 | DELETE (static: deep link sections describe app store listing and URL handling, which no spec carries) |
| phr.md:283-288 | Device types, HealthDocumentRecord fallback | 0 | 0 | QUESTION for the content session: keep device types and the `HealthDocumentRecord` fallback? (FHIR guidance; the spec carries the enum only) |
| consent.md:34 | States in two PHR sections | yes | m3:2157-2161 | QUESTION for the content session: keep, reword or delete? (sections unsourced) |
| consent.md:51 | Expired inside window the HIU set | 0 | 0 | CORRECT to "`EXPIRED` when nobody answers" (timer) |
| consent.md:54 | Request window clock set by HIU | 0 | 0 | QUESTION for the content session: does the request window stay? (timer; the M3 request carries no request expiry field) |
| consent.md:58 | Request "must display" fields | 0 | - | CORRECT ("carries") |
| consent.md:62-64 | NHA sets a floor of five capabilities | 0 | - | QUESTION for the content session: keep, reword or delete? (voice) |
| consent.md:78-80 | Sharing stops immediately | 0 | 0 | QUESTION for the content session: keep, reword or delete? (revoke description) |
| consent.md:84 | Subset of HL7 PurposeOfUse, terminology.hl7.org | 0 | 0 | DELETE (terminology source, not in the set) |
| consent.md:95 | Source table prints rows twice; patient reads code | 0 | - | DELETE (describes the source document, voice) |
| consent.md:101-110 | HI type display column (incl. "Record artifact") | 0 | 0 | QUESTION for the content session: keep, reword or delete? (display column removed) |
| consent.md:118 | Future sharing must stop immediately | 0 | 0 | DELETE (behaviour, not in the set) |
| consent.md:120 | Retention undocumented; "Sharing stops." | 0 | 0 | DELETE (retention, not in the set) |
| nhpr/index.md:19 | HPR token "generated from an HPR ID and password" | - | - | KEEP (the header is corrected to `x-hprid-auth`; the password clause stands under controller ruling (b), POST /api/v1/auth/authPassword at hiecm-m4.yaml:1456) |
| nhpr/hpr.md:17 | Three categories, more later | yes | yes | CORRECT ("Categories include") |
| nhpr/hpr.md:17 | Systems incl. Ayurveda, Homoeopathy, Sowa-Rigpa | 0 | 0 | QUESTION for the content session: which systems of medicine to name? (master data values, not in the M4 spec) |
| nhpr/hpr.md:17-23 | Role codes 1/2/3 table | 0 | 0 | QUESTION for the content session: keep, reword or delete? (table deleted; facility_manager in hprType) |
| nhpr/hpr.md:25 | No role 2/3 means no facility | 0 | 0 | DELETE (role code rule) |
| nhpr/hpr.md:29 | 14 digit | 0 | - | QUESTION for the content session: keep, reword or delete? (digit count dropped) |
| nhpr/hpr.md:33 | Sample `71-2665-5777-XXXX` | 0 | 2 | CORRECT (raw example `71-1********-0212`) |
| nhpr/hpr.md:50 | Degree code must agree with both | 0 | 0 | DELETE (master data rule, not in the spec) |
| nhpr/hpr.md:52-54 | Subcategory codes differ between tables | 0 | 0 | DELETE (master data rule, not in the spec) |
| nhpr/hpr.md:56 | SMD null for nurses | 0 | 1 | DELETE (master data rule, not in the spec) |
| nhpr/hpr.md:78-82 | Aadhaar link valid 5 minutes; certificates mandatory; demographicAuthViaMobile first; "Three things to know first" | 0 | 0 | DELETE (timer, document mandate, call order rule) |
| nhpr/hpr.md:106 | Registry rejects display values | 0 | 0 | DELETE (validation behaviour, not in the spec) |
| nhpr/hpr.md:109 | Three fields encrypted, RSA/ECB/PKCS1Padding for NHPR, M1 uses OAEP | 1 | 0 | DELETE (cipher has 0 hits in hiecm-m4.yaml; crypto prose) |
| nhpr/hpr.md:111 | 1 MB / 5 MB, png jpeg jpg PDF | 0 | 0 | DELETE (file limits, not in the spec) |
| nhpr/hfr.md:19 | Licence renewals, empanelment benefits | 0 | 0 | DELETE (benefits prose) |
| nhpr/hfr.md:31 | Mandatory by type, bed count > 0, exemptions | field names only | - | DELETE (per-type rules) |
| nhpr/hfr.md:35 | Only codes accepted, else validation fails | 0 | - | DELETE (validation behaviour) |
| nhpr/hfr.md:42 | Unique identification number until submit | 0 | - | DELETE (identifier lifecycle, not in the spec) |
| nhpr/hfr.md:47-49 | Not submitted stays draft, goes nowhere | 1 | 1 | QUESTION for the content session: keep, reword or delete? (kept Draft status) |
| nhpr/hfr.md:51 | Update by resending with ID | 0 | - | DELETE (update process, not in the spec) |
| nhpr/hfr.md:57 | Facility manager rights, role 2 or role 3 (consolidation: "with facility manager rights" goes) | 0 | 0 | QUESTION for the content session: keep, reword or delete? (removed role codes) |
| nhpr/hfr.md:66 | Dedup 6 digit, labelled facility unique ID (Concerns 4: `69765` example) | yes | yes | QUESTION for the content session: keep, reword or delete? (numeric, example) |
| nhpr/hfr.md:74 | HIP name 15 chars, no specials, unique, XYZ BRIDGE | 0 | 0 | DELETE (HIP name rules, not in the schema) |
| nhpr/hfr.md:81 | Fuzzy name, exact others | 0 | - | CORRECT to "Search by name and the other filters." (match behaviour, not in the spec) |
| nhpr/hfr.md:82 | Nearby filter "ABDM enabled" vs `abdmSoftware` (borderline API), nearest first | yes | yes | DELETE "Results are ordered nearest first" (ordering behaviour, not in the spec; the `abdmSoftware` filter is applied) |
| nhpr/hfr.md:83 | OTP proves control of a facility record | yes | yes | QUESTION for the content session: keep, reword or delete? (purpose dropped) |

## Page group 4

Paths below are relative to site/docs/. Specs are catalogue/openapi/hiecm/v3/. Line numbers are after the edits.

### Applied

| File:line (after) | Before | After | Spec evidence (file:line or grep count) |
| --- | --- | --- | --- |
| hiecm/v3/concepts/callback-authenticity.md:20 | certs endpoint "needs no token" | "needs an access token" | hiecm-gateway.yaml:1854-1860 `security: bearerAuth` on /certs |
| hiecm/v3/concepts/callback-authenticity.md:23 | "Which header carries the signed token is not published. Log the headers..." | "The token arrives in the `Authorization` header as a bearer token." | hiecm-m2.yaml webhooks 10 ops / 11 bearerAuth, hiecm-m3.yaml webhooks 5 ops / 6 bearerAuth; bearerAuth is http bearer JWT (hiecm-m2.yaml:4788-4792) |
| hiecm/v3/concepts/callback-authenticity.md:53-54 | "You do not need an access token... declares no security" | "You need an access token for this. The certificates endpoint declares bearer authentication and a required `X-CM-ID` header" | hiecm-gateway.yaml:1859-1860 bearerAuth, :1875-1881 X-CM-ID required, example sbx |
| hiecm/v3/concepts/callback-authenticity.md:61,64 | curl with REQUEST-ID and TIMESTAMP only | adds `Authorization: Bearer <ACCESS_TOKEN>` and `X-CM-ID: sbx` | hiecm-gateway.yaml:1859-1881 |
| hiecm/v3/concepts/callback-authenticity.md:86-90 | caution "The header is not published... None of the webhook definitions... declares a header or a security scheme" plus "Two things follow. Confirm the header name... treat this page as unconfirmed" | note "The header is declared": every M2 and M3 webhook declares bearer authentication, token in `Authorization`; "Two things follow" paragraph deleted (existed only for the false premise) | same as :23 |
| hiecm/v3/concepts/callback-authenticity.md:84 | Heading "What this documentation cannot yet tell you" | "Which header carries the token" (controller ruling b; no inbound links to the old anchor in site/docs, site/src, site/static, skills-src, plugins) | follows the :86-90 note correction |
| hiecm/v3/concepts/callback-authenticity.md:103-104 | "the `REQUEST-ID` matches a request you sent" | "its `response.requestId` matches the `REQUEST-ID` of a request you sent" | hiecm-m2.yaml:2710-2717 (webhook body response.requestId "The requestId that was passed") |
| hiecm/v3/concepts/callback-authenticity.md:118-120 | "The header is not declared in any specification here, so log every header" | "The webhook definitions declare bearer authentication, so read the `Authorization` header" | same as :23 |
| hiecm/v3/concepts/participants/doctor.md:27 | `hpId` | `hpid` | hiecm-m4.yaml:57, :1824 `hpid`; `hpId` 0 in specs |
| hiecm/v3/concepts/participants/doctor.md:49 | `x-hpird-auth` | `x-hprid-auth` | hiecm-m4.yaml:629 (/v1.5/facility/basic-information), :861 (/v1.5/facility/submit-facility) |
| hiecm/v3/concepts/participants/lab.md:26 | "yes or no flags" | "flags" | hiecm-m4.yaml:5013-5025 `^(YALL|YIN|N)$` |
| hiecm/v3/concepts/participants/pharmacy.md:26-27 | "a yes or no flag" | "a flag" | hiecm-m4.yaml:5016 hasPharmacy `^(YALL|YIN|N)$` |
| hiecm/v3/concepts/participants/pharmacy.md:n/a (was 46-50) | warning "Check the swagger before you send `Invoice`... missing from the M3 list" | deleted | hiecm-m3.yaml:248, :2435 `- Invoice` |
| hiecm/v3/concepts/participants/phr.md:41 | "four login routes" | "eight login routes" | hiecm-p1.yaml:1785 "8 flows" on login verify |
| hiecm/v3/getting-started/build-it-well.mdx:21 | "four error shapes" | "several error shapes" | audit: 6+ distinct 4xx shapes in hiecm-m1.yaml |
| hiecm/v3/getting-started/build-it-well.mdx:34 | ABHA address "8 to 18 characters... then `@` and the domain" | "then `@` and the domain" removed | raw M1 ABHA Swagger 1.yaml:5 Abha Address Validation regex has no `@`, length 8 to 18 |
| hiecm/v3/getting-started/build-it-well.mdx:35 | Mobile "10 digits, no country code and no `+`" | "10 digits, the first from 1 to 9, with an optional `+91` or `0` in front" | raw M1 ABHA Swagger 1.yaml:5 `(\+91|0)?[1-9][0-9]{9}` |
| hiecm/v3/getting-started/build-it-well.mdx:37 | "A fresh UUID version 4" | "A fresh UUID" | raw M1 ABHA Swagger 1.yaml:5 UUID regex `[1-5]` version; hiecm-m1.yaml:148 format uuid |
| hiecm/v3/getting-started/build-it-well.mdx:48-49 | "[four different error shapes]... only two of them carry a code. Parse for all four" | "[several different error shapes]... only some of them carry a code. Parse for all of them" | as :21 |
| hiecm/v3/getting-started/build-it-well.mdx:106 | "The search response names the mobile the OTP went to" | "The OTP request response names the masked mobile the OTP went to" | hiecm-m1.yaml:2002-2110 search response has no mobile; :3642 request/otp "OTP is sent to Mobile number ending with ******0903" |
| hiecm/v3/getting-started/build-it-well.mdx:119 | "profile returned thirty" | "profile returned twenty eight" | hiecm-m1.yaml:4462-4600 GET /abha/api/v3/profile/account 200 has 28 top level properties |
| hiecm/v3/getting-started/build-it-well.mdx:130 | "as `M`, `F` or `O`" | "for example `M` or `F`" | hiecm-m1.yaml:4499-4501 gender example M; `O` 0 |
| hiecm/v3/getting-started/build-it-well.mdx:132 | address row incl `townName` | `townName` removed | not a top level property of the 200 schema (only under localizedDetails) |
| hiecm/v3/getting-started/build-it-well.mdx:133 | `stateCode`, `districtCode`, `subDistrictCode` | `subDistrictCode` removed | absent from the 200 schema property list |
| hiecm/v3/getting-started/build-it-well.mdx:148 | "Several of these fields are nullable, and `villageName`, `wardName` and `townName` are commonly null" | "Several of these fields can come back null" | villageName, townName only under localizedDetails; wardName absent from M1 response |
| hiecm/v3/getting-started/build-with-ai.mdx:71 | "Callbacks are how the answer arrives, from M2 onward" | "in M2 and M3" | hiecm-m4.yaml has no `webhooks:` key; m2:2648, m3:1677 do |
| hiecm/v3/getting-started/sandbox.mdx:67-68 | "every callback carries the `REQUEST-ID` you sent on the original call" | "each callback that answers a call carries the `REQUEST-ID` you sent on it in `response.requestId`" | hiecm-m2.yaml:2710-2717, :1594, :2304 "The requestId that was passed" |
| hiecm/v3/getting-started/going-live.mdx:81 | production cell `https://apis.abdm.gov.in`, `X-CM-ID: abdm` | `https://apis.abdm.gov.in` | X-CM-ID examples in hiecm-gateway.yaml all `sbx` (10); "abdm" as header value 0/0 |
| hiecm/v3/getting-started/going-live.mdx:82 | ABHA service row, production cell `https://abha.abdm.gov.in/api/abha/v3/` | row kept with sandbox `https://abhasbx.abdm.gov.in/abha/api/v3/`; production cell "Not in the specification" (controller ruling a) | abha.abdm.gov.in raw 0, specs 0; abhasbx.abdm.gov.in in hiecm-m1.yaml servers (1) |
| hiecm/v3/milestones/index.mdx:124 | "logs in four different ways" | "logs in eight different ways" | hiecm-p1.yaml:1785 "8 flows" |
| hiecm/v3/concepts/callback-authenticity.md:4, 18, 37-38 | ABDM signs what it sends / signs its callbacks | ABDM authenticates what it sends / callbacks declare bearer authentication | hiecm-m2.yaml:4788-4792 bearerAuth http bearer JWT |
| hiecm/v3/concepts/participants/citizen.md:27-28 | age | year of birth | hiecm-p1.yaml:92 phrDetails.yearOfBirth |
| hiecm/v3/concepts/participants/doctor.md:48-49 | create call takes an HPR token in the header, submit takes `x-hprid-auth` | Both calls take `x-hprid-auth`, and submit also takes `x-hprid-auth-verifier` | hiecm-m4.yaml:629, 861, 866 |
| hiecm/v3/concepts/participants/phr.md:55 | created or updated | linked or updated | hiecm-subscription.yaml:1217 |
| hiecm/v3/getting-started/build-it-well.mdx:128-130, 138-143 | Only on a Self-Declared profile; KYC verified profile; Self-Declared profile ... becomes KYC verified in place | Only when `kycVerified` is false; profile with `kycVerified` true; profile with `kycVerified` false was not proved against Aadhaar, so it is correctable | hiecm-m1.yaml profile/account 200 `kycVerified` |
| hiecm/v3/getting-started/build-with-ai.mdx:57 | Those exist for M1 to M3, the milestones the catalogue has flows and errors for. | Every module skill carries both, under its `references/`. | plugins/abdm-integrators-assistant/skills/abdm-*/references/scaffold.md and debug.md in all 11 module skills |
| hiecm/v3/getting-started/first-fifteen-minutes.mdx:52 | usually means the credentials or the `X-CM-ID` header | means the request was not authorised | hiecm-gateway.yaml:245 401 Unauthorized; X-CM-ID as a cause 0 |
| hiecm/v3/getting-started/going-live.mdx:82 | production cell "Not in the specification" | cell left empty, as hip-hiu.md:32 | table convention for an absent value |
| hiecm/v3/milestones/index.mdx:124 | and her family members | (clause deleted) | family: 0 in every spec |
| whats-new/2026-09-16.mdx:23 | every way to log in has its own sequence | every way to log in that the specification carries has its own sequence | hiecm-m1.yaml has no password login; journeys/m1.yaml walks every creation and login flow it carries |
| whats-new/2026-09-16.mdx:29 | Each module's errors page lists the codes | Seven modules have an errors page, and each lists the codes | scripts/build-api-reference.mjs:387 errors page only when the spec has error examples or webhooks: m1, m2, m3, p1, p2, scan-and-pay, subscription |
| catalogue/shared (atoms) sandbox/first-fifteen-minutes.md:73, sandbox/going-live.md:91-93, glossary/sandbox.md:30-31, glossary/gateway.md:38-39 | `abdm` X-CM-ID, abha.abdm.gov.in, apissbx.abdm.gov.in | removed; dev.abdm.gov.in only | same evidence as gateway.md:58 and going-live.mdx:81-82 |

### Handoff

| File:line (after) | Claim | raw hits | spec hits | Audit's suggested action |
| --- | --- | --- | --- | --- |
| _glossary/_hiecm.mdx:90 | Purpose codes are a subset of HL7 v3 PurposeOfUse | 0 | 0 | CORRECT to "The codes are ..." (unsourced, not contradicted) |
| _glossary/_shared.mdx:18 | ABHA address is "self-declared" | 0 | 0 | CORRECT, remove "self-declared" (KYC label wording) |
| _glossary/_shared.mdx:34 | HTC reviews integrations for production onboarding | 0 (13 base64 noise) | 2 (noise) | KEEP flagged (onboarding process, not in the final set) |
| _glossary/_shared.mdx:54 | Demographic authentication "for government entities only" | 18 (none relevant) | 16 | DELETE clause (business guidance) |
| _glossary/_shared.mdx:66 | ABHA OTP valid for 10 minutes, stated generally | 1 | 6 | KEEP flagged (Concern 9: sourced only for Find ABHA; timer) |
| _glossary/_shared.mdx:72-74, 88-90 | Safe to Host, WASA, CERT-In auditor | 0/0/0 | 0/0/0 | KEEP flagged (onboarding process, not in the final set) |
| _glossary/_shared.mdx:82 | txnId "short lived and single purpose", "stops working once the flow finishes or expires" | 0 | 0 | DELETE both clauses (timer, unsourced) |
| hiecm/v3/concepts/participants/citizen.md:24 | Address: "or you are issued a default" | 0 relevant | suggestion API only | CORRECT to "You choose it" (a default address is not in the spec) |
| hiecm/v3/concepts/participants/citizen.md:28 | Profile "self declared and carries no KYC" | 0 | 0 | DELETE (KYC label) |
| hiecm/v3/concepts/participants/citizen.md:46-47 | Revoking stops sharing "immediately" | 0 | 0 | CORRECT, remove "immediately" (timing has no source) |
| hiecm/v3/concepts/participants/doctor.md:27 | HPID sample `71-2665-5777-XXXX` | 0 | 0 | CORRECT to `71-1********-0212` (example value) |
| hiecm/v3/concepts/participants/doctor.md:30-32 | Role code 1/2/3 meanings | 0 | 0 | DELETE (role codes) |
| hiecm/v3/concepts/participants/doctor.md:44-45 | Degree and registration certificate "Both are mandatory" | 0 | 0 | CORRECT, remove "Both are mandatory" (document mandate) |
| hiecm/v3/concepts/participants/doctor.md:48-50 | "With role 2 or role 3"; "create call takes an HPR token in the header" | 0 | 0 | CORRECT, remove "With role 2 or role 3" (role guidance; the header wording is applied) |
| hiecm/v3/concepts/participants/doctor.md:62-63 | Blocked until someone with "facility manager rights" exists | 0 | 0 | CORRECT to "a person with an HPR ID" (role guidance) |
| hiecm/v3/concepts/participants/hospital.md:22 | "a 6 digit value on deduplicate search" | 3 | 4 | CORRECT to "a numeric value such as `69765`" (example value) |
| hiecm/v3/concepts/participants/hospital.md:35-37 | A clinician needs facility manager rights before registering | 0 | 0 | CORRECT to "registering the facility needs one of them" (role guidance) |
| hiecm/v3/concepts/participants/hospital.md:48 | "This is mandatory for every HIP" | 0 | 0 | DELETE (mandate) |
| hiecm/v3/concepts/participants/hospital.md:49-50 | "Validate the consent, then encrypt, sign and push ... inside the 20 minute window" | 0 | 0 | CORRECT to "Encrypt and push the records." (timer, who validates consent) |
| hiecm/v3/concepts/participants/hospital.md:55-57 | HFR benefits: trusted identity, search listing, licence, empanelment | 0 | 0 | DELETE (and drop "On the exchange itself,") |
| hiecm/v3/concepts/participants/insurer.md:31-34 | HFR lists hospitals, clinics, labs, imaging, pharmacies, blood banks | Hospital, Blood Bank, Imaging Center only | same | CORRECT to "facility types such as hospitals, imaging centres and blood banks" (facility type list) |
| hiecm/v3/concepts/participants/insurer.md:35-36 | M4 is required for an HIU | 0 | 0 | CORRECT to "Ask which entry you register against before you plan M4 work." (role guidance) |
| hiecm/v3/concepts/participants/lab.md:19-21 | HFR lists diagnostic labs and imaging alongside hospitals, clinics, pharmacies | Imaging Center, Hospital only | same | DELETE clause (facility type list) |
| hiecm/v3/concepts/participants/lab.md:27-29 | Imaging or diagnostic centre need not submit infrastructure or bed counts | 0 | 0 | DELETE (per-type rules, not in the M4 schema) |
| hiecm/v3/concepts/participants/lab.md:42-44 | All eight record types mandatory for an HMIS | 0 | 0 | DELETE (mandate) |
| hiecm/v3/concepts/participants/lab.md:46-47 | Split CT/MRI and stream inside the 20 minute window | 0 | 0 | DELETE paragraph (timer) |
| hiecm/v3/concepts/participants/lab.md:55-57 | Registry benefits list | 0 | 0 | DELETE (benefits prose) |
| hiecm/v3/concepts/participants/nha.md:34 | Facility ID for hospital, clinic, laboratory, imaging centre or pharmacy | Hospital, Imaging Center, Blood Bank | same | CORRECT to "hospital, imaging centre, blood bank or other facility" (facility type list) |
| hiecm/v3/concepts/participants/nha.md:37 | Sandbox gives test identities and milestone certification | 14/0 | 3/0 | CORRECT to "Client credentials" (process) |
| hiecm/v3/concepts/participants/nha.md:53-54 | "One certification path covers going live" | 0 | 0 | DELETE (certification) |
| hiecm/v3/concepts/participants/pharmacy.md:20-21 | HFR lists pharmacies alongside hospitals, clinics, labs | no Pharmacy type | no | DELETE clause (facility type list) |
| hiecm/v3/concepts/participants/pharmacy.md:26 | Pharmacy appears "as a facility type" | no Pharmacy type | no | CORRECT to "as pharmacy details in the detailed information layer" (facility type list; flag half applied) |
| hiecm/v3/concepts/participants/pharmacy.md:28-29 | Pharmacy need not submit infrastructure or bed counts | 0 | 0 | DELETE (per-type rules, not in the M4 schema) |
| hiecm/v3/concepts/participants/pharmacy.md:43-44 | Prescription Record follows Pharmacy Council of India guidelines | 0 | 0 | KEEP flagged (FHIR profile scope) |
| hiecm/v3/concepts/participants/pharmacy.md:53-56 | Registry benefits list | 0 | 0 | DELETE (benefits prose) |
| hiecm/v3/concepts/participants/phr.md:34-35 | Deep link listing: app name, Play Store URL, App Store URL at sandbox exit | 0 | 0 | DELETE paragraph (process) |
| hiecm/v3/concepts/participants/phr.md:45-46 | Accepting uploads makes you a health locker, needs M2 | 0 | 0 | DELETE (role guidance) |
| hiecm/v3/getting-started/build-it-well.mdx:33 | Cost of skipping ABHA format `400 {"loginId": "LoginId is invalid"}` | 0 | 0 | DELETE, now "A failed call" (fix-E direct; sandbox-run anecdote) |
| hiecm/v3/getting-started/build-it-well.mdx:36 | Aadhaar number 12 digits, no spaces | 0 | 0 | DELETE row (Aadhaar number format, not in the set) |
| hiecm/v3/getting-started/build-it-well.mdx:78 | Request an OTP: rate limited, retry loop causes lockout | 42/0 | 33/0 | CORRECT to "Each request sends the person a new OTP" (rate-limit prose) |
| hiecm/v3/getting-started/build-it-well.mdx:79 | Verify an OTP: OTP and txnId both single use | 0 | 0 | DELETE row (single use rule, not in the set) |
| hiecm/v3/getting-started/build-it-well.mdx:81 | "ABDM repeats callbacks" | 0 | 0 | CORRECT to "Deduplicate on the id the callback carries before you apply any effect" (retry behaviour, not in the set) |
| hiecm/v3/getting-started/build-it-well.mdx:95 | Wait example "thirty minutes" | 0 | 0 | QUESTION for the content session: keep, reword or delete? (timer, screen copy) |
| hiecm/v3/getting-started/build-it-well.mdx:107 | Say upfront when the account will be restricted | 0 relevant | 0 | DELETE row (screen rule) |
| hiecm/v3/getting-started/build-it-well.mdx:108 | Answer scan and share inside thirty seconds | 0 | 0 | DELETE row (timer) |
| hiecm/v3/getting-started/build-it-well.mdx:113 | "The first four are journey specific" | - | - | CORRECT to "first two" once rows 107-108 go (the count follows those deletions) |
| hiecm/v3/getting-started/build-it-well.mdx:138 | "where NHA holds them" | - | - | Voice defect (Concern 8) |
| hiecm/v3/getting-started/build-with-ai.mdx:69 | "NHA's v3" | - | - | Voice defect (Concern 8) |
| hiecm/v3/getting-started/build-with-ai.mdx:70 | "the bare digits are refused" | present (dash format) | refusal 0 | QUESTION for the content session: keep, reword or delete? (unsourced refusal) |
| hiecm/v3/getting-started/first-fifteen-minutes.mdx:56-58 | Runner uses RSA-OAEP, the only RSA a browser offers, digest a control | 5/6 | 2/2 | CORRECT to "encrypts it with RSA under the public certificate" (crypto padding) |
| hiecm/v3/getting-started/going-live.mdx:25 | "They are not your sandbox values" | 0 | 0 | CORRECT, delete sentence (credential shape, not in the set) |
| hiecm/v3/getting-started/going-live.mdx:42-47 | Empanelled agencies run functional testing and security audit; functional report and certificate; security audit produces Safe to Host certificate | 0 | 0 | KEEP flagged (certification, abdm.gov.in/FAQ and sandbox docs, not the final set) |
| hiecm/v3/getting-started/going-live.mdx:49-50 | Demonstrate built functionality to the integration team before testing | 0 | 0 | KEEP flagged (certification) |
| hiecm/v3/getting-started/going-live.mdx:52-61 | Exit form with four uploads: functional report and certificate (empanelled agency), security audit report (CERT-In empanelled auditor), signed undertaking, other documents | 0 | 0 | KEEP flagged (certification) |
| hiecm/v3/getting-started/going-live.mdx:63-64 | Confirm report and undertaking format with the integration team | 0 | 0 | KEEP flagged (certification) |
| hiecm/v3/getting-started/going-live.mdx:70-72 | Committee records its decision in four review stages, each with reviewer and date | 0 | 0 | DELETE (unrecorded sandbox observation) |
| hiecm/v3/getting-started/going-live.mdx:83 | Production client id against a sandbox host, or the reverse, fails | 0 | 0 | DELETE (environment behaviour, not in the set) |
| hiecm/v3/getting-started/sandbox.mdx:21-33 | Six stages, Health Tech Committee approval, stage 2 ordering | 0 | 0 | KEEP flagged (process, Concern 2) |
| hiecm/v3/getting-started/security-audit.mdx:4, 14-17 | Every app passes a WASA audit, producing a Safe to Host certificate uploaded with the exit form | 0 | 0 | KEEP flagged (whole page is certification, outside the final set) |
| hiecm/v3/getting-started/security-audit.mdx:21-25 | In short: separate from functional, CERT-In auditor, staging URL, one audit per platform, in-date certificate covers a new module | 0 | 0 | KEEP flagged (certification, outside the final set) |
| hiecm/v3/getting-started/security-audit.mdx:29-30 | Build modules before applying | - | - | KEEP (generic) |
| hiecm/v3/getting-started/security-audit.mdx:34-35 | CERT-In empanelled list link | 0 | 0 | KEEP flagged (certification, outside the final set) |
| hiecm/v3/getting-started/security-audit.mdx:39-47 | Audit on staging carries into production; one audit per platform; shared ABHA base URL audit does not cover mobile apps | 0 / 10 unrelated | 0 / 7 unrelated | KEEP flagged (certification, outside the final set) |
| hiecm/v3/getting-started/security-audit.mdx:51-58 | Scope table by situation | 0 | 0 | KEEP flagged (certification, outside the final set) |
| hiecm/v3/getting-started/security-audit.mdx:62-64 | Re-audit on major or backend change; certificate expiry | 0 | 0 | KEEP flagged (certification, outside the final set) |
| hiecm/v3/getting-started/security-audit.mdx:68-77 | How you know it worked; three failure modes | 0 | 0 | KEEP flagged (certification, outside the final set) |
| hiecm/v3/milestones/index.mdx:57 | "many products do exactly that and never build M4" | 0 | 0 | DELETE clause (market claim) |
| hiecm/v3/milestones/index.mdx:101 | "None of the above leaves sandbox until the clinic is a registered facility and its doctors hold professional IDs" | 0 | 0 | CORRECT to "Enrol the clinic as a facility and its doctors as professionals, then link your software to the facility." (process) |
| hiecm/v3/milestones/index.mdx:124 | Card and QR code kept under P1 though `phrCard`/`qrCode` sit in the P2 spec | 10/17 | 3/5 | KEEP flagged (Concern 7) |
| hiecm/v3/milestones/index.mdx:172 | M2 needed by "a citizen pushing their own" | 0 | 0 | DELETE clause (role guidance) |
| hiecm/v3/milestones/index.mdx:173 | M3 needed by "every PHR app" | 0 | 0 | DELETE clause (role guidance) |
| hiecm/v3/milestones/index.mdx:176-184 | "fourth certificate" | 0 | 0 | KEEP flagged (onboarding wording) |
| hiecm/v3/reference/data-dictionary.md:1-18 | Whole page sourced from the sandbox data dictionary v1.0 (`source: Data_Dictionary__Sandboxdb_data_dictionary_v1.0.md`), not the final set | 0 | 0 | KEEP flagged (Concern 3: no HIE-CM API claim, but outside the set under a strict reading) |
| hiecm/v3/reference/data-dictionary.md:20-30, 63-95 | Source contents counts (31 tables, 636 columns, 45 indexes, 34 sequences, 104 defaults) and table overview, incl. `sd_status` "four HTC review stages" | 0 | 0 | KEEP flagged (Concern 3) |
| hiecm/v3/reference/data-dictionary.md:47-61 | Abbreviations: HTC reviews integration at the end of exit; WASA produces Safe to Host certificate | 0 | 0 | KEEP flagged (certification) |
| hiecm/v3/reference/data-dictionary.md:96-648 | Per-table column transcriptions (sd_login to awsdms_apply_exceptions, incl. sd_exit 279, wasa_dhis_initiation_details 376) | 0 | 0 | KEEP flagged (Concern 3) |
| hiecm/v3/reference/data-dictionary.md:649-743 | Backup copies, indexes, what is not transcribed, what the page does not tell you | 0 | 0 | KEEP flagged (Concern 3) |
| support/index.md:20 (not an assigned page) | sandboxsupport.abdm.gov.in | 0 | 11 (only in injected info.contact) | KEEP flagged (fix-E Concern 2: same shape as the M4 gateway-token line, may need that ruling) |
| support/index.md:25 (not an assigned page) | integration.support@nha.gov.in | 0 | 0 | KEEP flagged (contact channel) |
