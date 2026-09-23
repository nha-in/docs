# 8. Validation

One section per skill. A later skill appends its section; the per-module record files carry every skill's rows, each tagged with its skill.

## nhcx-<skill>

### Per module

| Module | Part | Checks | Passed | Failed | Re-validated | Record |
| --- | --- | --- | --- | --- | --- | --- |
| | | | | | | |

### Reused capabilities

Every capability stage 0 found present, with its rows run here.

| Capability | Rows run | Observed | Still present |
| --- | --- | --- | --- |
| | | | |

### Cross-module

| Check | How | Observed | OK |
| --- | --- | --- | --- |
| Every pin this skill owns has one comparison | | | |
| Archive holds one file per message on this skill's legs | | | |
| Stage agrees with case_stage after every write | | | |
| Only 7.1 sends, only 7.3 receives | | | |
| No literal codes outside 7.11 and configuration | | | |
| Every leg row this skill writes stores the four ids | | | |
| Another skill's rows re-run for every shared module this skill extended | | | |
| HL7 validator | | | |

### Accepted exceptions

| Check | Why accepted | Agreed by |
| --- | --- | --- |
| | | |
