# M1 / ABHA diff report, NHA drop 2026-09-01

NEW: `catalogue/openapi/.raw/nha-2026-09-01/fixed/abha/abha-api-v3.yaml` (36 operations, zero `operationId` values, `openapi: 3.0.x` style single-file swagger). Note the path in the task brief, `.../swagger/fixed/abha/...`, does not exist in this checkout; the real path has no `swagger/` segment. The `fixed/` copy is compared here rather than the unfixed sibling under `.raw/nha-2026-09-01/abha/abha-api-v3.yaml`, because `fixed/` is what the drop's own audit ran against last and what a future ingest would actually pull in.

OURS: `catalogue/openapi/hiecm/v3/hiecm-m1.yaml` (44 operations, OpenAPI 3.1.1).

Matching is by path suffix after stripping each side's prefix (`/abha/api/v3` on the drop; `/v3`, `/v3.1`, `/v1/bridges`, `/patient-share/v3` on ours, tried in that order) and lower-cased. One pair needed a manual call: the drop's `GET /abha/api/v3/account/request/logout` is missing a `profile` path segment that every sibling operation carries; matched anyway on summary and tag identity (see its entry below and correction 9).

Counts: **34 matched, 2 new-in-drop, 10 ours-only.**

## 1. Operation inventory

| Method | Path (drop, suffix shown) | Path (ours) | operationId ours | Classification |
|---|---|---|---|---|
| POST | /enrollment/request/otp | /v3/enrollment/request/otp | m1_enrolment_request_otp | MATCHED |
| POST | /enrollment/enrol/byAadhaar | /v3/enrollment/enrol/byAadhaar | m1_enrolment_by_aadhaar | MATCHED |
| POST | /enrollment/auth/byAbdm | /v3/enrollment/auth/byAbdm | m1_enrolment_verify_abdm_otp | MATCHED |
| GET | /enrollment/enrol/suggestion | /v3/enrollment/enrol/suggestion | m1_enrolment_address_suggestions | MATCHED |
| POST | /enrollment/enrol/abha-address | /v3/enrollment/enrol/abha-address | m1_enrolment_claim_abha_address | MATCHED |
| POST | /enrollment/enrol/auth/init | /v3/enrollment/enrol/auth/init | m1_enrolment_face_auth_init | MATCHED |
| POST | /enrollment/enrol/capturePID | /v3/enrollment/enrol/capturePID | m1_enrolment_capture_pid | MATCHED |
| POST | /enrollment/enrol/byDocument | /v3/enrollment/enrol/byDocument | m1_enrolment_by_document | MATCHED |
| GET | /enrollment/profile/children | /v3/enrollment/profile/children | m1_enrolment_list_children | MATCHED |
| POST | /profile/account/abha/search | /v3/profile/account/abha/search | m1_find_abha_search | MATCHED |
| POST | /profile/login/search | /profile/login/search | m1_login_search | MATCHED |
| POST | /profile/login/request/otp | /v3/profile/login/request/otp | m1_login_request_otp | MATCHED |
| POST | /profile/login/verify | /v3/profile/login/verify | m1_login_verify | MATCHED |
| POST | /profile/login/verify/user | /v3/profile/login/verify/user | m1_login_select_account | MATCHED |
| POST | /profile/account/request/otp | /v3/profile/account/request/otp | m1_profile_request_otp | MATCHED |
| POST | /profile/account/verify | /v3/profile/account/verify | m1_profile_verify_otp | MATCHED |
| GET | /profile/account | /v3/profile/account | m1_profile_get_account | MATCHED |
| PATCH | /profile/account | /v3/profile/account | m1_profile_update_account | MATCHED |
| POST | /profile/account/request/emailVerificationLink | /profile/account/request/emailVerificationLink | m1_send_email_verification_link | MATCHED |
| GET | /profile/account/qrCode | /v3/profile/account/qrCode | m1_profile_get_qr_code | MATCHED |
| GET | /profile/account/abha-card | /v3/profile/account/abha-card | m1_profile_get_abha_card | MATCHED |
| POST | /profile/benefit/linkAndDelink | /v3/profile/benefit/linkAndDelink | m1_benefit_link_or_delink | MATCHED |
| POST | /profile/benefit/search | /v3/profile/benefit/search | m1_benefit_search | MATCHED |
| POST | /phr/web/login/abha/search | /phr/web/login/abha/search | m1_phr_search_abha_address | MATCHED |
| POST | /phr/web/login/abha/request/otp | /phr/web/login/abha/request/otp | m1_phr_request_otp | MATCHED |
| POST | /phr/web/login/abha/verify | /phr/web/login/abha/verify | m1_phr_verify | MATCHED |
| GET | /phr/web/login/profile/abha-profile | /phr/web/login/profile/abha-profile | m1_get_phr_profile | MATCHED |
| GET | /phr/web/login/profile/abha/phr-card | /phr/web/login/profile/abha/phr-card | m1_download_phr_card | MATCHED |
| GET | /phr/web/login/profile/abha/qr-code | /phr/web/login/profile/abha/qr-code | m1_download_phr_qr_code | MATCHED |
| GET | /profile/benefit/abha/{abhanumber} | /v3/profile/benefit/abha/{abhaNumber} | m1_benefit_get_by_abha | MATCHED |
| GET | /profile/benefit/abha/statedistrict/{abhanumber} | /v3/profile/benefit/abha/statedistrict/{abhaNumber} | m1_benefit_get_state_district | MATCHED |
| GET | /profile/benefit/abha/search/insurance/{abhanumber} | /v3/profile/benefit/abha/search/insurance/{abhaNumber} | m1_benefit_search_insurance | MATCHED |
| GET | /profile/account/request/token | /v3/profile/account/request/token | m1_token_refresh | MATCHED |
| GET | /profile/public/certificate | /profile/public/certificate | m1_get_public_certificate | MATCHED |
| GET | /account/request/logout (missing `profile` segment, see below) | /v3/profile/account/request/logout | m1_profile_logout | MATCHED, path text differs |
| POST | /api/hiecm/gateway/v3/sessions | (n/a) | (n/a) | NEW-IN-DROP, not really M1 |
| GET | (drop path as written) /abha/api/v3/account/request/logout | (n/a) | (n/a) | counted under the MATCHED row above |
| GET | (n/a) | /v3.1/profile/login/request/otp | m1_login_request_otp_v31 | OURS-ONLY, whole drop has no v3.1 |
| POST | (n/a) | /v3.1/profile/login/verify | m1_login_verify_v31 | OURS-ONLY, whole drop has no v3.1 |
| GET | (n/a) | /v3/profile/account/download-abha-card | m1_profile_download_abha_card | OURS-ONLY, absent from whole drop |
| GET | (n/a) | /v3/profile/benefit/search/aadhaarByAbha | m1_benefit_find_aadhaar_by_abha | OURS-ONLY, absent from whole drop |
| GET | (n/a) | /v3/profile/benefit/search/abhaByAadhaar | m1_benefit_find_abha_by_aadhaar | OURS-ONLY, absent from whole drop |
| POST | (n/a) | /v3/phr/app/enrollment/encrypt | m1_encrypt_value | OURS-ONLY, absent from whole drop, already sandbox-verified |
| POST | (n/a) | /v1/bridges/MutipleHRPAddUpdateServices | m1_register_hrp_services | OURS-ONLY, absent from whole drop; a similarly-named op lives in the gateway drop instead, see note below |
| POST | (n/a) | /patient-share/v3/share | m1_receive_patient_share | OURS-ONLY, lives in the drop's separate `patient-share.yaml`, not this file |
| POST | (n/a) | /patient-share/v3/on-share | m1_on_share_acknowledgement | OURS-ONLY, lives in the drop's separate `patient-share.yaml`, not this file |

Counted plainly: 36 drop operations = 34 matched + 2 rows that do not add new M1 surface (the gateway session duplicate and the logout path variant already folded into its match). 44 our operations = 34 matched + 10 ours-only.

A word on the 2 "new-in-drop" rows before the per-operation diffs, because neither is a genuine new capability:

- `POST /api/hiecm/gateway/v3/sessions` is the gateway session-token call. It is embedded again inside `abha-api-v3.yaml` (tag "Gateway Session") even though it already lives in the drop's own `hiecm/gateway.yaml` and is already fully diffed in `catalogue/openapi/nha-drops/2026-09-01-diffs/gateway.md`. It does not belong in an M1/ABHA file at all; nothing to add to `hiecm-m1.yaml` because of it.
- `GET /abha/api/v3/account/request/logout` carries the exact summary ("Use Case: Logout user from their ABHA Profile"), the exact tag (`ABHA PROFILE`), the same three headers (`REQUEST-ID`, `TIMESTAMP`, `X-token`) and the same response body shape as our `m1_profile_logout`. Every sibling path in this drop keeps the `profile` segment (`/profile/account/...`); this one path is missing it. Treated as the same operation with a spelling defect in the drop, not as a second logout endpoint. See correction 9, do not change our path off this alone.

## 2. Cross-cutting findings across the matched operations

These recur on enough operations that repeating them 34 times would bury the operation-specific diffs. Each is referenced by its S-number from the per-operation list below.

**S1, X-token / T-token / R-token required flag.** Our shared parameter components (`XToken`, `TToken`, `RToken` in `hiecm-m1.yaml` `components.parameters`) are all declared `required: false`, and every operation that uses them does so by `$ref`, so every operation inherits `false`. The drop declares the equivalent header `required: true` on essentially every profile-scoped, PHR-scoped and token-refresh operation (`X-token` on 12 of the operations that use it, `T-token` on the account-selection call, `R-token` on the token refresh call). The one place the drop itself does **not** require `X-token` is `POST /enrollment/enrol/byAadhaar` (the header is present but `required` is simply absent, i.e. optional), which lines up with that call being usable for first-time creation where no session exists yet. Ours is not wrong to keep it optional at the component level for calls that predate login; it is wrong to leave it optional everywhere else.

**S2, missing standard error responses.** Our file documents only `200` on 29 of the 34 matched operations. The drop documents `400`, `401`, `403`, and typically `500` on every one of them, plus `404` where a lookup can miss and `422` on a few creation calls. Response bodies in the drop are frequently boilerplate reused verbatim across unrelated operations (see the sessions example in `gateway.md` for the pattern) rather than written per endpoint, so the prose is not worth importing uncritically, but the status codes and the `{error: {code, message}}` / `{code, message}` shape are worth having.

**S3, twelve operations in ours carry no response body at all.** Not "thin", literally absent. The description on these is our own placeholder text: "The call was accepted. No response body is documented for this operation. Run it against the sandbox and record what comes back before relying on it." The drop, imperfect as parts of it are, gives a real schema and example for every one of them. Affected operations: `m1_enrolment_request_otp`, `m1_enrolment_verify_abdm_otp`, `m1_enrolment_address_suggestions`, `m1_enrolment_face_auth_init`, `m1_profile_request_otp`, `m1_profile_verify_otp`, `m1_profile_get_account`, `m1_token_refresh`, `m1_login_select_account`, `m1_enrolment_list_children`, `m1_benefit_get_by_abha`, `m1_benefit_get_state_district`. This is the single highest-value thing in this drop for M1 and it is addressed once here rather than 12 times below.

**S4, `Benefit-Name` vs `BENEFIT_NAME`.** The drop spells this header `Benefit-Name` (hyphenated, title case) consistently, 7 times, everywhere it appears. Our `BenefitName` parameter component documents NHA's Postman collection spelling it four different ways (`BENEFIT_NAME` most often, `Benefit-Name` on demo auth and child ABHA, `BENEFIT-NAME`, `Benefit_Name` once) and defaults our example to `BENEFIT_NAME`. `BENEFIT_NAME` and `Benefit-Name` are different header names on the wire (underscore is not hyphen), so this is not cosmetic. The spec and the collection disagree with each other, same as the timestamp case. See correction 4.

**S5, `scope` arrays: already resolved, nothing to import.** The task brief for this report specifically calls out an audit finding of "`scope` type=string but example is a list." That finding is real, but it is against the **unfixed** file (`catalogue/openapi/.raw/nha-2026-09-01/example_findings.json`, 5 sites: `enrollment/request/otp`, `enrollment/auth/byAbdm`, `enrollment/enrol/auth/init`, `enrollment/enrol/capturePID`, `phr/web/login/abha/request/otp`). The **fixed** file compared in this report (`fixed/example_findings.json`, confirmed against `fix_detail.json` category "A5 string type, array example") already carries `scope` as `type: array, items: {type: string}` everywhere. Ours already types `scope` as an array too. No correction needed; recorded here only so nobody re-imports a bug that both sides already fixed.

**S6, TIMESTAMP header: confirms our correction, no contradiction.** Every `TIMESTAMP` parameter in the drop reads "ISO 8601 date-time: year, month, day, hour, minutes, seconds and milliseconds, e.g. `2024-09-03T11:20:51.456Z`" and every example uses the Postman `{{$isoTimestamp}}` variable, which emits exactly that UTC-with-`Z` format. This matches `catalogue/openapi/corrections/2026-08-26-timestamp-utc.md` exactly. See section 5.

**S7, `/profile/public/certificate` and the sandbox-verified atoms: confirmed, no contradiction.** The drop's response shape for the certificate call, `{"publicKey": "<base64 DER SubjectPublicKeyInfo>"}`, matches our `CertificateResponse` schema and the sandbox-observed body recorded in `catalogue/openapi/corrections/2026-08-26-sandbox-verification.md` (P6). `POST /v3/phr/app/enrollment/encrypt` (`m1_encrypt_value`, P7, verified `{"encryptedData": "..."}`) does not appear anywhere in this drop at all, so there is nothing to compare it against; flagged OURS-ONLY above, untouched.

## 3. Matched operation diffs, beyond the cross-cutting findings above

Only residual, operation-specific differences are listed per operation. Where an operation's only differences are S1/S2/S3, it is listed with just that reference.

**m1_enrolment_request_otp.** S3 (no body in ours; drop's 200 body: `message`, `txnId`). S2. No other material difference; both sides require `scope`, `loginHint`, `loginId`, `otpSystem`.

**m1_enrolment_by_aadhaar.** S4 (`Benefit-Name` vs `BENEFIT_NAME`). S2 (drop adds `422` here too, for the biometric/face-auth validation failure cases).

**m1_enrolment_verify_abdm_otp.** S3 (drop's 200 body: `accounts`, `authResult`, `message`, `txnId`). S2.

**m1_enrolment_address_suggestions.** S3 (drop's 200 body: `abhaAddressList`, `txnId`). S2. Header casing difference beyond S4: the drop names the transaction-id parameter `Transaction_Id`; ours documents it as `TRANSACTION_ID`. Same class of problem as S4, not separately corrected below, treat together.

**m1_enrolment_claim_abha_address.** Material difference in `preferred`. Before (ours): `preferred: {type: integer}`. After (drop): `preferred: {type: string, example: '1'}`. This looks like a straightforward "adopt the drop's type" case until you check the drop's own request-body `examples` block, which still has `preferred: 1` (a bare, unquoted integer) in two of its three named examples, `POST /abha/api/v3/enrollment/enrol/abha-address`'s `examples[ABHA Address]` and `[ABHA Address-Positive flow]`. This is exactly the residual bug the drop's own `payload_findings.json` flags: `"preferred", "1 is not of type 'string'"`. The property-level schema was fixed to say `string`; the full-payload example next to it was not. Do not import `string` on the strength of the schema alone; the drop is internally inconsistent about it. See correction 5. Also: drop's 200 body adds `abhaAddress`, `preferred`, `txnId`; ours' 200 body has `healthIdNumber` that the drop's 200 body does not carry here.

**m1_enrolment_face_auth_init.** S3 (drop's 200 body: `message`, `txnId`). S2.

**m1_enrolment_capture_pid.** S2 only. Ours already documents a 200 body (`status`, `message`, `txnId`); drop's 200 body does not add `txnId` at property level though its full example includes one, same under-declaration pattern noted for byDocument below.

**m1_enrolment_by_document.** Material difference, and ours is the more correct side. Before/after framing inverted here: the drop's request schema is `{type: object}` with **no `properties` key at all**, just a top-level `example` block listing `txnId`, `documentType`, `documentId`, `firstName`, `middleName`, `lastName`, `dob`, `gender`, `frontSidePhoto`, `backSidePhoto`, `address`, `state`, `district`, `pinCode`, `consent`. Ours declares every one of those 15 fields as a typed property. The field names in ours match the drop's own example exactly, so ours is the drop's example turned into a real schema, not an invention. Nothing to change here; noted so a future diff does not read "REQ PROPS only in OURS" as a gap. S2 (drop adds `422` here too).

**m1_enrolment_list_children.** S1 (`X-token required: true` in drop). S3 (drop's 200 body: `children`, `childrenCount`, `mobileNumber`, `parentAbhaNumber`). S2. Drop also adds a `Content-Type` request header parameter on this `GET`, which has no body; almost certainly a copy-paste artifact from a POST operation template rather than a real requirement, not worth importing.

**m1_find_abha_search.** S4-class header casing (`BENEFIT_NAME` only in ours; not present in the drop's params for this specific op at all, so nothing to reconcile here beyond the general S4 note). S2 (drop adds `404` for "not found").

**m1_login_search.** S2. Drop's 200 body has no properties captured beyond what's in the full example; ours documents `ABHANumber`, `gender`, `kycStatus`, `mobile`, `name` explicitly. Keep ours.

**m1_login_request_otp.** S4. Ours declares an extra `txnId` request property the drop's schema does not declare; same under-declaration pattern as byDocument (the drop's own examples for this path include a `txnId` field even though `properties` omits it), so keep it. S2 (drop's `404` here is "mobile number not registered", a real, useful addition; drop drops `422` that we do not carry to begin with, no loss).

**m1_login_verify.** S2, partially already covered: ours already has `400`, `401`, `404`, `422` in addition to `200`; the drop adds `403` and `500` that ours lacks, and does not carry `422` (see the `reasons` note under `m1_profile_verify_otp` below for why `422`-shaped validation may not be reliable in this drop anyway). Material difference in the `404` body: drop's `error` property is declared `type: object` but its own schema-level `example` key is the bare string `"900901"`, contradicting the nested `properties.code`/`properties.message` shape one line below it, whose own examples are `"ABDM-1114"` / `"No ABHA user registered with this Aadhaar number."`. Trust the nested shape (`{code, message}`, matching our own error atom convention), not the object's own broken top-level example. This is the type-mismatch the task brief pointed at in `example_findings.json`; confirmed present in the fixed file, not something to propagate.

**m1_login_select_account.** S1 (`T-token required: true` in drop; ours has it optional). S3 (drop's 200 body: `expiresIn`, `refreshExpiresIn`, `refreshToken`, `token`, i.e. a full token-issuance response; ours has none). S2.

**m1_profile_request_otp.** S1. S3 (drop's 200 body: `message`, `txnId`). S2.

**m1_profile_verify_otp.** S1. S2 (drop adds `422` here too). Material difference in `reasons`. Before (ours): `reasons` not in `required`. After (drop): `required: [scope, authData, reasons]`. Do not adopt `required` on `reasons`. The drop's own `payload_findings.json` shows 6 of its own named examples on this exact operation failing validation with `"'reasons' is a required property"` (Deactivate/Delete via Password, Re-KYC, Update Mobile, Update Email, and both password-flow examples), i.e. most of the drop's own recorded real-world payloads omit it. A schema `required` list that the source's own majority of examples violate is not evidence the field is actually mandatory across every use of this shared verify endpoint (delete, deactivate, re-KYC, password, mobile update, email update all share it); it more likely means `reasons` is required for a subset of `purpose` values only. See correction 6, needs sandbox, not a straight import. S3 does not apply, ours already has `400`, `401`, `403` (would be added), `422` bodies documented for this one via component reuse; verify before assuming otherwise.

**m1_profile_get_account.** S1. S3 (drop's 200 body is a full profile object: `ABHANumber`, `address`, `authMethods`, `createdDate`, `dayOfBirth`, `districtCode`, `districtName`, `firstName`, `gender`, `kycPhoto`, `kycVerified`, `lastName`, `localizedDetails`, `middleName`, `mobile`, `monthOfBirth`, `name`, `pincode`, `preferredAbhaAddress`, `profilePhoto`, `stateCode`, `stateName`, `status`, `subdistrictName`, `tags`, `verificationStatus`, `verificationType`, `yearOfBirth`). This is the single largest content gap found in this diff: ours documents zero fields for the account read call. S2.

**m1_profile_update_account.** S1 (drop drops `X-token` from this operation's parameter list entirely, see correction 8, do not mirror this without sandbox confirmation). S4. Material difference in five field types on the 200 response: `dayOfBirth`, `monthOfBirth`, `yearOfBirth`, `stateCode`, `districtCode` are `type: integer` in the drop (examples `26`, `2`, `2021`, `27`, `290`, all genuinely numeric, no internal contradiction the way `preferred` and `reasons` have one) versus `type: string` in ours. Unlike `preferred`, this one looks like a real, clean correction; see correction 7. Request-body material difference: 4 fields (`name`, `dob`, `abhaNumber`, `gender`) move from optional in ours to `required` in the drop; ours additionally accepts `accountStatus`, `mobile`, `profilePhoto` on the request that the drop's request schema does not mention (the drop's 200 response schema does carry a superset of read-only fields, so this looks like ours modelling the request body against the response body rather than NHA's narrower documented input; worth a sandbox PATCH to settle which fields the endpoint actually accepts). S2.

**m1_send_email_verification_link.** Material difference: the drop's request schema adds `otpSystem` (`type: string`, required, example `"abdm, aadhaar"`) which our request schema does not have. Ours declares `loginHint` as `enum: [email]`; the drop leaves it a free string with example `"email"`, no enum. Keeping our enum is reasonable enrichment, not a bug; adding `otpSystem` is a real gap. S2. S3 does not apply, ours already documents a `MessageResponse` 200 body; drop's 200 body additionally carries `txnId`.

**m1_profile_get_qr_code.** S1. S2.

**m1_profile_get_abha_card.** S1. S2.

**m1_benefit_link_or_delink.** S4. Material difference: `loginId` and `loginHint` move from optional in ours to `required` in the drop. S2 (drop adds `403`, `500`; ours already has `400`, `401`). Drop also drops the `X-token` parameter here entirely, same pattern as `m1_profile_update_account`; note but do not import without sandbox confirmation, this operation plainly needs to know who is acting.

**m1_benefit_search.** S4. S2 (drop adds `404`).

**m1_phr_search_abha_address.** S2. S3 does not apply (ours has an `AuthMethodsResponse` 200 body, drop's is much fuller: `abhaAddress`, `blockedAuthMethods`, `fullName`, `healthIdNumber`, `message`, `mobile`, `status`, in addition to `authMethods`). Two residual, harmless audit-flagged bugs on this exact response, confirmed still present in the fixed file and specifically called out in `fixed/example_findings.json`: `blockedAuthMethods.items` is `type: string` with `example: null`, and `message` is `type: string` with `example: null`. Both are cosmetic (a `null` example on a string field breaks nothing at the wire level) but do not copy the literal `example: null` if this response gets adopted; use a real sample or omit the example.

**m1_phr_request_otp.** Material difference: drop's request schema adds `otpSystem`, same as the email-verification-link operation above. Ours declares `loginHint: enum: [abha-address]`; drop leaves it unconstrained. S2.

**m1_phr_verify.** S2. Response shape difference beyond a simple superset: ours documents `accounts`, `expiresIn`, `refreshExpiresIn`, `refreshToken`, `token` at the top level; the drop nests the equivalent information under `tokens` and `users` plus top-level `authResult`, `message`. Not a small rename, a different envelope; if this response gets rewritten from the drop, it is a full replacement of the shape, not an additive patch.

**m1_get_phr_profile.** S1 (drop adds `X-token`, required, that ours' equivalent operation does not currently list as a parameter at all, the reverse direction from the S1 pattern elsewhere: here it's ours missing the header, not the requiredness). S2. Response shape: ours has a compact `ABHAAddress`, `ABHANumber`, `dob`, `name`; the drop has a much larger flat object (`abhaAddress`, `abhaNumber`, `address`, `authMethods`, `dateOfBirth`, `dayOfBirth`, `districtCode`, `emailVerified`, `firstName`, `fullName`, `kycStatus`, `lastName`, `middleName`, `mobileVerified`, `monthOfBirth`, `pinCode`, `stateCode`, `stateName`, `status`, `subDistrictCode`, `subDistrictName`, `yearOfBirth`). Note the field-name casing swap too, `ABHAAddress`/`ABHANumber` (ours) vs `abhaAddress`/`abhaNumber` (drop), a real wire-format question, not just style. Also `profilePhoto` and `email` are `type: [string, null]` in ours (explicitly nullable) vs plain `type: string` in the drop; keep ours' nullability unless sandbox shows the field is never absent.

**m1_download_phr_card.** S1 (drop adds `X-token`, missing from ours here too, same direction as `m1_get_phr_profile`). Material difference in success status code: drop's success response is `202` ("Indicates a successful generation of PHR card"), not `200`; ours uses `200`. Content type and body are otherwise equivalent, an image. `202 Accepted` for what reads as a synchronous PNG return is an unusual choice and matches the pattern already flagged as suspect in `gateway.md` for the session-token call; do not change our status code without a real sandbox response in hand. See correction 10.

**m1_download_phr_qr_code.** S1 (same missing `X-token` direction). S2.

**m1_benefit_get_by_abha.** S3 (drop's 200 body: `abhaNumber`, `programme`). S4-class header casing on `Benefit-Name`/`BENEFIT_NAME`, path parameter also differs in case only (`abhanumber` in the drop vs `abhaNumber` in ours; path templates are case-sensitive text but the literal URL segment sent by a client is whatever value is substituted in, so this has no wire effect). S2.

**m1_benefit_get_state_district.** S3 (drop's 200 body: `abhaNumber`, `districtCode`, `stateCode`, `status`). S4-class header casing, same as above. S2.

**m1_benefit_search_insurance.** S2, mostly already covered: ours already has `400`, `401`, `500` here; drop adds `403`, `404` that ours lacks.

**m1_token_refresh.** S1 (`R-token required: true` in drop). S3 (drop's 200 body: `expiresIn`, `refreshExpiresIn`, `refreshToken`, `token`, a full token-issuance response, same shape family as the login/verify-user response). S2.

**m1_get_public_certificate.** S7 (confirmed, no contradiction). Drop's 200 body adds one field ours does not carry, `encryptionAlgorithm` (example not distinctly informative, likely `RSA`/similar; check the actual sandbox response before trusting the drop's value verbatim). S2.

**m1_profile_logout (path text mismatch).** The drop's path, `/abha/api/v3/account/request/logout`, is missing the `profile` segment every other operation in this file keeps (`/abha/api/v3/profile/account/...`). Everything else about the operation matches ours exactly: summary, tag, the three headers (`REQUEST-ID`, `TIMESTAMP`, `X-token`, and per S1 the drop marks `X-token` required here too), and a 200 body of `message` + `timestamp` that ours does not currently document (S3-class, add it). Given every sibling path keeps `profile/account`, this reads as a typo in the drop's source rather than an intentional path change, but it is exactly the kind of claim that should be settled by one real sandbox call against both URLs, not assumed either way. See correction 9.

## 4. New-in-drop operations

Both rows classified NEW-IN-DROP above are explained in section 1: the gateway session call belongs to `gateway.yaml` and is already covered by `gateway.md`, and the logout path variant is the same operation as `m1_profile_logout` with a missing path segment, folded into its entry in section 3. There is no operation in this drop that represents genuinely new M1/ABHA surface beyond what `hiecm-m1.yaml` already models.

## 5. Recommended corrections

1. **HIGH.** Backfill 200 response schemas for the 12 operations listed under S3 that currently document no body at all (`m1_enrolment_request_otp`, `m1_enrolment_verify_abdm_otp`, `m1_enrolment_address_suggestions`, `m1_enrolment_face_auth_init`, `m1_profile_request_otp`, `m1_profile_verify_otp`, `m1_profile_get_account`, `m1_token_refresh`, `m1_login_select_account`, `m1_enrolment_list_children`, `m1_benefit_get_by_abha`, `m1_benefit_get_state_district`), sourced from the drop's schemas, marked `unverified` the same as everything else in this file, and recorded as a correction citing this report. Do not carry over the residual bugs noted in section 3 (bare `example: null` on string fields, the `error` object's broken top-level example on login/verify's 404) while doing it.

2. **HIGH.** Add `400`, `401`, `403`, `500` (and `404`/`422` where the per-operation notes above say the drop has them) to the 29 operations that currently document only `200`. Import the status codes and the `{error: {code, message}}` shape; do not import the drop's per-code prose verbatim, most of it is boilerplate reused across unrelated operations (see `gateway.md` for the established pattern of the same boilerplate appearing on completely different endpoints).

3. **HIGH.** Override `required: true` on the `X-token` parameter for the specific operations listed under S1 where the drop requires it (all matched operations that carry `X-token` except `m1_enrolment_by_aadhaar`), on `T-token` for `m1_login_select_account`, and on `R-token` for `m1_token_refresh`. Since these are shared `$ref` components in ours, this needs either per-operation inline overrides or splitting the component into required/optional variants; do not flip the shared component's default to `true` globally, `m1_enrolment_by_aadhaar` genuinely needs it optional.

4. **MEDIUM, needs sandbox.** Settle `Benefit-Name` vs `BENEFIT_NAME` (S4) the same way the timestamp header was settled: one real call with each spelling, see which one the sandbox accepts. Our current documentation is sourced from NHA's own Postman collection (real recorded traffic); this drop's swagger file disagrees with it. Neither source wins by default.

5. **MEDIUM, needs sandbox, do not import blindly.** Do not set `preferred` to `type: string` on `m1_enrolment_claim_abha_address` purely because the drop's schema says so. The drop's own request `examples` for this exact field still use a bare integer `1`, contradicting its own schema, and this is a confirmed residual entry in the drop's own `payload_findings.json`. Send one real request with `preferred` as an integer and one as a string and see which the sandbox accepts before touching ours.

6. **LOW, do not import.** Do not mark `reasons` required on `m1_profile_verify_otp`. The drop's own `payload_findings.json` shows 6 of its own named examples for this operation failing schema validation specifically because they omit `reasons`. A `required` list the source's own majority of examples violate is not something to copy in; more likely `reasons` is conditionally required depending on the shared endpoint's `purpose`, which the drop does not model. Leave optional pending a sandbox test across a few `purpose` values.

7. **MEDIUM.** Retype `dayOfBirth`, `monthOfBirth`, `yearOfBirth`, `stateCode`, `districtCode` from `string` to `integer` on `m1_profile_update_account`'s 200 response. Unlike `preferred` and `reasons`, this one has no internal contradiction in the drop, the schema type and every example agree it's numeric. Still MEDIUM rather than HIGH because it is a breaking type change for any existing consumer parsing these as strings; call it out explicitly in the correction commit.

8. **MEDIUM.** Add `otpSystem` (required, `type: string`) to the request schemas of `m1_send_email_verification_link` and `m1_phr_request_otp`. Both are currently missing a field the drop marks required and gives a concrete example for (`"abdm, aadhaar"`).

9. **LOW, needs sandbox, do not change our path.** The drop's logout path is missing a `profile` segment (`/abha/api/v3/account/request/logout` vs every sibling's `/abha/api/v3/profile/account/...`). Everything else about the operation matches `m1_profile_logout` exactly. Treat as a typo in the drop rather than a second real endpoint unless a sandbox call against the shorter path actually succeeds; if it does, record both as valid rather than picking one.

10. **LOW, needs sandbox, do not adopt without confirmation.** Two operations, `m1_profile_update_account` and `m1_benefit_link_or_delink`, have the `X-token` parameter present in ours but absent from the drop's parameter list entirely. Both operations plainly need to identify which person's account is being acted on, so this reads as a documentation omission in the drop rather than a real requirement change. Do not remove `X-token` from either operation in ours on the strength of this drop alone.

11. **LOW, needs sandbox, do not adopt without confirmation.** `m1_download_phr_card`'s success status in the drop is `202`, not the `200` ours currently documents, for what otherwise reads as a synchronous PNG return. Same shape of claim as the `202` findings already raised against the gateway session and bridge-url calls in `gateway.md`; settle with one real call rather than trusting either side.

12. **LOW.** Two header parameters carry casing-only variants worth a single pass, not urgent: `Transaction_Id` (drop) vs `TRANSACTION_ID` (ours) on `m1_enrolment_address_suggestions`, and the path parameter case `abhanumber` (drop) vs `abhaNumber` (ours) across the three benefit-by-ABHA-number lookups, which has no wire effect since it is a substituted value, not a literal segment, but is worth normalising in our own examples for consistency.

## 6. Contradictions with recorded corrections

- **Timestamp UTC correction** (`catalogue/openapi/corrections/2026-08-26-timestamp-utc.md`). No contradiction. Confirmed under S6: every `TIMESTAMP` parameter in this drop describes UTC with milliseconds and a `Z` suffix and every example uses Postman's `$isoTimestamp`, which the correction file itself already identified as emitting that format. This drop reinforces the correction, it does not challenge it.

- **Sandbox verification, P6 and P7** (`catalogue/openapi/corrections/2026-08-26-sandbox-verification.md`). No contradiction. Confirmed under S7: the certificate response shape in the drop matches the sandbox-observed `{"publicKey": "..."}` body exactly. The encrypt endpoint (P7) is absent from this drop entirely, so it is neither confirmed nor contradicted, just untouched.

- **C3, the UUID `format` removal** (`catalogue/openapi/corrections/2026-08-25-m1-m2-m3-ingest.md`, `RequestId` parameter in `hiecm-gateway.yaml`). No contradiction and no new evidence either way. The drop's `REQUEST-ID` examples throughout `abha-api-v3.yaml` are the Postman variable `{{$randomUUID}}`, which does not settle whether real production values are UUID-shaped; C3 remains open pending a real sandbox observation of a non-Postman request.

- **No conflict found on `scope`.** Flagged separately from the corrections list above because the task brief for this report specifically asked to check it: the audit's "`scope` type=string but example is a list" finding (S5) is against the unfixed file only. The fixed file this report compares against, and our own file, already agree `scope` is an array. Recorded so the next person does not spend time re-verifying this.
