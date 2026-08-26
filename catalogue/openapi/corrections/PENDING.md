# Pending edits, flagged and tracked, not yet applied

Things we believe are wrong, or cannot yet decide, recorded here rather than
changed. Nothing on this page has been edited in the Catalogue. Each entry
says what would change, what it is blocked on, and how it gets settled.

Move an entry out of this file only when the blocker is gone, and record the
change in a dated corrections file.

## P1: UUID format assertions, 26 sites

**Status:** correction C3 already removed the assertion. Whether it should
come back is undecided.

NHA's schemas declare `consentId`, `consentRequestId` and `id` as
`format: uuid`. NHA's own examples for those fields are not UUIDs.

| If | Then |
|---|---|
| Real values are UUIDs | Restore `format: uuid`, and NHA's examples are wrong |
| Real values are not UUIDs | Keep it removed, and NHA's schema is wrong |

**Blocked on:** one real response from the sandbox. Any consent request will
settle it in a single call.

**Do not** guess from the examples. NHA's example values look synthetic, so
they are weak evidence either way.

Sites carry `x-abdm-correction: C3` and are findable with
`grep -rn "x-abdm-correction: C3" catalogue/openapi`.

## P2: HI type, the value set is not pinned anywhere

**Status:** flagged, untouched.

Health information types appear in three places with three shapes.

| Where | Shape |
|---|---|
| M2 specification, `hiType` | A string, corrected to an array under C4 |
| M3 consent request | A list, values unconstrained |
| NHA's M2 document | A prose table of seven names |

The seven NHA names: Prescription, DiagnosticReport, OPConsultation,
DischargeSummary, ImmunizationRecord, HealthDocumentRecord, WellnessRecord.

No file declares these as an enum, so nothing rejects a wrong value at
build time and an integrator learns the list from a rejected call.

**What would change:** one shared enum, referenced from every `hiType` and
`hiTypes` field across M2 and M3.

**Blocked on:** confirmation that the seven are complete and current, and
that the wire values match the display names exactly. The M2 document gives
display names, not necessarily wire values.

## P3: the `action` column on 500 error codes

**Status:** applied, and it is ours rather than NHA's.

NHA's workbooks give a code and a message. They do not say what an
integrator should do. The action shown against each code is this
catalogue's reading of the message text, by rule:

| Rule matches | Action |
|---|---|
| not authorised, forbidden, blocked, deactivated, consent | Cannot proceed |
| unavailable, timeout, try again, too many requests | Retry |
| invalid, missing, mismatch, not found, expired, format | Fix request |
| anything else | Unclassified |

**Blocked on:** NHA confirming, or a reviewer reading the Unclassified ones.
Until then every module's error page says the action is not NHA's.

## P4: 422 Aarogya Setu codes, resolved

**Status:** closed on 25 August 2026.

`ErrorCode-Message.xlsx` carries two parallel sheets of 422 rows: `CoreBlock`
with `ABDM-xxxx` codes and `AarogyaSetu` with `AS-xxxx`, row for row. It is a
translation table: the same failure, worded for a patient facing PHR
application rather than for a system integrator.

Both halves are now ingested. The `ABDM-xxxx` half sits against the modules
that raise it. The `AS-xxxx` half is recorded once against P1 and applies to
every PHR module, because Aarogya Setu is NHA's reference PHR and the same
codes reach any PHR implementation.

Still to confirm with NHA, carried as item 6 in `docs/asks-for-nha.md`:
whether `AS-xxxx` codes appear on the wire to a PHR integrator, or only
inside Aarogya Setu itself. If they are internal they should not be in a
developer portal at all.

## P5: NHA repeats the gateway group in every milestone file

**Status:** resolved structurally, worth watching.

The session, certificate and bridge operations appear in all three milestone
files. We describe them once in `hiecm-gateway.yaml`. If NHA ever lets the
three copies drift apart, our single copy will silently follow whichever one
we ingested last.

**Blocked on:** nothing. This is a watch item for the source watcher.

## P8: TIMESTAMP verified on sandbox, assumed for production

**Status:** the UTC format is observation-backed for abhasbx.abdm.gov.in
only (2026-08-25). Production (abha.abdm.gov.in) is assumed to behave the
same, consistent with NHA's own spec saying UTC, but has not been observed.

**Blocked on:** one production call, once production credentials exist.
