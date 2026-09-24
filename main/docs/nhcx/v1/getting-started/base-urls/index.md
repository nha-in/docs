# Base URLs

Every NHCX call is a base URL followed by a path. Each base URL is fixed: one value in the sandbox and one in production. It does not change from call to call or from participant to participant. The paths are the same in both environments. Each service has its own base, so keep the bases in configuration and set them once per environment.

## In short

- Each service has its own base. The exchange, the participant service and the ABDM gateway are three different bases, not one.
- A path in this documentation, such as `/v1/preauth/submit`, goes after the base of the service that serves it.
- Each base is a fixed value for its environment. Going Live has the order of the switch from the sandbox values to the production values.

## Every base, in both environments

| Service                  | Sandbox                                                         | Production                                                    |
| ------------------------ | --------------------------------------------------------------- | ------------------------------------------------------------- |
| ABDM session token       | `https://dev.abdm.gov.in`                                       | `https://apis.abdm.gov.in`                                    |
| NHCX exchange            | `https://apisbx.abdm.gov.in/hcx`                                | `https://apisprod.nha.gov.in/hcx`                             |
| Participant service      | `https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice` | `https://apisprod.nha.gov.in/pmjay/hcx/participanthcxservice` |
| ABDM proxy               | `https://apisbx.abdm.gov.in/pmjay/sbxhcx/abdmproxy`             | `https://apisprod.nha.gov.in/pmjay/hcx/abdmproxy`             |
| NHCX portal              | `https://hcxsbx.abdm.gov.in`                                    | `https://nhcx.abdm.gov.in`                                    |
| Face authentication page | `https://phrsbx.abdm.gov.in/face-auth`                          | `https://phr.abdm.gov.in/face-auth`                           |

What each one serves:

- **ABDM session token**: The session token every other call carries, at /api/hiecm/gateway/v3/sessions.
- **NHCX exchange**: Every use-case call under /v1, fingerprint and iris authentication under /abha.
- **Participant service**: Creating and updating a participant, the registry search, certificates and policies.
- **ABDM proxy**: Face authentication for PMJAY biometrics.
- **NHCX portal**: The portal, the sandbox Swagger specifications it publishes, and notification subscribe.
- **Face authentication page**: The QR page a patient opens to complete face authentication, with ?txnId=\<txnId>.

The ABDM gateway also reads `X-CM-ID` on the session call: `sbx` in the sandbox, `abdm` in production.

On the sandbox, a preauthorisation is therefore posted to `https://apisbx.abdm.gov.in/hcx/v1/preauth/submit`, and a participant is created at `https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/v2/participant/create`.

## Two things that are easy to get wrong

**The use-case path is `/hcx/v1`, the participant path is `/pmjay/sbxhcx/participanthcxservice`.** They are different services on the same host and neither prefix works for the other.

**Biometrics span two bases.** Fingerprint and iris sit under the exchange's `/abha/`; face authentication sits under the ABDM proxy's `/abha/`. A client that assumes one base path for all three will fail on face authentication alone.

## Production

The production bases are fixed values, listed in the table above. The exchange's production base is `https://apisprod.nha.gov.in/hcx`. The participant service's is `https://apisprod.nha.gov.in/pmjay/hcx/participanthcxservice`, and the ABDM gateway's is `https://apis.abdm.gov.in`. When you go live, set each base to its production value once.

## Next steps

- Session Token: the first call, made against the ABDM gateway's base
- Environments and Addresses, in the Reference: every full address, the headers each service reads, and the firewall
- Going Live: when and how each base changes to production
