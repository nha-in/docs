---
title: Gateway session
sidebar_label: Overview
sidebar_position: 0
description: Every ABDM call carries a bearer token from one endpoint. This is that endpoint, plus the certificate and bridge registration calls that sit beside it.
verification: unverified
source: catalogue/openapi/hiecm/v3/hiecm-gateway.yaml
---

# Gateway session

Every module in this catalogue gets its access token here, so this is the first call in any integration and the one to get working before anything else.

NHA repeats this group inside all three milestone files. It is described once here, so a change lands in one place rather than three.

## What is in it

Sessions, the certificate endpoints your client needs to verify tokens, and the bridge registration calls that tell ABDM which URL your callbacks arrive on.

## Before your first call

You need a client ID and client secret from the ABDM sandbox. See [the sandbox page](/docs/hiecm/v3/getting-started/sandbox).

The full operation list is in the [Gateway session API reference](/reference/hiecm-gateway).
