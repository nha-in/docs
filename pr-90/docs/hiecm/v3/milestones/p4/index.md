# P4 Locker

A health locker is a [PHR](/docs/pr-90/docs/hiecm/v3/getting-started/glossary#phr) application that keeps a person's health records for the long term, under their control. It hears about new records through a subscription on their [ABHA address](/docs/pr-90/docs/hiecm/v3/getting-started/glossary#abha-address), fetches them with consent, and stores them.

## In short

- A health locker subscribes to two categories on an ABHA address: LINK, a new care context linked at a HIP, and DATA, new data on an existing care context.
- A subscription raised by a health locker is approved automatically for all HIPs and all health information types.
- A LINK notification starts a consent request. A DATA notification reuses an existing consent that covers it.
- Set up the locker for each patient, then read its settings back to show them.
- Processing documents the person uploads needs certification as a Health Locker ([Health Repository Provider](/docs/pr-90/docs/hiecm/v3/getting-started/glossary#hrp)), which requires [M2](/docs/pr-90/docs/hiecm/v3/milestones/m2).

## Who needs it

A PHR application that stores a person's records rather than only displaying them. A health locker builds on [P3 Subscription](/docs/pr-90/docs/hiecm/v3/milestones/p3): it uses the same subscription and consent calls, and adds the locker setup and settings calls on this page.

## How a health locker receives records

1. **Set up the locker for the patient.** Call setup locker with the locker's identifier in `X-LOCKER-ID`. The response carries a `consentAutoApprovalId`.

2. **Subscribe to the patient's ABHA address.** Use the gateway subscription calls and identify your application as a health locker. The subscription is approved automatically for all HIPs and all health information types.

3. **Act on each notification** by its category:

   | Category | What happened                                          | What your locker does                                                                                                                   |
   | -------- | ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
   | `LINK`   | A HIP linked a new care context to the ABHA address    | Raise a consent request for that care context. Once the person grants it, raise the health information request                          |
   | `DATA`   | New data is available on a care context already linked | Look for an existing consent that covers the health information type and date range, and use it to raise the health information request |

4. **Store what arrives**, for long term access by the person.

A notification carries no health records. The records arrive only through the health information request that follows a granted consent, as described in [P3 Subscription](/docs/pr-90/docs/hiecm/v3/milestones/p3).

Notes for AI agents

**Before you start.** The app is a PHR application with [P1](/docs/pr-90/docs/hiecm/v3/milestones/p1) login and the [P3](/docs/pr-90/docs/hiecm/v3/milestones/p3) subscription and consent calls, and the person is signed in. The calls about a patient carry `X-AUTH-TOKEN`, the person's login token, not the gateway session token.

**What happens.** Set up the locker with `X-LOCKER-ID` and keep the `consentAutoApprovalId` it returns. Subscribe to the ABHA address as a health locker; the subscription is approved automatically. On a `LINK` notification, raise a consent request and, once the person grants it, the health information request. On a `DATA` notification, reuse a consent that covers the health information type and date range. Store what arrives.

**How you know it worked.** Setup locker answers 200 with a `consentAutoApprovalId`. The lockers call lists the locker for the ABHA address with `isActive` true, and its settings show subscriptions with status `GRANTED`.

**When it goes wrong.** A notification arrived but no records did: the notification only says something changed, so raise the consent request or the health information request. A patient call is refused: it carries the gateway session token where `X-AUTH-TOKEN` needs the person's login token. Processing documents the person uploads needs certification as a Health Locker, which requires [M2](/docs/pr-90/docs/hiecm/v3/milestones/m2).

## The locker calls

| Call                        | Method and path                                                        | What it returns                                                                                    |
| --------------------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Health locker providers     | `GET /api/hiecm/gateway/v3/health-lockers`                             | The providers with health locker enabled                                                           |
| Set up a locker             | `POST /api/hiecm/subscription-requests/v3/setup-locker`                | `consentAutoApprovalId`                                                                            |
| Lockers on an ABHA address  | `GET /api/hiecm/subscription-requests/v3/patients/lockers`             | Each locker's `lockerId`, `lockerName`, `isActive` and dates. `includeInactive` adds inactive ones |
| One locker's settings       | `GET /api/hiecm/subscription-requests/v3/patients/lockers/{locker-id}` | The locker and its subscriptions, each with its purpose and status                                 |
| Requests on an ABHA address | `GET /api/hiecm/subscription-requests/v3/patients/requests`            | The consent and subscription requests, filtered by status                                          |

Every call carries `REQUEST-ID`, `TIMESTAMP`, `X-CM-ID` and the gateway session token. The calls about a patient also carry `X-AUTH-TOKEN`, the person's own login token from [P1 Registration and login](/docs/pr-90/docs/hiecm/v3/milestones/p1), which is a different token from the gateway session token.

## How you know it worked

- Setup locker answers 200 with a `consentAutoApprovalId`.
- The lockers call lists your locker for the ABHA address with `isActive` true.
- The locker's settings show its subscriptions with status `GRANTED`.

## When it does not

- **A notification arrived but no records did.** Raise the consent request, or the health information request under an existing consent. The notification only says that something changed.
- **A patient call is refused.** Check that `X-AUTH-TOKEN` holds the person's login token, not the gateway session token.

## Certification

The cases a PHR application is tested against, each with its id, steps, expected result and the calls it exercises: [PHR application test cases](/docs/pr-90/docs/hiecm/v3/resources/test-cases/phr). Certification runs once, for the whole integration: [Go live](/docs/pr-90/docs/hiecm/v3/getting-started/going-live).

## Next

- The calls and base URLs: [P4 API reference](/docs/pr-90/reference/hiecm-p4).
- Subscriptions and consent from the patient's side: [P3 Subscription](/docs/pr-90/docs/hiecm/v3/milestones/p3).
- Where a locker fits among PHR applications: [Personal Health Record (PHR) Application](/docs/pr-90/docs/hiecm/v3/concepts/participants/phr).
