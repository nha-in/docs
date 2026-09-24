# API reference tabs, and five smaller UI fixes: design spec

Date: 2026-09-25. Scope: the generated endpoint pages under
`site/docs/<gateway>/<version>/api/`, the Try it console, the Ask AI bridge,
the HIE-CM Get started page, View as Markdown, and the deploy script's
content type for `.md`.

## What was asked

1. Endpoint pages show too much at once. Put the reference in Postman style
   tabs, keep the request and response on the right but collapsible, and make
   Try it bigger, as on Razorpay's API playground.
2. Remove the sequence number from endpoint titles.
3. Put an Ask AI button on every request and response panel that attaches that
   panel, so the reader can ask about it specifically.
4. Get started: rename "What ABDM is" to "What is ABDM?" and add a monochrome
   line drawing of an ABHA card beside that section.
5. View as Markdown opens the page's Markdown inside the site. Open the raw
   file instead, as `docs.stripe.com/get-started.md` does.
6. On one endpoint page a table ran wider than the centre column and over the
   cURL panel.

## Decisions taken

| Question | Answer |
|---|---|
| Layout | Tabs in the centre column, collapsible Request and Response on the right, Try it at about 90% of the window. The three column layout `docs-ux` requires stays. |
| Right-hand panels | Open by default, collapsible, the choice remembered per browser. |
| Get started prose | NHA's two paragraphs stay word for word. Only the layout changes. |
| Ask AI scope | The Request and Response panels on every endpoint page, and both panels in Try it, including the live response. |

## 1. Endpoint page tabs

### Layout

```
eyebrow
Title
Lede
[POST] /abha/api/v3/enrollment/request/otp          [Try it]
Overview | Headers | Params | Body | Responses      | Request   v  [lang] copy AI |
---------------------------------------------      | curl ...                    |
the active tab's content                           | Response  v  200 400 copy AI|
                                                   | { ... }                     |
```

The eyebrow, title, lede and method bar stay above the tabs, so the call is
the first thing on the page whichever tab is open.

### Tabs and what goes in each

| Tab | Content | Shown when |
|---|---|---|
| Overview | NHA's description with the header and body sections taken out: **Endpoint**, **Flow** with Previous and Next, **Hosted by**, notes, prose | Always |
| Headers | NHA's **Headers** / **Header** section if present, otherwise Authorizations and Headers from the schema. NHCX Protected header also goes here | Either exists |
| Params | Path parameters, query parameters | Either exists |
| Body | NHA's **Request body for this use case:** / **Request Body** section if present, otherwise Body from the schema | Either exists |
| Responses | The Responses section as it is today, with each status's fields and help link | Any response |

Counted over the 800 generated operations on 25 September 2026, the bold
labels NHA's descriptions open sections with are: Endpoint (248), Flow (248),
Headers (162), Request body for this use case (162), Hosted by... (about 70),
Header (46), Request Body (42), Note (22), For example (4), and
Authorisation (4). Header and body labels move to their tab. Every other label,
including Note, stays in the section it sits in.

### How the description is split

A pure function, `sections(markdown)` in `site/src/components/api/sections.ts`,
returns `{overview, headers, body}`. It splits NHA's description on its
line-leading bold labels:

- A section starts at a line that opens with a bold label and runs to the next
  such line, or to the end of the text.
- Headers and Header go to `headers`. Request body and Request Body go to `body`.
- Anything else, including a `---` rule and text before the first label, goes
  to `overview` in its original order.
- The pieces rejoin to the original text when put back in order, so nothing is
  lost. The test asserts it.

It sits beside `blocks.ts` and is tested the same way, in `sections.test.mjs`,
against real descriptions from three operations: an M1 journey step, an M2
callback, and an NHCX operation. The existing `nhaHeaders` and `nhaBody`
checks in `ApiEndpoint.tsx` become `sections(...).headers !== ''` and
`.body !== ''`.

### Behaviour

- **Component.** Radix Tabs from the installed `radix-ui` package. It handles
  roving focus and arrow keys, and the aria roles and labels.
- **Every panel stays in the DOM.** Content is force mounted and inactive
  panels are hidden with CSS. Cmd+K search, Copy for LLM and the emitted
  `<route>.md` therefore keep the whole page. The accepted cost: the browser's
  own find does not match text in a closed tab.
- **The URL remembers the tab.** Selecting a tab replaces the hash with
  `#overview`, `#headers`, `#params`, `#body` or `#responses`. On load, a hash
  that names a tab opens it. A hash that names an element inside a panel opens
  that panel and scrolls to the element. No hash opens Overview.
- **Sticky tab bar.** The tab list sticks under the site chrome while the
  panel scrolls.
- **Narrow screens.** The tab list scrolls sideways. The right-hand panels
  stack below the tabs, as the aside does today.
- **Callbacks.** Tabs work the same. There is still no Try it on callbacks.

### Right-hand panels

`RequestPanel` and `ResponsePanel` each get a header row. From left to right:
a chevron and the label, the existing language select or status tabs, the
existing copy button, then the Ask AI button. The body is the existing code
block inside the installed `ui/collapsible`.

The open or closed state of each panel is stored in `localStorage` under
`abdm:api-panels`. Every read and write is wrapped in try/catch, and the panels
default to open when storage is missing or throws. The existing `max-height`
rules on the two `pre` blocks stay.

### Try it size

`.api-console` goes from `min(72rem, 100vw - 3rem)` by `min(46rem, 100vh - 5rem)`
to `min(96rem, 100vw - 4rem)` by `calc(100vh - 4rem)`. The layout inside stays
as it is: the form on the left, Request and Response on the right, which is
already the shape of Razorpay's playground.

## 2. Sequence numbers

`scripts/build-api-reference.mjs` line 1170 builds the journey step title as
`` `${i + 1}. ${stepped.title}${optional}` ``. The `${i + 1}. ` prefix goes.
Sidebar order is unchanged, because it comes from the order of the items
array, not the label. The doc id keeps its `NN-` prefix, which Docusaurus
strips, so no URL changes. The "step 2 of 5" line and Previous and Next in the
Overview tab stay: they place the reader in the journey rather than number the
call. The generated pages and the sidebar JSON are gitignored build outputs,
so they regenerate with the usual build and nothing generated is committed.

Two other places number steps, and neither changes here:

- `scripts/build-postman.mjs` line 173 numbers the Postman collection's
  requests. Open PR #46 edits that file, so its numbering is left to follow
  that PR rather than conflict with it.
- `scripts/compile-skills.mjs` line 49 numbers the steps of a journey inside a
  compiled skill. That is a procedure an agent follows in order, not the name
  of an API.

## 3. Ask AI on a panel

`AskAiBridge.tsx` accepts one more field on the `abdm:ask-ai` event:
`snippet: {title, markdown}`. When it is present, the bridge opens the panel
and calls `attachPage({title, url: location.href, markdown})` directly, with
no fetch. The widget does not change, and this works under `npm start` because
nothing is fetched.

| Where | Title shown on the chip | Markdown |
|---|---|---|
| Endpoint page, Request | `<Language> request: <endpoint title>` | The method and path, then the current sample in a fenced block |
| Endpoint page, Response | `<status> response: <endpoint title>` | The status and its description, then the example in a fenced json block |
| Try it, Request | `Request as typed: <endpoint title>` | The live cURL, redacted |
| Try it, Response | `Live response: <endpoint title>` or `<status> example: <endpoint title>` | The live status, headers and body, redacted, or the example |

**Redaction.** Before anything from Try it is attached, `redact(text)` in
`site/src/components/api/redact.ts` replaces the value of every
`Authorization`, `X-token`, `T-token`, `X-Auth-Token` and `Cookie` header
with `<redacted>`, as does any JSON property named `accessToken`,
`refreshToken`, `token` or `xToken`. The page examples carry placeholders
only, so they are not redacted. `redact.test.mjs` covers a curl with each
header, a JSON body with nested tokens, and text with nothing to redact.

The button is an icon button labelled "Ask AI about this request" or "Ask AI
about this response". It uses the Sparkles icon that Ask about this page
already uses.

**Sequencing against PR #46.** Open PR #46 (`feat/chain-step-values`) edits
`TryIt.tsx` in its imports and two other hunks. The endpoint page panels do
not touch that file and ship first. The two Try it buttons are the last task
and wait for #46 to merge, or stack on it if the user says so, rather than
editing a file another open branch is changing.

## 4. Get started

`site/docs/hiecm/v3/getting-started/index.mdx`:

- `## What ABDM is` becomes `## What is ABDM?`. No page links to
  `#what-abdm-is`, which was checked with grep on 24 September 2026.
- The two paragraphs stay word for word. They sit in a two column block with
  the illustration on the right from 996px up, and the illustration is centred
  below the text on narrower screens.
- The illustration is `site/src/components/docs/AbhaCardArt.tsx`, an inline
  SVG with `role="img"` and an `aria-label` that describes the drawing.

The drawing: a hand holding an ABHA card, from the reference image. The hand is
drawn loosely, as a caricature. The card is drawn precisely, with a generic
avatar, the labels ABHA Number, ABHA Address, Date of Birth, Gender and Mobile,
placeholder values (`91-XXXX-XXXX-XXXX`, `name@abdm`), and a decorative QR
pattern that encodes nothing. The whole drawing uses one stroke weight in
`currentColor` and no fill colour, so it follows light and dark mode. The
difference between the loose hand and the exact card is the one distinctive
element, and nothing else on the page changes.

The drawing leaves out the national emblem and NHA's logo, because use of the
emblem is restricted by law and the drawing must not pass for a real card. It
also leaves out any real name or number.

## 5. View as Markdown

- In `PageActions.tsx`, the link's `href` becomes
  `` `${pathname.replace(/\/$/, '')}.md` ``, the sibling file
  `scripts/emit-page-markdown.mjs` already writes for every route (line 440).
- `site/src/pages/markdown.tsx` and `site/src/css/markdown-view.css` are
  deleted, together with anything that imports them.
- In `deploy/nha/deploy.sh`, `.md` files are synced in a pass of their own with
  `--content-type "text/markdown; charset=utf-8"`, which is the header Stripe
  serves (checked on 24 September 2026). The pass sits beside the other
  must-revalidate files. Without the header, `aws s3 sync` guesses the type
  with no charset, and curly quotes come out garbled.
- Under `npm start` the file does not exist, the same as today.

## 6. Table overflow

NHA's descriptions render through `marked` in `Markdown.tsx` into raw HTML.
Prose pages wrap each table in `.table-scroll` (`typography.css` line 180), but
these tables never get that wrapper. `.markdown table code` does not wrap
(`typography.css` line 243), so a long field name such as
`authData.child.profilePhoto` pushes the table past its grid track and over
the aside.

Fix: `Markdown.tsx` wraps every `<table>` it emits in
`<div class="table-scroll">`, using a `marked` renderer override. Every
endpoint page and the Try it lede share that one path. The wrapper's styles
are scoped to `.markdown`, so the rule gains the endpoint page's container
selector too.

## Not changing

- No What's New entry. Layout and navigation changes do not qualify
  (`changelog`).
- The Postman collection's numbering, until PR #46 merges.
- Code blocks on prose pages get no Ask AI button.
- NHA's Get started prose.

## Verification

- `node --test` on `sections.test.mjs` and `redact.test.mjs`, plus the
  existing `blocks`, `lede` and `rsa` tests.
- `npm run typecheck` and a full `npm run build` from `site/`, which also runs
  the postbuild markdown and asset checks.
- `./scripts/plan-check.sh` and `npm run check:plugins`, because the generator
  changes and the compiled skills are regenerated.
- In the browser pane, against the dev server:
  - Each tab and the hash on an M1 journey step, an M2 callback and an NHCX
    operation.
  - Collapse, reload and still collapsed.
  - Ask AI from all four panels, with the chip title and a redacted token
    checked in the attached text.
  - Try it at 1280 and 1920 wide.
  - Get started in light, dark and 375 wide.
  - The page that overflowed, with no overlap at 1280.
- In a production build served locally, `<route>.md` opens as text and the
  emitted Markdown for an endpoint page still carries every tab's content.
