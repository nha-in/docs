---
id: shared.glossary.timestamp-header
type: glossary
gateway: shared
milestone: n/a
version: abdm-v3
title: TIMESTAMP, the request time header
summary: >
  The moment you sent the request, written as an ISO 8601 date and time
  and carried in the TIMESTAMP header.
sources:
  - file: catalogue/openapi/.raw/nha-2026-09-16/hiecm/gateway.yaml
    fetched: 2026-09-16
    hash: sha256:d3bc599054c2570a50818ca54906c44cf652ad6f813473e8ac243667da4e9300
related: {}
---

# TIMESTAMP, the request time header

## In plain words

`TIMESTAMP` is a required header on ABDM HIE-CM calls. The specification
describes it as:

> Actual time of the request was initiated, ISO 8601 represents date and
> time by starting with the year, followed by the month, the day, the hour,
> the minutes, seconds and milliseconds

The example given is `2022-10-06T15:10:00.587Z`, so milliseconds and the
trailing `Z` for UTC are part of the shape you send.

## Before you start

You need a clock you trust, because the value states when you initiated the
request rather than when anything was received.

## What happens

Every HIE-CM operation takes this header, including
`gateway_post_gateway_v3_sessions`, so the first call you ever make carries
it.

## How you know it worked

You have understood this when you can write the header value for the current
moment without looking up the format.

## When it goes wrong

Sending a local time without the UTC marker, or dropping the milliseconds,
either of which leaves the value outside the format the specification states.
