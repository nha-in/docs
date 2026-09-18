---
id: hiecm.concept.error-body-shapes
type: concept
gateway: hiecm
milestone: M1
version: abdm-v3
title: The five shapes an error body arrives in
summary: >
  An ABDM error is not always an error object. It can be an array, a
  flat object, a message with a timestamp, a field keyed object or an
  empty body, and the code can carry a trailing colon and space.
sources:
  - file: catalogue/annexure/integration-learnings-2026-09-16.md
    fetched: 2026-09-16
    hash: sha256:d1415609d3d71178563367bcdcc48fa7a01fe9ebd247b4c019686304868368ce
    note: >
      Section 1.4. Observed by an integrator on 2026-09-16. The array
      shape with the trailing colon is also in
      catalogue/verification/hiecm.endpoint.p1-login-request-otp.json,
      run 2026-09-17.
related:
  concepts:
    - hiecm.concept.error-codes
  errors:
    - hiecm.error.abdm-1006
    - hiecm.error.abdm-1094
    - hiecm.error.abdm-9999
  endpoints:
    - hiecm.endpoint.m2-hip-link-care-context
skills:
  - hiecm-m1-debug
  - hiecm-m2-debug
  - hiecm-m3-debug
---

# The five shapes an error body arrives in

## In plain words

When a call fails, the body that comes back names the problem. The
[error code table](hiecm.concept.error-codes) tells you what a code
means. This page tells you where in the body to find it, because the
shape changes from service to service and a parser that expects one
shape shows your users a bare "HTTP 400".

## Before you start

Nothing. Read this before writing the first error handler.

## What happens

These five shapes all arrive from the sandbox:

```jsonc
{"error": {"code": "ABDM-1006", "message": "..."}}                // the documented envelope
[{"code": "ABDM-9999: ", "message": "Invalid Login Hint"}]       // a top level array, code with trailing ": "
{"code": "ABDM-9999", "message": "User not found"}               // flat
{"message": "Invalid X-token", "timestamp": "2026-09-16 14:34:55"} // message only, no code
{"loginId": "Invalid LoginId", "timestamp": "..."}                // keyed by the field that failed
```

and a sixth that is no body at all: the link care context call answers
400 with an empty body when `abhaNumber` carries dashes.

Write one parser and route every response through it:

1. If the body is an array, take its first element.
2. Read `error.code` and `error.message`; fall back to top level
   `code` and `message`.
3. If neither exists, take the first string value in the object as the
   message and record the key it sat under, because that key is the
   field that failed.
4. Strip trailing colons and spaces from the code before comparing it.
   `ABDM-1006: ` and `ABDM-1006` are the same code.
5. An empty body with a 4xx status is still an error. Log the request
   you sent, since the response will not tell you what was wrong.

Log the raw body in every case. One recorded response carries
`ABDM-9999` as its code with the ABDM-1094 message inside the text,
and only the raw body shows that.

## How you know it worked

You have understood this when you can answer both of these.

1. A response body is `[{"code":"ABDM-1006: ","message":"Invalid mobile number"}]`.
   What code does your handler compare against, and what does it show
   the user?
2. A response is 400 with no body. What do you log?

## When it goes wrong

The handler assumes an object and throws on the array. The user sees the
status code and nothing else.

The handler compares `code === "ABDM-1006"` and never matches because
of the trailing colon and space.

The handler treats an empty 400 as a network fault and retries the same
wrong body.
