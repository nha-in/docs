---
title: Every NHCX call returns 401
sidebar_label: Every NHCX call returns 401
sidebar_position: 2
description: "Every endpoint fails the same way: the token, its prefix, its header or its environment"
source: nhcx-package/docs/08-Troubleshooting/02-Every Call Returns 401.md
generated: true
covers:
  - nhcx.troubleshooting.everything-returns-401
---

# Every NHCX call returns 401

Every call fails with `401`, often with the message `Sender is not authorized to execute the operation`. When every endpoint fails the same way, the fault is your token or the header carrying it. It is not any one call.

## In short

- An expired token is the usual cause. Fetch a new one and retry the failing call once.
- The header value is `Bearer`, a space, then the token.
- Send the same value in `bearer_auth` and `Authorization`.
- A sandbox token never works against a production host.

## Prerequisites

- More than one endpoint is failing. If one call fails while others succeed, read that call's own error instead.
- You have the full response body, not only the status code.

## Work through these in order

1. **Has the token expired?** An expired token returns this message. Read the lifetime from the token response, `expiresIn` or `expires_in`, instead of assuming one. Fetch a new token and retry the failing call once. A retry with the old token fails the same way.
2. **Does the value start with `Bearer `?** The header value is the word `Bearer`, a space, then the token. A bare token returns `401`.
3. **Is the token in the header the call reads?** Send the same value in both `bearer_auth` and `Authorization`.
4. **Are the token and the host from the same environment?** A sandbox token does not work against a production host, or the reverse. Compare the host that issued the token with the host of the failing call. [Base URLs](/docs/nhcx/v1/getting-started/base-urls) lists both.
5. **Is the token call itself healthy?** If minting a token fails, check the credentials and the body. The session address needs `grantType` set to `client_credentials`. [Session Token](/docs/nhcx/v1/getting-started/session-token) has the call.

## What you see when it works

A call that returned `401` now returns its normal response. It keeps doing so across several calls, over more than one token lifetime. One success can be a token that happened to be fresh, so confirm again after the next refresh.

## When it goes wrong

A `401` on linking or de-linking a policy, while other calls work, is a different fault. The token must come from the client ID that created the payer or [TPA](/docs/nhcx/v1/getting-started/glossary#organisations-and-programmes) named in the link. Run the linking job under those credentials.

If all five checks pass and calls still return `401`, the credentials may have been revoked or reissued. Write to `hcx.integration@nha.gov.in` with the call, its time and the full response body. Never send the token or the client secret.

## Next steps

- [Session Token](/docs/nhcx/v1/getting-started/session-token): minting the token and keeping it fresh.
- [Troubleshooting](/docs/nhcx/v1/reference/troubleshooting): the symptom table, if the `401` names a header.
- [When something breaks](/docs/nhcx/v1/troubleshooting): the other symptoms.
