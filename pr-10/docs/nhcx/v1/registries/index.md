# Registries

NHCX has a registry of its own, and it is not a registry of people. The entry is a participant:
an organisation with a role, not a doctor and not a patient.

## In short

- Every provider and payer onboards as a participant, in sandbox first and then in production.
- A participant holds three identifiers that do different jobs: a participant ID, client credentials, and a registry ID.
- The registry ID inside a FHIR bundle must equal the one on the sender's participant record.
- Claims go to the policy's processor, which is not always the insurer.

## The participant registry

NHCX sits in the middle and moves messages between registered participants. Onboarding, the three
identifiers, the callback address rules, and how a beneficiary is matched to a policy are all in
[Participants and policies](/docs/nhcx/v1/registries/participants-and-policies).

The calls themselves are in [Get started](/docs/nhcx/v1/getting-started): creating the
[participant record](/docs/nhcx/v1/getting-started/participant-record), and
[finding participants and policies](/docs/nhcx/v1/getting-started/finding-participants-and-policies).

## ABDM's three registries

[ABHA](/docs/nhcx/v1/getting-started/glossary#abha) identifies a patient, the HPR a practitioner,
the HFR a facility. All three are ABDM wide, and a hospital on both gateways already holds the last
two from its [HIE-CM](/docs/nhcx/v1/getting-started/glossary#hie-cm) onboarding.

On NHCX the HFR ID is what a provider registers as its registry ID, and an insurer or TPA registers
its IRDAI registry ID instead, without leading zeros. A practitioner's HPR ID travels inside the
bundle, and the SHA HP sandbox looks the doctor up by the identifier typed `HPIN`.

If you need the identifiers themselves, they are written up on HIE-CM:
[registries](/docs/hiecm/v3/registries) has all three.

## Next

- [Participants and policies](/docs/nhcx/v1/registries/participants-and-policies)
- [Core concepts](/docs/nhcx/v1/concepts), what a claim is made of
