#!/bin/sh
# Settles PENDING P6 and P7 with two sandbox calls, and captures the evidence.
#
#   ABDM_CLIENT_ID=... ABDM_CLIENT_SECRET=... sh scripts/verify-pending.sh
#
# P6: does GET /v3/profile/public/certificate work with a correct UTC
#     TIMESTAMP? (Never observed succeeding; atom says unproven.)
# P7: what does the encrypt helper actually return? (Observed working,
#     response shape never captured.)
#
# Evidence lands in /tmp/abdm-verify/; paste the summary back into the
# session, or attach the files, and the atoms get their verified stamps.
set -eu

: "${ABDM_CLIENT_ID:?set ABDM_CLIENT_ID}"
: "${ABDM_CLIENT_SECRET:?set ABDM_CLIENT_SECRET}"

OUT=/tmp/abdm-verify
mkdir -p "$OUT"

ts() { date -u +%Y-%m-%dT%H:%M:%S.000Z; }
rid() { uuidgen | tr 'A-Z' 'a-z'; }

echo "== session token (gateway)"
curl -s -X POST 'https://dev.abdm.gov.in/api/hiecm/gateway/v3/sessions' \
  -H 'Content-Type: application/json' \
  -H "REQUEST-ID: $(rid)" \
  -H "TIMESTAMP: $(ts)" \
  -H 'X-CM-ID: sbx' \
  -d "{\"clientId\":\"$ABDM_CLIENT_ID\",\"clientSecret\":\"$ABDM_CLIENT_SECRET\",\"grantType\":\"client_credentials\"}" \
  > "$OUT/session.json"
TOKEN=$(python3 -c "import json;print(json.load(open('$OUT/session.json'))['accessToken'])")
echo "   token acquired (${#TOKEN} chars)"

echo "== P2: certificate endpoint, correct UTC timestamp"
CODE=$(curl -s -o "$OUT/certificate.json" -w "%{http_code}" \
  'https://abhasbx.abdm.gov.in/abha/api/v3/profile/public/certificate' \
  -H "Authorization: Bearer $TOKEN" \
  -H "REQUEST-ID: $(rid)" \
  -H "TIMESTAMP: $(ts)" \
  -H 'X-CM-ID: sbx')
echo "   HTTP $CODE -> $OUT/certificate.json"
head -c 300 "$OUT/certificate.json"; echo

echo "== P3: encrypt helper, capture the response shape"
CODE=$(curl -s -o "$OUT/encrypt.json" -w "%{http_code}" \
  -X POST 'https://abhasbx.abdm.gov.in/abha/api/v3/phr/app/enrollment/encrypt' \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $TOKEN" \
  -H "REQUEST-ID: $(rid)" \
  -H "TIMESTAMP: $(ts)" \
  -H 'X-CM-ID: sbx' \
  -d '{"data":"1"}')
echo "   HTTP $CODE -> $OUT/encrypt.json"
head -c 300 "$OUT/encrypt.json"; echo

echo
echo "Done. Evidence in $OUT/ - session.json holds a live token, do not share it;"
echo "certificate.json and encrypt.json are the two answers PENDING is waiting on."
