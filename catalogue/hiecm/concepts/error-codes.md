---
id: hiecm.concept.error-codes
type: concept
gateway: hiecm
milestone: M2
version: abdm-v3
title: Reading an ABDM error code
summary: Read the ABDM error code in the response body before the HTTP status,
  and key your handling on it.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/getting-started/build-it-well.mdx
    status: page
    note: Generated from
      site/docs/hiecm/v3/getting-started/build-it-well.mdx#error-codes. Edit the
      page, never this file.
related: {}
---

# Reading an ABDM error code

## In plain words

ABDM returns [several different error shapes](/docs/hiecm/v3/api/m1/errors), and
only some of them carry a code. Parse for all of them before you write any handling,
because the shape tells you where the failure came from.

Every code in the [error code reference](/docs/hiecm/v3/reference/error-codes)
carries an action. Key your handling to that column rather than to a list of
codes you maintain by hand.

| Action | What your code does |
| --- | --- |
| Fix request | Do not retry. Something you sent is wrong, and sending it again will not help |
| Fix auth | Fetch a fresh token, then retry once |
| New request id | Generate a new `REQUEST-ID`, then retry once |
| Retry | Back off and retry, with a ceiling on attempts |
| Cannot proceed | Stop, and tell the person why in their own terms |
| Ask support | Stop, and collect the ids before the context is lost |
| Unclassified | Treat as Cannot proceed until you have seen it once and know better |

Symptom first debugging, for the failures that produce no useful code at all, is
in [troubleshooting](/docs/hiecm/v3/troubleshooting).

Read the code in the body before the HTTP status. A 404 can carry `ABDM-1016`,
Invalid Timestamp: the route exists and the request was refused. A 404 whose
body carries `Status report` and no code means no route matched the request. A
code can arrive bare or with a trailing colon and space, as in `ABDM-1016: `, so
match on the code itself.

## What happens

Parse the body for an error code before acting on the status. Strip a trailing colon and space from the code, then key the handling on the action column of the [error code reference](/docs/hiecm/v3/reference/error-codes), not on a list maintained by hand.

## How you know it worked

Given a code, you can say what it means and which header or field it concerns: `ABDM-2403` is Invalid X-CM-ID, the consent manager header.

## When it goes wrong

A one line message is read as a diagnosis: Invalid header covers many causes. A code that is not in the reference is handled as Unclassified, not guessed at. A 404 is treated as a wrong path when its body carries a code.
