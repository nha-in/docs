# The exchange delivers a message to your bridge URL

`POST delivery`

The exchange POSTs to your registered `endpoint_url` plus the path of the exchange concerned, so a preauthorisation decision arrives at `<endpoint_url>/v1/preauth/on_submit`. Build one handler and route by path.

Answer within 30 seconds with `202` and the receipt, then process. Anything slower, including a slow `200`, is read as a failed delivery and retried up to five times before the correlation ID is retired.

Two body shapes arrive. `JWEPayload` carries a sealed bundle. `ProtocolResponse` carries a refusal, with the `x-hcx-` fields in the clear and the reason in `x-hcx-error_details`.

The exchange signs its calls to you with a JWT in the authorisation header. No published source gives the public key to verify against, an address to fetch it from, or the name of the header it arrives in, so build the check and treat a missing key as a deliberate, logged, temporary state rather than a silent default.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/hcxdelivery \
  --header 'Content-Type: application/json' \
  --data '"<VALUE>"'
```
