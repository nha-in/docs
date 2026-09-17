---
id: hiecm.concept.abha-address-policy
type: concept
gateway: hiecm
milestone: M1
version: abdm-v3
title: What an ABHA address is allowed to be
summary: >
  The rules an ABHA address has to satisfy before NHA will create it, the
  password rules that go with it, and the three shapes NHA currently refuses
  even though they look like they should work.
sources:
  - file: catalogue/openapi/.raw/nha-2026-09-05/NewDocumant-PHR-app.docx
    fetched: 2026-09-05
    hash: sha256:4f8b40b31e894520be49885260912586a3f665933958cc0680ce5a4675704542
    note: >
      NHA's PHR application document. States the address policy twice, in the
      narrative and again in the test cases, and the two do not agree on the
      minimum length. Both readings are recorded below rather than one being
      chosen.
related:
  concepts:
    - hiecm.concept.abha-number-and-address
  endpoints:
    - hiecm.endpoint.p1-enrollment-address-suggestion
    - hiecm.endpoint.p1-enrollment-address-exists
  glossary:
    - shared.glossary.abha-address
    - shared.glossary.abha-number
  flows:
    - hiecm.flow.p1-create-abha-address
skills:
  - hiecm-p1-build
  - hiecm-p1-debug
---

# What an ABHA address is allowed to be

## In plain words

An [ABHA address](shared.glossary.abha-address) is the username a person
signs in with, and it looks like an email address without being one:
`someone@abdm`. Every 14 digit
[ABHA number](shared.glossary.abha-number) is issued a default address on
the consent manager, of the form `14digit@sbx` or `14digit@abdm`, and a person
may create a friendlier one beside it.

Your application does not get to decide what an address may be. NHA validates
it on creation, so an address your form accepts and NHA rejects is a form your
user cannot get past.

## Before you start

You need to know whether you are creating an address against an existing
[ABHA number](shared.glossary.abha-number) or against a self declared profile,
because the two carry different rules. Both are in
[creating an ABHA address](hiecm.flow.p1-create-abha-address).

## What happens

### The naming rules

The characters allowed are letters, digits and a single dot. Beyond that:

- It cannot begin with a digit.
- It cannot begin or end with a dot.
- An address made only of digits is allowed for an ABHA number and nothing
  else, which is what makes the default `14digit@abdm` legal.

**On the minimum length, the source disagrees with itself.** NHA's document
states the policy twice. The narrative says the minimum is 4 characters. The
test case for creating an address by mobile number says the minimum is 8.
Neither has been run against the sandbox from this catalogue, so treat 8 as
the safe assumption when you build a form, and expect 4 to be accepted.

### The three shapes NHA currently refuses

These read as though they should work and do not:

- **A ten digit mobile number as an address**, `9999999999@abdm`. Creation is
  restricted today.
- **An ABHA number as an address you create**, `14digit@abdm`. The default one
  is issued automatically, and you cannot create it yourself. Signing in with
  it works in both the web and the mobile personal health record application.
- Anything failing the naming rules above, which NHA rejects on creation
  rather than on submission of the form.

### The password rules

A password is created alongside the address. NHA's document says password
validation "has been made optional", and gives the policy as: at least 8
characters, at least one uppercase letter, at least one lowercase letter, at
least one digit, at least one symbol, no spaces, and no more than two
consecutive characters or keyboard keys.

Read "optional" as applying to whether your application enforces the rule, not
to whether a password exists. What NHA itself enforces has not been confirmed
here.

### Offer suggestions rather than a blank field

NHA asks that an application suggest addresses built from the person's name
and the username part of their email, rather than presenting an empty box and
a policy. Two calls exist for this:
[address suggestions](hiecm.endpoint.p1-enrollment-address-suggestion) and
[address exists](hiecm.endpoint.p1-enrollment-address-exists).

## How you know it worked

The address is created and the person can sign in with it.

Before that, your form is right when all of these hold:

1. `9.abc@abdm` is rejected, because it begins with a digit.
2. `.abc@abdm` and `abc.@abdm` are rejected, because a dot cannot open or
   close an address.
3. `12345678901234@abdm` is offered only where an ABHA number backs it.
4. A person who types a taken address is shown alternatives rather than an
   error alone.

## When it goes wrong

The address is taken. Check with
[address exists](hiecm.endpoint.p1-enrollment-address-exists) before you
submit, and show the suggestions rather than making the person guess again.

Your form allows what NHA refuses. The rules above are validated on creation,
so a form built to a shorter list produces a failure the person cannot act on.
The minimum length is the likeliest place for this, given the source
disagrees with itself.

A person expects to use their mobile number as their address. It reads as the
obvious choice and NHA has restricted it, so say so in the form rather than
letting them find out on submission.
