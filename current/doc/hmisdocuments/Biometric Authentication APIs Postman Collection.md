# Biometric Authentication APIs Postman Collection

*Source: `hmisdocuments/Biometric Authentication APIs Postman Collection.zip` — archive extracted to `Biometric Authentication APIs Postman Collection_extracted/`*

**1 file(s) in archive:**

- `5. Biometric Authentication APIs Postman.json` (4,684 bytes)


---

## 5. Biometric Authentication APIs Postman.json

**Collection:** ABHA-Proxy Copy

- **POST** `https://apisbx.abdm.gov.in/hcx/abha/biometric/auth/init` — https://apisbx.abdm.gov.in/hcx/abha/biometric/auth/init
  - headers: `accept`, `Content-Type`, `Authorization`, `process`, `payerid`

  <details><summary>request body</summary>

  ```json
{
  "scope": ["abha-login", "aadhaar-bio-verify"],//["abha-login", "aadhaar-bio-verify"] or ["abha-login", "aadhaar-face-verify"] or ["abha-login", "aadhaar-iris-verify"]
  "loginHint": "abha-number",
  "loginId": "91-XXXX-XXXX-0302",
  "otpSystem": "aadhaar",
  "authMode": "FINGERPRINT"//FINGERPRINT,IRIS, FACE_AUTH,
}
  ```
  </details>

- **POST** `https://apisbx.abdm.gov.in/hcx/abha/biometric/auth/verify` — https://apisbx.abdm.gov.in/hcx/abha/biometric/auth/verify
  - headers: `accept`, `Content-Type`, `Authorization`, `process`, `payerid`

  <details><summary>request body</summary>

  ```json
{
  "scope":  ["abha-login", "aadhaar-bio-verify"],//["abha-login", "aadhaar-bio-verify"] or ["abha-login", "aadhaar-face-verify"] or ["abha-login", "aadhaar-iris-verify"]
  "authData": {
    "authMethods": [
      "bio"//bio | iris |face
    ],
     "bio": {
      "txnId": "d21b3db9-xxxx-xxxx-8eed-8f75e7f86b9f",
      "fingerPrintAuthPid": "string"
    },
    "face": {
      "txnId": "d21b3db9-xxxx-xxxx-8eed-8f75e7f86b9f",
      "faceAuthPid": "string"
    },
    "iris": {
      "txnId": "d21b3db9-xxxx-xxxx-8eed-8f75e7f86b9f",
      "irisAuthPid": "string"
    },
    "otp": {
      "txnId": "d21b3db9-xxxx-xxxx-8eed-8f75e7f86b9f",
      "otpValue": "123456"
    }
  },
  "authMode": "FINGERPRINT"//FINGERPRINT,IRIS, FACE_AUTH
}
  ```
  </details>

- **GET** `https://apisbx.abdm.gov.in/hcx/abha/biometric/auth/refresh/token` — https://apisbx.abdm.gov.in/hcx/abha/biometric/auth/refresh/token Copy
  - headers: `R-token`, `TIMESTAMP`, `REQUEST-ID`, `Authorization`, `payerid`, `process`