---
name: nha-voice
description: The voice and audience of everything published on the ABDM Developer Portal. The portal is published by NHA and addressed to integrators, so pages state what ABDM does rather than reporting what NHA's documents say. Use when writing or editing any page, atom or compiled skill, when a draft cites NHA in the third person, when prose describes how the documentation was produced, when a page says the sandbox has not been tried, and when reviewing anyone's draft before it ships. Applies to generated prose as well as hand written prose.
---

# NHA Voice

Binding. A page in the wrong voice fails review the same way a broken link
does, and it fails for a worse reason: it tells the reader they are holding a
third party's notes about ABDM rather than ABDM's own documentation.

**You are NHA. Write as NHA.**

Not as someone reporting on NHA, summarising NHA, or relaying what NHA has
decided. Every sentence on this portal is ABDM telling an integrator how ABDM
works. An author does not cite themselves, and "NHA is explicit that the order
is fixed" is the author citing themselves. The order is fixed. Say that.

## Who is speaking, and to whom

**The publisher is NHA.** Not a vendor, not a consultancy, not a team
assembling a catalogue from NHA's PDFs. The portal is ABDM's documentation.

**The reader is an integrator.** A developer at a hospital, laboratory,
pharmacy, insurer or PHR app, with a repository open, who has to make ABDM
work. They came for the contract and the steps, not for an account of how this
page came to exist.

Everything below follows from those two sentences.

## The three defects

Each is drawn from a page currently published. The fix is never to soften the
sentence; it is to change who is speaking.

### 1. Attribution noise

NHA does not cite NHA. Sourcing is real, and it belongs in frontmatter.

| Instead of | Write |
|---|---|
| "NHA's M3 document says a granted request returns the ids of the consent artefacts created against it, plural." | "A granted request returns the id of every consent artefact created against it. Store all of them." |
| "NHA gives its validity as six months and says to validate it before use." | "A link token is valid for six months. Validate it before use." |
| "NHA marks implementing all HI types as mandatory for an HMIS." | "An HMIS must implement every HI type." |
| "NHA states the first. The rest follow from the flows." | Delete the sentence. State the prerequisites. |

### The NHA test

**If a sentence of body prose contains the word "NHA", that sentence is wrong
until proven otherwise.** Not stylistically weak. Wrong. Search the page for
it and justify every hit or delete it.

There are exactly four justified hits:

1. **A genuinely external source the reader must go to.** An HL7 value set, the
   Local Government Directory, the FHIR profiles at nrces.in. Those are
   citations, not hedges.
2. **NHA as an actor the integrator deals with**, in a process they must
   follow: contacting NHA for production credentials, an approval NHA grants.
   The reader acts on that.
3. **Glossary and orientation pages** that define what NHA is.
4. **A string the platform itself emits.** `ABDM-1094` returns "Please contact
   NHA to enable it", and `AS-1309` returns "As per NHA policy". Those are the
   bytes on the wire. Transcribe them exactly and never rewrite them for voice:
   the reader is matching them against a response.

Everything else is the author citing themselves. In particular, every one of
these is a defect with no exception:

| Never write | Because |
|---|---|
| "NHA is explicit that the order is fixed" | The order is fixed. |
| "NHA says that ID is the unique identification number" | That ID is the unique identification number. |
| "NHA's document states that the facility remains in draft" | The facility stays in draft. |
| "NHA states", "NHA gives", "NHA marks", "NHA lists", "NHA describes" | Say the thing. |
| "NHA's M4 document", "NHA's PHR document", "NHA's collection" | Delete the clause entirely. |
| "NHA does not say what to do with what you received" | Decide the position and state it, or omit. |

Attribution never adds authority here. It removes it: a reader who is told
what NHA's document says is being handed a report about ABDM instead of ABDM's
own instruction.

### 2. Production-process leakage

How this documentation was assembled is invisible to the reader. A sentence
about conversion, collections, screenshots or missing specification files is
an internal note that escaped into production.

| Instead of | Write |
|---|---|
| "NHA has published no OpenAPI file for the PHR role. These operations are derived from NHA's Aarogya Setu collection rather than from a specification." | Nothing. Document the operations. |
| "NHA's document carries about 95 screenshots, each a request or response sample. In most cases the screenshot is the only place the method and path appear, so both are missing here." | "Method and path are not yet published for the calls below." |
| "## What did not survive the conversion" | Delete the section. What is documented is documented; what is not does not need a memorial. |
| "The prose is derived from the collection, not written from a specification." | Nothing. |

The reader cannot act on any of it. If a gap is real and load bearing, say
what is missing in platform terms and what to do instead, then stop.

**A heading can be the memorial, and so can a page title.** These all shipped
on this portal and all were wrong:

| Memorial | What replaced it |
|---|---|
| `## What we have not confirmed` | `## Fetching the public key`, then the fact |
| `## What is not documented yet` | `## Limits to code against`, holding the same four facts as rules |
| `## Open questions`, a table of which document contradicts which | `## Confirm at onboarding`, a list of what to hold and what to send meanwhile |
| `## What is missing here` | `## Field and error reference`, pointing at the Swagger spec |
| `# What NHA documents without a path`, a whole page | `# M4 operations and fields`, the reference it always was |

The last one is the warning. A page named after its own gap tells every reader
arriving from search that they have found the wrong page, and it had carried
that title from the day it was published.

**Provenance is tautological.** NHA publishes this portal, so every fact in it
comes from NHA. Saying where a fact came from adds nothing the reader can use,
and a section headed "Where this comes from" is nothing but that sentence.

Delete it. Do not relocate it into the paragraph above, do not soften it, and
do not keep the half that sounds useful. A rewrite that moves the provenance
somewhere less obvious has not fixed anything.

| Rationalisation | Reality |
|---|---|
| "This bit reassures the reader the calls apply to them too." | The portal is ABDM's documentation for that role. Publishing it is the reassurance. |
| "Naming the source shows our work." | The reader is not reviewing our work. They are integrating. |
| "It is only one sentence now." | One sentence of provenance is the whole defect, at any length. |
| "The source is unusual here, so it is worth saying." | Unusual to us, invisible to them. Frontmatter records it. |

The `source:` field in frontmatter already records where an atom came from,
per atom, for the people who need it. That is the entire provenance budget.

### 3. Self-doubt in the platform's voice

NHA operates the sandbox. A page published by NHA cannot say NHA has not tried
its own endpoint. This is the defect that most often hides a genuine problem,
so it has its own ladder below rather than a substitution table.

## The uncertainty ladder

Uncertainty is not permission to guess, and confidence is not permission to
invent. When a fact is unresolved, walk this ladder and stop at the first rung
that holds.

1. **Resolve it.** Run the call against sandbox, or ask the team that owns the
   endpoint. Most unresolved facts are one request away.
2. **State the operative rule that holds under either reading.** When two
   published tables disagree on a code, the instruction that survives both is
   the one to publish: fetch the codes from the master data call rather than
   hard coding either table.
3. **State availability in platform terms.** "Not available in sandbox."
   "Available from v3.1." "Method and path are not yet published." These are
   statements about ABDM, which NHA is entitled to make.
4. **Omit.** If none of the first three hold, the claim does not ship.

Never publish doubt as prose. "We have not run this", "we cannot tell you
which applies", "treat the response shape as unconfirmed" and "read the
validation error to find out" are all rung zero, and rung zero does not exist.

### Rung 2 has a shape: Confirm at onboarding

Rung 2 is the rung people skip, because two published sources disagreeing feels
like something to report rather than something to instruct. It is not. Turn the
disagreement into the instruction that survives it, and give the section a
heading a reader can act on.

Not this, which is three columns of provenance:

> ## Open questions
>
> | Question | What the documents say |
> | Which way `descriptor.flag` reads | The document says the field sends "flag for in stock or out of stock" and shows `false` in both samples. It does not say which value means which. |

This, which is one instruction:

> ## Confirm at onboarding
>
> - **The polarity of `descriptor.flag`.** It arrives as `false` on stocked and unstocked records alike. Do not render "in stock" or "out of stock" from it until the polarity is confirmed.

The reader now knows what to build, what not to ship, and what to ask for. The
contradiction is still doing its job and no longer needs a paragraph.

When the disagreement is about a code or an enum, the instruction is almost
always the same: fetch it from the master data call rather than hard coding
either table.

**Frontmatter is unchanged.** `verification: unverified` stays on the page and
keeps meaning exactly what it meant. It is metadata: it drives the compiler,
tells maintainers what to prove next, and travels with the atom. The reader
does not need it narrated at them, and the presence of honest metadata is what
makes an authoritative sentence safe to write.

## What does not change

This skill governs voice. It does not license overclaiming, and it does not
touch the rest of the writing guide.

- Short sentences. One idea each. Say "you" and "your system".
- No em dash, ever. No "simply", "just", "obviously", "of course", "merely".
- Every acronym links to the glossary on first use, in every page.
- Every code sample runs as written once placeholders are filled.
- Name the observable, not the feeling: "You receive `status: SUCCESS` within
  60 seconds", never "it should work".

**One rule is superseded.** The writing guide says to write "We have not run
this against sandbox yet" in prose. That was right when the catalogue was
assembled from the outside. It is wrong in NHA's voice. The honesty it
protects now lives in frontmatter and in the ladder above.

## Naming ABDM's own parts

In NHA's voice the gateway, the registries and the milestones are ours, not a
third party's. Write "the HIE-CM gateway", "the ABHA registry", "Milestone 2".
Do not write "NHA's gateway" or "the NHA registry": the possessive reintroduces
the outside observer the rest of this skill removes.

Say "we" only where NHA is genuinely acting on the reader's behalf, and rarely:
"We issue the token", not "we think", "we believe", "we have not checked".

**This reaches diagram participants and table rows, not only sentences.** A
mermaid `participant G as NHA gateway` puts the outside observer back into the
one place a reader looks first. Write `HIE-CM gateway`, `HPR service`,
`HFR service`, `ABHA service`. Same for a participants table: the gateway is
"The routing layer", not "NHA's routing layer".

## Where the defect lives is not where it renders

A generated page cannot be fixed. Editing one is lost on the next build, and
`api/**/endpoints/`, `**/errors.md` and `reference/{authentication,callbacks,error-codes}.md`
are all generated. When a voice defect renders there, it is in the OpenAPI
specification's `description` fields or in the atom, and that is where it is
fixed. Rebuild, then confirm the page.

Two source-side defects are worth naming because both shipped at scale.

**An error table's `source:` note renders.** It carried which spreadsheet a code
came from, on what date, and which column was ours rather than NHA's. None of it
is actionable. Say what the column means and stop.

**An atom body can address the wrong reader.** This shipped on 21 endpoint
pages:

> Not yet observed. NHA's collection saves no response body for this operation,
> so this catalogue does not state a shape. When you run this against the
> sandbox, record the exact response here and set `verified.status` to verified
> with the date and who ran it.

The second sentence instructs a maintainer, in a page an integrator is reading.
Both sentences collapse to one platform fact: the response body for this
operation is not yet published. If a note is genuinely for maintainers, it
belongs in frontmatter or in a comment, never in the body.

## The benchmark

[developers.cloudflare.com](https://developers.cloudflare.com) is the standard
this portal is measured against. It is a platform documenting itself to
integrators, which is exactly our situation, and it never once tells the reader
where its facts came from.

Read a page there before writing one here. The patterns worth copying:

**Open with the task, not with context.** "Set up and deploy your first Worker
with Wrangler, the Cloudflare Developer Platform CLI. This guide will instruct
you through setting up and deploying your first Worker." Two sentences: what
you will do, and what the page delivers. No history, no scope note, no
throat-clearing.

**Headings are the steps.** Their H2s read `Prerequisites`, `1. Create a new
Worker project`, `2. Develop with Wrangler CLI`, `3. Write code`, `4. Deploy
your project`, `Next steps`. The table of contents is the procedure. A reader
who reads only the headings still knows what to do.

**Second person, imperative, short.** "Open a terminal window and run C3." "Go
to http://localhost:8787 to view your Worker." Sentences run about 12 to 18
words, well inside our 25 word ceiling. Aim there, not at the ceiling.

**Callouts are titled with the reader's question**, not with a statement:
"What files did C3 create?", "Browser issues?" Ours are usually titled with an
assertion. A question is what the stuck reader is actually thinking.

**Constraints are declarative and quantitative.** "Each isolate can consume up
to 128 MB of memory." "A Worker must parse and execute its global scope within
1 second." No "may", no "typically", no "generally", and never a note about
what has not been tested. This is the uncertainty ladder already in practice.

**Differences go in a table, not in prose.** Free versus Paid sits in a
comparison table, so what you do not get is visible as a number rather than
explained in a paragraph. Use the same shape for sandbox versus production, for
mandatory versus optional, and for what a role does and does not implement.

**Unavailable is stated plainly and once.** Deprecated plans get a short note
saying they are "no longer available for new accounts". No apology, no account
of how they came to be deprecated.

**Close with Next steps.** A short bulleted list of where to go, every time.

### Translated to our pages

| Ours today | The benchmark |
|---|---|
| `## Build in this order` followed by a numbered list | Make each step its own numbered H2 |
| `:::warning[Without call five the facility does not exist]` | `:::warning[What happens if I skip the submit call?]` |
| "Which parts are mandatory depends on the facility type" | A table: facility type against what it must submit |
| "Nothing here has been run against the sandbox" | Delete. State the limit, or omit the claim |
| A closing paragraph of links in prose | `## Next steps`, bulleted |

## Review checklist

Reject a draft that trips any of these.

- [ ] Does a sentence report what a document says, rather than what ABDM does?
- [ ] Does any prose mention conversion, screenshots, collections, Postman, or
      a missing OpenAPI file?
- [ ] Does any sentence say where a fact came from, anywhere on the page?
- [ ] Does any sentence say we have not run, tested, or confirmed something?
- [ ] Does a heading memorialise a gap ("What did not survive", "What the
      sources give you")?
- [ ] Is "NHA" used possessively about ABDM's own components?
- [ ] Does "NHA" appear in body prose at all? Every hit must match one of the
      three justified cases in the NHA test, or come out.
- [ ] Does a heading, or the page title, name a gap rather than a subject?
- [ ] Does a mermaid participant or a table row carry NHA possessively?
- [ ] Does a section report a contradiction where it could instruct? See rung 2.
- [ ] Is the defect on a generated page, meaning the fix belongs in the
      specification or the atom?
- [ ] Would an integrator have to know how this portal was built to understand
      the sentence?

The last question is the one that catches what the others miss.

## Related

- Prose rules this sits on top of: `writing-guide`
- Where a page goes and in what order: `docs-ux`
- Page structure and section headings: `atom-authoring`
- Review process: `atom-review`
- What earns a What's New entry, in this voice: `changelog`
