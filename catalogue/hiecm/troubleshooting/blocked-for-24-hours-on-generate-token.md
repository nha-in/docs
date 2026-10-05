---
id: hiecm.troubleshooting.blocked-for-24-hours-on-generate-token
type: troubleshooting
gateway: hiecm
milestone: M2
version: abdm-v3
title: You are blocked for 24 hours, on the generate token callback
summary: >
  The answer to a link token request says you are blocked for 24 hours. It
  means too many requests were sent, and the usual reason is asking for a new
  token when a stored one would do, or retrying in a loop.
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m2_post_v3_hip_token_on_generate_token.mdx
    fetched: 2026-10-03
    hash: sha256:811e61dcb50bdb0f168a4ccb6b849e07b6c873e675d805aef537abeadf85d94d
    note: >
      site/docs/_notes/hiecm/m2_post_v3_hip_token_on_generate_token.mdx. The
      callback carries linkToken or error, ABDM-1027 among its codes, and a
      token not stored means generating another.
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/errors/m2.mdx
    fetched: 2026-10-03
    hash: sha256:b0b0036c6d3d0d8b17b31e3587353dba177a7b67219d3bd3dad23b7b445747df
    note: >
      site/docs/_notes/hiecm/errors/m2.mdx. ABDM-1022 and ABDM-2429, the step
      to ABDM-1027, the usual causes, and how to back off.
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/concepts/gateway.mdx
    fetched: 2026-10-03
    hash: sha256:15ebd5a733bade27568ed817e0cc6cbf925ed650917dc273a032321aaacb059a
    note: >
      site/docs/hiecm/v3/concepts/gateway.mdx. Limits to code against: the
      two rate limit codes, and that the thresholds are not published.
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m2_post_v3_token_generate_token.mdx
    fetched: 2026-10-03
    hash: sha256:2c26f96827e303fde4a5f4754c56c19435987a13a1d917cdd3c7b8a7f8cf9564
    note: >
      site/docs/_notes/hiecm/m2_post_v3_token_generate_token.mdx. A link
      token is valid for six months: store it and reuse it.
  - file: catalogue/hiecm/openapi/.raw/nha-2026-09-16/hiecm/link-token.yaml
    hash: sha256:2e9cdca38bd2b2230ffcc70b53ae68b99aad68b9a526c96beeda4bf11dcb4273
    note: >
      The on-generate-token callback's error example, ABDM-1027 with the
      message "You are blocked. Please try again after 24 hours."
related:
  endpoints:
    - hiecm.endpoint.m2-generate-link-token
  callbacks:
    - hiecm.callback.m2-link-token-generation-call-back
    - hiecm.callback.m2-on-generate-token-result
  errors:
    - hiecm.error.abdm-1022
    - hiecm.error.abdm-1026
  concepts:
    - hiecm.concept.m2-retry-is-a-duplicate
    - hiecm.concept.m2-exchange-not-call
  flows:
    - hiecm.flow.journey-hip-initiated-linking
  glossary:
    - hiecm.glossary.link-token
---

# You are blocked for 24 hours, on the generate token callback

## In plain words

Before a hospital can attach a visit to a patient's health account, it asks
ABDM for a pass for that patient. The pass is called a
[link token](/docs/hiecm/v3/getting-started/glossary#link-token), and it
lasts six months.

ABDM limits how many requests it accepts. Software that asks too often is
first told "too many requests". Software that keeps asking is blocked, and
the answer to the next token request reads "You are blocked. Please try
again after 24 hours."

The request itself is not wrong. The number of requests is. The usual reasons
are asking for a new pass on every visit when the stored one is still good,
or software that retries by itself in a loop.

## What happens

The block arrives as an `error` object on your bridge at
`/api/v3/hip/token/on-generate-token`, with the code `ABDM-1027`. Your
`POST /api/hiecm/v3/token/generate-token` call still returned
`202 Accepted`, because that response is only receipt. The `error` is the
answer, not a delivery fault.

Two codes come before the block: `ABDM-1022`, "Too many requests", and
`ABDM-2429`, "Too many requests found". The thresholds are not published, so
back off on the first sign.

### The check that separates the causes

In your own logs, count the generate token calls in the period before the
block, grouped by patient.

| What the count shows | Cause | Fix |
| --- | --- | --- |
| Several calls for the same patient, spread over visits or link calls | The token is requested each time and not reused. A token that was received and not stored has the same effect | Store the token against the patient record, not the visit. Reuse it for every link for six months. Check it is still valid before each link call, and request a new one only when it has expired |
| Many calls for the same patient within seconds or minutes | A retry loop. A refusal, or a callback that was slow to arrive, was answered with another request at once | Remove the automatic retry. Read the code in the `error` before you call again. Back off exponentially, add jitter, and cap the number of attempts |
| One call each for a large number of patients in a short time | A bulk job | Batch the work and spread it out. Request a token when the patient registers with you, not for the whole patient list at once |

A refused token request is also remembered. Sending the same request again
straight away is refused as a duplicate with `ABDM-1092`, so an immediate
retry cannot succeed.

### The fix

1. Stop every generate token call from your client. That includes scheduled
   jobs and retries.
2. Wait for the 24 hours the message names.
3. Correct the cause the count showed before you call again.

## How you know it worked

After the wait, one generate token call for one patient produces a callback
that carries `linkToken`, with `response.requestId` equal to your
`REQUEST-ID`. Your logs then show no second generate token call for that
patient while the stored token is valid.

## When it goes wrong

If the block returns although your logs show one call per patient and no
retries, raise a request through [Support](/docs/support). Report the
`REQUEST-ID` and `TIMESTAMP` of the call, your HIP ID, and the callback body
with the code. Never include an access token or a patient's identifiers.

## Questions this answers

- Why is there a You are blocked for 24 hours message in the on-generate token callback while hitting generate token API?
- What does ABDM-1027 mean?
- How many times can I call generate token for one patient?
- What should I do after ABDM blocks my client for 24 hours?
- Should I generate a new link token for every visit?
