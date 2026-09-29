---
id: hiecm.callback.m3-on-consent-request-notify-hiu
type: callback
gateway: hiecm
milestone: M3
version: abdm-v3
title: The patient's decision, sent to the requester
summary: On a grant the notification lists every consent artefact id created; on
  a revocation, the artefacts withdrawn.
generated: true
operation: m3_post_v3_hiu_consent_request_notify
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m3_post_v3_hiu_consent_request_notify.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m3_post_v3_hiu_consent_request_notify.mdx#m3-on-consent-request-notify-hiu.
      Edit the page, never this file.
related:
  errors:
    - hiecm.error.abdm-9999
  concepts:
    - hiecm.concept.asynchronous-callbacks
---

# The patient's decision, sent to the requester

## In plain words

`status` carries the decision, and `consentRequestId` ties it to your request.

- `GRANTED`: `consentArtefacts` lists the id of every [consent artefact](/docs/hiecm/v3/getting-started/glossary#consent-artefact) created. Store all of them.
- `DENIED` or `EXPIRED`: no artefact was created.
- `REVOKED`: `consentArtefacts` lists the artefacts the patient withdrew. Stop using them.

## Before you start

Store the consent request id from the on-init callback, so the notification can be matched.

## How you know it worked

You hold every artefact id from a `GRANTED` notification, and fetch each one through `/api/hiecm/consent/v3/fetch`.

## When it goes wrong

Storing only the first artefact id loses the rest. Do not request data against a revoked or expired artefact.
