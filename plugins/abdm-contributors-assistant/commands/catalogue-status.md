---
description: Coverage and graph health of the ABDM Catalogue by gateway, milestone and atom type.
argument-hint: '[--gateway <g>|--milestone <M>|--gaps]'
---

Report where the ABDM Catalogue actually is. Filters: `$ARGUMENTS`. With no arguments, report everything.

Where the Catalogue actually is, as opposed to where it feels like it is.

## Usage

```
/catalogue-status
/catalogue-status --gateway hiecm
/catalogue-status --milestone M2
/catalogue-status --gaps             # what is missing rather than what exists
```

## What it reports

**Coverage** per gateway and milestone: atoms by type, against the expected set derived from the ingested OpenAPI operations. An endpoint in the spec with no atom is a gap.

**Sandbox evidence**: which endpoint atoms have a file under `catalogue/verification/`, and how old the newest run is. Atoms carry no status; this is the only record.

**Scope** reporting: which gateways and milestones carry atoms, and which carry none yet. Report the counts rather than judging them, because no gateway is barred. Flag anything in M1 to M3 claiming dummy-proof depth without all five sections.

**Graph health**: dangling ids, orphan atoms, flows with no skill target, flow steps with no endpoint atom.

**Blockers to the definition of done**, mapped to the numbered list in `portal-planning`, so the gap between here and shippable is explicit rather than estimated.

## Reading it

The number that matters is not atoms written. It is endpoint atoms on the dummy-proof paths with matching sandbox evidence, because that is what the definition of done requires and what the first-day developer test exercises.

A high atom count with little evidence is the failure mode this command exists to make visible.
