# Get the biometric auth refresh token

`GET /hcx/abha/biometric/auth/refresh/token`

Exchanges the refresh token from `Biometric auth verify` for a new thirty-minute user token without a fresh capture.

### Business purpose

A beneficiary's user token lasts thirty minutes, and a case lasts much longer. The refresh keeps a case authenticated through its transaction cycle without bringing the patient back to the device each time the token lapses.

### When to use

Use it when the user token lapses while a case is still open. Refresh at least once every ten days and keep the new refresh token.

### Preconditions

- A refresh token less than fifteen days old, sent on `R-token`.
- The ABDM session token on `Authorization`, with `payerid` and `process`.

### Postconditions

Returns a new user token and a new refresh token. The new refresh token replaces the old one.

### Common mistakes

- Sending the refresh token on `Authorization` instead of `R-token`.
- Keeping the old refresh token after a refresh.
- Refreshing where a live capture is required, such as each visit of a cyclic case.

### Best practices

- Refresh within every ten days and store the new token.
- Refresh automatically while a case is open. If the token has lapsed and cannot be refreshed, start a fresh authentication.

### Related scenario

A beneficiary's eligibility was checked with a fresh token at admission, but the pre-authorisation is ready only after the thirty minutes have passed. The integration sends the stored refresh token on `R-token` to this endpoint, receives a new user token and a new refresh token, sends the user token on the pre-authorisation, and stores the new refresh token against the case.

### Specification

Chapter [Biometric authentication](/docs/nhcx/v1/roles/provider/biometric-authentication) of the NHCX integration specification.

```bash
curl --request GET \
  --url https://apisbx.abdm.gov.in/hcx/abha/biometric/auth/refresh/token \
  --header 'R-token: Bearer <refresh token>' \
  --header 'payerid: <payer code>' \
  --header 'process: Preauth'
```

## Headers

- `R-token` (string, required): Sent on this call, as the package's request carries it.
- `payerid` (string, required): `payerid` is the insurer's own participant code. Every insurer has one, even when it works through a TPA.
- `process` (string, required): No source puts `process` or `payerid` on `faceauth/init` or `capture/pid`.

## Responses

- `200`: Returns a new user token and a new refresh token.
