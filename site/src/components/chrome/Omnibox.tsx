import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import SearchBar from '@theme/SearchBar';
import {ArrowUp, PenLine, Sparkles, Square} from 'lucide-react';
import {cn} from '@site/src/lib/utils';
import ChatMarkdown, {CopyButton} from '@site/src/components/chrome/ChatMarkdown';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@site/src/components/ui/sheet';

/** One catalogue atom an answer drew on, surfaced as a citation chip. */
type Source = {id: string; title: string; status: string; url: string};

type Turn = {from: 'you' | 'assistant'; text: string; sources?: Source[]};

/** What the mock says back, whatever it is asked. */
const CANNED =
  'This panel is a mock. No assistant is connected to this portal yet, so ' +
  'nothing here can answer that. The search field does work and covers every ' +
  'published page, and the support page lists the channels a human reads.';

/** Fallback text when the live backend cannot be reached mid-stream. */
const UNREACHABLE =
  'The assistant is unreachable right now. Try again shortly.';

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

type StreamHandlers = {
  onText: (delta: string) => void;
  onTool: (detail: string) => void;
  onSources: (sources: Source[]) => void;
  onError: (message: string) => void;
};

/**
 * A minimal SSE reader over a fetch body. The backend's contract (Task 6)
 * sends four event types, one JSON payload each: "tool" while the model is
 * consulting the catalogue, "text" for streamed answer deltas, "sources" at
 * most once with the citations for the reply, and "done" when the turn is
 * over. "error" carries a message when the loop cannot continue.
 */
async function readStream(
  body: ReadableStream<Uint8Array>,
  handlers: StreamHandlers,
): Promise<void> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  const dispatch = (block: string) => {
    let event = 'message';
    const dataLines: string[] = [];
    for (const line of block.split('\n')) {
      if (line.startsWith('event:')) {
        event = line.slice(6).trim();
      } else if (line.startsWith('data:')) {
        dataLines.push(line.slice(5).trim());
      }
    }
    if (dataLines.length === 0) return;
    let payload: unknown;
    try {
      payload = JSON.parse(dataLines.join('\n'));
    } catch {
      return;
    }
    switch (event) {
      case 'text':
        handlers.onText((payload as {delta: string}).delta ?? '');
        break;
      case 'tool': {
        const tool = payload as {name: string; detail: string};
        handlers.onTool(tool.detail || tool.name);
        break;
      }
      case 'sources':
        handlers.onSources(payload as Source[]);
        break;
      case 'error':
        handlers.onError(
          (payload as {message: string}).message || UNREACHABLE,
        );
        break;
      default:
        break;
    }
  };

  for (;;) {
    const {done, value} = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, {stream: true});
    let sep;
    while ((sep = buffer.indexOf('\n\n')) !== -1) {
      const block = buffer.slice(0, sep);
      buffer = buffer.slice(sep + 2);
      dispatch(block);
    }
  }
}

/** Appends a text delta onto the last turn in the thread. */
function appendToLastTurn(
  setTurns: React.Dispatch<React.SetStateAction<Turn[]>>,
  delta: string,
) {
  setTurns((prior) => {
    const last = prior[prior.length - 1];
    return [...prior.slice(0, -1), {...last, text: last.text + delta}];
  });
}

/** Attaches the citation chips to the last turn in the thread. */
function attachSources(
  setTurns: React.Dispatch<React.SetStateAction<Turn[]>>,
  sources: Source[],
) {
  setTurns((prior) => {
    const last = prior[prior.length - 1];
    return [...prior.slice(0, -1), {...last, sources}];
  });
}

/**
 * The chat panel behind the Ask AI chip.
 *
 * Without a chat backend configured (`chatUrl` is null), this stays the mock
 * it always was: the opening line says so, the reply is a constant, and the
 * badge in the header repeats it, because a convincing mock of an assistant
 * that cannot answer is worse than no assistant at all.
 *
 * With `chatUrl` set, the composer posts the thread to the real backend and
 * streams the answer in as it arrives, showing what the model is doing
 * ("Consulting the catalogue") until the first text delta lands.
 */
function AskAiPanel() {
  const {siteConfig} = useDocusaurusContext();
  const chatUrl = siteConfig.customFields?.chatUrl as string | null;
  const [turns, setTurns] = React.useState<Turn[]>([
    chatUrl ? LIVE_OPENING : MOCK_OPENING,
  ]);
  const [draft, setDraft] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [activity, setActivity] = React.useState<string | null>(null);
  const thread = React.useRef<HTMLDivElement>(null);
  const composer = React.useRef<HTMLTextAreaElement>(null);
  const abort = React.useRef<AbortController | null>(null);

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
  const stick = React.useRef(true);
  const onThreadScroll = () => {
    const el = thread.current;
    if (!el) return;
    stick.current = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
  };

  React.useEffect(() => {
    const el = thread.current;
    if (el && stick.current) el.scrollTop = el.scrollHeight;
  }, [turns, activity]);

  // The composer grows with what is pasted into it, up to a point: developers
  // arrive with a whole error body to paste, and a one line box hides all but
  // the last line of it.
  React.useEffect(() => {
    const el = composer.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [draft]);

  // Leaving the panel mid-answer stops the stream rather than leaving it to
  // run against a component nobody is watching.
  React.useEffect(() => () => abort.current?.abort(), []);

  const reset = () => {
    abort.current?.abort();
    stick.current = true;
    setTurns([chatUrl ? LIVE_OPENING : MOCK_OPENING]);
    setDraft('');
    setActivity(null);
    setBusy(false);
  };

  const ask = async (asked: string) => {
    if (!asked || busy) return;
    setDraft('');

    if (!chatUrl) {
      setTurns((prior) => [
        ...prior,
        {from: 'you', text: asked},
        {from: 'assistant', text: CANNED},
      ]);
      return;
    }

    const history = [...turns.slice(1), {from: 'you' as const, text: asked}];
    setTurns((prior) => [
      ...prior,
      {from: 'you', text: asked},
      {from: 'assistant', text: ''},
    ]);
    setBusy(true);
    const controller = new AbortController();
    abort.current = controller;
    try {
      const res = await fetch(`${chatUrl}/api/chat`, {
        method: 'POST',
        signal: controller.signal,
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          turns: history
            .slice(-9)
            .map((t) => ({role: t.from === 'you' ? 'user' : 'assistant', text: t.text})),
        }),
      });
      if (!res.ok || !res.body) throw new Error(`status ${res.status}`);
      await readStream(res.body, {
        onText: (delta) => appendToLastTurn(setTurns, delta),
        onTool: (detail) => setActivity(detail),
        onSources: (sources) => attachSources(setTurns, sources),
        onError: (message) => appendToLastTurn(setTurns, message),
      });
    } catch (err) {
      // A stop is the reader's own doing: keep whatever arrived, say nothing.
      if (!(err instanceof DOMException && err.name === 'AbortError')) {
        appendToLastTurn(setTurns, UNREACHABLE);
      }
    } finally {
      abort.current = null;
      setBusy(false);
      setActivity(null);
    }
  };

  const send = (event: React.FormEvent) => {
    event.preventDefault();
    void ask(draft.trim());
  };

  const lastTurn = turns[turns.length - 1];
  const showActivity =
    activity !== null && lastTurn?.from === 'assistant' && lastTurn.text === '';

  return (
    <Sheet>
      <SheetTrigger className="omnibox__ai" aria-label="Ask AI">
        <Sparkles className="size-3.5" aria-hidden="true" />
        {/* The label goes when the bar gets narrow; the mark carries it. */}
        <span className="omnibox__ai-label">Ask AI</span>
      </SheetTrigger>
      <SheetContent side="right" className="ask-ai">
        <SheetHeader className="ask-ai__head">
          <SheetTitle className="ask-ai__title">
            Ask AI
            {!chatUrl && <span className="ask-ai__badge">Mock</span>}
            {turns.length > 1 && (
              <button
                type="button"
                className="ask-ai__reset"
                onClick={reset}
                aria-label="Start a new conversation">
                <PenLine className="size-3.5" aria-hidden="true" />
                New
              </button>
            )}
          </SheetTitle>
          <SheetDescription>
            {chatUrl ? (
              'Answers come from the published catalogue and cite their sources. Questions are logged to improve the answers.'
            ) : (
              <>
                Not connected to anything. For a real answer, use{' '}
                <Link to="/docs/support">support</Link>.
              </>
            )}
          </SheetDescription>
        </SheetHeader>

        <div className="ask-ai__thread" ref={thread} onScroll={onThreadScroll}>
          {turns.map((turn, index) => (
            <div
              key={index}
              className={cn('ask-ai__turn', `ask-ai__turn--${turn.from}`)}>
              {turn.from === 'assistant' ? (
                <ChatMarkdown text={turn.text} />
              ) : (
                turn.text
              )}
              {turn.from === 'assistant' && index > 0 && turn.text !== '' && (
                <CopyButton
                  text={turn.text}
                  label="Copy answer"
                  className="ask-ai__turn-copy"
                />
              )}
              {turn.sources && turn.sources.length > 0 && (
                <div className="ask-ai__sources">
                  <span className="ask-ai__sources-label">Sources</span>
                  {turn.sources.map((source) => (
                    <Link
                      key={source.id}
                      to={source.url}
                      className="ask-ai__source-chip">
                      {source.title}
                      {source.status !== 'verified' ? ' (spec)' : ''}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          {showActivity && (
            <p className="ask-ai__activity">
              <span className="ask-ai__pulse" aria-hidden="true" />
              {activity}
            </p>
          )}

          {/* The empty state carries the openers, and they go the moment the
              reader has asked anything of their own. */}
          {turns.length === 1 && (
            <div className="ask-ai__starters">
              {STARTERS.map((q) => (
                <button
                  key={q}
                  type="button"
                  className="ask-ai__starter"
                  onClick={() => void ask(q)}>
                  {q}
                </button>
              ))}
            </div>
          )}
        </div>

        <form className="ask-ai__composer" onSubmit={send}>
          {/* A textarea, not an input: an error body pasted in should be
              readable before it is sent. Enter still sends, because that is
              what every chat box does; shift and enter takes a new line. */}
          <textarea
            ref={composer}
            className="ask-ai__input"
            value={draft}
            rows={1}
            onChange={(event) => setDraft(event.target.value)}
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
              className="ask-ai__send ask-ai__send--stop"
              type="button"
              aria-label="Stop"
              onClick={() => abort.current?.abort()}>
              <Square className="size-3" aria-hidden="true" />
            </button>
          ) : (
          <button
            className="ask-ai__send"
            type="submit"
            aria-label="Send"
            disabled={draft.trim() === ''}>
            <ArrowUp className="size-4" aria-hidden="true" />
          </button>
          )}
        </form>
      </SheetContent>
    </Sheet>
  );
}

/**
 * Search and the assistant are one control, not two: the same field, with the
 * assistant on its right edge, so the box reads as an AI enabled search rather
 * than a text search standing next to a separate robot. It sits in the middle
 * of the top bar and stays there.
 */
export default function Omnibox() {
  const box = React.useRef<HTMLDivElement>(null);

  // The search theme takes its placeholder from a translation string, and the
  // usual override, i18n/en/code.json, turns on translation validation for the
  // whole site, which the sidebar does not currently pass. So the word is
  // corrected on the node instead. React holds the prop constant, so it never
  // writes over this.
  React.useEffect(() => {
    const root = box.current;
    if (!root) return;
    root
      .querySelector('input.navbar__search-input')
      ?.setAttribute('placeholder', 'Search or ask AI');

    // The search theme hardcodes the Apple command mark. On Windows, Linux and
    // Android that key does not exist, so the hint tells the reader to press
    // something they do not have. Correct it from the platform, and drop it
    // entirely where there is no hardware keyboard to press.
    const ua = navigator.userAgent;
    const isApple = /Mac|iPhone|iPad|iPod/.test(ua);
    const isTouchOnly = /Android|iPhone|iPad|iPod/.test(ua);
    for (const hint of Array.from(
      root.querySelectorAll<HTMLElement>("kbd[class*='searchHint']"),
    )) {
      if (isTouchOnly) {
        hint.style.display = 'none';
        continue;
      }
      if (hint.textContent && hint.textContent.trim() !== 'K') {
        hint.textContent = isApple ? '⌘' : 'Ctrl';
      }
    }
  }, []);

  return (
    <div ref={box} className="omnibox">
      <SearchBar />
      <AskAiPanel />
    </div>
  );
}
