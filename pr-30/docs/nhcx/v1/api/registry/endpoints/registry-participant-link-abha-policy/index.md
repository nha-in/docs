# Link ABHA number to policies

`POST /participant/link/abha/policy`

Payer-side write that links a beneficiary's ABHA number and member ID to one or more products, so provider policy lookups can find them.

### Business purpose

NHCX does not hold a national policy database of its own. Payers push their beneficiary-to-product links into the participant registry with this call, and providers pull them back with /participant/get/policies. Without a link, a hospital's policy lookup returns nothing and the patient cannot be processed as cashless on NHCX, regardless of what the admission record says. The insurer benefits by making its members discoverable; the hospital benefits by getting the payerId, memberId and productId it needs for every downstream claim call.

### When to use

Use it when a policy is issued or renewed, or a member is added. Also use it to link again after a de-link, for example when an insurer moves to a new TPA.

### Preconditions

- You have a valid access token in the `bearer_auth` header.
- You are the payer or its TPA, using the credentials that participant was created with.
- The payer, and the TPA if there is one, are already registered.

### Postconditions

The member's policies are linked at once. Providers can now find them through the get-policies lookups.

### Common mistakes

- Using a token from different credentials than the payer or TPA was created with.
- Mixing up `payerid` and `processingid`. `payerid` is always the insurer.
- Re-linking to change TPA. De-link first, then link with the new TPA.
- Leaving out a required field.

### Best practices

- Generate a fresh UUID for requestid on every call and log it with the response so a duplicate submission can be traced.
- Keep the ABHA number in the form the member layer expects (the identifier table and get/policies documentation both specify ABHA without hyphens) and store it in that form.
- Make sure productid and productname exactly match the payer's product catalogue as registered through /product/link, because providers will later match on these values.
- Cache and proactively refresh the Bearer token; retry once on 401 with a new token, then stop and alert.
- After linking, verify the result with /participant/get/policies using the same identifier before telling the provider the member is ready.

### Related scenario

A private insurer onboards a new group policy for a corporate client and issues a family floater to a beneficiary who already holds an ABHA. Its policy administration system has previously registered the product through /product/link and now calls /participant/link/abha/policy with the beneficiary's ABHA number, member ID, the insurer's own participant code as payerid and the TPA's code as processingid. A week later the beneficiary is admitted to a network hospital; the hospital's desk calls /participant/get/policies with the ABHA number, receives the linked details and uses the processingid as x-hcx-recipient_code for the coverage-eligibility check and the preauthorisation that follow.

### Specification

Chapter [Creating and updating a participant](/docs/nhcx/v1/getting-started/creating-and-updating-a-participant) of the NHCX integration specification.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/participant/link/abha/policy \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'bearer_auth: Bearer <access token>' \
  --header 'Content-Type: application/json' \
  --data '{
  "requestid": "7f3f2a4e-0c6b-4b7a-9e2d-2c1f8a5b6d90",
  "abhanumber": "12345678910111",
  "mobilenumber": "9876543210",
  "memberid": "MEM-2026-000123",
  "payerid": "100234@sbx",
  "policies": [
    {
      "productid": "PRD-FLOATER-01",
      "productname": "Family Floater Gold"
    }
  ],
  "processingid": "100235@sbx"
}'
```

## Authorization

- `Authorization` (bearer token, required): On every NHCX call, the token goes in a header called `bearer_auth`, with the word `Bearer` and a space in front. The sources are not unanimous: the authentication page and the FAQ both write the example as `Authorization`, and the notification endpoint uses `Authorization`. The safe course, and what the adapter does, is to send both headers with the same value.

## Headers

- `bearer_auth` (string, required): It is `bearer_auth`, not `Authorization`, on NHCX's own endpoints.

## Body

- `requestid` (string)
- `abhanumber` (string)
- `mobilenumber` (string)
- `memberid` (string)
- `payerid` (string)
- `policies` (object[])
- `policies.productid` (string)
- `policies.productname` (string)
- `processingid` (string)

## Responses

- `200`: On success the service returns HTTP 200 with ParticipantLinkAbhaResponse, whose two optional fields are result (a string) and errormessage (errorcode and errordescription).

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "result": "success"
}
```
