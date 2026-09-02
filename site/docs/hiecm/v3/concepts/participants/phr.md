---
title: PHR app
sidebar_label: PHR app
sidebar_position: 7
description: 'The citizen facing app: what identifies it, the three milestones it builds, and why it is where consent happens.'
verification: unverified
source: site/docs/hiecm/v3/concepts/phr.md, site/docs/hiecm/v3/milestones/p1.mdx, site/docs/hiecm/v3/milestones/p3.mdx, catalogue/hiecm/concepts/roles.md, site/docs/hiecm/v3/concepts/gateway.md
---

# PHR app

You are the citizen's own app. You hold their identity, show them their records,
and are the place where every consent decision is taken.

## Who you are in ABDM

A [PHR](/docs/hiecm/v3/getting-started/glossary#phr) application sits on the
citizen facing side of the
[HIE-CM](/docs/hiecm/v3/getting-started/glossary#hie-cm). A provider facing
system sits on the other. That position is fixed for the life of your product.

You hold no registry identifier of your own. Your users hold the
[ABHA](/docs/hiecm/v3/getting-started/glossary#abha) numbers and addresses, and
everything routes on the address. Your own credentials are the client id and
client secret issued at sandbox signup, which you exchange for a session token.

Within that position you take both directions. You are an
[HIU](/docs/hiecm/v3/getting-started/glossary#hiu) whenever you fetch a user's
records, and a [HIP](/docs/hiecm/v3/getting-started/glossary#hip) the moment a
user uploads one into you.

To be listed for deep links, submit three things at sandbox exit: your
application name, your Play Store URL and your App Store URL.

## What you can do

| Build | What it gives the user |
| --- | --- |
| [P1](/docs/hiecm/v3/milestones/p1) | Create or link an ABHA address, four login routes, profile, card and QR code |
| [P2](/docs/hiecm/v3/milestones/p2) | Scan and share at a facility, discover old records, link [care contexts](/docs/hiecm/v3/getting-started/glossary#care-context) |
| [P3](/docs/hiecm/v3/milestones/p3) | Subscriptions, notifications, consent decisions, auto approval, fetching and storing records |

Accepting uploads makes you a health locker, and that needs
[M2](/docs/hiecm/v3/api/m2) as well.

## Why it is worth it

You are the only participant the citizen actually sees. Every consent request
raised anywhere on the network arrives in your app, and the decision is made
there.

The [HIE-CM](/docs/hiecm/v3/getting-started/glossary#hie-cm) tells you when a
care context is created or updated for a subscribed address, so records reach
your user without them chasing a facility. You then store those records for the
long term, which no other participant does on the citizen's behalf.

## Next

[PHR applications](/docs/hiecm/v3/concepts/phr) is the build guide, screen by
screen.
