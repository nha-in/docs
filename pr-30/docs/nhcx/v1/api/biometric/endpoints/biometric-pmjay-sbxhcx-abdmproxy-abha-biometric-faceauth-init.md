# Submit the face auth init

`POST /pmjay/sbxhcx/abdmproxy/abha/biometric/faceauth/init`

Starts a face authentication on the ABDM proxy host and returns the `txnId` the rest of the face flow quotes.

### Business purpose

Face authentication is the method that works when fingerprint and iris do not. The capture happens on the patient's own phone, in the ABHA app, rather than on a hospital device. A case authenticated by fingerprint at admission can be authenticated by face at discharge, because the methods do not have to match across a case.

### When to use

Use it when fingerprint and iris do not work for the patient. The patient completes the face scan on their own phone, in the ABHA app.

### Preconditions

- The ABDM session token on `Authorization`, with a fresh `REQUEST-ID` and `TIMESTAMP`.
- The request goes to the ABDM proxy host, not the fingerprint host.
- The patient has the ABHA app on a phone.

### Postconditions

Returns a `txnId`. Show `https://phrsbx.ABDM.gov.in/face-auth?txnId=<txnId>` as a QR code for the patient to scan with the ABHA app.

### Common mistakes

- Sending it to the fingerprint host.
- Waiting for a callback. There is none, so you poll.
- Treating face as optional. All three methods must be built.

### Best practices

- Keep both biometric base paths in configuration.
- Record the `txnId` against the case as soon as it arrives.

### Related scenario

A patient authenticated by fingerprint at admission cannot be captured on the device at discharge. The desk calls this endpoint, shows the QR code built from the `txnId`, and the patient scans it with the ABHA app. The desk polls `Face auth capture PID` until the capture is complete, then calls `Face auth verify`.

### Specification

Chapter [Biometric authentication](/docs/nhcx/v1/roles/provider/biometric-authentication) of the NHCX integration specification.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/pmjay/sbxhcx/abdmproxy/abha/biometric/faceauth/init \
  --header 'REQUEST-ID: <uuid>' \
  --header 'TIMESTAMP: <iso timestamp>' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-enrol",
    "face-auth"
  ]
}'
```

## Headers

- `REQUEST-ID` (string, required): `REQUEST-ID` is a fresh UUID that you generate for every call. Sending the same one twice is the mistake to avoid; generate it, do not copy it from an example.
- `TIMESTAMP` (string, required): `TIMESTAMP` is the current time in UTC, ISO 8601 with milliseconds and a trailing `Z`, as in `2026-09-04T06:15:51.975Z`. A clock that has drifted will be refused, so take the time from the system rather than constructing it by hand. How to produce it in each language is at the end of this chapter.

## Body

- `scope` (string[])

## Responses

- `200`: Returns a `txnId`.
