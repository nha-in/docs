---
title: Support
sidebar_label: Support
sidebar_position: 0
description: Where to ask about the sandbox, and what to put in a report.
verification: unverified
source: repository README.md and catalogue/openapi/hiecm-gateway.yaml
---

# Support

Two different things can go wrong, and they go to two different places. If a
sandbox call behaves in a way this portal does not explain, that is a question
for [NHA](/docs/overview/glossary#nha). If a page here is wrong, missing or
broken, that is a question for this repository.

## Ask NHA about the sandbox

NHA runs a developer forum at
[devforum.abdm.gov.in](https://devforum.abdm.gov.in). Post there for anything
about the [ABDM](/docs/overview/glossary#abdm) sandbox itself: credentials,
onboarding, an endpoint returning something the document does not describe, a
callback that never arrives, or a certification question.

Search the forum before posting. Sandbox problems are often shared, and the
answer is frequently already on a thread from someone integrating the same
module.

## What to put in a report

A report with these five things can be acted on. A report without them turns
into a round of questions first.

| Include | Example |
|---|---|
| The API you called | `POST /api/hiecm/gateway/v3/sessions` |
| The `REQUEST-ID` header you sent | `4f8a1c62-6a3b-4d0e-9d7c-2b1f0a5e8d31` |
| The `TIMESTAMP` header you sent | `2026-08-24T09:14:07.412Z` |
| The response you received | Status code and full body |
| What you expected instead | The behaviour the document describes |

Include the callback body too, if the call is asynchronous and a callback
arrived. Never post an access token, a client secret, or a real patient's
identifiers. Replace them with a placeholder before you post.

The `REQUEST-ID` and the timestamp matter more than they look. `REQUEST-ID` is
a fresh UUID you generate per request, and NHA's own M1 Postman collection
sends it on almost every call. It is the one value in your report that names
the exact call you made, so log it and quote it. Without it, the first reply
you get is usually a request for it.

## Report a problem with this portal

Wrong page, dead link, a payload that does not match what the sandbox actually
returns: raise it on the repository that builds this site, not on NHA's forum.
The catalogue is the source, so a fix lands in the catalogue and the site
rebuilds from it.

Two things worth saying in the report: the page URL, and whether you saw the
real behaviour yourself. Pages here are written from NHA's documents and are
marked `unverified` for that reason. A report from someone who has run the call
is how a page becomes verified.
