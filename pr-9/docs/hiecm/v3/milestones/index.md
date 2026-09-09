# Milestones

Four milestones. You certify them one at a time, in order, and together they
spell CARE.

## In short

M4 certifies last but blocks M2. Sharing a record needs a valid facility ID and
registration in the HIP role, and that facility ID comes from M4. Plan the
registry work early.

## One patient, four milestones

Meera arrives at your clinic. Each card below is one thing your system has to
be able to do for her, and one milestone that gives you it.

## The same story from Meera's own app

If you are building the patient's app rather than the clinic's system, you are
building a [PHR](/docs/hiecm/v3/getting-started/glossary#phr) application. The
work splits into three, and each part mirrors a milestone on the provider side.

## Which milestones your role needs

| Your role | M1 | M2 | M3 | M4 |
| --- | --- | --- | --- | --- |
| PHR application | Required | Patient side only | Required | Not needed |
| HIP | Required | The bulk of your build | Only if you also read records held elsewhere | Required |
| HIU | Required | Not needed unless you also act as a HIP | The bulk of your build | Required |

A PHR application builds the P1, P2 and P3 pages above rather than the provider
side of M2.

## What each milestone gets you

| Milestone | What you get | Who needs it |
| --- | --- | --- |
| [M1 Create](/docs/hiecm/v3/milestones/m1) | Identity and the session token | Everyone |
| [M2 Attach](/docs/hiecm/v3/milestones/m2) | Linking and sharing records | HIP systems, and the patient side for a PHR app |
| [M3 Retrieve](/docs/hiecm/v3/milestones/m3) | Consent and record fetching | HIU systems and PHR apps |
| [M4 Enrol](/docs/hiecm/v3/milestones/m4) | A facility ID and professional registration | Anyone going live as a facility |

The M1 pages carry request URLs, headers and bodies. Most M2, M3 and M4 request
and response shapes are not transcribed yet, so those pages give steps and
failure modes rather than payloads.

## Next

Start with [M1 Create](/docs/hiecm/v3/milestones/m1), or read [Go
live](/docs/hiecm/v3/getting-started/going-live) for what happens after the
fourth certificate.
