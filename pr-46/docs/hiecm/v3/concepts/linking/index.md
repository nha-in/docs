# Care contexts and linking

A health record your system creates is invisible to [ABDM](/docs/pr-46/docs/hiecm/v3/getting-started/glossary#abdm) until you link it, which means telling the [HIE-CM](/docs/pr-46/docs/hiecm/v3/getting-started/glossary#hie-cm) that a named group of records exists at your facility for a named person. Until that happens no patient can discover the record and no consent request can reach it; the calls that do it are in the [M2 guide](/docs/pr-46/docs/hiecm/v3/api/m2).

## The unit that gets linked is a care context

You do not link a record. You link a [care context](/docs/pr-46/docs/hiecm/v3/concepts/care-context), a logical grouping of a patient's health records that your system defines. It carries a reference ID and a display name, and nothing else. What each field holds, and how to structure care contexts per visit and per admission, is on [Care contexts](/docs/pr-46/docs/hiecm/v3/concepts/care-context).

## Why the record has to be linked first

The HIE-CM is data blind. It holds a map: which [ABHA address](/docs/pr-46/docs/hiecm/v3/getting-started/glossary#abha-address) has care contexts at which facilities. Linking puts an entry on that map, and everything downstream reads it.

- A [PHR](/docs/pr-46/docs/hiecm/v3/getting-started/glossary#phr) app shows a patient their records by reading their linked care contexts.
- A consent request names record types and a date range, and the HIE-CM works out which record holders to notify from the links.
- A health information request arrives quoting a care context you linked.

An unlinked record is not private. It is absent.

## Link when the record is ready to share

Link as soon as the health record is ready to be shared, not when the visit opens and not at the end of the month.

Whenever a care context is linked, or an existing one gains new records, the HIE-CM notifies every PHR application subscribed to that ABHA address. You do not send those notifications. You trigger them by linking.

## Three routes onto the map

Which route applies depends on what the patient gave you at registration.

| Route                                                                              | When it applies                                                     | Who starts it             |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------- |
| [HIP](/docs/pr-46/docs/hiecm/v3/getting-started/glossary#hip) initiated linking    | The patient shared their ABHA address with you                      | You                       |
| Notification to mobile                                                             | You hold a mobile number, name, age and gender, but no ABHA address | You, and then the patient |
| [Discovery](/docs/pr-46/docs/hiecm/v3/getting-started/glossary#discovery) and link | The patient goes looking for old records from their PHR app         | The patient               |

**HIP initiated linking.** You know who the patient is, so you assign each new record to a care context and link it against their ABHA address.

**Notification to mobile.** With no ABHA address to link to, you tell ABDM a record is ready. ABDM sends the patient an SMS with a secure deep link, which opens their PHR app or sends them to install one, where they can create an ABHA address, discover the record and link it. This route converts into the third one.

**Discovery and link.** The request comes to you. The patient picks the facility they visited in their PHR app, and the HIE-CM forwards a discovery request to the [HRP](/docs/pr-46/docs/hiecm/v3/getting-started/glossary#hrp) or HIP behind it. You match against your own patients and reply with care contexts, and the patient picks which to link. Implementing discovery is mandatory for every HIP, even if every patient gives you an ABHA address at the counter, because a patient who visited two years ago did not.

What you are handed splits in two:

- **Verified identifiers**, which you weight higher: ABHA address, mobile number, name, gender and year of birth.
- **Unverified, patient declared information**, typically a facility issued identifier such as a patient ID or a medical registration number.

Use the unverified value to sharpen a match, not to make one. The response carries care context metadata and nothing else: no diagnosis, no test result, no report content. Somebody who has not yet proved they are the patient reads it.

## The link token

Linking is authorised by a [link token](/docs/pr-46/docs/hiecm/v3/getting-started/glossary#link-token), not by your session token alone. The token ties your facility to one patient's ABHA address.

| Property                       | Rule                                                                                        |
| ------------------------------ | ------------------------------------------------------------------------------------------- |
| When you get it                | Generated and stored at the time the patient registers with you                             |
| Validity                       | Six months                                                                                  |
| Before use                     | Validate it, for example with a tool like JWT.io. Which check to run is not documented yet. |
| If you do not have a valid one | Regenerate it through demographic authentication                                            |

Store it against the patient record, not the visit: you need it for every link you make for that patient over six months. Check it before you link, not after the gateway rejects you.

## What links look like when they go wrong

From the M2 error table. Read the code with the message the gateway returns, because the table reuses some codes against more than one message.

| Code        | Message                                    |
| ----------- | ------------------------------------------ |
| `ABDM-1026` | Invalid Link Token                         |
| `ABDM-1038` | ABHA address and Link token mismatch       |
| `ABDM-1056` | This care contexts has been already linked |
| `ABDM-1057` | Invalid Care Contexts                      |
| `ABDM-1060` | Invalid Patient Reference Number           |
| `ABDM-1090` | Duplicate HIP link request                 |

The full list is on [M2 errors](/docs/pr-46/docs/hiecm/v3/api/m2/errors).

## Where this is implemented

- [Hospital, lab and pharmacy systems](/docs/pr-46/docs/hiecm/v3/concepts/hip-hiu), what a facility builds to do the linking.
- [M2 Health Information Provider, Health Information Provider Services](/docs/pr-46/docs/hiecm/v3/api/m2), the call order for all three routes.
- [Consent](/docs/pr-46/docs/hiecm/v3/concepts/consent), what happens once somebody asks for a linked care context.
- [How a record travels](/docs/pr-46/docs/hiecm/v3/concepts/data-flow), what you do when that request arrives.
- [PHR applications](/docs/pr-46/docs/hiecm/v3/concepts/participants/phr), the patient side of discovery and linking.
