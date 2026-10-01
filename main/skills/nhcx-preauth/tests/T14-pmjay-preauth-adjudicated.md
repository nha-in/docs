# T14. PMJAY Pre-authorisation Through the Payer Service

#### T14D. DESCRIPTION

On PMJAY the decision is taken on the NHCX Payer Service, outside the exchange ([A14. Adjudicator User Role](../apis/A14-adjudicator-user-role.md), [A15. Adjudicator Process Case](../apis/A15-adjudicator-process-case.md), payer service transport). A pre-authorisation is decided in one step, at PPD-Trust. PMJAY first acknowledges the request, then sends its decision; both arrive as [C5. Pre-auth Reply](../callbacks/C5-preauth-on-submit.md) on the leg's correlation id and neither is routed on its workflow id (CORE instruction 5).

#### T14S. SETUP

A PMJAY claim with a package and its ruling, as [T13. PMJAY Eligibility, Package Master and Ruling](T13-pmjay-eligibility-and-package-master.md) leaves it; the Payer Service token from [T1. Test Configuration](T1-test-configuration.md) (or the facility's own session token).

#### T14G. GUI

1. [S4. Claim Creation Form](../screens/S4-claim-creation-form.md), [S9. Pre-authorisation](../screens/S9-preauthorisation.md): fill and send the pre-authorisation; wait for PMJAY's acknowledgement on [S9. Pre-authorisation](../screens/S9-preauthorisation.md).
2. Payer side, through the payer driver: read the role; run the `approve` cycle.
3. Wait on [S9. Pre-authorisation](../screens/S9-preauthorisation.md) for the decision.

#### T14L. CLI

1. [A4. Pre-auth Submit](../apis/A4-preauth-submit.md); wait for the first [C5. Pre-auth Reply](../callbacks/C5-preauth-on-submit.md) (the acknowledgement).
2. [A14. Adjudicator User Role](../apis/A14-adjudicator-user-role.md) with the case number read off the leg's payer reference (its last `/` segment, [PAYER](../references/PAYERS.md#markers)).
3. [A15. Adjudicator Process Case](../apis/A15-adjudicator-process-case.md) cycle with decision `approve`.
4. Wait for the next [C5. Pre-auth Reply](../callbacks/C5-preauth-on-submit.md).

#### T14X. EXPECT

- The send goes out under PMJAY's pre-authorisation workflow id ([PAYERS.md](../references/PAYERS.md#workflow-ids)) with the `AB-PMJAY` programme code on every line.
- [A14. Adjudicator User Role](../apis/A14-adjudicator-user-role.md) returns `PPD-Trust`; the cycle takes `Approve` there and stops `completed`, with one step in its trail and one `cycle_id`.
- The decision arrives as [C5. Pre-auth Reply](../callbacks/C5-preauth-on-submit.md); the leg is `approved` with PMJAY's approved amount, shown on [S9. Pre-authorisation](../screens/S9-preauthorisation.md).
- Every action taken, and the cycle's trail, is recorded against the claim.
