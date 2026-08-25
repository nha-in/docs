import React from 'react';
import Link from '@docusaurus/Link';
import SearchBar from '@theme/SearchBar';
import {ArrowUp, Sparkles} from 'lucide-react';
import {cn} from '@site/src/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@site/src/components/ui/sheet';

type Turn = {from: 'you' | 'assistant'; text: string};

/** What the mock says back, whatever it is asked. */
const CANNED =
  'This panel is a mock. No assistant is connected to this portal yet, so ' +
  'nothing here can answer that. The search field does work and covers every ' +
  'published page, and the support page lists the channels a human reads.';

const OPENING: Turn = {
  from: 'assistant',
  text:
    'This is a preview of the assistant, not a working one. Ask anything to ' +
    'see the shape of the answer; the reply below is fixed.',
};

/**
 * The chat panel behind the Ask AI chip. Everything in it is staged: the
 * opening line says so, the reply is a constant, and the badge in the header
 * repeats it, because a convincing mock of an assistant that cannot answer is
 * worse than no assistant at all.
 */
function AskAiPanel() {
  const [turns, setTurns] = React.useState<Turn[]>([OPENING]);
  const [draft, setDraft] = React.useState('');

  const send = (event: React.FormEvent) => {
    event.preventDefault();
    const asked = draft.trim();
    if (!asked) {
      return;
    }
    setTurns((prior) => [
      ...prior,
      {from: 'you', text: asked},
      {from: 'assistant', text: CANNED},
    ]);
    setDraft('');
  };

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
            <span className="ask-ai__badge">Mock</span>
          </SheetTitle>
          <SheetDescription>
            Not connected to anything. For a real answer, use{' '}
            <Link to="/docs/support">support</Link>.
          </SheetDescription>
        </SheetHeader>

        <div className="ask-ai__thread">
          {turns.map((turn, index) => (
            <p
              key={index}
              className={cn('ask-ai__turn', `ask-ai__turn--${turn.from}`)}>
              {turn.text}
            </p>
          ))}
        </div>

        <form className="ask-ai__composer" onSubmit={send}>
          <input
            className="ask-ai__input"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Ask about ABDM"
            aria-label="Ask the assistant"
          />
          <button className="ask-ai__send" type="submit" aria-label="Send">
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
    box.current
      ?.querySelector('input.navbar__search-input')
      ?.setAttribute('placeholder', 'Search or ask AI');
  }, []);

  return (
    <div ref={box} className="omnibox">
      <SearchBar />
      <AskAiPanel />
    </div>
  );
}
