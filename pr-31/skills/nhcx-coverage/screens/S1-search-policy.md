# S1. Search Policy Screen

#### S1R. ROUTE
claims/search

Breadcrumb: Claims (claims/list, S5) > Policy search

#### S1D. DESCRIPTION
The first step of a new claim. The operator types in one identifier the beneficiary carries. The app then looks up every policy linked to that identifier on the NHCX Beneficiary Identification System (BIS).

Identifier types, in this order (Member ID is the default):

| Value (sent upstream) | Label |
|---|---|
| `MemberId` | Member ID |
| `MobileNo` | Mobile number |
| `AbhaNumber` | ABHA number |

Member ID comes first because it is printed on the card the beneficiary hands over, and the payer's directory is keyed on it [REF](../references/PAYERS.md#markers).

API: [A1. Policy Search](../apis/A1-policy-search.md)

Rules:
- Validation happens before any call. An unknown identifier type gets "Choose what kind of identifier you are searching with." An empty value gets "Enter an identifier value to search for."
- Any upstream failure shows as a red error message inside a card on the screen, never as a 500.
- The search is a GET with the type and value in the query string, so a result can be bookmarked and a refresh repeats the search.
- The sandbox returns no beneficiary name or photo at this stage [SANDBOX](../references/PAYERS.md#markers).

#### S1L. LAYOUT
The arrangement below is the reference implementation's [REF](../references/PAYERS.md#markers): follow the target HMIS's own screen conventions. What is required is in DESCRIPTION and ACTIONS: the fields, options, columns, statuses, messages and actions.


```
|------------------------------------------------------------------|
| Claims > Policy search                                           |
|------------------------------------------------------------------|
| [Card] Search the beneficiary's policy                           |
|                                                                  |
|  Identifier type      Identifier value                           |
|  [Member ID      v]   [__________________]   [(search) Search    |
|                                                         policies]|
|------------------------------------------------------------------|
|                                                                  |
| [Card, only when the search failed]                              |
|  <error message in danger colour>                                |
|------------------------------------------------------------------|
```

- One card titled "Search the beneficiary's policy", holding a single filter row with the fields and button side by side (they wrap on narrow screens).
- The identifier value input is at least 16rem wide.
- The button is the primary style with a search icon.
- Fields in this row have no bottom margin, so labelled fields line up with the button.

#### S1A. ACTIONS
1. Search: validate, call A1, and go to the Select Policy screen S2 (claims/search/results) with the identifier type, identifier value and returned policies. S2 shows zero results as "No policy matches that identifier."
2. Change identifier type: switch the dropdown. The value field keeps its text.
3. Breadcrumb "Claims": go back to the Claim Master screen S5 without searching.
