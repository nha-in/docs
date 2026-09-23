---
id: shared.concept.ask-ai-assistant
type: concept
gateway: shared
milestone: n/a
version: abdm-v3
title: What the Ask AI assistant can do
summary: >
  What the Ask AI assistant on this portal can do for you, what you can give
  it to work from, and what it will not do.
sources:
  - file: ai-widget/README.md
    fetched: 2026-09-23
    hash: sha256:969f1a400a8667590c04a8fdf2cbd71b2b743b3db3d9180de6ce32ff4af5053e
    note: >
      The assistant panel: attachments, pages, commands, history and what it
      keeps. Registered as annexure#ask-ai-panel.
  - file: mcp/internal/chat/loop.go
    fetched: 2026-09-23
    hash: sha256:5cf9023704bcfcbcf9f9cef68d5b58d4db9ca9773075bdcd092d0b455dd69cfe
    note: >
      The assistant's rules: answers from this portal only, cites what it
      used, writes no code for your codebase beyond curl.
related:
  glossary:
    - shared.glossary.abdm
    - shared.glossary.hie-cm
  concepts:
skills: []
---

# What the Ask AI assistant can do

## In plain words

Ask AI is the assistant on this portal. Ask it how to integrate with
[ABDM](shared.glossary.abdm) in your own words, and it answers from this
portal's documentation and API references. Every answer names the pages it
drew on, so you can read the source yourself.

It covers the [HIE-CM](shared.glossary.hie-cm) gateway and its milestones,
the patient side and PHR services, and the UHI and NHCX material this portal
carries. It does not answer ABDM questions from general knowledge: a path, a
header, a field or an error code comes from this portal or not at all.

## Before you start

- Open it from the top bar. Press **Ask AI** beside search, or type a question
  into search and press **Ask AI**.
- Open it from a page. Press **Ask about this page** under a page's title, and
  that page goes with your question.
- You need nothing else. There is no account and nothing to install.

## What happens

**You ask a question.** Type it, or pick a suggestion under the greeting.
Press Enter to send. Shift and Enter starts a new line.

**You give it something to work from.** Press **+** beside the chat bar:

| Choice | What it does |
|---|---|
| Upload from computer | Attaches a text, JSON, log, CSV, XML, YAML, Markdown or HAR file, a PDF, or an image. The file is read in your browser and only its text is sent. Text files hold up to 256KB, a PDF or image up to 8MB, and at most 20,000 characters of text either way. |
| Attach a page | Searches every page on this portal. Pick one and it goes with your questions. One page is attached at a time. |

What is attached shows as a pill on top of the chat bar. Press its **x** to
take it off.

**You point it at a skill.** Under the chat bar are four commands. Turn one on
and your next questions draw on that section of the module's agent skill:

| Command | Use it to |
|---|---|
| Scaffold | Get a build plan: what to build, in what order, against which endpoints |
| Design | Work through design choices for Milestone 1, 2 or 3 |
| Integrate | Get the calls and the order to make them in |
| Debug | Take a failing call or an error code to a named fix |

The assistant works out the module from the page you attached or the
question you asked. If it cannot tell, it asks you which one.

**You pick up where you left off.** **History** lists the conversations you
have had in this browser, newest first. Pick one to carry on. **New** starts a
fresh conversation.

**It will not do these.**

- Write code for your codebase. It shows curl and nothing else. Ask for a
  scaffold and it gives you the plan, then offers the agent skills and the
  MCP server so your coding agent builds it.
- Keep your conversations anywhere but your browser. History holds up to 50
  conversations for 30 days, on this device only.
- Send your files. Only the text read from them goes with your question.
- Stand in for support. For your account, credentials or production approval,
  use the support page.

## How you know it worked

- An answer arrives in the panel, with a **Sources** row of pages under it.
  Each source opens the page the answer drew on.
- An answer drawn from a command carries a line above it naming the module
  and the section, for example "Using M2 · Debug".
- An attached page or file shows as a pill on the chat bar before you send.
- A conversation you had appears under **History**.

## When it goes wrong

- **"Which module is this about?"** A command is on, and neither your question
  nor an attached page names a module. Pick one of the modules it offers, and
  it answers the same question for that module.
- **"No design guide for this module yet. Answering from the docs."** Design
  covers Milestones 1, 2 and 3. For any other module the answer comes from
  the documentation alone.
- **"Could not attach" on a page pill.** The page's text could not be fetched,
  and the answer will not use it. Remove the pill, or attach the page again.
- **"That file is too large."** Attach the failing part of it: the request,
  the response, and the lines around the error.
- **"The assistant is unreachable right now."** Wait a minute and ask again.
  Each address can ask a limited number of questions a minute and a day, and
  a question over the limit shows this.
