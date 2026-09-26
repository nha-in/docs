# 22 September 2026

3 changes

### PHR calls carry the gateway session token, and their body fields are required

The [P1](/docs/pr-50/reference/hiecm-p1) and [P2](/docs/pr-50/reference/hiecm-p2) references showed 21 PHR application calls with no `Authorization` header and no required body fields. Every one of them takes the access token from the gateway session call, and every field the request body shows is required. Get profile, QR code and PHR card also take `X-AUTH-TOKEN` beside `X-token`. If your app sends those calls without the token, add it.

### The PHR public key is not the ABHA service's key

A [PHR](/docs/pr-50/docs/hiecm/v3/getting-started/glossary#phr) application encrypts the Aadhaar number, mobile number, OTP and password with the key from `GET /abha/api/v3/phr/app/login/public/certificate`, the first call in [P1](/docs/pr-50/docs/hiecm/v3/api/p1/endpoints/p1-certificate-and-session/01-p1-get-v3-phr-app-login-public-certificate). [Encryption](/docs/pr-50/docs/hiecm/v3/concepts/encryption) had sent every reader to the M1 certificate. Encrypt every PHR call with the PHR key.

### Consent request init and context notify take an id only

On [consent request init](/docs/pr-50/docs/hiecm/v3/api/m3/endpoints/m3-consent-management-data-flow-hiu/01-m3-post-consent-v3-request-init) the `hiu` block requires `id` alone; the reference had required `name` too, and the request example still sent it. On [link context notify](/docs/pr-50/docs/hiecm/v3/api/m2/endpoints/m2-abdm-hip-initiated-linking-hip/02-m2-post-hip-v3-link-context-notify) the `notification.hip` block requires `id` alone; the reference had required `name` and `type`. Neither extra field is needed.
