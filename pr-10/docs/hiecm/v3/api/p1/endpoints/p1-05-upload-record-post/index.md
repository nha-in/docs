# 05 - Upload Record [POST]

`POST /digi-locker/upload`

Uploads a file the person holds into their DigiLocker as a health record.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/digi-locker/upload \
  --header 'Content-Type: application/json' \
  --data '{
  "attachment": "base64_encoded_file_content_here",
  "fileName": "sample_report.pdf"
}'
```
