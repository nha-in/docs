import {render} from 'preact';
import {useEffect, useRef, useState} from 'preact/hooks';
import ChatMarkdown, {CopyButton, absolute} from './markdown';
import {ArrowUp, PenLine, Sparkles, Square, X} from './icons';
import {readStream, UNREACHABLE, type Source} from './sse';
import {revealStep} from './pacing';
import css from './styles.css';

type Turn = {from: 'you' | 'assistant'; text: string; sources?: Source[]};

/** What the mock says back, whatever it is asked. */
const CANNED =
  'This panel is a mock. No assistant is connected here yet, so nothing in ' +
  'it can answer that. The support page lists the channels a human reads.';

const MOCK_OPENING: Turn = {
  from: 'assistant',
  text:
    'This is a preview of the assistant, not a working one. Ask anything to ' +
    'see the shape of the answer; the reply below is fixed.',
};

const LIVE_OPENING: Turn = {
  from: 'assistant',
  text:
    'Ask about ABDM and this answers from the published catalogue, with the ' +
    'atoms it drew on cited below the reply.',
};

/**
 * The empty state's openers. A blank chat box is the hardest question a
 * reader answers, and these also teach the panel's range in one glance: a
 * header detail, an error code, a flow, and a concept. They are questions the
 * catalogue genuinely answers, so a first try does not miss.
 */
const STARTERS = [
  'What format does the TIMESTAMP header need?',
  'What does ABDM-1016 mean and how do I fix it?',
  'How do I create an ABHA with an Aadhaar OTP?',
  'What is a care context?',
];

type Setter = (update: (prior: Turn[]) => Turn[]) => void;

/** Appends a text delta onto the last turn in the thread. */
function appendToLastTurn(setTurns: Setter, delta: string) {
  setTurns((prior) => {
    const last = prior[prior.length - 1];
    return [...prior.slice(0, -1), {...last, text: last.text + delta}];
  });
}

/** Attaches the citation chips to the last turn in the thread. */
function attachSources(setTurns: Setter, sources: Source[]) {
  setTurns((prior) => {
    const last = prior[prior.length - 1];
    return [...prior.slice(0, -1), {...last, sources}];
  });
}

type PanelProps = {
  apiBase: string;
  docsOrigin: string;
  open: boolean;
  onClose: () => void;
  supportUrl: string;
};

/**
 * The conversation itself.
 *
 * Without a backend configured (`apiBase` is empty), this is a labelled mock:
 * the opening line says so, the reply is a constant, and the badge in the
 * header repeats it, because a convincing mock of an assistant that cannot
 * answer is worse than no assistant at all.
 *
 * The panel is a native modal dialog, so it lands in the browser's top layer.
 * That is what keeps it above a host page's own stacking contexts without the
 * widget knowing anything about them, and it brings Escape, the backdrop and
 * focus containment with it.
 */
function Panel({apiBase, docsOrigin, open, onClose, supportUrl}: PanelProps) {
  const [turns, setTurns] = useState<Turn[]>([
    apiBase ? LIVE_OPENING : MOCK_OPENING,
  ]);
  const [draft, setDraft] = useState('');
  const [phase, setPhase] = useState<'idle' | 'thinking' | 'streaming'>('idle');
  const [activity, setActivity] = useState<string | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const thread = useRef<HTMLDivElement>(null);
  const composer = useRef<HTMLTextAreaElement>(null);
  const abort = useRef<AbortController | null>(null);
  const busy = phase !== 'idle';

  // Text that has arrived but has not been shown yet, and the frame loop that
  // shows it. Both are refs: the loop runs from a callback the browser holds,
  // outside any one render, so state it read would be the state of the render
  // that started it.
  const pending = useRef('');
  const revealing = useRef(false);
  const netDone = useRef(true);
  const askedAt = useRef(0);
  const atOnce = useRef(false);
  const frame = useRef(0);
  const heldSources = useRef<Source[] | null>(null);

  const drain = () => {
    frame.current = requestAnimationFrame(drain);
    const backlog = pending.current.length;

    if (backlog === 0) {
      if (!netDone.current) return;
      cancelAnimationFrame(frame.current);
      frame.current = 0;
      revealing.current = false;
      if (heldSources.current) {
        attachSources(setTurns, heldSources.current);
        heldSources.current = null;
      }
      setPhase('idle');
      return;
    }

    const take = revealStep(
      backlog,
      performance.now() - askedAt.current,
      revealing.current,
      atOnce.current,
    );
    // Zero is the thinking hold: the indicator stands rather than a first word
    // flashing up in its place.
    if (take === 0) return;
    if (!revealing.current) {
      revealing.current = true;
      setPhase('streaming');
    }
    appendToLastTurn(setTurns, pending.current.slice(0, take));
    pending.current = pending.current.slice(take);
  };

  /** Queues text for the reveal loop rather than rendering it directly. */
  const emit = (text: string) => {
    pending.current += text;
  };

  /** Holds the citations until the answer they belong to has finished. */
  const queueSources = (sources: Source[]) => {
    heldSources.current = sources;
  };

  const stopDrain = () => {
    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = 0;
    revealing.current = false;
    pending.current = '';
    heldSources.current = null;
    netDone.current = true;
  };

  // An embedder can set api-base after the element is already on the page.
  // While nothing has been asked, the opening line follows it, rather than
  // introducing a mock that is no longer one.
  useEffect(() => {
    setTurns((prior) =>
      prior.length === 1 ? [apiBase ? LIVE_OPENING : MOCK_OPENING] : prior,
    );
  }, [apiBase]);

  // The dialog's own state is the source of truth for the browser; the `open`
  // prop drives it. Escape and the backdrop fire "close", which is where the
  // host is told the panel went away.
  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  // Escape closes it, from wherever focus happens to be. The dialog's own
  // close request would do this, but only when focus is inside the panel, and
  // it takes the panel away without telling this state it went. Catching the
  // key first, in the capture phase, keeps one source of truth and beats any
  // handler the host page has bound to Escape for itself.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      event.stopPropagation();
      onClose();
    };
    document.addEventListener('keydown', onKey, true);
    return () => document.removeEventListener('keydown', onKey, true);
  }, [open, onClose]);

  // Follow the answer as it streams, and stop the moment the reader scrolls
  // away to re-read something earlier. Yanking them back down mid-sentence is
  // the rudest thing a chat panel can do.
  //
  // The intent is tracked rather than inferred from distance: measuring the
  // gap on each render looks equivalent but is not, because until the answer
  // is taller than the panel the browser clamps scrollTop to 0, and the first
  // answer that overflows then reads as "the reader has scrolled up" and
  // following stops for good. A scroll listener sees the difference, since
  // pinning to the bottom lands at a gap of zero and leaves the flag set.
  const stick = useRef(true);
  const onThreadScroll = () => {
    const el = thread.current;
    if (!el) return;
    stick.current = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
  };

  useEffect(() => {
    const el = thread.current;
    if (el && stick.current) el.scrollTop = el.scrollHeight;
  }, [turns, phase, activity]);

  // The composer grows with what is pasted into it, up to a point: developers
  // arrive with a whole error body to paste, and a one line box hides all but
  // the last line of it.
  useEffect(() => {
    const el = composer.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [draft]);

  // Leaving the page mid-answer stops the stream rather than leaving it to
  // run against a component nobody is watching.
  useEffect(
    () => () => {
      abort.current?.abort();
      if (frame.current) cancelAnimationFrame(frame.current);
    },
    [],
  );

  const reset = () => {
    abort.current?.abort();
    stopDrain();
    stick.current = true;
    setTurns([apiBase ? LIVE_OPENING : MOCK_OPENING]);
    setDraft('');
    setActivity(null);
    setPhase('idle');
  };

  /** Stops the answer and keeps every word of it that had arrived. */
  const stop = () => {
    abort.current?.abort();
    if (pending.current) appendToLastTurn(setTurns, pending.current);
    pending.current = '';
    netDone.current = true;
  };

  const ask = async (asked: string) => {
    if (!asked || busy) return;
    setDraft('');

    const history = [...turns.slice(1), {from: 'you' as const, text: asked}];
    setTurns((prior) => [
      ...prior,
      {from: 'you', text: asked},
      {from: 'assistant', text: ''},
    ]);

    // Every answer, mock or live, goes through the same reveal loop, so the
    // preview shows the pacing the real thing has.
    pending.current = '';
    revealing.current = false;
    netDone.current = false;
    askedAt.current = performance.now();
    atOnce.current = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    setPhase('thinking');
    setActivity('Thinking');
    if (!frame.current) frame.current = requestAnimationFrame(drain);

    if (!apiBase) {
      emit(CANNED);
      netDone.current = true;
      return;
    }

    const controller = new AbortController();
    abort.current = controller;
    try {
      const res = await fetch(`${apiBase.replace(/\/$/, '')}/api/chat`, {
        method: 'POST',
        signal: controller.signal,
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          turns: history.slice(-9).map((t) => ({
            role: t.from === 'you' ? 'user' : 'assistant',
            text: t.text,
          })),
        }),
      });
      if (!res.ok || !res.body) throw new Error(`status ${res.status}`);
      await readStream(res.body, {
        onText: emit,
        onTool: (detail) => setActivity(detail),
        // Citations belong to the answer, so they wait for it: attaching them
        // while the text is still revealing would sit them under half a reply.
        onSources: (sources) => queueSources(sources),
        onError: emit,
      });
    } catch (err) {
      // A stop is the reader's own doing: keep whatever arrived, say nothing.
      if (!(err instanceof DOMException && err.name === 'AbortError')) {
        emit(UNREACHABLE);
      }
    } finally {
      abort.current = null;
      netDone.current = true;
      setActivity(null);
    }
  };

  // The indicator stands until the first word is actually shown, not until
  // the first byte lands. A reader watching it needs to know the panel is
  // working; what it says comes from the model's own tool calls once those
  // start arriving.
  const showActivity = phase === 'thinking';

  return (
    <dialog
      class="ask-ai"
      ref={dialog}
      aria-label="Ask AI"
      onClose={onClose}
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === dialog.current) onClose();
      }}>
      <div class="ask-ai__head">
        <h2 class="ask-ai__title">
          Ask AI
          {!apiBase && <span class="ask-ai__badge">Mock</span>}
          <span class="ask-ai__grow" />
          {turns.length > 1 && (
            <button
              type="button"
              class="ask-ai__reset"
              onClick={reset}
              aria-label="Start a new conversation">
              <PenLine />
              New
            </button>
          )}
          <button
            type="button"
            class="ask-ai__close"
            onClick={onClose}
            aria-label="Close">
            <X />
          </button>
        </h2>
        <p class="ask-ai__blurb">
          {apiBase ? (
            'Answers come from the published catalogue and cite their sources. Questions are logged to improve the answers.'
          ) : (
            <>
              Not connected to anything. For a real answer, use{' '}
              <a href={supportUrl} target="_blank" rel="noopener noreferrer">
                support
              </a>
              .
            </>
          )}
        </p>
      </div>

      {/* A log rather than a live region per turn: the reader's screen reader
          holds the announcement while aria-busy is set and reads the answer
          once, when it has finished arriving, instead of word by word. */}
      <div
        class="ask-ai__thread"
        ref={thread}
        role="log"
        aria-live="polite"
        aria-busy={busy}
        onScroll={onThreadScroll}>
        {turns.map((turn, index) =>
          // An answer with nothing in it yet is not a bubble. The thinking
          // indicator below stands in its place until the first word.
          turn.from === 'assistant' && turn.text === '' ? null : (
          <div
            key={index}
            class={`ask-ai__turn ask-ai__turn--${turn.from}${
              phase === 'streaming' && index === turns.length - 1
                ? ' ask-ai__turn--streaming'
                : ''
            }`}>
            {turn.from === 'assistant' ? (
              <ChatMarkdown text={turn.text} docsOrigin={docsOrigin} />
            ) : (
              turn.text
            )}
            {turn.from === 'assistant' &&
              index > 0 &&
              turn.text !== '' &&
              !(busy && index === turns.length - 1) && (
                <CopyButton
                  text={turn.text}
                  label="Copy answer"
                  className="ask-ai__turn-copy"
                />
              )}
            {turn.sources && turn.sources.length > 0 && (
              <div class="ask-ai__sources">
                <span class="ask-ai__sources-label">Sources</span>
                {turn.sources.map((source) => (
                  <a
                    key={source.id}
                    href={absolute(source.url, docsOrigin) ?? source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="ask-ai__source-chip">
                    {source.title}
                    {source.status !== 'verified' ? ' (spec)' : ''}
                  </a>
                ))}
              </div>
            )}
          </div>
          ),
        )}
        {showActivity && (
          <p class="ask-ai__activity">
            <span class="ask-ai__pulse" aria-hidden="true" />
            {activity ?? 'Thinking'}
          </p>
        )}

        {/* The empty state carries the openers, and they go the moment the
            reader has asked anything of their own. */}
        {turns.length === 1 && (
          <div class="ask-ai__starters">
            {STARTERS.map((q) => (
              <button
                key={q}
                type="button"
                class="ask-ai__starter"
                onClick={() => void ask(q)}>
                {q}
              </button>
            ))}
          </div>
        )}
      </div>

      <form
        class="ask-ai__composer"
        onSubmit={(event) => {
          event.preventDefault();
          void ask(draft.trim());
        }}>
        {/* A textarea, not an input: an error body pasted in should be
            readable before it is sent. Enter still sends, because that is
            what every chat box does; shift and enter takes a new line. */}
        <textarea
          ref={composer}
          class="ask-ai__input"
          value={draft}
          rows={1}
          onInput={(event) => setDraft(event.currentTarget.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              void ask(draft.trim());
            }
          }}
          placeholder="Ask about ABDM"
          aria-label="Ask the assistant"
        />
        {busy ? (
          <button
            class="ask-ai__send ask-ai__send--stop"
            type="button"
            aria-label="Stop"
            onClick={stop}>
            <Square />
          </button>
        ) : (
          <button
            class="ask-ai__send"
            type="submit"
            aria-label="Send"
            disabled={draft.trim() === ''}>
            <ArrowUp />
          </button>
        )}
      </form>
    </dialog>
  );
}

function Widget({
  host,
  apiBase,
  docsOrigin,
  supportUrl,
  launcher,
  open,
}: {
  host: HTMLElement;
  apiBase: string;
  docsOrigin: string;
  supportUrl: string;
  launcher: boolean;
  open: boolean;
}) {
  const close = () => {
    host.removeAttribute('open');
    host.dispatchEvent(new CustomEvent('close', {bubbles: true, composed: true}));
  };
  return (
    <>
      {launcher && (
        <button
          type="button"
          class="ask-ai__launcher"
          aria-label="Ask AI"
          onClick={() => {
            // Re-asserted rather than simply set: a browser can honour its
            // own close request for the dialog and leave this attribute
            // standing, and a launcher that then sets what is already set
            // would change nothing and open nothing.
            host.removeAttribute('open');
            host.setAttribute('open', '');
          }}>
          <Sparkles />
          {/* The label goes when the bar gets narrow; the mark carries it. */}
          <span class="ask-ai__launcher-label">Ask AI</span>
        </button>
      )}
      <Panel
        apiBase={apiBase}
        docsOrigin={docsOrigin}
        supportUrl={supportUrl}
        open={open}
        onClose={close}
      />
    </>
  );
}

/**
 * `<abdm-support-agent>`: the whole assistant, on any page, from one script
 * tag. Configuration is by attribute so an embedder needs no build step:
 *
 *   api-base     the chat server's origin; absent keeps the panel a mock
 *   docs-origin  where citations resolve, since "/docs/..." is wrong on
 *                every host except the docs site itself
 *   launcher     "none" to supply your own trigger and drive `open`
 *   open         present while the panel is showing; the element removes it
 *                and fires a "close" event when the reader dismisses it
 *
 * Everything renders in a shadow root, so the host page's styles cannot reach
 * in and the widget's cannot leak out. Colour is taken from the host's own
 * tokens where it defines them (see styles.css), and nothing about a
 * conversation is written to the host page's storage.
 */
/**
 * Which way the host page's ground runs, read from the first ancestor that
 * actually paints a background. The panel's fallback palette follows the page
 * it is on rather than the reader's operating system: a light page on a
 * machine set to dark is still a light page, and a dark panel dropped into it
 * looks like a bug. Where nothing paints, the system preference decides.
 */
function groundOf(): 'light' | 'dark' {
  for (let el: HTMLElement | null = document.body; el; el = el.parentElement) {
    const parts = /^rgba?\(([^)]+)\)/.exec(getComputedStyle(el).backgroundColor);
    if (!parts) continue;
    const [r, g, b, a = 1] = parts[1].split(',').map(Number);
    if (!a) continue;
    return 0.2126 * r + 0.7152 * g + 0.0722 * b < 128 ? 'dark' : 'light';
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

class SupportAgentElement extends HTMLElement {
  static observedAttributes = [
    'api-base',
    'docs-origin',
    'support-url',
    'launcher',
    'open',
    'ground',
  ];

  private root: ShadowRoot | null = null;

  connectedCallback() {
    if (!this.root) {
      this.root = this.attachShadow({mode: 'open'});
      const style = document.createElement('style');
      style.textContent = css;
      this.root.append(style);
      // An embedder who sets this themselves is taken at their word.
      if (!this.hasAttribute('ground')) this.setAttribute('ground', groundOf());
    }
    this.paint();
  }

  attributeChangedCallback() {
    if (this.root) this.paint();
  }

  /** Opens the panel. Equivalent to setting the `open` attribute. */
  show() {
    this.setAttribute('open', '');
  }

  /** Closes the panel. */
  hide() {
    this.removeAttribute('open');
  }

  private paint() {
    const docsOrigin =
      this.getAttribute('docs-origin') ?? window.location.origin;
    render(
      <Widget
        host={this}
        apiBase={this.getAttribute('api-base') ?? ''}
        docsOrigin={docsOrigin}
        supportUrl={
          this.getAttribute('support-url') ??
          `${docsOrigin.replace(/\/$/, '')}/docs/support`
        }
        launcher={this.getAttribute('launcher') !== 'none'}
        open={this.hasAttribute('open')}
      />,
      this.root!,
    );
  }
}

// Guarded so the bundle can be imported where there is no DOM, which is what
// a test and a server-side render both do.
if (
  typeof customElements !== 'undefined' &&
  !customElements.get('abdm-support-agent')
) {
  customElements.define('abdm-support-agent', SupportAgentElement);
}
