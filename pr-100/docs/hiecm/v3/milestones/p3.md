# P3 Subscription

P3 is the other side of [M3 Health Information User](/docs/pr-100/docs/hiecm/v3/milestones/m3). M3 is a requester asking for records. P3 is the patient deciding, and being told each time.

A citizen fetching records is the [HIU](/docs/pr-100/docs/hiecm/v3/getting-started/glossary#hiu), so every [PHR](/docs/pr-100/docs/hiecm/v3/getting-started/glossary#phr) application must implement that side.

## In short

- Build for revocation from the start. A consent that worked yesterday can be withdrawn today, and that is the system working correctly.
- A subscription is how your app hears about changes to a user's ABHA address. Set one up at address creation and at first login on a new install.
- An auto approval policy stops the user approving a request every time a hospital adds a record.
- The user must be able to disable a policy at any time.

## Subscriptions and notifications

Ask the user for consent before you create a subscription. An approved subscription notifies your app when a care context is linked or updated. Surface these as device notifications.

You need screens to list subscriptions, approve them, deny them and edit them. Editing covers health information types, purpose, categories and the time period.

A subscription tells you a record exists. It is not consent, and it gives nobody the record: reading it still needs a consent request, which is why a subscription usually runs beside an auto approval policy.

Notes for AI agents

**Before you start.** A callback URL registered and reachable, and the person's explicit agreement to the subscription. Signing in does not imply it.

**What happens.** Raise the subscription with `/api/hiecm/subscription-requests/v3/init`; the request id arrives on `/api/v3/hiu/hiecm/subscription-requests/on-init`. The person approves it with `/api/hiecm/subscription-requests/v3/{subscriptionRequestId}/approve` or denies it. Once approved, notifications arrive on `/api/v3/hiu/subscription/notify`, in the categories `LINK` and `DATA`, and you acknowledge each with `/api/hiecm/subscription-requests/v3/hiu/care-context/on-notify`. Set one up when you create an address and when a person signs in with an address the install has not seen.

**How you know it worked.** The subscription shows as approved, and linking a care context to that address from a facility produces a notification on your callback without any call from you.

**When it goes wrong.** Nothing arrives: the checks are those for any callback, see [the callback never arrives](/docs/pr-100/docs/hiecm/v3/troubleshooting/callback-never-arrives). A subscription created without asking the person is a consent failure that certification looks for. A notification acted on as though it were permission reads a record with no consent behind it.

## Auto approval: subscribe once, approve every time

1. Ask the user to confirm your app may retrieve new linked records automatically.
2. Set up an auto approval policy with the [HIE-CM](/docs/pr-100/docs/hiecm/v3/getting-started/glossary#hie-cm).

While the policy is active, the consent request you raise on a new or updated care context notification is granted immediately, and you fetch and store the record. Disable the policy and a request arrives for each record instead.

The user must be able to disable the policy at any time, as easily as they enabled it.

Notes for AI agents

**Before you start.** The person is signed in, a subscription is approved, and the app can surface device notifications.

**What happens.** Ask the two questions separately: whether to subscribe, and whether new records may be retrieved automatically. Set the policy with `/api/hiecm/consent/v3/auto/approve`, naming the `hiu` and whether it applies to all HIPs; it answers 202 Accepted. The policy is later switched with `/api/hiecm/consent/v3/auto/approve/{consentId}/disable` and `/api/hiecm/consent/v3/auto/approve/{consentId}/enable`, where `consentId` is the auto approval id.

**How you know it worked.** The next new care context produces a consent request that is granted without the person being asked, and the record is fetched.

**When it goes wrong.** The app keeps no auto approval id, so the person cannot turn the policy off. A request arriving for each record after the policy is disabled is the system working, not failing.

## Consent management

| Capability           | What it covers                                                       |
| -------------------- | -------------------------------------------------------------------- |
| View requests        | Requesting HIU, purpose, data types, date range, validity, status    |
| Modify a request     | Access duration, record date range, data categories, validity period |
| Grant or deny        | The decision goes back to the HIE-CM                                 |
| View active consents | Who currently has access, and to what                                |
| Revoke               | Withdraw at any time. Sharing under that consent stops immediately   |

The Consents tab and the Subscriptions tab group state the same way: a Requests section holding Requested, Denied and Expired, and an Approved section holding Granted and Revoked.

## Fetching and displaying records

Once a care context is linked to the user's ABHA address:

1. Your app receives the notification.
2. It creates a consent request for that record and sends it to the HIE-CM.
3. The consent is granted, automatically if a policy exists, otherwise by the user.
4. It raises a health information request with the approved [consent artefact](/docs/pr-100/docs/hiecm/v3/getting-started/glossary#consent-artefact).
5. The [HIP](/docs/pr-100/docs/hiecm/v3/getting-started/glossary#hip) sends the records across the network.
6. Your app stores them for long term access and displays them, preferably in chronological order.

A grant on its own is not the end. A granted consent with no health information request behind it leaves the person with permission and no records.

Notes for AI agents

**Before you start.** The care context is linked to the person's address, a subscription tells you when it appears or changes, and the app implements the consent and data flow calls as an HIU. See [M3 Journey 3](/docs/pr-100/docs/hiecm/v3/milestones/m3#m3-fetch-records) for the fetch itself.

**What happens.** On the notification, raise a consent request for that care context, wait for the grant, then raise the health information request with the granted artefact, and decrypt what the HIP pushes. Store every record for the long term.

**How you know it worked.** The records for the notified care context are stored and shown in date order, and reopening them needs no new request.

**When it goes wrong.** `ABDM-1112`: the artefact is invalid or already expired. Revocation is the person exercising a right, so handle it as a state, not as an error. Records fetched but not stored disappear when the consent window closes. Test every HI type the app may receive, structured and unstructured, not only one.

## Certification

The cases a PHR application is tested against, each with its id, steps, expected result and the calls it exercises: [PHR application test cases](/docs/pr-100/docs/hiecm/v3/resources/test-cases/phr). Certification runs once, for the whole integration: [Go live](/docs/pr-100/docs/hiecm/v3/getting-started/going-live).

## Next

- The calls and base URLs: [P3 API reference](/docs/pr-100/reference/hiecm-p3).
- Keeping the records for the long term: [P4 Locker](/docs/pr-100/docs/hiecm/v3/milestones/p4).
- Back to the four provider milestones: [Milestones](/docs/pr-100/docs/hiecm/v3/milestones).
- Take your integration to production: [Go live](/docs/pr-100/docs/hiecm/v3/getting-started/going-live).
