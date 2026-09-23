# 23 September 2026

6 changes

### P2 consent, linking and share calls go to the gateway

The [P2](/docs/pr-28/reference/hiecm-p2) reference printed 17 calls under `/api/hiecm/` against `https://abhasbx.abdm.gov.in`, the ABHA service. They are gateway calls and go to `https://dev.abdm.gov.in`: consent requests and artefacts, auto approval, linking, discovery and patient share. The `/abha/api/v3/phr/app/` calls stay on the ABHA service. If your app built these URLs from the sample, change the host.

### List calls send their required query parameters

The samples on a list call now carry the query parameters the call requires, for example `?limit=5&offset=5&status=ALL` on listing subscription requests. Before, the sample sent the path alone and the call was refused. Listing subscription requests now requires `limit`, `offset` and `status`.

### PHR registration by Aadhaar number, and no email update

[P1](/docs/pr-28/docs/hiecm/v3/milestones/p1) lists registering an ABHA address from an Aadhaar number again, through the ABHA number the Aadhaar OTP creates. Updating the email on a PHR profile is deprecated and no longer listed in P2. On approving a subscription request, `hip` is optional.

### Subscriptions are part of P3, and gateway calls gain two fields

The subscription request and its notifications, a module of their own until now, are the first journey in [P3](/docs/pr-28/reference/hiecm-p3), beside the approve and deny calls they pair with. Old page links redirect. Listing providers takes optional `stateCode` and `districtCode`, and the discovery reply `on-discover` requires `X-HIU-ID`, as the PHR swagger declares.

### Try it fills in fixed values, and the gateway lists what it owns

In Try it, a field that takes only one value, such as `otpSystem` on an M1 use case or `grantType` on the session call, is filled in and locked. The response panel expands to the whole console, and long lines wrap. Callback bodies declared as a success or an error shape, such as [link on care context](/docs/pr-28/docs/hiecm/v3/api/m2/endpoints/m2-callbacks/02-m2-post-v3-link-on-carecontext), show their fields. The [gateway](/docs/pr-28/reference/hiecm-gateway) lists the bridge calls and the session call. Providers and government programmes are in [P2](/docs/pr-28/reference/hiecm-p2), the health locker list in [P4](/docs/pr-28/reference/hiecm-p4).

### P2 is Consents Management, and the patient share calls are named for the OPD

The P2 reference is [P2 Consents Management](/docs/pr-28/reference/hiecm-p2). Its patient share calls read OPD token generation and OPD Token History, in a journey called Quick OPD Registration. Updating the email is gone from every P2 call, not only from the list of journeys. The two PHR application pages are now [one page](/docs/pr-28/docs/hiecm/v3/concepts/participants/phr), which speaks in P1 to P3. The OpenID configuration, key set and update bridge service pages are gone; their old addresses redirect.
