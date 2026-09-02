# 2026-09-02: the public certificate path carries the version segment

`catalogue/openapi/hiecm/v3/hiecm-m1.yaml:2610` declares the RSA public
certificate operation at `/profile/public/certificate`.

Observed against the sandbox on 2026-09-02, while wiring the Quickstart's live
runner:

- `https://abhasbx.abdm.gov.in/abha/api/profile/public/certificate` returns 404.
- `https://abhasbx.abdm.gov.in/abha/api/v3/profile/public/certificate` returns
  401 without a token, which is the path answering and asking to be
  authenticated.

So the live route carries the `v3` segment that the recorded path omits. The
Quickstart calls the versioned path, because that is the one that answers.

The spec is left as ingested. This note records the difference rather than
editing the recorded path, and the observation is unauthenticated: neither
route has been called with a valid token, so the 401 is evidence the path
exists, not evidence of what it returns.

Two other things observed at the same time, both worth knowing before anyone
wires these calls up again:

- The M1 enrolment operations are not served from the gateway host. Both
  `/v3/profile/public/certificate` and `/v3/enrollment/request/otp` return 503
  from `https://dev.abdm.gov.in/api`, and answer from
  `https://abhasbx.abdm.gov.in/abha/api`, which is the server the M1 spec
  itself declares.
- Both hosts send `access-control-allow-origin: *`, so a browser can call them
  directly with no proxy in between.
