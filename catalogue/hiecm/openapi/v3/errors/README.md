# Error codes NHA lists per module

One `<module>.yaml` per module for which NHA has supplied an error code list
that is not tied to a call, as it did for M2 in its API review of 21
September 2026. `scripts/lib/spec-errors.mjs` merges a module's list with
the codes its specification's response examples return, so the module's
errors page, the error codes reference and the compiled skills show both.

Each file carries `intro`, the sentence NHA wrote above its table, `source`,
and `codes`, a list of `code` and `message`. Nothing here is invented: a row
is here because NHA's document lists it. A code NHA lists with more than one
message keeps every message.
