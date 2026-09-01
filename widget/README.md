# The support agent widget

The ABDM support agent as one custom element, `<abdm-support-agent>`, that
goes on any page: the docs site, the developer console, a partner's internal
wiki, a landing page. The docs site is its first user, not its owner.

## Embedding

One script tag and one element. No framework is required on the host page, and
there is no build step for an embedder.

```html
<script defer src="https://<docs-origin>/agent/abdm-support-agent.js"></script>

<abdm-support-agent
  api-base="https://<chat-server>"
  docs-origin="https://<docs-origin>"></abdm-support-agent>
```

The origin the page is served from must be on the server's allowlist, or the
browser refuses the request. Ask for one in a pull request against the server's
configuration.

### Attributes

| Attribute     | Meaning                                                                   |
| ------------- | ------------------------------------------------------------------------- |
| `api-base`    | The chat server's origin. Absent leaves the panel a labelled mock.        |
| `docs-origin` | Where citations resolve. Defaults to the host page's own origin, which is right only on the docs site. |
| `support-url` | Where the mock's "use support" link points. Defaults to `<docs-origin>/docs/support`. |
| `launcher`    | `none` supplies your own trigger instead of the built-in chip.            |
| `ground`      | `light` or `dark`. The element reads the host page's background and sets this itself; set it to override that reading. |
| `open`        | Present while the panel is showing. Set it to open the panel, and the element removes it when the reader closes one. |

`show()` and `hide()` on the element do the same as setting and removing
`open`, for a host that prefers a method call.

### How an answer arrives

A stream does not arrive evenly: a tool call, a second of silence, then a
paragraph in one packet. The panel buffers what arrives and reveals it on the
display's own clock, a share of the backlog each frame, so the answer reads at
an even pace whatever the network did. Nothing is shown until the panel has
visibly thought for half a second, so a fast first token does not flash a word
up in place of the indicator, and a caret marks the live edge of the text so a
pause reads as the model thinking rather than the answer having ended.

Under `prefers-reduced-motion: reduce` the text is not paced at all: it appears
as it arrives. The three constants that set the pacing are at the top of
`src/index.tsx`.

Stopping an answer keeps every word that had arrived, including the part still
waiting to be shown. Citations attach when the answer finishes, not while it is
still being revealed.

### Appearance

Everything renders in a shadow root, so the host page's styles cannot reach in
and the widget's cannot leak out. Colour comes from the host page's own custom
properties where it defines them (`--surface`, `--accent`, `--text-body` and
the rest of the set in `src/styles.css`), and falls back to a palette that
follows `prefers-color-scheme`. To theme it deliberately, set those properties
on the element.

The panel is a native modal dialog, so it sits in the browser's top layer above
whatever the host page stacks, without either side knowing about the other.

### What it does not do

Nothing about a conversation is written to the host page's storage. State lives
in memory for the session and goes when the tab does.

## Working on it

    npm run build --workspace widget    # dist/abdm-support-agent.js
    npm test --workspace widget         # the markdown and the event stream

The docs site builds its own copy into `site/static/agent/` on every
`prestart` and `prebuild`, so a change here reaches the site by rebuilding it.
