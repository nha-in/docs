---
id: hiecm.concept.consent-in-a-phr-app
type: concept
gateway: hiecm
milestone: P3
version: abdm-v3
title: The five things a personal health record application must let a person do
  with consent
summary: A personal health record app must let a person see a consent request,
  change it, allow or refuse it, see what is allowed, and take it back.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/concepts/consent.mdx
    status: page
    note: Generated from
      site/docs/hiecm/v3/concepts/consent.mdx#consent-in-a-phr-app. Edit the
      page, never this file.
related:
  concepts:
    - hiecm.concept.consent-artefact
    - hiecm.concept.phr-subscriptions
    - hiecm.concept.care-context
  flows:
    - hiecm.flow.p3-fetch-records
  endpoints:
    - hiecm.endpoint.p3-deny-consent-request
    - hiecm.endpoint.p3-revoke-consent-request
  glossary:
    - shared.glossary.phr
    - shared.glossary.hiu
---

# The five things a personal health record application must let a person do with consent

## In plain words

Consent is granted by a person, and the PHR app is where they do it. There is
a floor of five capabilities, and an app missing one leaves a person able to
give access they cannot inspect, change or withdraw.

1. **See the request**, with the HIU asking, the purpose, the record types,
   the date range of records, how long the consent would last, and its status.
2. **Change it before allowing it**, where the request permits: the access
   duration, the record date range, the categories shared, and the validity
   period. This is the one most often left out, and the one that turns a
   consent screen into a negotiation rather than a demand.
3. **Allow or refuse it.** The consent flow has three outcomes, not two:
   approve, reject and ignore. An ignored request expires on the requester's
   window, and the interface has to show that state.
4. **See what is already allowed**, so the person can tell which
   organisations hold access right now. A list of past decisions is not the
   same thing.
5. **Take it back** at any time. Two things follow: the status updates at the
   consent manager, and sharing under that consent stops immediately, not at
   the end of the period.

## Before you start

The app receives consent requests only through an approved subscription. See [P3 Subscription](/docs/hiecm/v3/milestones/p3).

## What happens

Build a screen for each of the five. Approving posts to `/api/hiecm/consent/v3/request/{consentRequestId}/approve`, denying to `/api/hiecm/consent/v3/request/{consentRequestId}/deny`, and revoking a granted consent to `/api/hiecm/consent/v3/revoke`. Show Expired as its own state, never as Denied, because the person refused nothing.

## How you know it worked

One request goes through the whole arc in the app: seen, its date range narrowed, allowed, found in the list of live consents, and revoked. A fetch attempted under it afterwards fails.

## When it goes wrong

A screen that lists requests but not live consents leaves the person unable to revoke what they cannot see. Revocation shown as expiry hides a decision the person made. Leaving out modification turns consent into a notice.
