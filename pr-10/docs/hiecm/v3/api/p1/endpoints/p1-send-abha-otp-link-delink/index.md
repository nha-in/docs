# Send ABHA Otp - Link-DeLink

`POST /api/login/profile/request/otp`

Sends an OTP to the ABHA number's registered contact to authorise linking or delinking an ABHA address. `loginId` is encrypted.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/api/login/profile/request/otp \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-login",
    "mobile-verify"
  ],
  "loginHint": "abha-number",
  "loginId": "Dl3zAX8xvneRfB2KKkEt3KTTVs1PK7LXSMODQsu3VWnksnnHLmNJDtD2yuLZnRvrjySf79n3LFLjedxFF6f5PELEts2yNYo+oL80cjS+Zw1ODyrc/ziHiJAlCzhN6XM2FxlfVQc/VeF9MdXCMrEq5AY6b3xj1VxiWcCmN/pyUk/VtxABvCMYGswq6/cEBc3jI90/srM02BwuavWj5H9sudMGfs1q4sIx0b9l05COEOjq+R4v+OArf2ohsedmTBR/dL9ZZqS5/pSSyD/6TJ3UvvmC2tRNEDwHYwH7mWnzJii+3sj00rLjPwPOSSxfkX07NCS5LTDCJ4hjJt5AVUyqv/kRBJ+hLvfo/HXtaCbebyYVfYd3QE3AGIat/ZO6pecjH+cx+ZJNKmULS8HigaiVav+3Plbe6tomfJyRVFhQIsWAk6wt/EqOKzKrzvs2MpMdpfNfaNscU24PdPSO3XpohmHkekJbwzLsVLmzLZfBlqluCPN49MxLfU/6lyntaz5XenmM1q06Ut3dCgWaQWe5fTm+mKRYftHGXNjCgmh5EOmNmBWzWjRBCREE1mSelUXtpR0dK9MUykA30tTs1LWL/h7myy/oqovTTfsYkkIvWpGTCqnWPclgELrExaDrbmpyLmqEo+KCw5m8vPiksp2f8vWo9Xj+8S3HmCGCBxldrwA=",
  "otpSystem": "<OTPSYSTEM>"
}'
```
