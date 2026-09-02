# HIE-CM troubleshooting atoms

One atom per symptom a developer actually reports, not per error code. A
developer who hits trouble usually knows what they saw, not which code
caused it: the callback never came, every call returns 401, the OTP never
arrived. Each atom in this folder starts there and walks the checks that
rule out the common causes, in the order this catalogue has evidence for.

These atoms exist alongside `errors/`, not instead of it. A troubleshooting
atom names the error atoms it can surface; it never repeats their content.

Scaffold a new one with the `atom-new` skill so the frontmatter and the five
mandatory sections come out right. READMEs like this one are contributor
notes, never indexed.
