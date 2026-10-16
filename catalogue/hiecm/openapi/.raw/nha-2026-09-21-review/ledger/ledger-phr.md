# PHR ledger: "ABHA PHR V3 Updated.docx" against P1 to P4

Source: `scratchpad/nha-src/md/ABHA_PHR_V3_Updated.md` (image-stripped copy at `scratchpad/phr_noimg.md`).
Targets: `catalogue/openapi/hiecm/v3/hiecm-p{1,2,3,4}.yaml`, `catalogue/openapi/hiecm/v3/journeys/p{1,2,3,4}.yaml`, `site/docs/hiecm/v3/milestones/p{1,2,3}.mdx`, `site/docs/hiecm/v3/concepts/phr.md`, `site/docs/hiecm/v3/concepts/participants/phr.md`, `site/docs/hiecm/v3/api/p{1,2}/errors.md`, `site/docs/hiecm/v3/concepts/encryption.md`, `site/docs/hiecm/v3/api/p{1,2}/_servers.md`. Generated pages under `site/docs/hiecm/v3/api/p*/` are reported against the yaml that feeds them.

Limits of this audit: the section 2 sequence diagrams are images in the docx and were not readable; flow step order is judged from the section 3 API order for each named flow and from section 1 prose. Every yaml operation was parsed with PyYAML; every header and body field below is what the yaml declares, not what the page prose says.

## Two systemic findings that drive most rows

**S1. `apiKeyAuth` is referenced but never defined.** `hiecm-p1.yaml` (10 references) and `hiecm-p2.yaml` (11 references) attach `security: [{apiKeyAuth: []}]` to every PHR app operation except `login/request/otp`, `login/verify`, `login/verify/user` and `emailVerificationLink`, but `components.securitySchemes` in both files defines only `bearerAuth`. The generator resolves the dangling ref to nothing: the published data file for enrolment request OTP (`site/src/data/api/p1-post-v3-phr-app-enrollment-request-otp--p1-create-abha-address-mobile-01.json`) has `"security": []` and headers `REQUEST-ID`, `TIMESTAMP` only. The doc marks `Authorization: {{access-token}}` **Yes** on 3.2 to 3.38 and 3.42. So 24 operations publish without the header the doc says is mandatory. Fix location: the `security:` lines in both yamls (switch to `bearerAuth`, or define the scheme).

**S2. No PHR app request body declares `required`.** Every `/abha/api/v3/phr/app/**` operation in p1 and p2 has `required: []` on its body schema; the doc marks every body field **Yes**. Fix location: the schemas in `hiecm-p1.yaml` and `hiecm-p2.yaml`. (p2 HIE-CM operations and p3/p4 do declare `required`.)

Rows below say "S1" or "S2" rather than repeating the text.

## 1. Endpoint coverage (PHRE-)

Column key: hdrs = do the yaml's declared headers (parameters plus resolvable security) match the doc's header table; body = do the doc's Yes fields appear and are they required in the yaml.

| ID | PHR V3 § | Method + URL (doc) | In yaml / operationId | hdrs | body | Status | Notes |
|---|---|---|---|---|---|---|---|
| PHRE-01 | 3.0 | POST https://dev.abdm.gov.in/api/hiecm/gateway/v3/sessions | hiecm-gateway.yaml `gateway_post_gateway_v3_sessions` (p1 journey `p1-certificate-and-session` step 2) | yes (REQUEST-ID, TIMESTAMP, X-CM-ID) | yes | APPLIED | Owned by gateway module, not a P yaml; fine. |
| PHRE-02 | 3.1 | GET https://abhasbx.abdm.gov.in/abha/api/v3/phr/app/login/public/certificate | p1 `p1_get_v3_phr_app_login_public_certificate` | yes | n/a | APPLIED | Same call as 3.44. Doc steps 2 and 3 (encrypt with devglan.com, cipher RSA/ECB/OAEPWithSHA-1AndMGF1Padding): see PHRC-14. |
| PHRE-03 | 3.2 | POST /abha/api/v3/phr/app/enrollment/request/otp (mobile) | p1 `p1_post_v3_phr_app_enrollment_request_otp` example "OTP Request - Mobile" | no: Authorization absent (S1) | fields present, none required (S2) | PARTIAL | Scopes, loginHint, otpSystem match. |
| PHRE-04 | 3.3 | POST /abha/api/v3/phr/app/enrollment/verify (mobile) | p1 `p1_post_v3_phr_app_enrollment_verify` example "OTP Verify - Mobile" | no (S1) | S2 | PARTIAL | |
| PHRE-05 | 3.4 | POST .../enrollment/request/otp (ABHA number, Aadhaar OTP) | p1 same op, example "OTP Request - AADHAR OTP" | no (S1) | S2 | PARTIAL | scope `abha-login`,`aadhaar-verify`; loginHint `abha-number`; otpSystem `aadhaar`: match. |
| PHRE-06 | 3.5 | POST .../enrollment/verify (Aadhaar OTP) | p1 same op, example "OTP Verify - AADHAR OTP" | no (S1) | S2 | PARTIAL | |
| PHRE-07 | 3.6 | POST .../enrollment/request/otp (ABHA number, mobile OTP) | p1 same op, example "OTP Request - ABHA OTP" | no (S1) | S2 | PARTIAL | |
| PHRE-08 | 3.7 | POST .../enrollment/verify (ABHA number, mobile OTP) | p1 same op, example "OTP Verify - ABHA OTP" | no (S1) | S2 | PARTIAL | Doc's own header table omits TIMESTAMP here (doc defect, not repo). |
| PHRE-09 | 3.8 | POST /abha/api/v3/phr/app/enrollment/suggestion | p1 `p1_post_v3_phr_app_enrollment_suggestion` | no (S1) | fields txnId, firstName, lastName, day/month/yearOfBirth, email present; none required (S2) | PARTIAL | Doc marks `email` Yes but its own request body omits it; treat as optional. |
| PHRE-10 | 3.9 | GET /abha/api/v3/phr/app/enrollment/isExists?abhaAddress= | p1 `p1_get_v3_phr_app_enrollment_isexists` | no (S1); query `abhaAddress` present | n/a | PARTIAL | Doc says missing credentials returns "Code - 400"; p1 errors page says 401 (PHRC-17). |
| PHRE-11 | 3.10 | POST /abha/api/v3/phr/app/enrollment/enrol | p1 `p1_post_v3_phr_app_enrollment_enrol` | no (S1) | txnId, phrDetails present; phrDetails has all 18 doc fields; none required (S2) | PARTIAL | Example 1 has `"mobile": "<BASE64_PHOTO>"`, a scrub artefact: the placeholder for the encrypted mobile is wrong. |
| PHRE-12 | 3.11 | POST /abha/api/v3/phr/app/login/request/otp (mobile) | p1 `p1_post_v3_phr_app_login_request_otp` example "OTP Request - Mobile" | yes (bearerAuth resolves to Authorization) | S2 | PARTIAL | S2 only. |
| PHRE-13 | 3.12 | POST /abha/api/v3/phr/app/login/verify (mobile) | p1 `p1_post_v3_phr_app_login_verify` example "Login OTP Verify - Mobile" | yes | S2 | PARTIAL | S2 only. |
| PHRE-14 | 3.13 | POST .../login/request/otp (ABHA number, Aadhaar OTP) | p1 same op, example "OTP Request - AADHAR OTP" | yes | S2 | PARTIAL | S2 only. |
| PHRE-15 | 3.14 | POST .../login/verify (ABHA number, Aadhaar OTP) | p1 same op, example "Login OTP Verify - AADHAR" | yes | S2 | PARTIAL | S2 only. |
| PHRE-16 | 3.15 | POST .../login/request/otp (Aadhaar number, Aadhaar OTP) | p1 same op, example "new OTP Request- AADHAAR" | yes (doc's own table omits Authorization; doc defect) | S2 | CONTRADICTS | Doc: `"loginHint": "Aadhaar-number"`. Yaml example: `"loginHint": "aadhaar"`. Scope `abha-login, aadhaar-verify, aadhaar-otp-verify` matches. Example `loginId` is `<BASE64_PHOTO>` (scrub artefact). |
| PHRE-17 | 3.16 | POST .../login/verify (Aadhaar number) | p1 same op, example "new OTP verify- AADHAAR" | yes | S2 | PARTIAL | Example `otpValue` is `<BASE64_PHOTO>` (scrub artefact). |
| PHRE-18 | 3.17 | POST .../login/request/otp (ABHA number, mobile OTP) | p1 same op, example "OTP Request - ABHA OTP" | yes | S2 | PARTIAL | S2 only. |
| PHRE-19 | 3.18 | POST .../login/verify (ABHA number, mobile OTP) | p1 same op, example "Login OTP Verify - ABHA" | yes | S2 | PARTIAL | S2 only. |
| PHRE-20 | 3.19 | POST .../login/request/otp (ABHA address, mobile OTP) | p1 same op, example "OTP Request - ABHAADDRES Mobile" | yes | S2 | PARTIAL | S2 only. |
| PHRE-21 | 3.20 | POST .../login/verify (ABHA address, mobile OTP) | p1 same op, example "Login OTP Verify - ABHAADDRES Mobile" | yes | S2 | PARTIAL | S2 only. |
| PHRE-22 | 3.21 | POST .../login/request/otp (ABHA address, email OTP, Optional) | p1 same op, example "OTP Request - ABHAADDRES Email" | yes | S2 | PARTIAL | Doc marks the route Optional; nothing in yaml summary or page says so (PHRC-03). |
| PHRE-23 | 3.22 | POST .../login/verify (ABHA address, email OTP, Optional) | p1 same op, example "Login OTP Verify - ABHAADDRESS Email" | yes | S2 | PARTIAL | As above. |
| PHRE-24 | 3.23 | POST /abha/api/v3/phr/app/login/search | p1 `p1_post_v3_phr_app_login_search` | no (S1) | abhaAddress present, not required (S2) | PARTIAL | |
| PHRE-25 | 3.24 | POST .../login/verify (password) | p1 same op, example "Login Verify - Password" | yes | S2 | PARTIAL | Example password is `<BASE64_PHOTO>` (scrub artefact). |
| PHRE-26 | 3.25 | POST /abha/api/v3/phr/app/login/verify/user | p1 `p1_post_v3_phr_app_login_verify_user` | partial: doc lists Authorization only; yaml adds required `T-token` | S2 | PARTIAL | The T-token is what the sandbox actually needs (the verify response's `token`), but the doc does not say it. Record as a doc gap and keep T-token; flag to NHA. |
| PHRE-27 | 3.26 | POST /abha/api/v3/phr/app/login/profile/request/otp (update mobile) | p2 `p2_post_v3_phr_app_login_profile_request_otp` example "Send Otp - Update Mobile" | no: doc Authorization; yaml `X-token` only (S1) | S2 | PARTIAL | Doc's parameter table says scope `abha-address-enroll` but its request body says `abha-address-profile`; yaml uses `abha-address-profile` (the body). |
| PHRE-28 | 3.27 | POST (doc URL blank; body implies /login/profile/verify) | p2 `p2_post_v3_phr_app_login_profile_verify` example "Verify Otp - Update Mobile" | no (S1) | S2 | PARTIAL | Doc omits the URL (doc defect). |
| PHRE-29 | 3.28 | POST .../login/profile/request/otp (update email) | p2 same op, example "Send Otp - Update Email" | no (S1) | S2 | PARTIAL | |
| PHRE-30 | 3.29 | POST .../login/profile/verify (update email) | p2 same op, example "Verify Otp - Update Email" | no (S1) | S2 | PARTIAL | |
| PHRE-31 | 3.30 | POST .../login/profile/verify (update password) | p2 same op, example "Verify Password - Update Password" | no (S1) | S2 | PARTIAL | |
| PHRE-32 | 3.31 | POST .../login/profile/request/otp (link ABHA number, mobile OTP) | p2 same op, example "Send ABHA Otp - Link-DeLink" | no (S1) | S2 | PARTIAL | Example loginId `<BASE64_PHOTO>` (scrub artefact). |
| PHRE-33 | 3.32 | POST .../login/profile/verify (link, mobile OTP) | p2 same op, example "Verify ABHA Otp - Link-DeLink" | no (S1) | S2 | PARTIAL | |
| PHRE-34 | 3.33 | POST /abha/api/v3/phr/app/login/profile/link (LINK) | p2 `p2_post_v3_phr_app_login_profile_link` example "Link Request" | no (S1) | action, transactionId present; not required (S2) | PARTIAL | |
| PHRE-35 | 3.34 | POST .../login/profile/request/otp (link, Aadhaar OTP) | p2 same op, example "Send AADHAAR Otp - Link-DeLink" | no (S1) | S2 | PARTIAL | |
| PHRE-36 | 3.35 | POST .../login/profile/verify (link, Aadhaar OTP) | p2 same op, example "Verify AADHAAR Otp - Link-DeLink" | no (S1) | S2 | PARTIAL | Example otpValue `<BASE64_PHOTO>` (scrub artefact). |
| PHRE-37 | 3.36 | POST .../login/profile/link (Aadhaar variant) | p2 same op, example "Link Request (2)" | no (S1) | S2 | PARTIAL | |
| PHRE-38 | 3.37 | GET /abha/api/v3/phr/app/login/profile/switch-profile | p2 `p2_get_v3_phr_app_login_profile_switch_profile` | no: doc Authorization; yaml X-token (S1) | n/a | PARTIAL | |
| PHRE-39 | 3.38 | POST .../login/profile/verify/switch-profile/user | p2 `p2_post_v3_phr_app_login_profile_verify_switch_profile_user` | no: doc Authorization; yaml T-token (S1) | S2 | PARTIAL | |
| PHRE-40 | 3.39 | GET /abha/api/v3/phr/app/login/profile | p2 `p2_get_v3_phr_app_login_profile` | no: doc `X-token` and `X-AUTH-TOKEN` both Yes; yaml `X-token` only | n/a | PARTIAL | Same gap on 3.40, 3.41. |
| PHRE-41 | 3.40 | GET .../login/profile/qrCode | p2 `p2_get_v3_phr_app_login_profile_qrcode` | no (X-AUTH-TOKEN missing) | n/a | PARTIAL | |
| PHRE-42 | 3.41 | GET .../login/profile/phrCard | p2 `p2_get_v3_phr_app_login_profile_phrcard` | no (X-AUTH-TOKEN missing) | n/a | PARTIAL | |
| PHRE-43 | 3.42 | POST .../login/profile/updateProfile | p2 `p2_post_v3_phr_app_login_profile_updateprofile` | no: doc Authorization; yaml X-token (S1) | all 16 doc fields present; none required (S2) | PARTIAL | |
| PHRE-44 | 3.43 | GET .../login/profile/request/token | p2 `p2_get_v3_phr_app_login_profile_request_token` | yes (`R-token`, REQUEST-ID, TIMESTAMP) | n/a | APPLIED | Doc's "Body parameters" table here is a mis-pasted consent-notify table (status, consentId, requestId); ignore. Doc states refresh token valid 15 days (PHRC-08). |
| PHRE-45 | 3.44 | GET .../login/public/certificate | p1 `p1_get_v3_phr_app_login_public_certificate` | yes | n/a | APPLIED | Doc note: "Include this at the beginning of the PHR APIs to clearly differentiate between the ABHA public key and the PHR public key." Journey puts it last (PHRF-19) and encryption.md sends readers to the M1 key (PHRC-09). |
| PHRE-46 | 3.45 | GET .../login/profile/request/logout | p2 `p2_get_v3_phr_app_login_profile_request_logout` | yes (`X-token`) | n/a | APPLIED | |
| PHRE-47 | 11 (PHR 3.4) | /abha/api/v3/phr/app/login/profile/deLink | none | | | MISSING | Listed in the doc's API listing ("De link the Abha number via ABHA otp request or Aadhaar otp"), not in section 3, not in any yaml. Only trace is the p2 example names "Link-DeLink". |
| PHRE-48 | 5.3.1 | POST /api/hiecm/patient-share/v3/share | p2 `p2_post_patient_share_v3_share` | yes (X-HIU-ID, X-CM-ID, X-AUTH-TOKEN, bearer) | intent, metaData, profile required | APPLIED | |
| PHRE-49 | 5.3.4 | callback /api/v3/hiu/patient/on-share | p2 webhook `/api/v3/hiu/patient/on-share` | | | APPLIED | |
| PHRE-50 | 6.12 / 9.3.5 | GET /api/hiecm/hip/v3/link/patient/links?limit=-1 | p2 `p2_get_hip_v3_link_patient_links` | yes; `limit` declared required | n/a | APPLIED | |
| PHRE-51 | 6.13 | POST /api/hiecm/consent/v3/auto/approve | p2 `p2_post_consent_v3_auto_approve` | yes | required hiu, isApplicableForAllHIPs, includedSources | APPLIED | |
| PHRE-52 | 6.14 | POST .../consent/v3/auto/approve/{id}/disable | p2 `p2_post_consent_v3_auto_approve_auto_approval_id_disable` | yes | n/a | APPLIED | Doc names the path param `{{consentId}}`; it is the auto-approval id. Yaml is right. |
| PHRE-53 | 6.15 | POST .../consent/v3/auto/approve/{id}/enable | p2 `p2_post_consent_v3_auto_approve_auto_approval_id_enable` | yes | n/a | APPLIED | |
| PHRE-54 | 6.16 | GET /api/hiecm/consent/v3/request?limit&offset&status | p2 `p2_get_consent_v3_request` | yes | n/a | APPLIED | |
| PHRE-55 | 6.17 | GET .../consent/v3/request/{request-id} | p2 `p2_get_consent_v3_request_request_id` | yes | n/a | APPLIED | |
| PHRE-56 | 6.18 | GET .../consent/v3/artefact/request/{request-id} | p2 `p2_get_consent_v3_artefact_request_request_id` | yes | n/a | APPLIED | |
| PHRE-57 | 6.19 | GET .../consent/v3/artefact/{artefact-id} | p2 `p2_get_consent_v3_artefact_artefact_id` | yes | n/a | APPLIED | |
| PHRE-58 | 6.20 | GET .../consent/v3/artefact?limit&offset&status | p2 `p2_get_consent_v3_artefact` | yes | n/a | APPLIED | |
| PHRE-59 | 6.21 | POST .../consent/v3/request/{request-id}/deny | p2 `p2_post_consent_v3_request_request_id_deny` | yes | reason required | APPLIED | |
| PHRE-60 | 6.22 | POST /api/hiecm/consent/v3/revoke | p2 `p2_post_consent_v3_revoke` | yes | consents required | APPLIED | |
| PHRE-61 | 8.3.1 | GET /api/hiecm/subscription-requests/v3/requests | p3 `p3_get_subscription_requests_v3_requests` | yes | doc query Limit, Offset, Filters all Yes; yaml `limit`, `offset`, `status` optional | PARTIAL | Doc's own section 11 URL uses `status=ALL`, so `status` is right; requiredness differs. |
| PHRE-62 | 8.3.4 | POST .../subscription-requests/v3/{request-id}/approve | p3 `p3_post_subscription_requests_v3_request_id_approve` | yes | yaml requires `excludedSources`; doc marks it Optional | CONTRADICTS | Doc: "Excluded sources: Optional". Yaml: `required: [isApplicableForAllHIPs, includedSources, excludedSources]`. |
| PHRE-63 | 8.3.7 | POST .../subscription-requests/v3/{subscription_id}/deny | p3 `p3_post_subscription_requests_v3_request_id_deny` | yes | reason required | APPLIED | Doc path param is the request id despite its name. |
| PHRE-64 | 8.3.9 | PUT .../subscription-requests/v3/patients/{subscription-id} | p3 `p3_put_subscription_requests_v3_patients_subscription_id` | yes | hiuId, subscriptionEditAndApprovalRequest required | APPLIED | |
| PHRE-65 | 8.3.13 | GET .../subscription-requests/v3/request/{subscriptionRequestId} | p3 `p3_get_subscription_requests_v3_request_request_id` | yes | n/a | APPLIED | |
| PHRE-66 | 8.3.14 | GET (doc) .../v3/request/{subscriptionId} | p3 `p3_get_subscription_requests_v3_subscription_id` at `/v3/{subscription-id}` | yes | n/a | PARTIAL | Doc's URL for "by subscription id" repeats the "by request id" path (doc defect). Yaml path is the plausible one; confirm with NHA. |
| PHRE-67 | 8.3.15 | GET .../subscription-requests/v3/patients/requests?consentLimit... | p4 `p4_get_subscription_requests_v3_patients_requests` | yes; all five query params required | n/a | APPLIED | |
| PHRE-68 | 8.3.16 | GET .../subscription-requests/v3/patients/lockers?includeInactive | p4 `p4_get_subscription_requests_v3_patients_lockers` | yes | n/a | APPLIED | |
| PHRE-69 | 8.3.17 | GET .../subscription-requests/v3/patients/lockers/{locker-id} | p4 `p4_get_subscription_requests_v3_patients_lockers_lockerid` | yes | n/a | APPLIED | |
| PHRE-70 | 8.3.18 | POST .../subscription-requests/v3/setup-locker | p4 `p4_post_subscription_requests_v3_setup_locker` | yes (X-LOCKER-ID) | no body schema in yaml; doc shows none either | APPLIED | |
| PHRE-71 | 10.3.1 | POST /api/hiecm/user-initiated-linking/v3/patient/care-context/discover | p2 `p2_post_user_initiated_linking_v3_patient_care_context_discover` | yes (yaml makes X-AUTH-TOKEN required; doc leaves its Required cell blank) | hip, unverifiedIdentifiers required | APPLIED | Doc body names the field `hipId`; yaml `hip` (object). Doc's own example uses `hip`; keep. |
| PHRE-72 | 10.3.4 | callback /api/v3/hiu/patient/care-context/on-discover | p2 webhook | | | APPLIED | |
| PHRE-73 | 10.3.5 | POST .../user-initiated-linking/v3/link/care-context/init | p2 `p2_post_user_initiated_linking_v3_link_care_context_init` | yes | transactionId, patient required | APPLIED | |
| PHRE-74 | 10.3.8 | callback /api/v3/hiu/patient/care-context/on-init | p2 webhook | | | APPLIED | |
| PHRE-75 | 10.3.9 | POST .../user-initiated-linking/v3/link/care-context/confirm | p2 `p2_post_user_initiated_linking_v3_link_care_context_confirm` | yes | token, linkRefNumber required | APPLIED | |
| PHRE-76 | 10.3.12 | callback /api/v3/hiu/patient/care-context/on-confirm | p2 webhook | | | APPLIED | |
| PHRE-77 | 10.3.13 | GET /api/hiecm/gateway/v3/providers?stateCode&districtCode&name | gateway `gateway_get_gateway_v3_providers` (p2 journey step) | yes | n/a | APPLIED | Gateway module. |
| PHRE-78 | 10.3.14 | GET .../gateway/v3/providers/{hip-id} | gateway `gateway_get_gateway_v3_providers_provider_id` (p2 journey step) | yes | n/a | APPLIED | |
| PHRE-79 | 10.3.15 | GET /api/hiecm/gateway/v3/govt-programs | gateway `gateway_get_gateway_v3_govt_programs` | yes | n/a | PARTIAL | Operation exists; no P journey walks it, though the doc lists it under user initiated linking (PHRF-24). |

### Reverse: operations in p1 to p4 yamls that the doc does not describe

| ID | Yaml / operationId | Path | Status | Notes |
|---|---|---|---|---|
| PHRE-R1 | p1 `p1_post_v3_profile_account_request_emailverificationlink` | POST /abha/api/v3/profile/account/request/emailVerificationLink | EXTRA | Not a `/phr/app/` path and not in the doc's PHR listing. Looks like an M1 profile operation that fell into the P1 folder. |
| PHRE-R2 | p2 `p2_get_patient_share_v3_profile_gettokendetails` | GET /api/hiecm/patient-share/v3/profile/getTokenDetails | EXTRA | Not in section 5 or section 11. |
| PHRE-R3 | p2 `p2_post_consent_v3_request_request_id_approve` | POST /api/hiecm/consent/v3/request/{request-id}/approve | EXTRA | Section 6 documents deny (6.21) and revoke (6.22) but no patient approve; section 11 does not list it either. Real HIE-CM call; the doc is the one with the gap. |
| PHRE-R4 | p3 `p3_post_subscription_requests_v3_enable_subscription_id` | POST /api/hiecm/subscription-requests/v3/enable/{subscription-id} | EXTRA | Not in section 8 or 11. |
| PHRE-R5 | p3 `p3_post_subscription_requests_v3_disable_subscription_id` | POST .../subscription-requests/v3/disable/{subscription-id} | EXTRA | Not in section 8 or 11. |

Everything else in p1 to p4 maps to a doc section above.

## 2. Flow and order (PHRF-)

Doc step order is taken from section 3 (the diagrams are images). "Same steps" compares operation sequence; example names in brackets.

| ID | Doc flow (§2 / §1) | Doc steps (§3) | Journey | Status | Notes |
|---|---|---|---|---|---|
| PHRF-01 | 2.1 Registration via mobile | 3.2 request/otp, 3.3 verify, 3.8 suggestion, 3.9 isExists, 3.10 enrol | p1 `p1-create-abha-address-mobile` | APPLIED | Same five, same order. |
| PHRF-02 | 2.2 Registration via ABHA number, Aadhaar OTP | 3.4, 3.5, 3.8, 3.9, 3.10 | p1 `p1-create-abha-address-abha-number-aadhaar-otp` | APPLIED | |
| PHRF-03 | 2.3 Registration via ABHA number, ABHA (mobile) OTP | 3.6, 3.7, 3.8, 3.9, 3.10 | p1 `p1-create-abha-address-abha-number-abha-otp` | PARTIAL | Journey inserts `login/verify/user` ("Verify User") after verify, before suggestion. Doc's enrolment flows do not call 3.25; only the login flows do. Also asymmetric with PHRF-02, which has no such step. |
| PHRF-04 | 2.4 Login via mobile | 3.11, 3.12, 3.25 verify/user | p1 `p1-login-mobile` | APPLIED | |
| PHRF-05 | 2.5 Login via email (Optional) | 3.21, 3.22 (ABHA address, email OTP); §1 also names "Email Id" login | p1 `p1-login-email` (loginHint `email`) and `p1-login-abha-address-email-otp` (loginHint `abha-address`, scope email-verify) | PARTIAL | Two journeys for what the doc documents once with `loginHint: email`. The `abha-address` + `email-verify` variant is from the Postman collection, not this doc. Neither journey is marked optional. |
| PHRF-06 | 2.6 Login using ABHA number, Aadhaar OTP | 3.13, 3.14, 3.25 | p1 `p1-login-abha-number-aadhaar-otp` | APPLIED | |
| PHRF-07 | 2.7 Login using Aadhaar number, Aadhaar OTP | 3.15, 3.16, 3.25 | p1 `p1-login-aadhaar-otp` | PARTIAL | Order matches; loginHint value contradicts (PHRE-16). |
| PHRF-08 | 2.8 Login using ABHA number, ABHA OTP | 3.17, 3.18, 3.25 | p1 `p1-login-abha-number-abha-otp` | APPLIED | |
| PHRF-09 | 2.9 Login using Aadhaar number, Aadhaar face verify | no §3 API; diagram only | none | MISSING | Doc names the flow (TOC and §2) but supplies no API. Cannot be built from this doc; ask NHA for the face-auth request shape. |
| PHRF-10 | 2.10 Login using ABHA number, ABHA face verify | no §3 API | none | MISSING | As above. |
| PHRF-11 | 2.11 Login using password | 3.23 search, 3.24 verify (password) | p1 `p1-login-abha-address-password` | APPLIED | |
| PHRF-12 | §1 route 6: ABHA address, mobile OTP | 3.19, 3.20 | p1 `p1-login-abha-address-mobile-otp` | APPLIED | No §2 diagram; §3 pair present. |
| PHRF-13 | 2.12 Profile, get profile details | 3.39 | p2 `p2-profile` step 1 | PARTIAL | Bundled into one six-step journey with QR, card, updateProfile, refresh token, logout. Not the doc's separate flow, but nothing is missing. |
| PHRF-14 | 2.13 Profile, mobile number update | 3.26, 3.27 | p2 `p2-update-mobile` | APPLIED | |
| PHRF-15 | 2.14 Profile, edit profile details | 3.42 | p2 `p2-profile` step 4 | PARTIAL | Bundled (see PHRF-13). |
| PHRF-16 | 2.15 Profile, get QR code | 3.40 | p2 `p2-profile` step 2 | PARTIAL | Bundled. |
| PHRF-17 | 2.16 Profile, link ABHA address to ABHA number | 3.31, 3.32, 3.33 (mobile OTP); 3.34, 3.35, 3.36 (Aadhaar OTP) | p2 `p2-link-abha-number-abha-otp`, `p2-link-abha-number-aadhaar-otp` | APPLIED | Both variants, same order. |
| PHRF-18 | §1 update email | 3.28, 3.29 | p2 `p2-update-email` | APPLIED | |
| PHRF-19 | §1 update password | 3.30 | p2 `p2-update-password` | APPLIED | |
| PHRF-20 | §1 switch profile | 3.37, 3.38 | p2 `p2-switch-profile` | APPLIED | |
| PHRF-21 | §1 get refresh token; logout | 3.43; 3.45 | p2 `p2-profile` steps 5, 6 | PARTIAL | Bundled. |
| PHRF-22 | §1 GET PHR certificate; 3.44 note "include this at the beginning of the PHR APIs" | 3.44, then 3.0 session | p1 `p1-certificate-and-session` (last journey in p1) | PARTIAL | The doc asks for the certificate first, to separate the PHR key from the ABHA key; the journey file's own comment says it "sits loose at the end". |
| PHRF-23 | §1 get PHR card | 3.41 | p2 `p2-profile` step 3 | PARTIAL | Bundled. |
| PHRF-24 | §10.2 user initiated linking (providers, govt programs, discover, init, confirm) | 10.3.13, 10.3.14, 10.3.15, 10.3.1, 10.3.5, 10.3.9 with callbacks | p2 `p2-abdm-user-initiated-linking-phr` | PARTIAL | Providers, discover, init, confirm and their callbacks in order; `govt-programs` (10.3.15) not walked. |
| PHRF-25 | §5.2 profile share | 5.3.1, 5.3.4 callback | p2 `p2-abdm-hiecm-patient-share-phr` | APPLIED | Adds getTokenDetails (EXTRA, PHRE-R2). |
| PHRF-26 | §6 consent manager, PHR side | 6.12 to 6.22 | p2 `p2-consent-management-data-flow-phr` | APPLIED | Adds approve (PHRE-R3). |
| PHRF-27 | §8 subscription, PHR side | 8.3.1, 8.3.4, 8.3.7, 8.3.9, 8.3.13, 8.3.14 | p3 `p3-subscription-phr` | APPLIED | Adds enable/disable (PHRE-R4, R5). |
| PHRF-28 | §8 locker | 8.3.18, 8.3.16, 8.3.17, 8.3.15 | p4 `p4-locker` | APPLIED | |

No p1 or p2 journey exists that the doc has no flow for.

## 3. Content (PHRC-)

| ID | Doc statement (§) | Page | Page statement | Status | Notes |
|---|---|---|---|---|---|
| PHRC-01 | §1 Registration: two methods, mobile number or ABHA number; ABHA number by Aadhaar OTP or mobile OTP | p1.mdx, concepts/phr.md | "Build both creation paths: by mobile number, and by an existing 14 digit ABHA number", ABHA number "Aadhaar OTP or ABHA OTP" | APPLIED | |
| PHRC-02 | §1 Login: eight routes listed, two of them "(Optional)" (email ID; ABHA address email OTP) | p1.mdx | frontmatter: "logs in four ways"; In short: "All eight login routes are mandatory"; Login table: 3 rows | CONTRADICTS | Doc: "Login into PHR using Email Id (Optional)" and "ABHA Address Email OTP(Optional)". Page: "All eight login routes are mandatory." The page also disagrees with itself (four vs eight). Fix: p1.mdx description, In short, Login section. |
| PHRC-03 | same | participants/phr.md | "multiple authentication (four mandated login routes)" | CONTRADICTS | Four is neither the doc's eight nor the six non-optional. |
| PHRC-04 | same | concepts/phr.md | "All these routes are mandatory" over a 3-row table (mobile, address, ABHA number) | CONTRADICTS | Email routes are optional in the doc. |
| PHRC-05 | §1 route 8: "Login into PHR using AADHAAR Number via AADHAAR OTP" (3.15, 3.16) | p1.mdx Login table; concepts/phr.md "Log in: Mobile number, ABHA address, or ABHA number" | Aadhaar number never named as a login identifier | MISSING | Journey `p1-login-aadhaar-otp` exists; the prose does not. |
| PHRC-06 | §2.9, 2.10 face verification login (Aadhaar face, ABHA face) | all P pages | no mention | MISSING | Doc supplies no API for it either; the page cannot state more than "exists, undocumented". Raise with NHA. |
| PHRC-07 | §3.0 "The session token remains valid for 20 minutes." | p1.mdx, p2.mdx, p3.mdx, concepts/phr.md | nothing; concepts/gateway.md shows `"expiresIn": 1200` in a JSON sample only | PARTIAL | Number is present as a sample, never stated. |
| PHRC-08 | §3.43 "The refresh token remains valid for 15 days." (login response `expiresIn: 1800`, `refreshExpiresIn: 1296000`) | P pages | "secure storage of the refresh token" only | MISSING | |
| PHRC-09 | §3.44 note: "Include this at the beginning of the PHR APIs to clearly differentiate between the ABHA public key and the PHR public key." URL `/abha/api/v3/phr/app/login/public/certificate` | concepts/encryption.md | "M1 has a `public/certificate` API for fetching the public key" linking to `/abha/api/v3/profile/public/certificate` | CONTRADICTS | Doc: the PHR key is a different key at a different URL. Page: sends every reader, PHR builders included, to the ABHA (M1) key. p1 yaml has the PHR endpoint; the concept page does not distinguish. |
| PHRC-10 | §"PHR APIs" base URLs: SBX `https://abhasbx.abdm.gov.in/abha/api/v3/phr/app/`, PROD `https://apis.abdm.gov.in/phr/api/phr/app/v3/`; ABHA address verification SBX `.../abha/api/v3/phr/web`, PROD `https://phr.abdm.gov.in/api/phr/web/v3` | p1 yaml servers (feeds api/p1/_servers.md), p2 yaml | sandbox host only | MISSING | No production host, no web-verification base. Fix in yaml `servers`. |
| PHRC-11 | §1 profile management: 12 items (update mobile, update email, update password, get profile, edit profile, QR, PHR card, refresh token, logout, link ABHA number, switch profile, PHR certificate) | p1.mdx "Profile, card and QR code" | covers get/edit profile, card, QR, link ABHA number, reset password, refresh token, "more than one user profile per install" | PARTIAL | Update email, logout as an API, switch profile by name, and the PHR certificate are not stated. |
| PHRC-12 | §11 groups profile management under PHR alongside registration and login (flow 3) | p2.mdx "P2 Linking and records" | page never mentions profile, card, QR, refresh token or logout although hiecm-p2.yaml holds all twelve profile operations | PARTIAL | p1.mdx describes the profile screens whose APIs live in p2. participants/phr.md puts "profile management, ABHA card and QR code generation" in P2, p1.mdx puts them in P1. Pick one and say so on the other page. |
| PHRC-13 | §3.25 verify user is "a common API used to verify the user from the list of ABHA addresses received in the response of verify OTP/face authentication API" | p1.mdx Login table | "Mobile OTP, then the user picks which linked ABHA address to sign in as" (mobile row only) | PARTIAL | The pick-an-address step applies to all OTP routes (3.12, 3.14, 3.16, 3.18 return `users[]`), page states it for mobile only. |
| PHRC-14 | §3.1 step 2: encrypt "using below third party API https://www.devglan.com/online-tools/rsa-encrypt"; step 3 cipher `RSA/ECB/OAEPWithSHA-1AndMGF1Padding` | concepts/encryption.md | no devglan; "Your platform's standard RSA library does the work" | MISSING (keep it missing) | Pointing integrators at a third-party website to encrypt Aadhaar numbers fails the DPG no-vendor rule and is bad practice. Do not apply; tell NHA. Confirm the padding string is on the page (grep found no "OAEP" in encryption.md: check and add if absent). |
| PHRC-15 | §12 error codes: 80 rows, ABDM-1000 to ABDM-1064, 1100, 1101, 1108, 1109, 1200 to 1205, 1401, 1402, 9999 | api/p1/errors.md | 4 codes: `900902`, `ABDM-1107`, `ABDM-1211`, `ABDM-9999` | PARTIAL | Pages are generated from response examples, so they only carry what the yaml examples return. The doc's codes are not in the yamls. Either add the doc's error responses to the yaml examples or link the reference page to the doc's list. |
| PHRC-16 | §12 `ABDM-1006` = "Invalid combinations of scopes" (also "Bad Request, invalid request Body"); §3.2 examples return `ABDM-1006` for Invalid Scope | api/p1/errors.md | `ABDM-1107` 400 "Invalid combinations of scopes" from `p1_post_v3_phr_app_login_verify` | CONTRADICTS | Doc: `ABDM-1006`. Page: `ABDM-1107`. Same message, different code. Check which the sandbox returns; the yaml example carries 1107. |
| PHRC-17 | §3.9 missing Bearer token: `900902 Missing Credentials`, "Code - 400 Bad Request" | api/p1/errors.md, api/p2/errors.md | `900902` HTTP 401 | CONTRADICTS | Doc says 400; page says 401. 401 is what the gateway returns; the doc is likely wrong. Flag to NHA rather than change. |
| PHRC-18 | §12 `ABDM-9999` = "Unknown exception"; §3.2 example `ABDM-9999` "Invalid LoginId" | api/p1/errors.md, api/p2/errors.md | `ABDM-9999` 400 "Invalid LoginId" | PARTIAL | Page matches the §3.2 example; doc's own table says otherwise. Doc inconsistency; note both on the errors page. |
| PHRC-19 | §12 codes for P3 and P4 (ABDM-1054 Invalid Subscription Request Id, 1039 Invalid Consent request id, 1040 Invalid HIU ID, and so on) | api/p3/, api/p4/ | no errors.md at all | MISSING | p3 and p4 yamls carry no error examples so no page is generated. |
| PHRC-20 | §1 "the system ensures the uniqueness of each ABHA Address"; §12 `ABDM-1101` "This ABHA Address already exists" | p1.mdx, concepts/phr.md | "ABDM wants one address per person"; isExists step in every enrolment journey | APPLIED | |
| PHRC-21 | §1 "Users can view their existing ABHA Address via the chosen registration method" | p1.mdx | "show the ABHA addresses already linked to that mobile number or ABHA number. The user then picks one instead of creating a duplicate." | APPLIED | |
| PHRC-22 | §1 update password: "verifying if the new password is not the same as the old password" | p1.mdx, concepts/phr.md | "reset password screen behind login" | PARTIAL | The not-same-as-old rule is not stated. |
| PHRC-23 | §3.4 to 3.7 registration by ABHA number uses scope `abha-login` (not `abha-address-enroll`) | p1.mdx | no scope prose | APPLIED | Yaml examples carry the right scopes; the page does not need to. |
| PHRC-24 | §1 "Login into PHR using ABHA Address Password" and 3.23 search returns auth methods for the address | p1.mdx | "Password, mobile OTP or email OTP, by the auth methods the address supports" | APPLIED | |
| PHRC-25 | §3.10 enrol body includes `password` and `abhaAddress` inside phrDetails | p1.mdx | mobile path "The user types them" | APPLIED | Yaml schema has both. |

## Counts

Endpoints (PHRE-01 to 79, plus R1 to R5, 84 rows): APPLIED 40, PARTIAL 41, CONTRADICTS 2, MISSING 1, EXTRA 5.

Flows (PHRF-01 to 28): APPLIED 15, PARTIAL 11, MISSING 2.

Content (PHRC-01 to 25): APPLIED 6, PARTIAL 8, CONTRADICTS 6, MISSING 5.

## Non-APPLIED rows

### Endpoints

- PHRE-03 to PHRE-11 PARTIAL: S1 (Authorization header not published) and S2 (no required fields) on all five enrolment operations.
- PHRE-12 to PHRE-15, PHRE-17 to PHRE-23, PHRE-25 PARTIAL: S2 on login/request/otp and login/verify.
- PHRE-16 CONTRADICTS: `loginHint` "Aadhaar-number" (doc) vs "aadhaar" (yaml).
- PHRE-24 PARTIAL: S1 and S2 on login/search.
- PHRE-26 PARTIAL: verify/user adds a T-token header the doc does not name.
- PHRE-27 to PHRE-39, PHRE-43 PARTIAL: S1 (doc Authorization vs yaml X-token / T-token, apiKeyAuth undefined) and S2 on all profile operations.
- PHRE-40 to PHRE-42 PARTIAL: doc requires `X-AUTH-TOKEN` alongside `X-token` on profile, qrCode, phrCard; yaml has X-token only.
- PHRE-47 MISSING: `/abha/api/v3/phr/app/login/profile/deLink`.
- PHRE-61 PARTIAL: subscription list query params optional in yaml, Yes in doc.
- PHRE-62 CONTRADICTS: approve subscription requires `excludedSources` in yaml; Optional in doc.
- PHRE-66 PARTIAL: doc URL for subscription-by-id is a copy of by-request-id.
- PHRE-79 PARTIAL: govt-programs exists but no P journey walks it.
- PHRE-R1 to R5 EXTRA: emailVerificationLink, getTokenDetails, consent approve, subscription enable, subscription disable.
- Scrub artefacts (`<BASE64_PHOTO>` used for mobile, loginId, otpValue, password) in p1 and p2 examples: PHRE-11, 16, 17, 25, 32, 36.

### Flows

- PHRF-03 PARTIAL: ABHA-OTP enrolment journey carries an extra verify/user step.
- PHRF-05 PARTIAL: email login split into two journeys; optional status not carried.
- PHRF-07 PARTIAL: loginHint mismatch inside an otherwise correct journey.
- PHRF-09, PHRF-10 MISSING: face verification logins (doc has diagrams, no APIs).
- PHRF-13, 15, 16, 21, 23 PARTIAL: profile flows bundled into one `p2-profile` journey.
- PHRF-22 PARTIAL: certificate journey last where the doc asks for it first.
- PHRF-24 PARTIAL: govt-programs not in the user-initiated-linking journey.

### Content

- PHRC-02, 03, 04 CONTRADICTS: login route count and mandatory status (doc: eight, two optional; pages: "four", "all eight mandatory", "all these mandatory").
- PHRC-05 MISSING: Aadhaar number as a login identifier.
- PHRC-06 MISSING: face verification login.
- PHRC-07 PARTIAL: 20-minute session token validity only as a JSON sample.
- PHRC-08 MISSING: refresh token 15-day validity.
- PHRC-09 CONTRADICTS: encryption.md points PHR builders at the M1 (ABHA) public key, doc says the PHR key is distinct.
- PHRC-10 MISSING: production and web-verification base URLs.
- PHRC-11 PARTIAL: profile management list incomplete (update email, logout, switch profile, certificate).
- PHRC-12 PARTIAL: profile APIs live in p2 yaml, described on p1.mdx, absent from p2.mdx; participants page assigns them to P2.
- PHRC-13 PARTIAL: address-pick step stated for mobile login only.
- PHRC-14 MISSING by design: devglan third-party encryption tool (do not apply; DPG rule); verify OAEP padding string is on encryption.md.
- PHRC-15 PARTIAL: error pages carry 4 and 2 codes against the doc's 80.
- PHRC-16 CONTRADICTS: ABDM-1107 vs ABDM-1006 for "Invalid combinations of scopes".
- PHRC-17 CONTRADICTS: 900902 HTTP 401 (page) vs 400 (doc).
- PHRC-18 PARTIAL: ABDM-9999 message differs inside the doc itself.
- PHRC-19 MISSING: no errors page for P3 or P4.
- PHRC-22 PARTIAL: new-password-differs-from-old rule not stated.

## Doc defects to send back to NHA (not repo work)

- 3.7 header table omits TIMESTAMP; 3.15 and 3.16 omit Authorization; 3.27 has no URL; 3.43 body table is a pasted consent-notify table; 3.26 parameter table says `abha-address-enroll` while its body says `abha-address-profile`; 8.3.14 URL duplicates 8.3.13; 8.3.4 deny path param is named subscription_id but is the request id; 6.14/6.15 path param named consentId but is the auto-approval id.
- Face verification logins (2.9, 2.10) and deLink (11 PHR 3.4) have no API section.
- Section 12 lists ABDM-1006, 1017, 1029, 1034, 1035, 9999 more than once with different messages.
- 3.1 recommends a third-party website for encrypting Aadhaar numbers and OTPs.
- 3.25 does not name the T-token the sandbox requires on verify/user.
