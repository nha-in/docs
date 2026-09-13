# delink

`PUT /api/family-management/delink`

Removes the family link between the signed-in person's ABHA address and the related address given.

```bash
curl --request PUT \
  --url https://phrsbx.abdm.gov.in/api/family-management/delink \
  --header 'Content-Type: application/json' \
  --data '{
  "relatedAbhaAddress": "nithishnov@sbx"
}'
```
