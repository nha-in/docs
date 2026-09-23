# 1. Idea

## The brief

<quote what the user said, or the written brief>

## Mode

<integrate | standalone>. Reason: <one sentence>.

## Payers

| Payer | Participant code | Kind | Query mode |
| --- | --- | --- | --- |
| | | | |

## Scope

Every step of `flow/flow.json`, with the skill that owns it. A skill changes only its own rows.

| Step | Use case | Leg | Skill | In, later or out | Reason |
| --- | --- | --- | --- | --- | --- |
| | | | | | |

## Constraints

| Constraint | Answer | Source |
| --- | --- | --- |
| Language and framework | | |
| Transport (existing, own, or nhcx-adapter because the user asked for it) | | |
| Inbound path (callback or poll) | | |
| Document store | | |
| Background worker | | |
| Forbidden | | |

## Definition of done

1. Every in-scope leg sent and read.
2. Every sent bundle matches its pin.
3. The callback door dedupes, archives, matches by correlation id.
4. Screens derive every state from messages.
5. Nothing the app already did is built twice.
6. Target rung: <1 | 2 | 3 | 4>.

## Agreed

<the user's words, or "the written brief stands in for the user"; one line per skill that confirmed or changed its rows>
