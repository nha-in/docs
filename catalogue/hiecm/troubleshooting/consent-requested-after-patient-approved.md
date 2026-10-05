---
id: hiecm.troubleshooting.consent-requested-after-patient-approved
type: troubleshooting
gateway: hiecm
milestone: M3
version: abdm-v3
title: The consent request stays in Requested after the patient says they approved it
summary: >
  The patient says they approved your request and your system still shows it
  as waiting. Either the approval never reached your server, or what the
  patient approved was not this request.
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/milestones/m3.mdx
    fetched: 2026-10-03
    hash: sha256:0a86c99c35671087c5c6137324aa74294c07ca326116297781ba1d17f8ed26af
    note: >
      site/docs/hiecm/v3/milestones/m3.mdx. Journeys 1 and 2: the on-init,
      status and notify exchanges, and the acknowledgement of the notify.
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m3_post_consent_v3_request_status.mdx
    fetched: 2026-10-03
    hash: sha256:bfaf4278d6833b57845f774eca9cb87df28635303456932b8c4e4eb3eb690af7
    note: >
      site/docs/_notes/hiecm/m3_post_consent_v3_request_status.mdx. The
      status call, its headers and where the artefact ids of a grant arrive.
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m3_post_v3_hiu_consent_request_notify.mdx
    fetched: 2026-10-03
    hash: sha256:43bd3b21ed83b1e6eafc522a84d30d8d0c634d8823cd0f8fe0c53a406b2d5cb4
    note: >
      site/docs/_notes/hiecm/m3_post_v3_hiu_consent_request_notify.mdx. The
      decision posted to the HIU bridge, and what each status carries.
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/troubleshooting/consent-stuck-requested.mdx
    fetched: 2026-10-03
    hash: sha256:fefbae394532b48d38b0e40dae996f8bef1a1c8fdee0843966ef760eb3e5d706
    note: >
      site/docs/hiecm/v3/troubleshooting/consent-stuck-requested.mdx. The
      patient's app and its subscription, the request window, and the wrong
      ABHA address.
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/concepts/consent.mdx
    fetched: 2026-10-03
    hash: sha256:74c5110506df29c30d455f318f78df86985440ff60dbe929bf680ce0f02fe7fa
    note: site/docs/hiecm/v3/concepts/consent.mdx. The five states and the two clocks.
  - file: catalogue/hiecm/openapi/.raw/nha-2026-09-16/hiecm/consent-management-data-flow.yaml
    hash: sha256:4b0af51af2e2b5bfbf08f5e8745a940f59c550f8a1e4600c970c526f27bc8718
    note: The consent request status call and the notify callback to the HIU.
related:
  troubleshooting:
    - hiecm.troubleshooting.consent-stuck-requested
    - hiecm.troubleshooting.no-callback-on-my-server
  endpoints:
    - hiecm.endpoint.m3-consent-request-status
    - hiecm.endpoint.m3-consent-request-init
    - hiecm.endpoint.m3-consent-hiu-on-notify
  callbacks:
    - hiecm.callback.m3-on-consent-request-status
    - hiecm.callback.m3-on-consent-request-notify-hiu
    - hiecm.callback.m3-on-consent-request-init
  flows:
    - hiecm.flow.journey-consent-to-records
    - hiecm.flow.m3-request-consent
  concepts:
    - hiecm.concept.consent-artefact
    - hiecm.concept.phr-subscriptions
  errors:
    - hiecm.error.abdm-1170
  glossary:
    - hiecm.glossary.hiu
    - shared.glossary.abha-address
---

# The consent request stays in Requested after the patient says they approved it

## In plain words

You asked a patient for permission to see their records. The patient says
they tapped approve. Your screen still says the request is waiting.

There are two possibilities. The approval happened and the news never
reached your server. Or the patient approved something else: another
request, or a request in another account.

You do not have to guess. You can ask ABDM for the current state of your
request, and the answer tells you which of the two it is.

## Before you start

Hold the consent request id that arrived on
`/api/v3/hiu/consent/request/on-init`. Without it there is nothing to ask
about.

## What happens

### The check that separates the causes

Call `POST /api/hiecm/consent/v3/request/status` with the `consentRequestId`
and the `X-HIU-ID` header. It returns `202 Accepted`, and the state arrives
on your bridge at `/api/v3/hiu/consent/request/on-status`.

| What comes back | Cause | Fix |
| --- | --- | --- |
| The state has moved on from Requested | The patient's decision was sent to `/api/v3/hiu/consent/request/notify` and your server missed it or did not store it | Find out why the notify callback was missed: see [no callback reaches my server](no-callback-on-my-server.md). Make the handler store every id in `consentArtefacts`, then acknowledge with `POST /api/hiecm/consent/v3/request/hiu/on-notify` |
| `REQUESTED`, and the patient cannot find the request in their app | The patient's app never showed it. A patient is notified through the ABHA app. A third party PHR app is notified of a new consent request only when it holds an approved subscription | Ask the patient which app they use, and to look for the request in the ABHA app |
| `REQUESTED`, and the patient did approve a request | It was a different request. The usual reason is the ABHA address: a valid address that belongs to another person delivers the request to that person, with no error. The patient may also hold more than one ABHA address | Read the address on the request aloud with the patient. If it is wrong, raise a new request against the right one |
| `EXPIRED` | The window you set on the request ran out before the patient acted | Raise a new request, with a window long enough for the patient to answer |
| No on-status callback arrives either | Your callback path is the fault, which also explains the missing decision | See [no callback reaches my server](no-callback-on-my-server.md) |

The window the patient has to answer is the one you set when you raised the
request. It is not a gateway timeout.

## How you know it worked

A POST reaches `/api/v3/hiu/consent/request/notify` with `status` `GRANTED`
and at least one id in `consentArtefacts`, and your system stores every one
of them.

## When it goes wrong

- Do not raise a second request for the same need while the first is open.
- `DENIED` is an answer, not a fault. No retry changes it.
- An `error` on the on-status callback with `ABDM-1001`, "No data found":
  the consent request id is wrong.

If the state is `REQUESTED`, the address is right, the patient sees the
request and says they approved it, raise a request through
[Support](/docs/support). Report the consent request id, the `REQUEST-ID`
and `TIMESTAMP` of the init call, and the status response. The general
checklist is on
[consent stuck in Requested](/docs/hiecm/v3/troubleshooting/consent-stuck-requested).

## Questions this answers

- The patient approved the consent but my request still shows Requested, why?
- How do I check the current status of a consent request?
- Why did I not get the consent granted callback?
- The patient cannot see my consent request in their app, what is wrong?
- How long does a patient have to approve a consent request?
