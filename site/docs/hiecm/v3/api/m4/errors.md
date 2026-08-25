---
title: M4 HPR and HFR errors
sidebar_label: Errors
sidebar_position: 98
description: What M4 HPR and HFR returns when a call fails, and what to do about it.
verification: unverified
source: hiecm-m4.yaml
---

# M4 HPR and HFR errors

## Code ranges

| Range | What it covers | Examples |
| --- | --- | --- |
| `HIS-400 to HIS-504` | The HTTP level failures | HIS-401 user is not authorized, HIS-403 forbidden, HIS-503 requested service is unavailable |
| `HIS-1xxx` | Validation and facility errors, 103 of them | HIS-1002 the field value should not be empty, HIS-1124 bridge not linked, HIS-1128 HIP name already exists, HIS-1132 duplicate facility detected |
| `HIS-2xxx` | Aadhaar, OTP and session errors | HIS-2022 invalid OTP, HIS-2031 request expired, HIS-2045 session expired |
| `HIS-3xxx` | Aadhaar data and HPID state | HIS-3001 resident data not available, HIS-3021 HPRID already exists, HIS-3031 invalid token |
| `HIS-4xxx` | Facility record errors | HIS-4003 facility already exists, HIS-4032 invalid state code, HIS-4055 invalid image format |
| `HIS-5xxx` | Registration workflow errors | HIS-5005 already registered, HIS-5011 token expired |

Every code above is recorded in the specification that owns it. The aggregated list across modules is at [error codes](/docs/hiecm/v3/reference/error-codes).

<a class="next-step" href="/docs/support">
<span class="next-step__eyebrow">Next</span>
<span class="next-step__label">Still stuck? Ask for help</span>
<span class="next-step__detail">Where to file what you hit, so the answer lands back in these pages.</span>
</a>

