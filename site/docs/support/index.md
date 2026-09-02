---
title: Support
sidebar_label: Support
sidebar_position: 0
description: Where to ask about the sandbox, and what to put in a report.
verification: unverified
source: repository README.md and catalogue/openapi/hiecm-gateway.yaml
---

# Support

Two places to ask, depending on what went wrong. Sandbox behaviour goes to the
[ABDM](/docs/hiecm/v3/getting-started/glossary#abdm) developer forum; a page here that is wrong,
missing or broken goes to whoever maintains it.

## Ask about the sandbox

The developer forum is at
[devforum.abdm.gov.in](https://devforum.abdm.gov.in). Post there for anything
about the sandbox itself: credentials,
onboarding, an endpoint returning something the document does not describe, a
callback that never arrives, or a certification question. Search the forum
first, because the answer is often already on a thread.

## What to put in a report

| Include | Example |
|---|---|
| The API you called | `POST /api/hiecm/gateway/v3/sessions` |
| The `REQUEST-ID` header you sent | `4f8a1c62-6a3b-4d0e-9d7c-2b1f0a5e8d31` |
| The `TIMESTAMP` header you sent | `2026-08-24T09:14:07.412Z` |
| The response you received | Status code and full body |
| What you expected instead | The behaviour the document describes |

Add the callback body if the call is asynchronous and a callback arrived. Never
post an access token, a client secret, or a real patient's identifiers. Replace
them with a placeholder.

`REQUEST-ID` is a fresh UUID you generate per request, and the M1 Postman
collection sends it on almost every call. It is the one value that names the
exact call you made, so log it and quote it.

## Attaching a file to Ask AI

Ask AI takes a file with your question: a failing request body, a FHIR bundle,
a log, a CSV, a PDF, or a screenshot. The paperclip is on the left of the box.
At most 20,000 characters of text, 256KB for a text file and 8MB for a PDF or
an image.

What happens to it is worth knowing before you attach one.

- The file is read in your own browser and only the text it gives up travels
  with your question. A PDF gives up the text it already carries. A screenshot
  is read by a text recognition engine your browser downloads once, from this
  site, and runs on your own machine. The picture itself is never sent, so
  nothing is uploaded and nothing is stored: the conversation lives in the
  panel and is gone when you close it.
- A PDF that is only pictures of text, a scan, gives up nothing. Screenshot
  the part you mean instead and that will be read.
- Text read from a picture carries reading mistakes. The assistant is told
  where the text came from, so it can say when an answer turns on a character
  it cannot trust.
- Personal data is removed before the file reaches the model. A file that
  parses as JSON is masked by its field names, so `name`, `telecom`,
  `address`, `birthDate` and identifier values in a FHIR bundle are replaced
  with placeholders such as `<MASKED_NAME>`. Aadhaar, ABHA, PAN, passport,
  voter, mobile, email and bearer tokens are matched by pattern anywhere in
  the file, JSON or not.
- A file with no field names, a log or the text read from a screenshot, gets
  the same pattern masking, and a name on a labelled line goes too:
  `patient: Rakesh Sharma` leaves as `patient: <MASKED_NAME>`.
- What none of that catches is a name written in running prose, with nothing
  marking it as a name. Redact those yourself, the same way you would in a
  forum post. The panel says so next to any file it read for you.
- Your question is logged, masked, to improve the answers. The file is not
  logged.

## Report a problem with a page here

Wrong page, dead link, a payload that does not match what the sandbox returns:
report it against the page, not on the developer forum. Say the page URL, and whether
you saw the real behaviour yourself. Pages here are written from the source documents
and marked `unverified` for that reason, so a report from someone who has run
the call is how a page becomes verified.
