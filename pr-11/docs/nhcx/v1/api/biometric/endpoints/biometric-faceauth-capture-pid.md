# Face auth capture PID

`POST /pmjay/sbxhcx/abdmproxy/abha/biometric/capture/pid`

Polls for the face capture the patient completes in the ABHA app after scanning the QR code for the `txnId` from `Face auth init`.

### Business purpose

The face capture happens on the patient's phone, out of the hospital system's sight. This call is how the hospital learns that it has finished. It is the step between showing the QR code and verifying.

### When to use

After showing the QR code and before `Face auth verify`, repeatedly until the capture is complete. There is no callback.

### Preconditions

- A `txnId` from `Face auth init`.
- The patient has scanned the QR code built from it.
- The ABDM session token on `Authorization`, with a fresh `REQUEST-ID` and the current `TIMESTAMP`. No source sends `process` or `payerid` on this call.
- The request sent to the ABDM proxy host.

### Postconditions

Answers `PENDING` with `Awaiting PID capture` until the patient finishes, then `COMPLETE` with `PID capture successful`. On `COMPLETE`, move on to `Face auth verify`.

### Common mistakes

- Waiting for a callback instead of polling.
- Calling `Face auth verify` before this answers `COMPLETE`.
- Sending it to the fingerprint host.

### Best practices

- Poll while the QR code is on screen, and stop when the answer is `COMPLETE`.
- Show the desk that the capture is pending, so the patient is not asked to scan twice.

### Related scenario

The desk has shown the QR code for a discharge face authentication. It polls this endpoint with the `txnId` and gets `PENDING` while the patient completes the scan in the ABHA app. The next poll answers `COMPLETE`, and the desk calls `Face auth verify`.

### Specification

Chapter [Biometric authentication](/docs/nhcx/v1/roles/provider/biometric-authentication) of the NHCX integration specification.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/pmjay/sbxhcx/abdmproxy/abha/biometric/capture/pid \
  --header 'REQUEST-ID: <uuid>' \
  --header 'TIMESTAMP: <iso timestamp>' \
  --header 'Content-Type: application/json' \
  --data '{
  "txnId": "<txn id>"
}'
```

## Headers

- `REQUEST-ID` (string, required): `REQUEST-ID` is a fresh UUID that you generate for every call. Sending the same one twice is the mistake to avoid; generate it, do not copy it from an example.
- `TIMESTAMP` (string, required): `TIMESTAMP` is the current time in UTC, ISO 8601 with milliseconds and a trailing `Z`, as in `2026-09-04T06:15:51.975Z`. A clock that has drifted will be refused, so take the time from the system rather than constructing it by hand. How to produce it in each language is at the end of this chapter.

## Body

- `txnId` (string)

## Responses

- `200`: Answers `PENDING` with `Awaiting PID capture` until the patient finishes, then `COMPLETE` with `PID capture successful`.

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "status": "COMPLETE",
  "message": "PID capture successful"
}
```
