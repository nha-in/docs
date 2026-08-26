# Sandbox verification run, 26 August 2026

Two calls with sandbox credentials (scripts/verify-pending.sh) settled two
pending items. Responses are recorded in the atoms; both atoms now carry
verified stamps.

## P6 resolved: the certificate endpoint works

GET /abha/api/v3/profile/public/certificate with a correct UTC TIMESTAMP
returned HTTP 200 and {"publicKey": "<base64 DER SubjectPublicKeyInfo>"}.
Every earlier failure against it was the timestamp format wrapped in a
misleading 404. Recorded in hiecm.endpoint.m1-get-public-certificate.

## P7 resolved: the encrypt helper returns encryptedData

POST /abha/api/v3/phr/app/enrollment/encrypt returned HTTP 200 and
{"encryptedData": "<base64 ciphertext>"}. The field name is encryptedData
and there is no wrapper. Recorded in hiecm.endpoint.m1-encrypt-value.

P8, production TIMESTAMP confirmation, remains pending: both observations
above are sandbox only.
