import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import SearchBar from '@theme/SearchBar';
import {ArrowUp, Sparkles} from 'lucide-react';
import {cn} from '@site/src/lib/utils';
import ChatMarkdown from '@site/src/components/chrome/ChatMarkdown';
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

  const send = async (event: React.FormEvent) => {
    event.preventDefault();
    const asked = draft.trim();
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
    try {
      const res = await fetch(`${chatUrl}/api/chat`, {
        method: 'POST',
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
    } catch {
      appendToLastTurn(setTurns, UNREACHABLE);
    } finally {
      setBusy(false);
      setActivity(null);
    }
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

        <div className="ask-ai__thread">
          {turns.map((turn, index) => (
            <div
              key={index}
              className={cn('ask-ai__turn', `ask-ai__turn--${turn.from}`)}>
              {turn.from === 'assistant' ? (
                <ChatMarkdown text={turn.text} />
              ) : (
                turn.text
              )}
              {turn.sources && turn.sources.length > 0 && (
                <div className="ask-ai__sources">
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
          {showActivity && <p className="ask-ai__activity">{activity}</p>}
        </div>

        <form className="ask-ai__composer" onSubmit={send}>
          <input
            className="ask-ai__input"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Ask about ABDM"
            aria-label="Ask the assistant"
            disabled={busy}
          />
          <button
            className="ask-ai__send"
            type="submit"
            aria-label="Send"
            disabled={busy}>
            <ArrowUp className="size-4" aria-hidden="true" />
          </button>
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
