---
name: hiecm-phr-debug
description: "Use when an ABDM PHR call fails: matches the error code against the codes the specification's examples return and walks to the operation that returns it, verified by the original step succeeding."
---
# HIE-CM phr debug

Every error below is an OODA loop: observe the error code and last request id, orient against the matched code, decide the fix, act, and observe whether the original step now succeeds. Applying a fix is not the exit condition; the original step succeeding is.

Loop limit: 5 passes per error.

## Errors

### 900902

**Observed as** HTTP 401, `Missing Credentials`, on `phr_get_v3_phr_app_enrollment_isexists`.

**Exit condition: the original call now succeeds.**

### ABDM-1107

**Observed as** HTTP 400, `Invalid combinations of scopes`, on `phr_post_v3_phr_app_login_verify`.

**Exit condition: the original call now succeeds.**

### ABDM-1211

**Observed as** HTTP 400, `User not found.`, on `phr_post_v3_phr_app_login_search`.

**Exit condition: the original call now succeeds.**

### ABDM-9999

**Observed as** HTTP 400, `Invalid LoginId`, on `phr_post_v3_phr_app_enrollment_request_otp`.

**Exit condition: the original call now succeeds.**

## Where the detail is

- The operation that returns each code: /docs/hiecm/v3/api/phr
