#!/bin/sh
# Runs the read-only, synchronous NHCX endpoint atoms against the sandbox and
# captures redacted evidence, so a verifier can compare each answer with the
# atom's "How you know it worked" section. It never sets verified itself.
#
#   NHCX_CLIENT_ID=... NHCX_CLIENT_SECRET=... \
#   NHCX_PARTICIPANT_CODE=<code to read, for example from the participant list> \
#   sh scripts/verify-nhcx.sh
#
# Required:
#   NHCX_CLIENT_ID, NHCX_CLIENT_SECRET   ABDM sandbox client credentials
#   NHCX_PARTICIPANT_CODE                participant code read by search,
#                                        details and fetch/certs
# Optional (the call is skipped when its inputs are unset):
#   NHCX_IDENTIFIER_TYPE, NHCX_IDENTIFIER_VALUE
#       AbhaNumber, MemberId or MobileNo and its value, for the two
#       get/policies calls. Use a test beneficiary only.
#   NHCX_CASE_ID, NHCX_PMJAY_PAYER_CODE
#       scheme case id and PMJAY payer code (no @hcx), for get/user-role
#   NHCX_ROLE (PAYER), NHCX_FROM_DATE (01/04/2021), NHCX_TO_DATE (today),
#   NHCX_SKIP_GET_SESSION=1 to leave out /get/session
#
# Calls, one per atom under catalogue/nhcx/endpoints/:
#   session-token.md            POST gateway /api/hiecm/gateway/v3/sessions
#   fetch-participants-list.md  POST /fetch/participants/list
#   participant-search.md       POST /participant/search
#   participant-details.md      POST /participant/details
#   fetch-certs.md              POST /fetch/certs
#   get-session.md              POST /get/session, then /fetch/certs with it
#   participant-get-policies.md POST /participant/get/policies     (optional)
#   v2-participant-get-policies.md POST /V2/participant/get/policies (optional)
#   payer-service-get-user-role.md POST .../v1/get/user-role        (optional)
# Nothing here creates, updates, links, delinks or submits.
#
# Secrets: credentials, tokens and request bodies reach curl on stdin, never on
# the command line, where ps would show them. Tokens are held in shell
# variables only. Every address must be https, curl is limited to https, and no
# call follows a redirect, which would resend the token header to another host.
# Evidence files carry named placeholders in place of tokens, credentials,
# cookies, mobile numbers, emails, OTPs and Aadhaar numbers, and the client
# secret and every token are also masked wherever they appear verbatim, as in
# an error text that echoes them. Do not run this with set -x.
set -eu

: "${NHCX_CLIENT_ID:?set NHCX_CLIENT_ID}"
: "${NHCX_CLIENT_SECRET:?set NHCX_CLIENT_SECRET}"
: "${NHCX_PARTICIPANT_CODE:?set NHCX_PARTICIPANT_CODE to the participant code to read}"

SESSIONS_URL=${NHCX_SESSIONS_URL:-https://dev.abdm.gov.in/api/hiecm/gateway/v3/sessions}
REGISTRY_BASE=${NHCX_REGISTRY_BASE:-https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice}
GET_SESSION_URL=${NHCX_GET_SESSION_URL:-https://apisbx.abdm.gov.in/get/session}
USER_ROLE_URL=${NHCX_USER_ROLE_URL:-https://apisbx.abdm.gov.in/pmjay/sbxhcx/nhcxpayerservice/v1/get/user-role}
CM_ID=${NHCX_CM_ID:-sbx}
ROLE=${NHCX_ROLE:-PAYER}
FROM_DATE=${NHCX_FROM_DATE:-01/04/2021}
TO_DATE=${NHCX_TO_DATE:-$(date +%d/%m/%Y)}
TIMEOUT=60

# Every call carries a credential or a token, so none may leave over plain HTTP.
for url in "$SESSIONS_URL" "$REGISTRY_BASE" "$GET_SESSION_URL" "$USER_ROLE_URL"; do
  case "$url" in
    https://*) ;;
    *) echo "Refusing to send credentials to a non-https address: $url" >&2; exit 1 ;;
  esac
done

OUT=$(mktemp -d "${TMPDIR:-/tmp}/nhcx-verify.XXXXXX")
export OUT

ts() { date -u +%Y-%m-%dT%H:%M:%S.000Z; }
rid() {
  if command -v uuidgen >/dev/null 2>&1; then uuidgen | tr 'A-Z' 'a-z'
  else python3 -c 'import uuid; print(uuid.uuid4())'; fi
}
# Escapes a value for a JSON string or a curl config string. The value moves
# through the printf builtin and a pipe, so it never appears in argv.
esc() { printf '%s' "$1" | sed 's/\\/\\\\/g; s/"/\\"/g'; }
# Writes the request as run, with placeholders, next to its evidence.
note() { printf '%s\n' "$2" > "$OUT/$1.request"; }

# Reads curl's "-D - -w __STATUS__" output on stdin, redacts it, writes
# NAME.headers and NAME.body, prints the status and a head of the body on
# stderr, and prints the named top-level field (a token) on stdout.
RECORD=$(cat <<'PY'
import json, os, re, sys
name = sys.argv[1]
key = sys.argv[2] if len(sys.argv) > 2 else ""
out = os.environ["OUT"]
raw = sys.stdin.buffer.read().decode("utf-8", "replace")
m = re.search(r"\n?__STATUS__(\d{3})\s*$", raw)
status = m.group(1) if m else "000"
if m:
    raw = raw[:m.start()]
headers, body = "", raw
while body.startswith("HTTP/"):
    cut, width = body.find("\r\n\r\n"), 4
    if cut < 0:
        cut, width = body.find("\n\n"), 2
    if cut < 0:
        headers, body = headers + body, ""
        break
    headers += body[:cut] + "\n\n"
    body = body[cut + width:]
secret_header = re.compile(r"^(set-cookie|cookie|authorization|proxy-authorization|bearer_auth|x-auth-token)\s*:", re.I)
lines = []
for line in headers.replace("\r", "").split("\n"):
    if secret_header.match(line):
        line = line.split(":", 1)[0] + ": <REDACTED>"
    lines.append(line)
secret_key = re.compile(r"(^token$|access_?token|refresh_?token|id_?token|secret|password|passcode|otp|aadhaar|mobile|phone|email)", re.I)
jwt = re.compile(r"eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+")
def scrub(v, k=""):
    if isinstance(v, dict):
        return {kk: scrub(vv, kk) for kk, vv in v.items()}
    if isinstance(v, list):
        return [scrub(x, k) for x in v]
    if k and secret_key.search(k) and v not in (None, ""):
        return "<REDACTED_" + re.sub(r"[^A-Za-z0-9]", "_", k).upper() + ">"
    if isinstance(v, str):
        return jwt.sub("<REDACTED_JWT>", v)
    return v
found = ""
try:
    doc = json.loads(body)
    if key and isinstance(doc, dict) and isinstance(doc.get(key), str):
        found = doc[key]
    clean = scrub(doc)
    pretty, flat = json.dumps(clean, indent=2), json.dumps(clean)
except ValueError:
    text = jwt.sub("<REDACTED_JWT>", body)
    text = re.sub(r"(?<!\d)[6-9]\d{9}(?!\d)", "<REDACTED_MOBILE>", text)
    text = re.sub(r"(?<!\d)\d{4}\s?\d{4}\s?\d{4}(?!\d)", "<REDACTED_12_DIGITS>", text)
    pretty = flat = text
# What this run knows to be secret is masked wherever it appears, in any shape:
# the client secret, the token sent with this call, and a token this response
# carries. Scrubbing by key name and by JWT shape alone misses an error text
# that echoes a secret, and a token that is not a JWT.
literals = [(os.environ.get("NHCX_CLIENT_SECRET", ""), "<REDACTED_CLIENT_SECRET>"),
            (os.environ.get("REDACT_TOKEN", ""), "<REDACTED_TOKEN>"),
            (found, "<REDACTED_TOKEN>")]
def mask(text):
    for value, label in literals:
        if value and len(value) >= 4:
            text = text.replace(value, label)
    return text
lines = [mask(line) for line in lines]
pretty, flat = mask(pretty), mask(flat)
with open(os.path.join(out, name + ".headers"), "w") as f:
    f.write("\n".join(lines))
with open(os.path.join(out, name + ".body"), "w") as f:
    f.write(pretty)
with open(os.path.join(out, "summary.txt"), "a") as f:
    f.write("%s HTTP %s\n" % (name, status))
sys.stderr.write("== %s: HTTP %s\n   %s\n" % (name, status, flat[:300].replace("\n", " ")))
if key:
    sys.stderr.write("   %s %s\n" % (key, "present (%d chars)" % len(found) if found else "absent"))
sys.stdout.write(found)
PY
)
record() { python3 -c "$RECORD" "$@"; }

# POST to the participant service with the three headers every registry
# atom sends. The token reaches curl as a config line on stdin.
registry() { # name path json-body body-as-recorded
  note "$1" "POST $REGISTRY_BASE$2
Accept: application/json
Content-Type: application/json
bearer_auth: Bearer <ACCESS_TOKEN>
$4"
  # The token and the body both reach curl as config lines on stdin, so neither
  # appears in argv, where ps would show a beneficiary identifier.
  RESP=$(printf 'header = "bearer_auth: Bearer %s"\ndata = "%s"\n' "$TOKEN" "$(esc "$3")" |
    curl -s -m "$TIMEOUT" --proto =https -D - -w '\n__STATUS__%{http_code}' -K - \
      -X POST "$REGISTRY_BASE$2" \
      -H 'Accept: application/json' \
      -H 'Content-Type: application/json') || RESP='__STATUS__000'
  printf '%s' "$RESP" | REDACT_TOKEN="$TOKEN" python3 -c "$RECORD" "$1" >/dev/null
}

echo "Evidence directory: $OUT"

# session-token.md
note session-token "POST $SESSIONS_URL
Content-Type: application/json
REQUEST-ID: <FRESH_UUID>
TIMESTAMP: <CURRENT_UTC_TIME>
X-CM-ID: $CM_ID
{\"clientId\":\"<NHCX_CLIENT_ID>\",\"clientSecret\":\"<NHCX_CLIENT_SECRET>\",\"grantType\":\"client_credentials\"}"
RESP=$(printf '{"clientId":"%s","clientSecret":"%s","grantType":"client_credentials"}' \
    "$(esc "$NHCX_CLIENT_ID")" "$(esc "$NHCX_CLIENT_SECRET")" |
  curl -s -m "$TIMEOUT" --proto =https -D - -w '\n__STATUS__%{http_code}' \
    -X POST "$SESSIONS_URL" \
    -H 'Content-Type: application/json' \
    -H "REQUEST-ID: $(rid)" \
    -H "TIMESTAMP: $(ts)" \
    -H "X-CM-ID: $CM_ID" \
    -d @-) || RESP='__STATUS__000'
TOKEN=$(printf '%s' "$RESP" | record session-token accessToken)
RESP=
if [ -z "$TOKEN" ]; then
  echo "No accessToken from the session call. The participant service calls need one; stopping." >&2
  echo "Evidence in $OUT/"
  exit 1
fi

# fetch-participants-list.md
BODY="{\"role\":\"$ROLE\",\"fromdate\":\"$FROM_DATE\",\"todate\":\"$TO_DATE\"}"
registry fetch-participants-list /fetch/participants/list "$BODY" "$BODY"

# participant-search.md and participant-details.md
BODY="{\"participant_code\":\"$NHCX_PARTICIPANT_CODE\"}"
registry participant-search /participant/search "$BODY" "$BODY"
registry participant-details /participant/details "$BODY" "$BODY"

# fetch-certs.md
BODY="{\"participantid\":\"$NHCX_PARTICIPANT_CODE\"}"
registry fetch-certs /fetch/certs "$BODY" "$BODY"

# participant-get-policies.md and v2-participant-get-policies.md
if [ -n "${NHCX_IDENTIFIER_TYPE:-}" ] && [ -n "${NHCX_IDENTIFIER_VALUE:-}" ]; then
  BODY="{\"identifiertype\":\"$NHCX_IDENTIFIER_TYPE\",\"identifiervalue\":\"$(esc "$NHCX_IDENTIFIER_VALUE")\"}"
  SHOWN="{\"identifiertype\":\"$NHCX_IDENTIFIER_TYPE\",\"identifiervalue\":\"<IDENTIFIER_VALUE>\"}"
  registry participant-get-policies /participant/get/policies "$BODY" "$SHOWN"
  registry v2-participant-get-policies /V2/participant/get/policies "$BODY" "$SHOWN"
else
  echo "== get/policies: skipped, NHCX_IDENTIFIER_TYPE and NHCX_IDENTIFIER_VALUE are unset" >&2
fi

# payer-service-get-user-role.md
if [ -n "${NHCX_CASE_ID:-}" ] && [ -n "${NHCX_PMJAY_PAYER_CODE:-}" ]; then
  BODY="{\"caseid\":\"$(esc "$NHCX_CASE_ID")\",\"payerid\":\"$(esc "$NHCX_PMJAY_PAYER_CODE")\"}"
  note payer-service-get-user-role "POST $USER_ROLE_URL
accept: application/json
Content-Type: application/json
bearer_auth: Bearer <ACCESS_TOKEN>
{\"caseid\":\"<CASE_ID>\",\"payerid\":\"$NHCX_PMJAY_PAYER_CODE\"}"
  # No --location: curl would resend the custom token header to any host a
  # redirect names. The body goes on stdin with the token, never in argv.
  RESP=$(printf 'header = "bearer_auth: Bearer %s"\ndata = "%s"\n' "$TOKEN" "$(esc "$BODY")" |
    curl -s -m "$TIMEOUT" --proto =https -D - -w '\n__STATUS__%{http_code}' -K - \
      --request POST "$USER_ROLE_URL" \
      --header 'accept: application/json' \
      --header 'Content-Type: application/json') || RESP='__STATUS__000'
  printf '%s' "$RESP" | REDACT_TOKEN="$TOKEN" python3 -c "$RECORD" payer-service-get-user-role >/dev/null
else
  echo "== get/user-role: skipped, NHCX_CASE_ID and NHCX_PMJAY_PAYER_CODE are unset" >&2
fi

# get-session.md, then its exit condition: /fetch/certs with that token
if [ "${NHCX_SKIP_GET_SESSION:-0}" != 1 ]; then
  note get-session "POST $GET_SESSION_URL
Content-Type: application/x-www-form-urlencoded
client_id=<NHCX_CLIENT_ID>&client_secret=<NHCX_CLIENT_SECRET>&grant_type=client_credentials"
  RESP=$(printf 'data-urlencode = "client_id=%s"\ndata-urlencode = "client_secret=%s"\n' \
      "$(esc "$NHCX_CLIENT_ID")" "$(esc "$NHCX_CLIENT_SECRET")" |
    curl -s -m "$TIMEOUT" --proto =https -D - -w '\n__STATUS__%{http_code}' -K - \
      -X POST "$GET_SESSION_URL" \
      -H 'Content-Type: application/x-www-form-urlencoded' \
      --data-urlencode 'grant_type=client_credentials') || RESP='__STATUS__000'
  GS_TOKEN=$(printf '%s' "$RESP" | record get-session access_token)
  RESP=
  if [ -n "$GS_TOKEN" ]; then
    TOKEN=$GS_TOKEN
    BODY="{\"participantid\":\"$NHCX_PARTICIPANT_CODE\"}"
    registry get-session-then-fetch-certs /fetch/certs "$BODY" "$BODY"
  fi
  GS_TOKEN=
fi
TOKEN=

echo
echo "Done. Evidence in $OUT/ (summary.txt, and NAME.request, .headers, .body per call)."
echo "Tokens, credentials and contact numbers are replaced with placeholders. A get/policies"
echo "body can still carry beneficiary details: review it before sharing or recording."
