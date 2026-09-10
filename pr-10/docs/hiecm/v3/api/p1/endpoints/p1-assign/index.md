# assign

`POST /api/family-management/assign`

Links another ABHA address to the signed-in person's address under a relationship type, so the two profiles are managed as a family.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/api/family-management/assign \
  --header 'Content-Type: application/json' \
  --data '{
  "relatedAbhaAddress": "nithishnov@sbx",
  "relationshipTypeId": 2
}'
```
