# Fetch a participant's public key

`POST /fetch/certs`

Returns the key material to seal a message for that participant, as PEM text. Usually a full X.509 certificate; for a participant who registered a bare key, an SPKI public key instead. Try the certificate import first and fall back to the key. The handbook's rule of thumb is that anything under about 400 bytes is a bare key.

Fetch against the `processingid` from the policy lookup, not the insurer's `payerid`. Cache by participant code for 24 hours.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/fetch/certs \
  --header 'Accept: <ACCEPT>' \
  --header 'Content-Type: application/json' \
  --data '{
  "participantid": "1000003538@hcx"
}'
```
