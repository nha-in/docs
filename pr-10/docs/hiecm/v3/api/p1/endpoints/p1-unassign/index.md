# unassign

`PUT /api/family-management/unassign`

Ends the family relationship with the related ABHA address given, on the signed-in person's side.

```bash
curl --request PUT \
  --url https://phrsbx.abdm.gov.in/api/family-management/unassign \
  --header 'Content-Type: application/json' \
  --data '{
  "relatedAbhaAddress": "nithishnov@sbx"
}'
```
