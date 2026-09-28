import React, {useCallback, useEffect, useRef, useState} from 'react';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import BrowserOnly from '@docusaurus/BrowserOnly';
import NetworkWeb from '@site/src/components/landing/NetworkWeb';
import FlapBoard from '@site/src/components/landing/FlapBoard';
import {PATHWAYS} from '@site/src/components/landing/pathways';
import BrandMark from '@site/src/components/chrome/BrandMark';
import {unfiltered} from '@site/src/config/roles';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@site/src/components/ui/tooltip';

/**
 * The three gateways, asked as intent rather than as ABDM's own role names
 * (HIP, HIU, PHR). A visitor knows what they are trying to build before they
 * know which gateway that maps to, so the intent is the card's main text and
 * the gateway is a small label under it; the full form only shows on hover
 * or keyboard focus, via the shared Tooltip.
 */
const gateways = [
  {
    // Identity comes before sharing, in the work and in the sentence: nobody
    // shares a record before there is an ABHA to hang it off, and a reader
    // whose first job is M1 saw only the second half of what this gateway
    // does.
    intent: 'I want to create an ABHA and share health records',
    short: 'HIE-CM',
    full: 'Health Information Exchange and Consent Manager',
    to: '/docs/hiecm/v3',
  },
  {
    intent: 'I want to offer health services',
    short: 'UHI',
    full: 'Unified Health Interface',
    to: '/docs/uhi/v1',
  },
  {
    intent: 'I want to solve for health insurance',
    short: 'NHCX',
    full: 'National Health Claims Exchange',
    to: '/docs/nhcx/v1',
  },
];

/** What the board rests on, and where it keeps coming back to. */
const RESTING = 'ABDM Developer Portal';

/**
 * What the board says about the delivery in the air, by who is receiving it.
 *
 * Not a rotation on a timer. The flaps start turning as the courier leaves
 * and settle as it lands, so the board is announcing the crossing the reader
 * is watching rather than whatever the clock came round to. Every line is a
 * capability of ABDM said as an outcome, because a first time visitor does
 * not yet have the vocabulary the documentation uses.
 *
 * The NHA's line is the portal's own name, and NetworkWeb sends every third
 * delivery there. That is what makes the site's identity the thing the board
 * returns to, on the network's rhythm rather than on a counter of its own.
 */
const DELIVERED: Record<string, string | string[]> = {
  citizen: 'Unique health identity',
  // A participant with more than one line takes them in turn, so calling
  // twice at the same door says something new the second time.
  phr: ['Your records, in one place', 'Unified health services'],
  hospital: 'Interoperable medical records',
  doctor: 'History at the point of care',
  lab: 'Reports that reach you',
  pharmacy: 'Prescriptions that travel',
  insurer: 'Faster insurance claims',
  nha: RESTING,
};

/** Wide enough for the longest line above, so the flaps never resize. */
const CELLS = Math.max(
  RESTING.length,
  ...Object.values(DELIVERED)
    .flat()
    .map((line) => line.length),
  ...Object.values(PATHWAYS).flatMap(({stages}) => stages.map(({line}) => line.length)),
);

/**
 * How long a card is pointed at before the network answers, and how long it
 * waits after the pointer leaves.
 *
 * The first is long on purpose. The pathway is an easter egg rather than the
 * card's hover state: a reader heading for the link never sees the ring move,
 * and one who lingers over a card finds the network rearrange around it. The
 * second lets a reader go from one card to the next without the network
 * falling back to rest in the gap between them.
 */
const ASK_MS = 6000;
const RELEASE_MS = 250;

/**
 * The statement, the one control and the three gateways.
 *
 * Markup only. What lifts it off the references page underneath is the
 * curtain that renders it (components/landing/LandingCurtain).
 */
export default function LandingHero(): React.ReactNode {
  const [message, setMessage] = useState(RESTING);
  // Set once on mount rather than read per render, so the server and the
  // first client render agree: both of them draw the resting name.
  const [still, setStill] = useState(true);
  /**
   * True on a screen too small for the drawing to be worth running.
   *
   * The network is a pointer instrument: it lights the participant under the
   * cursor and the board answers for it. A phone has no cursor, so all a
   * reader gets is eight nodes and their links drawn across the statement they
   * are trying to read, at a size where the nodes are unlabelled dots. It is
   * also a requestAnimationFrame loop running behind a page nobody can play
   * with, on the device most likely to be on a battery.
   *
   * Matched to the width the stylesheet sets the compact hero at, and false
   * for the server and the first client render so the two agree.
   *
   * This is not the only thing that can put the drawing away. A window with
   * no room for the ring around the copy hides it too, and that one is
   * measured rather than declared: see the sizing pass in NetworkWeb.
   */
  const [compact, setCompact] = useState(false);
  /** The participant the board is already speaking for. */
  const announced = useRef<string | null>(null);
  /** How many times each participant has been called at, for the two liners. */
  const visits = useRef<Record<string, number>>({});
  /**
   * The gateway card being asked about, by hover or by keyboard focus. The
   * network leans towards that journey and the board speaks its steps. A
   * click is still the card's link: the preview is the question, following
   * the link into the documentation is the answer.
   */
  const [intent, setIntent] = useState<string | null>(null);
  const asking = useRef<string | null>(null);
  const askTimer = useRef<number>(0);
  const ask = useCallback((id: string | null) => {
    window.clearTimeout(askTimer.current);
    askTimer.current = window.setTimeout(
      () => {
        asking.current = id;
        setIntent(id);
        if (id === null) {
          // Back to the network's own voice, from the name it rests on.
          announced.current = null;
          setMessage(RESTING);
        }
      },
      id ? ASK_MS : RELEASE_MS,
    );
  }, []);
  useEffect(() => () => window.clearTimeout(askTimer.current), []);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const follow = () => setStill(reduced.matches);
    follow();
    reduced.addEventListener('change', follow);
    return () => reduced.removeEventListener('change', follow);
  }, []);

  useEffect(() => {
    const narrow = window.matchMedia('(max-width: 768px)');
    const follow = () => setCompact(narrow.matches);
    follow();
    narrow.addEventListener('change', follow);
    return () => narrow.removeEventListener('change', follow);
  }, []);

  /**
   * The courier has landed, or the pointer has settled: either way the board
   * has something to say and says it now.
   *
   * A departure does not come through here. Nothing happens on the board while
   * a delivery is crossing: it holds the line it is showing and turns over
   * when the courier arrives, so the flaps are the arrival rather than a
   * commentary on the journey.
   */
  const carrying = useCallback((id: string | null) => {
    // A card is being asked about: the board belongs to its journey.
    if (asking.current) return;
    // The same participant twice running is the same line, and a board already
    // showing a message does not turn for it again. This is also what
    // collapses the repeated releases a moving pointer sends.
    if (announced.current === id) return;
    announced.current = id;
    // Nobody to speak for. A pointer moving across empty canvas is not asking
    // about a participant, so the board answers with the portal's own name
    // instead of holding whichever node it last passed. The walk takes the
    // board back once the pointer has been still long enough.
    if (id === null) {
      setMessage(RESTING);
      return;
    }
    const line = DELIVERED[id];
    if (!line) return;
    if (typeof line === 'string') {
      setMessage(line);
      return;
    }
    const called = visits.current[id] ?? 0;
    visits.current[id] = called + 1;
    setMessage(line[called % line.length]);
  }, []);

  return (
    <section className="landing-hero">
      {/* The network the page is about, drawn behind the words, on a screen
          with room for it and a pointer to drive it.

          No onDepart: a departure changes nothing on the board. The message
          belongs to the arrival, and to a pointer that has settled on a node
          and asked. */}
      {compact ? null : (
        <BrowserOnly>
          {() => (
            <NetworkWeb
              onArrive={still ? undefined : carrying}
              onPoint={still ? undefined : carrying}
              intent={intent}
              onStage={setMessage}
            />
          )}
        </BrowserOnly>
      )}

      <div className="landing-hero__copy">
        {/* The board, and the emblem beside it as the node the record leaves
            from. Not a pill: the mark and the row sit on the same line the
            links behind them run along, so this reads as part of the drawing
            rather than as a label laid over it. */}
        <p className="landing-hero__board">
          <BrandMark />
          <FlapBoard text={message} cells={CELLS} still={still} />
        </p>
        {/* Three lines, set as blocks rather than as `<br>`. A `<br>` hidden
            at narrow widths takes the line break away and leaves nothing in
            its place, which is how "Build on" and "India's" ended up as one
            word. These stay separate elements at every width: blocks while
            there is room, inline with a real space between them when there is
            not. */}
        <Heading as="h1" className="landing-hero__statement">
          <span className="landing-hero__line">Build on</span>{' '}
          <span className="landing-hero__line">India&rsquo;s Interoperable</span>{' '}
          <span className="landing-hero__line">Digital Health Infrastructure</span>
        </Heading>
        <p className="landing-hero__lede">
          Ayushman Bharat Digital Mission
          <br />
          Secure. Private. Robust.
        </p>
        {/* The three gateways are the page's action. Each card names what
            the visitor is trying to do rather than ABDM's own role names
            (HIP, HIU, PHR); the gateway short name is a small label, and
            the full form appears on hover or keyboard focus. */}
        <div className="landing-hero__goals">
          <p className="landing-hero__goals-prompt">What do you want to solve today?</p>
          <TooltipProvider>
            <nav className="landing-hero__goals-list" aria-label="Which gateway you need">
              {gateways.map(({intent, short, full, to}) => (
                <Tooltip key={to}>
                  <TooltipTrigger asChild>
                    <Link
                      to={unfiltered(to)}
                      className="landing-hero__goal"
                      // Pointer, not mouse: Docusaurus's Link sets its own
                      // onMouseEnter for prefetching, after ours, and drops it.
                      onPointerEnter={() => ask(short)}
                      onPointerLeave={() => ask(null)}
                      onFocus={() => ask(short)}
                      onBlur={() => ask(null)}>
                      <span className="landing-hero__goal-intent">{intent}</span>
                      <span className="landing-hero__goal-short">{short}</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>{full}</TooltipContent>
                </Tooltip>
              ))}
            </nav>
          </TooltipProvider>
        </div>
      </div>

      {/* Said while a journey is drawn on the network, because the drawing
          simplifies it: the steps, who they pass through and their order are
          there to explain, not to specify. On the hero's bottom edge, clear of
          the network, as a footnote to the whole screen. Always in the page,
          so it fades rather than appears. */}
      <p
        className="landing-hero__disclaimer"
        data-on={intent && !compact ? '' : undefined}
        aria-hidden={!(intent && !compact)}>
        Illustrative representation only. Actual system interactions, message
        sequences and participants may vary and are governed by the applicable
        ABDM specifications.
      </p>
    </section>
  );
}
