---
id: shared.decision.vocabulary-in-one-file
type: decision
gateway: shared
milestone: n/a
version: abdm-v3
title: Aliases live in one vocabulary file, not in every atom
summary: >
  The words readers bring are a property of the domain, not of any
  single atom, so they are recorded once and expanded at query time
  rather than repeated across frontmatter.
sources:
  - file: mcp/internal/index/schema.go
    status: not-yet-hashed
    note: >
      The FTS table this decision changes, which indexes title, summary,
      body and error codes and expands nothing.
  - file: catalogue/shared/glossary/abha.md
    status: not-yet-hashed
    note: >
      An atom whose subject has three common names in the wild, none of
      which the reader's query is guaranteed to use.
verified:
  status: unverified
  against: docs-only
related:
  decisions: [shared.decision.role-model-two-axes]
  glossary: [shared.glossary.abha, shared.glossary.abha-address]
---

# Aliases live in one vocabulary file, not in every atom

## In plain words

Readers do not use this catalogue's words. They ask about a health ID
when they mean an ABHA number, about NDHM when they mean ABDM, about a
golden card when they mean a PM-JAY card, and about an HMIS when they
mean a provider facing application on the HIE-CM.

Those alternative names are recorded in one file,
`catalogue/shared/vocabulary.yaml`, and the search expands a query
through it before matching. They are not repeated in atom frontmatter.

## Before you start

Nothing. This decision is about retrieval, and it changes no atom you
are reading.

## What happens

| | One vocabulary file | An alias field per atom |
|---|---|---|
| Where a term is defined | Once | Once per atom that mentions it |
| Adding a synonym | One line | Edit every affected atom |
| Drift | Not possible | The usual outcome |
| Review | One diff | Forty frontmatter edits |
| Query expansion | Reads the file directly | Needs the same file built anyway |

The decisive reason is the last row. Expanding a reader's query needs a
lookup table from alias to canonical term, and that table has to exist
whatever else is done. Once it exists, copying its contents into
frontmatter buys nothing and guarantees the copies diverge.

The cost is real and accepted: an atom no longer carries its own
vocabulary, so a reader looking at the file cannot see which words reach
it. The vocabulary file is the place to look, and it is one file.

## How you know it worked

A query using a word that appears nowhere in the catalogue's prose still
reaches the right atom, and the log records which expansion fired, so a
miss can be diagnosed rather than guessed at.

## When it goes wrong

Expansion trades precision for recall. Too many aliases on a common term
will pull unrelated atoms into every result. The retrieval evaluation in
`mcp/eval` is the check: measure before and after, and remove an alias
that costs more than it returns.

An alias is not a definition. If readers keep asking about a term, it
needs a glossary atom of its own, and the vocabulary file entry then
points at that atom rather than standing in for it.
