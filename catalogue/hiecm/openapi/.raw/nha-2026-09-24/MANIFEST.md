# NHA M4 swagger, published sandbox groups, 24 September 2026

Every file NHA supplied, with the sha256 of the bytes committed here. Every one of them is redacted by the same rules, because sandbox tokens, mobile numbers, ABHA numbers and addresses, HPR identifiers, photographs and internal hostnames turned up across the set rather than in a few files. Each row records the sha256 of the original bytes so a reissued file can be matched, and the originals are held outside git.

The three groups the sandbox Swagger page at https://apihspsbx.abdm.gov.in/v4/int/swagger-ui-ext/index.html publishes, downloaded from /v4/int/v3/api-docs/HFR, /HPR and /HPID on 24 September 2026. They replace the M4 files of the 16 September set as the M4 source. The original sha256 is of the bytes as served, a single line of JSON; the committed file is the same JSON indented by four spaces, as the 16 September files are, and then redacted.

| File | sha256 committed | sha256 original | Redactions |
| --- | --- | --- | --- |
| `M4/M4-HFR.json` | `39a581bb31e74f48340703056258e31850788848220787814ffa49750d23d9ba` | `c6965840accce9f2e4687227f0a37030eba53590e4c252123acd2362ee8ba702` | abha-address 1, email 1 |
| `M4/M4-HPID.json` | `b673f1dc7d25958998a8be194c87df9b779fd80389f9c8970bdb28b53df30b12` | `ab3f94f56a7b0ca02020b11127378ca8a4286983cab4e0ab7ee49f64b6141c80` | abha-address 1, email 1 |
| `M4/M4-HPR.json` | `2cbcab72692ada1b6b07bce3c6c6d3e3bd047bcaca0c5716ac1d691121025081` | `2725767148fa43dff6df8afdbf4309289d302dc11086d03e21d820d660b4f111` | abha-address 1, email 1 |
