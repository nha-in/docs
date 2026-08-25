---
title: Support
sidebar_label: Support
sidebar_position: 0
description: Where to ask about the sandbox, and what to put in a report.
verification: unverified
source: repository README.md and catalogue/openapi/hiecm-gateway.yaml
---

# Support

Two places to ask, depending on what went wrong. Sandbox behaviour goes to
[NHA](/docs/abdm/v3/glossary#nha); a page here that is wrong, missing or broken
goes to whoever maintains it.

## Ask NHA about the sandbox

NHA runs a developer forum at
[devforum.abdm.gov.in](https://devforum.abdm.gov.in). Post there for anything
about the [ABDM](/docs/abdm/v3/glossary#abdm) sandbox itself: credentials,
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

`REQUEST-ID` is a fresh UUID you generate per request, and NHA's M1 Postman
collection sends it on almost every call. It is the one value that names the
exact call you made, so log it and quote it.

## Report a problem with a page here

Wrong page, dead link, a payload that does not match what the sandbox returns:
report it against the page, not on NHA's forum. Say the page URL, and whether
you saw the real behaviour yourself. Pages here are written from NHA's documents
and marked `unverified` for that reason, so a report from someone who has run
the call is how a page becomes verified.
