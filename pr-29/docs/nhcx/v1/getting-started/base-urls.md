# Base URLs

Every NHCX call is a base URL followed by a path. The paths are the same in the sandbox and in production. The bases are not, and they differ from one service to the next, so keep each one in configuration rather than in code.

## In short

- Each service has its own base. The exchange, the participant service and the ABDM gateway are three different bases, not one.
- A path in this documentation, such as `/v1/preauth/submit`, goes after the base of the service that serves it.
- Only some production bases are published. The rest arrive with your onboarding; Going Live has the order of the switch.

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

The exchange's production base is `https://apisprod.nha.gov.in/hcx`. The participant service's production address is published, and so is ABDM's production gateway. The NHCX Adapter assumes the pattern of swapping the sandbox hostname for the others, but that is an inference. Check every production base against your onboarding letter before you switch.

## Next steps

- Session Token: the first call, made against the ABDM gateway's base
- Environments and Addresses, in the Reference: every full address, the headers each service reads, and the firewall
- Going Live: when and how each base changes to production
