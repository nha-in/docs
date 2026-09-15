import {render} from 'preact';
import {useEffect, useRef, useState} from 'preact/hooks';
import ChatMarkdown, {CopyButton, absolute, headings} from './markdown';
import {ArrowUp, Paperclip, PenLine, Sparkles, Square, X} from './icons';
import {readStream, UNREACHABLE, type Source} from './sse';
import {
  AGENTS,
  TOOLS,
  agentLabel,
  answer as scripted,
  needsAgent,
  say,
  wantsTools,
  type AgentId,
  type Step,
} from './install';
import {revealStep} from './pacing';
import {ASSET_BASE, loadScript} from './assets';
import css from './styles.css';

type Turn = {
  from: 'you' | 'assistant';
  text: string;
  sources?: Source[];
  /** The file that went with this question, kept so a follow-up still has it. */
  file?: Attached;
  /**
   * Where the install flow had got to when this turn was written. Present
   * only on the panel's own scripted turns, which is also what marks them as
   * not part of the conversation the model is shown.
   */
  install?: Step;
};

/**
 * A file the reader attached, read in the browser and never uploaded.
 *
 * kind says how the text was got, because it changes how far it can be
 * trusted: a PDF's own text layer is exact, an image's is a machine's reading
 * of a picture and comes with the mistakes that implies.
 */
type Attached = {name: string; text: string; kind?: 'pdf' | 'image'};

/**
 * What may be attached, and how much of it.
 *
 * Text only, and read here rather than uploaded: the server has no place to
 * put a file and no way to redact one it cannot read. A screenshot would need
 * both, which is why images are not in this list. The character cap matches
 * the server's own, so a file that is too long is refused here, where the
 * reader can see why, rather than in a 400.
 */
const ATTACH_TYPES =
  '.json,.txt,.log,.csv,.xml,.yaml,.yml,.md,.har,.pdf,.png,.jpg,.jpeg,.webp';
const ATTACH_MAX_CHARS = 20000;
/** A text file is small. A scan or a screenshot is not, so it gets its own cap. */
const ATTACH_MAX_BYTES = 256 * 1024;
const ATTACH_MAX_BINARY_BYTES = 8 * 1024 * 1024;

/**
 * Reads the text a PDF already carries. A scan with no text layer comes back
 * empty, which the caller reports rather than sending a blank attachment.
 */
async function textFromPdf(file: File): Promise<string> {
  const pdfjs = await import(/* @vite-ignore */ `${ASSET_BASE}pdf.min.mjs`);
  pdfjs.GlobalWorkerOptions.workerSrc = `${ASSET_BASE}pdf.worker.min.mjs`;
  const task = pdfjs.getDocument({data: await file.arrayBuffer()});
  const doc = await task.promise;
  const pages: string[] = [];
  for (let n = 1; n <= doc.numPages; n += 1) {
    const content = await (await doc.getPage(n)).getTextContent();
    pages.push(
      content.items
        .map((item: {str?: string}) => item.str ?? '')
        .join(' ')
        .replace(/[ \t]+/g, ' ')
        .trim(),
    );
    if (pages.join('\n\n').length > ATTACH_MAX_CHARS) break;
  }
  // The loading task owns the worker, not the document, so this is what
  // actually lets the worker go.
  await doc.cleanup?.();
  await task.destroy();
  return pages.join('\n\n').trim();
}

/**
 * Reads the text out of an image, in the reader's own browser.
 *
 * The picture never leaves their machine: what travels is the text, masked
 * on the way like any other attachment. Sending the image itself would mean
 * an upload, a vision model and redacting pixels, and a screenshot of a
 * failing call in a health system carries the patient in its pixels.
 */
async function textFromImage(
  file: File,
  onProgress: (note: string) => void,
): Promise<string> {
  onProgress('Loading the reader, once per browser.');
  await loadScript(`${ASSET_BASE}tesseract.min.js`);
  const lib = (window as unknown as {Tesseract: any}).Tesseract;
  onProgress('Reading the text out of that image.');
  const worker = await lib.createWorker('eng', 1, {
    workerPath: `${ASSET_BASE}worker.min.js`,
    corePath: ASSET_BASE,
    langPath: `${ASSET_BASE}lang`,
    // The language data is a file this site serves, not a download from
    // somebody else's CDN, so it must not be cached under a name that
    // implies otherwise.
    cacheMethod: 'none',
  });
  try {
    const {data} = await worker.recognize(file);
    return (data.text ?? '').replace(/[ \t]+/g, ' ').trim();
  } finally {
    await worker.terminate();
  }
}

/**
 * A page the host has attached as context for the conversation, through the
 * element's `attachPage` method. The widget knows nothing about where it
 * came from: the host fetches it and hands over the text.
 *
 * An empty `markdown` is the honest failure: the host tried to attach the
 * page and could not, and the panel says so rather than pretending.
 */
export type PageAttachment = {title: string; url: string; markdown: string};

/**
 * The chat API caps an attached page, so the panel cuts to the same length
 * rather than having the request rejected. The note goes to the model, not
 * to the reader: it is the model that has to know its copy stops early.
 */
const MAX_PAGE_CHARS = 24000;
const CUT_NOTE =
  '\n\n[This page was cut here to fit. Say so if the answer needs the rest of it.]';

function pageBody(markdown: string): string {
  if (markdown.length <= MAX_PAGE_CHARS) return markdown;
  return markdown.slice(0, MAX_PAGE_CHARS - CUT_NOTE.length) + CUT_NOTE;
}

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
  // Said the way a person would open, not as a notice about itself. What it
  // can do is shown by the questions below it; where the answer came from is
  // shown under the answer.
  text: 'What are you building? Ask me anything about ABDM.',
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

/**
 * The openers a host page asked for, one per line in the `starters`
 * attribute, falling back to the four above. A page that knows what its
 * reader came to do offers that rather than the general set.
 */
function startersFrom(given: string): string[] {
  const lines = given
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
  return lines.length ? lines.slice(0, 4) : STARTERS;
}

type Setter = (update: (prior: Turn[]) => Turn[]) => void;

/** Appends a text delta onto the last turn in the thread. */
function appendToLastTurn(setTurns: Setter, delta: string) {
  setTurns((prior) => {
    const last = prior[prior.length - 1];
    return [...prior.slice(0, -1), {...last, text: last.text + delta}];
  });
}

/**
 * Where the tools are offered, and the only place they are.
 *
 * Under the newest answer, and only when the question it answers sounded
 * like somebody doing the work rather than reading about it. Once the flow
 * has been entered the offer goes entirely: it is already in the thread.
 * Returns the turn index to put it under, or -1 for nowhere.
 */
function offerIndex(turns: Turn[]): number {
  if (turns.some((turn) => turn.install)) return -1;
  for (let i = turns.length - 1; i > 0; i -= 1) {
    const turn = turns[i];
    if (turn.from !== 'assistant' || turn.text === '') continue;
    const asked = turns[i - 1];
    return asked?.from === 'you' && wantsTools(asked.text) ? i : -1;
  }
  return -1;
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
  /** The Docs MCP server's address, where this build carries one. */
  mcpUrl: string | null;
  open: boolean;
  onClose: () => void;
  question: string;
  send: boolean;
  starters: string[];
  supportUrl: string;
  page: PageAttachment | null;
  onDetach: () => void;
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
/** How wide the panel may be dragged, in pixels. */
const PANEL_MIN = 320;
const PANEL_MAX = 960;
const PANEL_WIDTH_KEY = 'abdm-ask-ai-width';

/**
 * True while the left edge is being dragged, and for the click that ends the
 * drag. The panel closes on a click that lands on the dialog itself, which is
 * how a click on the backdrop dismisses it, and a drag that finishes anywhere
 * left of the panel ends exactly there: mouse down on the handle, mouse up on
 * the page, and the click goes to their common ancestor, which is the dialog.
 * So narrowing the panel used to shut it.
 */
let resizing = false;

/**
 * The panel's left edge, as something you can pull.
 *
 * The panel is a fixed 26rem, which is the right width for a paragraph and
 * the wrong width for the things it also shows: a sequence diagram, a curl
 * command with a long URL, a table of headers. Rather than guess a wider
 * default and make every short answer sit in a column of whitespace, the
 * reader sets it, and the width they set is remembered for their next visit.
 *
 * Pointer events rather than mouse events, so a pen and a trackpad work the
 * same way, with a capture so the drag survives the pointer leaving the
 * handle. There is no handle on a touch screen: the panel is the full width
 * of the viewport there, and there is nothing to drag it to.
 */
function ResizeGrip({dialog}: {dialog: {current: HTMLDialogElement | null}}) {
  const [dragging, setDragging] = useState(false);

  // The width is written onto the element rather than held in state, because
  // a re-render per pointer move is a re-render of everything in the panel,
  // and one of the things in the panel is a diagram.
  useEffect(() => {
    const saved = Number(localStorage.getItem(PANEL_WIDTH_KEY));
    if (saved >= PANEL_MIN && dialog.current) {
      dialog.current.style.setProperty('--aa-panel-width', `${saved}px`);
    }
  }, []);

  const start = (event: PointerEvent) => {
    const panel = dialog.current;
    if (!panel) return;
    event.preventDefault();
    resizing = true;
    setDragging(true);
    (event.target as Element).setPointerCapture(event.pointerId);
    const move = (moved: PointerEvent) => {
      // The panel is docked right, so its width is whatever is left of the
      // viewport once the pointer has taken its share.
      const wanted = window.innerWidth - moved.clientX;
      const width = Math.min(
        Math.max(wanted, PANEL_MIN),
        Math.min(PANEL_MAX, window.innerWidth),
      );
      panel.style.setProperty('--aa-panel-width', `${Math.round(width)}px`);
    };
    const stop = () => {
      // Cleared after the click this pointer up is about to produce, not
      // before it.
      setTimeout(() => {
        resizing = false;
      }, 0);
      setDragging(false);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', stop);
      window.removeEventListener('pointercancel', stop);
      const set = panel.style.getPropertyValue('--aa-panel-width');
      if (set) localStorage.setItem(PANEL_WIDTH_KEY, String(parseInt(set, 10)));
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', stop);
    window.addEventListener('pointercancel', stop);
  };

  return (
    <div
      class={`ask-ai__grip${dragging ? ' ask-ai__grip--dragging' : ''}`}
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize the panel"
      tabIndex={0}
      onPointerDown={start}
      onKeyDown={(event) => {
        // The keyboard reaches it too: a control only a pointer can work is
        // a control some readers do not have.
        const step =
          event.key === 'ArrowLeft' ? 32 : event.key === 'ArrowRight' ? -32 : 0;
        if (!step || !dialog.current) return;
        event.preventDefault();
        const now = dialog.current.getBoundingClientRect().width;
        const width = Math.min(Math.max(now + step, PANEL_MIN), PANEL_MAX);
        dialog.current.style.setProperty('--aa-panel-width', `${width}px`);
        localStorage.setItem(PANEL_WIDTH_KEY, String(width));
      }}>
      <span class="ask-ai__grip-bar" aria-hidden="true" />
    </div>
  );
}

function Panel({
  apiBase,
  docsOrigin,
  mcpUrl,
  open,
  onClose,
  page,
  onDetach,
  question,
  send,
  starters,
  supportUrl,
}: PanelProps) {
  const [turns, setTurns] = useState<Turn[]>([
    apiBase ? LIVE_OPENING : MOCK_OPENING,
  ]);
  // An attached page names its own sections, and a section heading is a
  // better opener than a guess. Where there is no page, or the page carries
  // no headings, the host's own openers stand.
  const pageOpeners = page ? headings(page.markdown).slice(0, 4) : [];
  const openers = pageOpeners.length ? pageOpeners : starters;
  const [draft, setDraft] = useState('');
  const [chosen, setChosen] = useState<Attached | null>(null);
  const [attachError, setAttachError] = useState<string | null>(null);
  const [reading, setReading] = useState<string | null>(null);
  const [phase, setPhase] = useState<'idle' | 'thinking' | 'streaming'>('idle');
  const [activity, setActivity] = useState<string | null>(null);
  // The install flow's one piece of state: the reader has pressed Other and
  // is typing the name of their agent. Panel level rather than per turn
  // because only the newest step is ever interactive.
  const [naming, setNaming] = useState('');
  const [asking, setAsking] = useState(false);
  const autoAsked = useRef<string | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const thread = useRef<HTMLDivElement>(null);
  const composer = useRef<HTMLTextAreaElement>(null);
  const picker = useRef<HTMLInputElement>(null);
  const abort = useRef<AbortController | null>(null);
  const busy = phase !== 'idle';
  // A page with no markdown is one the host could not fetch. It still shows,
  // as a failure, because a reader who asked for the page to be attached has
  // to be told it was not.
  const attached = page !== null && page.markdown !== '';

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

  // A host that already knows what the reader was typing, the docs site's
  // search box being the one that does, hands it over in `question`. It
  // seeds the composer and is never sent: the reader still decides whether
  // that is the question, and can edit it first. An empty box only, so
  // reopening the panel never writes over what they were part way through.
  useEffect(() => {
    if (!open || !question) return;
    if (!send) {
      setDraft((prior) => prior || question);
      return;
    }
    // Asked outright, once. The host says the reader has finished asking, so
    // pressing send again would be asking them to say it twice; the guard is
    // what stops a re-render or a second opening from asking it again.
    if (autoAsked.current === question) return;
    autoAsked.current = question;
    void ask(question);
  }, [open, question, send]);

  // The dialog's own state is the source of truth for the browser; the `open`
  // prop drives it. Escape and the backdrop fire "close", which is where the
  // host is told the panel went away.
  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    // Opening the panel is the reader saying they have something to ask, so
    // the caret starts in the composer and they do not have to click the box
    // first. The dialog's own autofocus would be the way to say that, but it
    // leaves focus on the dialog itself here, so the composer is focused by
    // hand once the panel is actually showing.
    if (open && !el.open) {
      el.showModal();
      composer.current?.focus();
    }
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
    const height = Math.min(el.scrollHeight, 160);
    el.style.height = `${height}px`;
    // A scrollbar only once there is something to scroll to. Left on auto,
    // a platform with classic scrollbars paints one against a single line of
    // text, because the box's own minimum height and the text's height round
    // apart by a pixel.
    el.style.overflowY = el.scrollHeight > height ? 'auto' : 'hidden';
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
    setChosen(null);
    setAttachError(null);
    setReading(null);
    setActivity(null);
    setPhase('idle');
  };

  /**
   * Reads a chosen file into the composer's attachment slot.
   *
   * The reading happens here, in the reader's own browser, and what travels
   * is the text it found. A file that is too large, or that turns out to be
   * binary once read, is refused with a line saying so rather than sent as
   * mojibake for the model to guess at.
   */
  const takeFile = async (file: File | undefined) => {
    if (!file) return;
    setAttachError(null);
    const name = file.name.toLowerCase();
    const isPdf = file.type === 'application/pdf' || name.endsWith('.pdf');
    const isImage = file.type.startsWith('image/');
    const cap = isPdf || isImage ? ATTACH_MAX_BINARY_BYTES : ATTACH_MAX_BYTES;
    if (file.size > cap) {
      setAttachError('That file is too large. Attach the failing part of it.');
      return;
    }
    let text: string;
    try {
      if (isPdf) {
        setReading('Reading the text in that PDF.');
        text = await textFromPdf(file);
        if (!text) {
          setReading(null);
          setAttachError(
            'That PDF has no text in it, only pictures of text. Attach a screenshot of the part you mean and it will be read.',
          );
          return;
        }
      } else if (isImage) {
        text = await textFromImage(file, setReading);
      } else {
        text = await file.text();
      }
    } catch {
      setReading(null);
      setAttachError('That file could not be read.');
      return;
    } finally {
      setReading(null);
    }
    // A replacement character is what a decoder leaves behind when the bytes
    // were never text, which is the cheap way to catch an image renamed .txt.
    if (!isPdf && !isImage && text.includes('\uFFFD')) {
      setAttachError('That looks like a binary file. Text and JSON only.');
      return;
    }
    if (text.length > ATTACH_MAX_CHARS) {
      setAttachError(
        `That file is ${text.length.toLocaleString()} characters. Attach at most ${ATTACH_MAX_CHARS.toLocaleString()}.`,
      );
      return;
    }
    if (!text.trim()) {
      setAttachError(
        isImage
          ? 'No text could be read out of that image.'
          : 'That file is empty.',
      );
      return;
    }
    setChosen({
      name: file.name,
      text,
      kind: isPdf ? 'pdf' : isImage ? 'image' : undefined,
    });
    composer.current?.focus();
  };

  /** Stops the answer and keeps every word of it that had arrived. */
  const stop = () => {
    abort.current?.abort();
    if (pending.current) appendToLastTurn(setTurns, pending.current);
    pending.current = '';
    netDone.current = true;
  };

  /**
   * Moves the install flow on by one step, writing it into the thread the
   * way an exchange reads: what the reader chose, then the answer to it.
   *
   * Nothing here goes to the server. The steps are scripted, so the panel
   * says them itself rather than asking a model to remember a command.
   */
  const walk = (next: Step, chose: string) => {
    setNaming('');
    setAsking(false);
    setTurns((prior) => [
      ...prior,
      ...(chose ? [{from: 'you' as const, text: chose}] : []),
      {
        from: 'assistant' as const,
        text: say(next, {docsOrigin, mcpUrl}),
        install: next,
      },
    ]);
  };

  const ask = async (asked: string) => {
    if (!asked || busy) return;
    const file = chosen;
    setDraft('');
    setChosen(null);
    setAttachError(null);

    // The install flow's turns are the panel talking to itself. They are in
    // the thread because the reader had the exchange, but sending them would
    // put three screens of commands in front of the model on every round
    // after, and it did not say any of them.
    const history = [
      ...turns.slice(1).filter((turn) => !turn.install),
      {from: 'you' as const, text: asked, file: file ?? undefined},
    ];
    setTurns((prior) => [
      ...prior,
      {from: 'you', text: asked, file: file ?? undefined},
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
            // The file rides with the question it came with, on every round,
            // because the whole conversation is re-sent each time and a
            // follow-up about "the bundle I sent" needs it still there.
            ...(t.file
              ? {
                  attachment: {
                    name: t.file.name,
                    text: t.file.text,
                    ...(t.file.kind ? {kind: t.file.kind} : {}),
                  },
                }
              : {}),
          })),
          // Context, not a turn: the server puts it in front of the model as
          // the page the reader is looking at, and it never enters the
          // transcript as something they typed. Omitted entirely when
          // nothing is attached, which is what an older server also sees.
          ...(attached
            ? {
                page: {
                  title: page!.title,
                  url: page!.url,
                  markdown: pageBody(page!.markdown),
                },
              }
            : {}),
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
  const offer = offerIndex(turns);

  return (
    <dialog
      class="ask-ai"
      ref={dialog}
      aria-label="Ask AI"
      onClose={onClose}
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === dialog.current && !resizing) onClose();
      }}>
      <ResizeGrip dialog={dialog} />
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
        {/* Nothing under the title while the assistant works. What it draws
            on shows under each answer as sources, which says the same thing
            where it can be checked; how questions are handled is on the
            support page, in the reader's own words rather than as a notice
            over every conversation. The mock still announces itself, because
            a panel that cannot answer has to say so. */}
        {!apiBase && (
          <p class="ask-ai__blurb">
            Not connected to anything. For a real answer, use{' '}
            <a href={supportUrl} target="_blank" rel="noopener noreferrer">
              support
            </a>
            .
          </p>
        )}
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
            {/* The file that went with the question, named in the reader's
                own bubble so what was sent is on the record they can see. */}
            {turn.file && (
              <span class="ask-ai__turn-file">
                <Paperclip />
                {turn.file.name}
              </span>
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
            {/* The install flow's own controls, on the newest step only.
                An older step's chips stay on the page as a record of what
                was chosen, but pressing them again would fork the thread. */}
            {turn.install && index === turns.length - 1 && (
              <div class="ask-ai__choices">
                {turn.install.at === 'tools' &&
                  TOOLS.map((tool) => (
                    <button
                      key={tool.id}
                      type="button"
                      class="ask-ai__choice"
                      onClick={() =>
                        walk(
                          needsAgent(tool.id)
                            ? {at: 'agents', tool: tool.id}
                            : {at: 'answer', tool: tool.id, agent: 'claude'},
                          tool.label,
                        )
                      }>
                      {tool.label}
                    </button>
                  ))}

                {turn.install.at === 'agents' &&
                  !asking &&
                  AGENTS.map((agent) => (
                    <button
                      key={agent.id}
                      type="button"
                      class="ask-ai__choice"
                      onClick={() => {
                        // Other is the one answer that needs a second
                        // question, so it opens a field instead of moving on.
                        if (agent.id === 'other') {
                          setAsking(true);
                          return;
                        }
                        walk(
                          {
                            at: 'answer',
                            tool: (turn.install as {tool: typeof TOOLS[number]['id']}).tool,
                            agent: agent.id as AgentId,
                          },
                          agent.label,
                        );
                      }}>
                      {agent.label}
                    </button>
                  ))}

                {turn.install.at === 'agents' && asking && (
                  <form
                    class="ask-ai__naming"
                    onSubmit={(event) => {
                      event.preventDefault();
                      const named = naming.trim();
                      if (!named) return;
                      walk(
                        {
                          at: 'answer',
                          tool: (turn.install as {tool: typeof TOOLS[number]['id']}).tool,
                          agent: 'other',
                          named,
                        },
                        named,
                      );
                    }}>
                    <input
                      class="ask-ai__naming-field"
                      value={naming}
                      autoFocus
                      placeholder="Which agent?"
                      aria-label="The name of your agent"
                      onInput={(event) =>
                        setNaming((event.target as HTMLInputElement).value)
                      }
                    />
                    <button
                      type="submit"
                      class="ask-ai__choice"
                      disabled={naming.trim() === ''}>
                      <ArrowUp />
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* One click into the agent, where the agent has a scheme for
                it. The line to run is already in the answer above, as the
                same fenced block every other answer here uses. */}
            {turn.install?.at === 'answer' &&
              (() => {
                const {link} = scripted(turn.install, {docsOrigin, mcpUrl});
                return link ? (
                  <a
                    class="ask-ai__install-cta"
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer">
                    <Sparkles />
                    {link.label}
                  </a>
                ) : null;
              })()}

            {/* The tools, offered where they would actually help. See
                offerIndex: under the newest answer, and only to a question
                that sounded like somebody doing the work. A reader who asked
                what a care context is gets the sentence and nothing else. */}
            {index === offer && !(busy && index === turns.length - 1) && (
              <button
                type="button"
                class="ask-ai__install-cta"
                onClick={() => walk({at: 'tools'}, 'Install AI tools')}>
                <Sparkles />
                Install AI tools
              </button>
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
            reader has asked anything of their own. A reader with a page
            attached gets that page's own sections instead of the host's four,
            because those are the questions this page actually answers. */}
        {turns.length === 1 && (
          <div class="ask-ai__starters">
            {openers.map((q) => (
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

      {(chosen || attachError || reading) && (
        <div class="ask-ai__attachment">
          {reading ? (
            <>
              <span class="ask-ai__pulse" aria-hidden="true" />
              <span class="ask-ai__attachment-note">{reading}</span>
            </>
          ) : chosen ? (
            <>
              <Paperclip />
              <span class="ask-ai__attachment-name">{chosen.name}</span>
              <span class="ask-ai__attachment-size">
                {chosen.kind === 'image'
                  ? `${chosen.text.length.toLocaleString()} characters read`
                  : `${chosen.text.length.toLocaleString()} characters`}
              </span>
              <button
                type="button"
                class="ask-ai__attachment-remove"
                aria-label={`Remove ${chosen.name}`}
                onClick={() => setChosen(null)}>
                <X />
              </button>
            </>
          ) : (
            <span class="ask-ai__attachment-error">{attachError}</span>
          )}
        </div>
      )}
      {/* Identifiers are masked on the way out, but a person's name written
          in prose is not something any pattern finds, and a screenshot is
          where one usually is. Said once, next to the file it applies to. */}
      {chosen?.kind && !reading && (
        <p class="ask-ai__attachment-note">
          Read here in your browser; the file itself is not sent. Names in it
          are yours to check before you send.
        </p>
      )}
      <form
        class="ask-ai__composer"
        onSubmit={(event) => {
          event.preventDefault();
          void ask(draft.trim());
        }}>
        {/* What is going with the question, said before it is sent rather
            than after. An attachment the reader cannot see is an answer they
            cannot account for, so it is named here and it comes off from
            here. */}
        {page && (
          <div
            class={`ask-ai__attached${attached ? '' : ' ask-ai__attached--failed'}`}>
            <span class="ask-ai__attached-text">
              {attached
                ? `Using this page: ${page.title}`
                : `Could not attach ${page.title}. The answer will not use it.`}
            </span>
            <button
              type="button"
              class="ask-ai__attached-remove"
              onClick={onDetach}
              aria-label={
                attached
                  ? `Do not use ${page.title}`
                  : `Dismiss the attachment notice for ${page.title}`
              }>
              <X />
            </button>
          </div>
        )}
        {/* The file never leaves the browser as a file: it is read here and
            its text goes with the question, so there is nothing to upload
            and nothing stored. */}
        <input
          ref={picker}
          type="file"
          class="ask-ai__picker"
          accept={ATTACH_TYPES}
          onChange={(event) => {
            const input = event.currentTarget;
            void takeFile(input.files?.[0]);
            // Cleared so choosing the same file twice still fires a change.
            input.value = '';
          }}
        />
        <button
          type="button"
          class="ask-ai__attach"
          aria-label="Attach a text or JSON file"
          title="Attach a text or JSON file"
          disabled={busy}
          onClick={() => picker.current?.click()}>
          <Paperclip />
        </button>
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
  mcpUrl,
  supportUrl,
  launcher,
  shortcut,
  open,
  page,
  onDetach,
  question,
  send,
  starters,
}: {
  host: HTMLElement;
  apiBase: string;
  docsOrigin: string;
  mcpUrl: string | null;
  supportUrl: string;
  launcher: boolean;
  shortcut: string;
  open: boolean;
  page: PageAttachment | null;
  onDetach: () => void;
  question: string;
  send: boolean;
  starters: string[];
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
          {/* The host's own key for this, if it has bound one. A reader who
              never looks in a menu learns the shortcut from the thing it
              opens or not at all. */}
          {shortcut && <kbd class="ask-ai__launcher-key">{shortcut}</kbd>}
        </button>
      )}
      <Panel
        apiBase={apiBase}
        docsOrigin={docsOrigin}
        mcpUrl={mcpUrl}
        supportUrl={supportUrl}
        open={open}
        question={question}
        send={send}
        starters={starters}
        onClose={close}
        page={page}
        onDetach={onDetach}
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
 *   mcp-url      the Docs MCP server's address, for the install flow to hand
 *                out; absent and the flow says so rather than inventing one
 *   launcher     "none" to supply your own trigger and drive `open`
 *   shortcut     the key the host has bound to open the panel, shown on the
 *                launcher; the host binds it, this only says what it is
 *   open         present while the panel is showing; the element removes it
 *                and fires a "close" event when the reader dismisses it
 *   question     seeds the composer when the panel opens with an empty box,
 *                for a host that already has the reader's words
 *   send         present alongside `question` to ask it outright rather than
 *                leave it in the composer for the reader to press
 *   starters     the empty state's opening questions, one per line, for a
 *                page that knows what its reader came to do
 *
 * One thing is set by method rather than attribute: attachPage({title, url,
 * markdown}) gives the conversation the page the reader is looking at, and
 * attachPage(null) takes it off again. A page of Markdown does not belong in
 * an attribute, and the host is the only one that knows where its own pages
 * are published, so it fetches and hands over the text.
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
    'mcp-url',
    'support-url',
    'launcher',
    'shortcut',
    'open',
    'question',
    'send',
    'starters',
    'ground',
  ];

  private root: ShadowRoot | null = null;
  private page: PageAttachment | null = null;

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

  /**
   * Attaches a page as context for the conversation, or clears it with
   * null. The host fetches the Markdown itself, since only the host knows
   * where its pages live; an empty `markdown` says it tried and failed, and
   * the panel shows that rather than attaching nothing quietly.
   *
   * It is a method rather than an attribute because a whole page of Markdown
   * has no business being reflected into the DOM as a string.
   */
  attachPage(page: PageAttachment | null) {
    this.page = page;
    if (this.root) this.paint();
  }

  private paint() {
    const docsOrigin =
      this.getAttribute('docs-origin') ?? window.location.origin;
    render(
      <Widget
        host={this}
        apiBase={this.getAttribute('api-base') ?? ''}
        docsOrigin={docsOrigin}
        mcpUrl={this.getAttribute('mcp-url')}
        supportUrl={
          this.getAttribute('support-url') ??
          `${docsOrigin.replace(/\/$/, '')}/docs/support`
        }
        launcher={this.getAttribute('launcher') !== 'none'}
        shortcut={this.getAttribute('shortcut') ?? ''}
        open={this.hasAttribute('open')}
        page={this.page}
        onDetach={() => this.attachPage(null)}
        question={this.getAttribute('question') ?? ''}
        send={this.hasAttribute('send')}
        starters={startersFrom(this.getAttribute('starters') ?? '')}
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
