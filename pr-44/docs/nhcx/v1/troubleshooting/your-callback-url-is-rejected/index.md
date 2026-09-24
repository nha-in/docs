# Your callback URL is rejected or never called

The National Health Claims Exchange (NHCX) delivers requests and answers to the `endpoint_url` on your participant record. Either the update that sets it is refused, or it saves and nothing ever arrives. A sender addressing you sees `NHCX-1001`, receiver system not reachable.

## In short

- The URL is HTTPS, uses a domain name with no port, and points at a server in India.
- Allow the exchange's three addresses through your firewall.
- An endpoint update activates only after you confirm its passcode within 24 hours.
- Answer every delivery `202` within 30 seconds.

## Prerequisites

- Your participant is active, and you can call the participant update.
- You know the rules the address must meet. [Receiving a Callback](/docs/pr-44/docs/nhcx/v1/getting-started/receiving-a-callback) has them.

## Work through these in order

1. **Is the URL HTTPS and publicly reachable?** It must be publicly accessible and reachable from the exchange.
2. **Does it use a domain name?** Use a fully qualified domain name. An IP address, or a port number in the URL, is not accepted.
3. **Is the server hosted in India?** Callback servers must be.
4. **Are the exchange's addresses allowed in?** Allow `3.109.99.210`, `13.126.152.0` and `13.200.129.223` in your server configuration and firewall. Confirm no firewall rule blocks incoming requests from them.
5. **Did you confirm the update?** An endpoint update sends a passcode. The new endpoint activates only after you confirm it with [the update validation call](/docs/pr-44/docs/nhcx/v1/api/onboarding/endpoints/onboarding-update-validate), within 24 hours.
6. **Does your application route every path the exchange calls?** Requests arrive on use-case paths such as `/v1/claim/on_submit`. Check that load balancers, gateways and reverse proxies send each path to the right service and version.
7. **Does your endpoint answer fast enough?** Answer `202` with the receipt body within 30 seconds. Otherwise the exchange retries five times, then deletes the request.

## What you see when it works

Your participant record shows the new endpoint as active. The next message addressed to you arrives on the right path, and your endpoint answers it `202` within 30 seconds.

To see a delivery arrive, send a coverage eligibility check to the [dummy payer](/docs/pr-44/docs/nhcx/v1/getting-started/glossary#messages), `1000003538@hcx`. Its `/v1/coverageeligibility/on_check` callback arrives at your endpoint.

## When it goes wrong

If every check passes and nothing arrives, find out whether the request was ever sent to you. See [Accepted with 202, and no callback arrives](/docs/pr-44/docs/nhcx/v1/troubleshooting/accepted-then-no-callback).

If the update itself keeps failing, write to `hcx.integration@nha.gov.in` with your participant code, the endpoint URL and the full response.

## Next steps

- [Receiving a Callback](/docs/pr-44/docs/nhcx/v1/getting-started/receiving-a-callback): the endpoint, the receipt and the paths to host.
- [Creating and Updating a Participant](/docs/pr-44/docs/nhcx/v1/getting-started/creating-and-updating-a-participant): the update and its confirmation.
- [When something breaks](/docs/pr-44/docs/nhcx/v1/troubleshooting): the other symptoms.
