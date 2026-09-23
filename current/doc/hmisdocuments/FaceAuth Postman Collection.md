# FaceAuth Postman Collection

*Source: `hmisdocuments/FaceAuth Postman Collection.zip` — archive extracted to `FaceAuth Postman Collection_extracted/`*

**1 file(s) in archive:**

- `FaceAuth.postman_collection.json` (5,307 bytes)


---

## FaceAuth.postman_collection.json

**Collection:** FaceAuth

- **POST** `https://apisbx.abdm.gov.in/pmjay/sbxhcx/abdmproxy/abha/biometric/faceauth/init` — FaceAuth init
  - headers: `Authorization`

  <details><summary>request body</summary>

  ```json
{
  "scope": [
    "abha-enrol",
    "face-auth"
  ]
}

  ```
  </details>

- **POST** `https://apisbx.abdm.gov.in/pmjay/sbxhcx/abdmproxy/abha/biometric/capture/pid` — FaceAuth capturePID
  - headers: `Authorization`, `Content-Type`, `Accept`

  <details><summary>request body</summary>

  ```json
{
  "txnId": "8fd6b178-93f6-4348-88d7-f3ddf4cd9f6e"
}

  ```
  </details>

- **POST** `https://apisbx.abdm.gov.in/pmjay/sbxhcx/abdmproxy/abha/biometric/v2/auth/verify` — FaceAuth Aadhar Verify
  - headers: `Authorization`, `payerid`, `process`, `Content-Type`, `Accept`

  <details><summary>request body</summary>

  ```json
{
  "authData": {
    "authMethods": [
      "face_auth"
    ],
    "face": {
      "txnId": "5724b1d1-9826-42f9-b08e-f87c4bb30706",
      "aadhaar": "HPfsbZmt3FY78SL+v7ubpbgTjMgpoY3E8/9n4W81dhvXJ8qFlZZ6C3C31wv0Ss3YQ/dNppa0Px3owD8a+bOnTADNOo4fv3LCujxJvydsGZ+5pJQt8C4YFCvw6rdy43KTDJONDge2YVoffSMF4NbfN6DtpM4STzsz/cbDhrWJ4Ak8oMr3fbL/VOjsY0NsyVMlUNpif1Q8etTSGJ35NDw7Od8O/v1iZOknbVCNi5NsZBq+k2WiXSrvi4V8OlVsAVuiPZqOPboR7JUyVCawMgFXQ9RXbIyOhVRl2utoTHxwcNyh7u/sXZwPzrzQ7ccnlTXxjRUzMjkF8gjXWuDKNMuYhw4QeKkCLU4Ngn1UyTFuRw+h0/w5vyuap1nieK6fdBX1XkVo138G6WujmHYoaVHWsrittMeDArJcWnAawA9qLbr+tmG2z8F1+yGt8lVjzgii8aobSqiFRGG9/GdSRs9WwW3DJ1YoFSWSJgnELi9ciBkd5n3wextrVu/zjdqGPIICsJkiyikOdKFqo68KmzR6Otmfp3gZE3VuGXj8yR62MvS2SZNSeYRjScR1XGCxjxd25aEQumhgkitMyjAcek3eIqf1/zPXk/L/47flt7Z4TdN773s/v/PWbVf1lUkJ3/TL0UVxfxY0N6wrMJYrZts3QB/qrofsJI4pe5G7zm8C4Ys=",
      "mobile": "9492123339"
    }
  },
  "authMode": "FACE_AUTH"
}
  ```
  </details>
