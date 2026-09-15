# 2026-09-05: the M1 and M2 test matrices were mostly not NHA's

`site/src/data/test-matrix/m1.json` carried 61 cases, of which 9 used an id
from NHA's sheet and 52 were written here with invented ids (B1, B2, C1).
`m2.json` carried 10, all invented (LNK_01, NTF_01, DAT_01). Neither matrix
was rendered on any page.

That is the one thing a certification matrix must not do. A developer working
through it believes they are preparing for the cases NHA will run, and the id
they pass is one NHA has never heard of.

Both sheets were already in the repository, recorded on 2026-09-04 and
unchanged:

| Sheet | sha256 |
| --- | --- |
| `ABHA-Creation-and-Verification-with-APIs-V1.1.xlsx` | `eb181bef...01f6` |
| `M2-Building-HIP-with-APIs-Updated-Aug-22.xlsx` | `07744bca...1abd` |

`scripts/build-test-matrix.py` now reads them. M1 goes from 9 to 66 real
cases across 13 groups, M2 from 0 to 36 across 11. The 52 and 10 cases written
here are kept, in a group called "Further checks this portal suggests", each
marked "Not an NHA test case." on the case itself.

## What the sheets are like

Their ids are not uniform, and the reader is handled rather than the sheet
being tidied: mixed case (`Health_RECORD_CREATION`), a trailing space
(`VRFY_ABHA `), an internal space (`SHARE _PATIENT_PROFILE`), and five with no
number at all (`HIP_INIT_GRANT_CONSENT_`).

NHA uses `VRFY_ABHA_501` twice, for ABHA verification by biometric and for
reading a profile from a QR code. Both are kept under that id, because that is
what the sheet says and renaming one would mean a case whose id nobody can
look up. NHA also spells one group "Exprire Consent Request", kept as written.

## Rendered

M1, M2 and M4 module pages now carry a Test cases section, which is rung nine
of the module ladder and had never been built. Their Certification sections
link to it.

M3 is not rendered. Its matrix is 16 cases, all written here, and no NHA sheet
for M3 has been supplied. Publishing invented ids under a Certification
heading is the defect this note is about, so M3 waits for its sheet.
