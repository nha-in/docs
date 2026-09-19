---
title: Sandbox integration learnings, 2026-09-16
description: What an end-to-end ABDM V3 sandbox integration observed on 2026-09-16 where the Catalogue and the sandbox disagreed, with the request and response shapes seen.
---

# Sandbox integration learnings, 2026-09-16

Collected while building an HMIS frontend plus a HIP and HIU backend that calls ABDM V3 directly. All observations are from **2026-09-16** against `abhasbx.abdm.gov.in` and `dev.abdm.gov.in`, with the integrator's own sandbox client id written as `<HIP_ID>` throughout.

This file is a source for atoms. Each finding has the symptom, the root cause, the fix shipped, and where applicable what the catalogue said versus what the sandbox did.

**Evidence labels:**
- `observed`: seen in a real sandbox request or response, logged by the integrator.
- `inferred`: best explanation, not isolated by a dedicated test.
- `untested`: implemented but not yet exercised end to end.

---

## 0. Summary

| # | Area | Catalogue said | Sandbox reality | Evidence |
|---|---|---|---|---|
| 1 | M1 X-token | Send bare token; `Bearer ` prefix gives ABDM-1094 | Bare user token gives `400 {"message":"Invalid X-token"}`; `Bearer <token>` is required | observed |
| 2 | M1 login verify | Token from verify is always a transfer token; always call `verify/user` | **Aadhaar OTP** returns the final user token (`expiresIn:1800` plus `refreshToken`). Calling `verify/user` with it gives `400 Invalid T-token`. **Mobile OTP** returns a 300 s transfer token that must be exchanged | observed |
| 3 | M1 PHR login | Not documented which RSA key the `/v3/phr/*` calls use | `/v3/phr/*` needs the **2048-bit** key from `/v3/phr/app/login/public/certificate`. The 4096-bit profile key gives `ABDM-1006 Invalid mobile number` | observed |
| 4 | M1 PHR mobile login | `loginHint` examples used `mobile` | `/v3/phr/app/login/request/otp` needs `loginHint:"mobile-number"`; `mobile` gives `ABDM-9999 Invalid Login Hint` | observed |
| 5 | M2 link | `abhaNumber` is a string (dashed format implied) | Dashed `91-1234-...` gives **400 with empty body**; digits-only string works | observed |
| 6 | M2 link | `hiType` is an array | String `"HealthDocumentRecord"` gives 202; array gives 400 | observed |
| 7 | M2 on_carecontext | Success = `status:"SUCCESS"` | `status:"Successfully Linked care context"`; treat "no `error` object" as success | observed |
| 8 | M2 context notify | Call after link | Notify within about 0 to 5 s of the link callback often gives `ABDM-1006 No care context linked`; a resend minutes later succeeds | observed |
| 9 | Gateway JWKS | `/gateway/v3/certs` needs no auth | v3 certs gives **401** without session token plus standard headers. (`/gateway/v0.5/certs` is public) | observed |
| 10 | M3 HIU notify | Spec enum `RECEIVED|FAILED` vs flow doc `TRANSFERRED` | `sessionStatus:"TRANSFERRED"` with `notifier.type:"HIU"` gives 202 `{"status":"Notification is Accepted"}` | observed |
| 11 | M3 on-request | `sessionStatus` ACKNOWLEDGED | HIU on-request callback carries `sessionStatus:"REQUESTED"` | observed |
| 12 | Scan and Share QR | Format not in catalogue | `https://phrsbx.abdm.gov.in/share-profile?hip-id=<HIP_ID>&counter-id=<COUNTER>`; scanned successfully from a PHR app | observed |
| 13 | Bridge | Not covered | `PATCH /gateway/v3/bridge/url` is **last-writer-wins per client id**. A shared client silently sends callbacks elsewhere. No API reads the URL back (`endpoints:{}`) | observed |
| 14 | Error bodies | `{error:{code,message}}` | At least 5 shapes, including a top-level array and codes with a trailing `": "` (see 1.4) | observed |

---

## 1. Cross-cutting (gateway, headers, crypto, bridge)

### 1.1 Credentials
- Use the client id and secret issued for `dev.abdm.gov.in`. Credentials issued by any wrapper or intermediary do not reach the ABDM gateway.

### 1.2 Standard headers (confirmed working)
```
Authorization: Bearer <gateway accessToken>
REQUEST-ID: <uuid v4, fresh per call>
TIMESTAMP: 2026-09-16T10:12:48.483Z      # UTC, milliseconds, Z
X-CM-ID: sbx
X-HIP-ID: <HIP_ID>                       # sent on every HIP call, harmless where undeclared
X-HIU-ID: <HIP_ID>                       # on consent init/fetch/on-notify, HI request, HIU notify
```
- **Session:** `POST https://dev.abdm.gov.in/api/hiecm/gateway/v3/sessions` with `{clientId, clientSecret, grantType:"client_credentials"}`. Use `expiresIn`, refresh 30 s early, and drop the cached token on any 401.

### 1.3 ABDM RSA public keys: two keys, chosen by path
| Calls | Certificate | Key |
|---|---|---|
| `/v3/enrollment/*`, `/v3/profile/*` | `GET /v3/profile/public/certificate` | RSA 4096 |
| `/v3/phr/*` (ABHA address and PHR login) | `GET /v3/phr/app/login/public/certificate` | RSA 2048 |

- **Response format:** `{"publicKey":"<base64 DER, no PEM armour>","encryptionAlgorithm":"RSA/ECB/OAEPWithSHA-1AndMGF1Padding"}`. Wrap it in PEM yourself at 64 characters per line.
- **Padding:** OAEP with SHA-1 for both digest and MGF1 (`crypto.publicEncrypt({padding: RSA_PKCS1_OAEP_PADDING, oaepHash:"sha1"})` in Node).
- **Wrong key symptom:** `[{"code":"ABDM-1006: ", "message":"Invalid mobile number"}]`. It looks like bad input, not bad crypto.
- **Encrypt helper:** `/v3/phr/app/enrollment/encrypt` takes `{"data":"..."}`. `{"value":"..."}` gives `ABDM-9999 Invalid Data`.
- **Fix shipped:** the client picks the certificate from the path prefix, and caches both.

### 1.4 Error body shapes seen (parse all of them)
```jsonc
{"error":{"code":"ABDM-1006","message":"..."}}            // documented
[{"code":"ABDM-9999: ", "message":"Invalid Login Hint"}]  // top-level ARRAY, code has trailing ": "
{"code":"ABDM-9999","message":"User not found"}         // flat
{"message":"Invalid X-token","timestamp":"2026-09-16 14:34:55"}
{"loginId":"Invalid LoginId","timestamp":"..."}         // field-keyed
(empty body, HTTP 400)                                   // link/carecontext with dashed abhaNumber
```
- **UI bug caused:** the error parser assumed an object, so users saw a bare "HTTP 400".
- **Fix:** handle arrays, flat and field-keyed shapes, and strip trailing `:` and spaces from codes.

### 1.5 Callback authentication (JWKS)
- **Symptom:** every callback logged `not verified (jwks: EOF)`.
- **Cause:** `GET /gateway/v3/certs` returns **401** without the session token and standard headers.
- **Fix:** fetch the JWKS through the authenticated gateway client. Afterwards, all callbacks verified (RS256, `Authorization: Bearer <jwt>`, `kid` present).
- The Authorization header on callbacks is an RS256 JWT verifiable against v3 certs: **observed**.

### 1.6 Bridge URL ownership (biggest time sink)
- **Symptom:** Scan and Share scans produced no callback at all. Earlier, data-flow callbacks also stopped for about 2 hours.
- **Cause:**
  - `<HIP_ID>` was also registered as the bridge of another system sharing the same client id.
  - `PATCH /gateway/v3/bridge/url` replaces the URL for the whole client id, so whichever system patched last receives **all** callbacks.
  - A restore command on the other system pointed the URL back at it, and every scan went there.
- **Detection:** `GET /gateway/v3/bridge-service/serviceId/{id}` returns `"endpoints":{}`, so you cannot read which URL is registered.
- **Fix:** re-register, then prove delivery with a cheap round trip. Linking a test care context returned `on_carecontext` within 1 s.
- **Recommendations:**
  - Add a **"prove callback delivery"** check after any bridge URL change: link a care context, or send consent init and wait for `on-init`.
  - Warn when a client id is known to be shared.
  - Document last-writer-wins.
- **Related:** `facilitysbx.abdm.gov.in/v1/bridges/MutipleHRPAddUpdateServices` was **network-unreachable** from a dev laptop, and `apihspsbx.abdm.gov.in` returned 503. Neither was needed: `GET bridge-service/serviceId/<HIP_ID>` already showed `isHip:true,isHiu:true,isPhr:true,active:true`. Check before trying to register.

### 1.7 Tunnels
- A tunnel whose public URL changes on restart needs a bridge re-PATCH plus the 1.6 delivery proof after every change.
- The admin API must not be reachable through the tunnel. Requests carrying `X-Forwarded-For` or a non-loopback remote address are rejected (403 via tunnel, verified).

### 1.8 Fidelius-compatible ECDH on a standard library
- **Reimplemented on the Go standard library**, without any third party ECDH package:
  - **Key maths:** Fidelius and BouncyCastle use the **short-Weierstrass form of Curve25519**, where Weierstrass `x = u + A/3 (mod p)` with `A = 486662`. The scalar maths runs on X25519, and only the encoding is converted.
  - **Public key format:** X.509 SPKI with OIDs `1.2.840.10045.2.1` and `1.3.6.1.4.1.3029.1.5.1`, containing an uncompressed point `04||x||y` (y recovered with a modular square root).
  - **Derivation:** `xor = ourNonce ^ peerNonce`, `salt = xor[0:20]`, `iv = xor[20:32]`, `key = HKDF-SHA256(sharedX, salt, 32)`, then AES-256-GCM with the tag appended, base64.
- **Unit test:** curve constants `a`, `b` and generator `x` match values derived from the Montgomery equation.
- **Peer key encodings (observed):** incoming HIU key material used explicit-parameter SPKI (`MIIBMTCB6gYHKoZIzj0CAT...`). Taking the trailing 65 bytes as the point works for both the named-curve and the explicit-parameter encodings.
- A reference implementation or a Fidelius test vector in the catalogue would save a day. Recommend "take last 65 bytes of SPKI" for peer keys.

### 1.9 Implementation pitfalls
- **Idempotency:** ABDM retries callbacks. Dedupe on the inbound `REQUEST-ID` header.

---

## 2. M1: ABHA creation and verification

### 2.1 X-token must carry `Bearer ` (catalogue said the opposite)
- **Symptom:** login succeeded (`verify/user` gave 200, `expiresIn:1800`), then `GET /v3/profile/account` and `/abha-card` gave `400 {"message":"Invalid X-token"}`.
- **Cause:** the catalogue said to send the bare token.
- **Fix:** `X-token: Bearer <token>`. Subsequent profile and card calls proceeded without X-token errors (observed across later sessions; not isolated in a single A/B test).
- The earlier "Bearer gives ABDM-1094" observation was made with a **transfer token**, which fails either way. Record this as the reason for the confusion.

### 2.2 Transfer token vs user token depends on the OTP system
| Login | `verify` returns | Next step |
|---|---|---|
| Mobile OTP (`abha-login` plus `mobile-verify`) | `token` (`expiresIn:300`) plus `accounts[]` | `POST /v3/profile/login/verify/user` with `T-token: Bearer <token>` and body `{ABHANumber, txnId}` gives the user token (1800 s) |
| Aadhaar OTP (`abha-login` plus `aadhaar-verify`) | `token` (`expiresIn:1800`) **plus `refreshToken`** plus `accounts[]` | **Use directly as X-token.** `verify/user` gives `400 Invalid T-token` |
- **Rule shipped:** if the verify response has `refreshToken`, it is the final token; otherwise exchange it.
- The "always exchange via verify/user" guidance is wrong for Aadhaar OTP.

### 2.3 Mobile login only returns KYC ABHA numbers
- **Symptom:** mobile login listed 2 accounts, both `kycVerified:true`, and no self-declared addresses.
- **Cause:** `/v3/profile/login` lists **ABHA numbers** (always KYC). Self-declared ABHA addresses have no ABHA number.
- **Fix:** add a PHR login that lists every address on the mobile.
  ```
  POST /v3/phr/app/login/request/otp   (2048-bit PHR key)
    {"scope":["abha-address-login", "mobile-verify"],"loginHint":"mobile-number","loginId":"<enc>","otpSystem":"abdm"}
  POST /v3/phr/app/login/verify
    -> {"users":[{abhaAddress, abhaNumber|null, fullName, kycStatus:"VERIFIED"|"PENDING", status}], "tokens":{"token":<300s transfer>}}
  POST /v3/phr/app/login/verify/user   T-token: Bearer <tokens.token>
    {"abhaAddress":"...","txnId":"..."}     -> without T-token: 401 empty body
  ```
- **Result:** 14 addresses on one mobile, including 3 `PENDING` with no ABHA number.
- **Gotchas:**
  - `loginHint:"mobile"` gives `Invalid Login Hint`.
  - The profile key instead of the PHR key gives `ABDM-1006 Invalid mobile number`.
  - `/v3/phr/web/login/abha/request/otp` with `loginHint:"mobile-number"` gives `ABDM-9999 User not found`, so only the `/phr/app/` path lists by mobile.

### 2.4 Other M1 notes
- **ABHA number plaintext** must keep dashes (`91-1234-0704-2043`) for `loginId` (catalogue correct).
- **Error display:** array error bodies (1.4) surfaced as "HTTP 400" until the parser was fixed.
- **Response fields parsed defensively, not yet confirmed:**
  - enrol/byAadhaar: `tokens.token`, `ABHAProfile`, `isNew`
  - suggestion: `abhaAddressList`
  - abha-address response
  - whether a `/phr/app` token works on `/phr/web/login/profile/abha-profile` and `/phr-card`

---

## 3. M2: HIP (linking and data transfer)

### 3.1 Confirmed callback paths on the bridge
```
POST /api/v3/hip/token/on-generate-token      {"abhaAddress","linkToken","response":{"requestId"}}
POST /api/v3/link/on_carecontext               {"abhaAddress","status":"Successfully Linked care context","response":{"requestId"}}
POST /api/v3/links/context/on-notify           {"acknowledgement":{"status":"SUCCESS"|"ERRORED"},"error"?,"response":{"requestId"}}
POST /api/v3/consent/request/hip/notify        {"notification":{"status","consentId","consentDetail":{schemaVersion:"v3",patient,careContexts,purpose,hip,consentManager:{id:"sbx"},hiTypes,permission}}}
POST /api/v3/hip/health-information/request    {"requestId":"","timestamp":"","transactionId","hiRequest":{consent,dateRange,dataPushUrl,keyMaterial}}
```
Every one uses the `/api/v3/...` prefix; the catalogue's v0.5 paths never fired. In the HI request, the body's `requestId` and `timestamp` are empty strings, so take them from the headers.

### 3.2 `link/carecontext`: 400 with an empty body
- **Symptom:** `POST /hip/v3/link/carecontext` gives 400, no body.
- **Cause:** `abhaNumber:"91-1234-0704-2043"` (dashed).
- **Fix:** `abhaNumber:"91123407042043"` gives 202, then `on_carecontext` success.
- **Also:**
  - `hiType` as a **string** works; the array form from the catalogue fails.
  - `generate-token` accepts `abhaNumber` as an integer (as documented).
  - The link token is reusable for later care contexts.

### 3.3 Success status is prose
- `on_carecontext.status` = `"Successfully Linked care context"`, never `SUCCESS`.
- The first version marked successful links as failed. Treat the absence of `error` as success.

### 3.4 Context notify races the link
- **Symptom:** `/hip/v3/link/context/notify` sent immediately after `on_carecontext` gives `on-notify {"acknowledgement":{"status":"ERRORED"},"error":{"code":"ABDM-1006: ","message":"No care context linked with given reference number"}}`.
- **What worked:**
  - Resending the same notify a few minutes later gives 202, and it triggered the PHR app to self-request consent and pull data.
  - A 5 s delay worked once (`on-notify SUCCESS`) but not every time.
- **Status:** partially fixed (fixed 5 s delay). **Recommended:** retry on `ABDM-1006` with backoff (5 s, 15 s, 60 s) using the on-notify callback.
- Document the eventual-consistency window and recommend retry.

### 3.5 Linking triggers an automatic data pull
- Within about 5 to 10 s of a successful notify, the gateway delivered `consent/request/hip/notify` (purpose `PATRQT` "Self Requested") and then `health-information/request`.
- The sandbox PHR app auto-fetches newly linked records. The HIP must be ready to serve data **immediately** after linking.

### 3.6 Data push and notify
| Call | Result |
|---|---|
| `POST /data-flow/v3/health-information/hip/on-request` | **200** (not 202) |
| Data push to `dataPushUrl` | 200 or 202, set by the receiving HIU |
| `POST /data-flow/v3/health-information/notify` (HIP, `TRANSFERRED`, `hiStatus:"OK"`) | 202 `{"status":"Notification is Accepted"}` |
| FHIR `HealthDocumentRecord` bundle | passed `validate_fhir` after adding `Bundle.meta.versionId` |

- Push body: `{pageNumber,pageCount,transactionId,entries:[{content, media:"application/fhir+json", checksum(md5 hex), careContextReference}],keyMaterial:{cryptoAlg:"ECDH",curve:"Curve25519",nonce,dhPublicKey:{expiry,parameters:"Curve25519/32byte random key",keyValue:<X.509>}}}`.

### 3.7 Untested M2 paths
- User-initiated discovery `/api/v3/hip/patient/care-context/discover`, link init/confirm, and the on-discover/on-init/on-confirm bodies are implemented, but no PHR-initiated discovery has been exercised yet.
- The OTP for user-initiated linking is printed to the server console, since the sandbox has no SMS.

---

## 4. M3: HIU (consent and data fetch), full loop observed

| Step | Call / callback | Observed |
|---|---|---|
| 1 | `POST /consent/v3/request/init` (plus `X-HIU-ID`) | 202 |
| 2 | `/api/v3/hiu/consent/request/on-init` | `{"consentRequest":{"id"},"error":null,"response":{"requestId"}}`. Body shape was **not in docs**; now confirmed |
| 3 | Patient approves in PHR app, then `/api/v3/hiu/consent/request/notify` | `{"notification":{"consentRequestId","status":"GRANTED","consentArtefacts":[{"id"}]}}`. `requestId` only in header |
| 4 | `POST /consent/v3/request/hiu/on-notify` `{"acknowledgement":[{consentId, status:"OK"}],"response":{requestId}}` | 202 |
| 5 | `POST /consent/v3/fetch` `{consentId}` | 202, then `/api/v3/hiu/consent/on-fetch` `{"consent":{"status":"GRANTED","consentDetail":{...,"permission":{dateRange...}}}}` (no `careContexts` issue seen) |
| 6 | `POST /data-flow/v3/health-information/request` with HIU key material, `dataPushUrl` = `<bridge>/api/v3/hiu/data/push/<consentId>` | 202, then `/api/v3/hiu/health-information/on-request` `{"hiRequest":{"transactionId","sessionStatus":"REQUESTED"}}` |
| 7 | Data push arrives (620 KB, 4 entries including a PDF) | Decrypted **8/8 records, 0 errors** across 2 consents |
| 8 | `POST /data-flow/v3/health-information/notify` `notifier.type:"HIU"`, `sessionStatus:"TRANSFERRED"`, `hiStatus:"OK"` | 202 `{"status":"Notification is Accepted"}` |

**Learnings:**
- **Patient can change the date range:** in the second consent, the patient narrowed it in the PHR app (`from` 2016 to 2024-09-19). The HIU must build the HI request from the **artefact's** `permission.dateRange` (from on-fetch), not from its own init request, or it gets ABDM-1063.
- **Consent id in the push URL:** putting the consent id in `dataPushUrl` avoids a race. The push arrived in the same second as `on-request`, before a `transactionId`-based lookup could be stored.
- **Keep the private key:** store it until the push arrives (kept in the database, keyed by consent), so a restart between request and push can still decrypt.
- **Enum conflict settled:** `TRANSFERRED` is accepted for HIU notify, so that conflict is resolved in practice.
- **Caveat on crypto proof:** these records came from the same integrator's HIP (same crypto code on both sides). An M3 fetch from a third-party HIP is still pending.

---

## 5. Scan and Share

### 5.1 QR format (not in catalogue)
```
https://phrsbx.abdm.gov.in/share-profile?hip-id=<HIP_ID>&counter-id=OPD1
```
- Confirmed by a successful scan from a PHR app.
- Counter id: 1 to 20 alphanumeric characters.

### 5.2 Callback and reply (observed)
```jsonc
// inbound: POST /api/v3/hip/patient/share
{"intent":"PROFILE_SHARE",
 "metaData":{"hipId":"<HIP_ID>","context":"OPD1","hprId":null,"latitude":"12.97","longitude":"77.71"},
 "profile":{"patient":{"abhaNumber":null,"abhaAddress":"<ABHA_ADDRESS>","name":"...","gender":"M",
   "dayOfBirth":"6","monthOfBirth":"6","yearOfBirth":"2000",
   "address":{"line":"...","district":"<DISTRICT>","state":"<STATE>","pincode":"<PINCODE>"},"phoneNumber":"<MOBILE>"}}}

// outbound: POST https://dev.abdm.gov.in/api/hiecm/patient-share/v3/on-share -> 202
{"acknowledgement":{"abhaAddress":"<ABHA_ADDRESS>","status":"SUCCESS",
  "profile":{"context":"OPD1","tokenNumber":"1","expiry":"1799"}},
 "response":{"requestId":"<REQUEST-ID header of the inbound share>"}}
```
- **Field formats:**
  - `abhaNumber` can be `null` (address-only ABHA).
  - Birth parts are **strings**.
  - `pincode` is lowercase `c` (the M1 spec variant says `pinCode`).
- **Token rules shipped:** sequential per counter per day (1, 2, 3...), 30-minute validity, and a rescan within validity returns the same token.
- **Open:** the unit of `expiry` is undocumented. Seconds were sent; confirm how the PHR app renders it.

### 5.3 Why scans failed at first
- **Main cause:** not the QR and not the payload. The bridge URL for `<HIP_ID>` was pointing at the other system sharing the client id (1.6), so the callback went there.
- **After re-registering:** the first scan produced `patient/share`, then `on-share` 202 within the same second.

### 5.4 PHR-side share API (not exercised)
```
POST https://dev.abdm.gov.in/api/hiecm/patient-share/v3/share
Headers: REQUEST-ID, TIMESTAMP, Authorization, X-HIU-ID, X-AUTH-TOKEN: Bearer <PHR user token>
Body: {"intent":"PROFILE_SHARE","metaData":{"hipId","context"},"profile":{"patient":{abhaAddress,name,gender,dayOfBirth,monthOfBirth,yearOfBirth,address,phoneNumber}}}
```
- Useful for testing Scan and Share without a phone.
- Add it as a PHR operation, noting the `X-AUTH-TOKEN` header name.

---

## 6. Suggested catalogue changes (actionable)

1. **Observed 2026-09-16:**
   - all callback paths in 3.1, 4, 5.2
   - `on-init`, `hiu notify`, `on-fetch`, `on-request` bodies (4)
   - Scan and Share QR, share and on-share bodies (5)
   - HIU notify `TRANSFERRED`
2. **Correct:**
   - X-token prefix (2.1)
   - Aadhaar-OTP token handling (2.2)
   - JWKS auth (1.5)
   - `abhaNumber` digits-only on link (3.2)
   - `hiType` string (3.2)
   - link success status (3.3)
   - HIP `on-request` returns 200
   - HIU `on-request` status `REQUESTED`
3. **Add:**
   - PHR key vs profile key table (1.3), and the `loginHint:"mobile-number"` requirement (2.3)
   - error-shape parser guidance (1.4)
   - bridge last-writer-wins plus a "prove callback delivery" recipe (1.6)
   - context-notify retry on ABDM-1006 (3.4)
   - automatic PHR self-pull after linking (3.5)
   - HIU must use the artefact date range (4)
   - a Fidelius test vector or reference implementation, including SPKI OID and the "last 65 bytes" rule (1.8)
4. **New checks for `validate_request`:**
   - reject a dashed `abhaNumber` on `link/carecontext`
   - reject array `hiType`
   - flag a bare `X-token`
   - flag `/v3/phr/*` requests encrypted with the 4096-bit key (512-byte ciphertext)
   - flag `loginHint:"mobile"` on `/v3/phr/app/login/request/otp`
