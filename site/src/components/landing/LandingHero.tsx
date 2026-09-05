import React, {useCallback, useEffect, useRef, useState} from 'react';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import BrowserOnly from '@docusaurus/BrowserOnly';
import NetworkWeb from '@site/src/components/landing/NetworkWeb';
import FlapBoard from '@site/src/components/landing/FlapBoard';
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

/**
 * What the board says when a record lands somewhere, by who received it.
 *
 * Not a rotation on a timer. The message names what the network just did, so
 * whichever one the board happens to be resting on is true of the crossing
 * the reader watched rather than being whatever the clock landed on. Every
 * line is a capability of ABDM, said as an outcome, because a first time
 * visitor does not yet have the vocabulary the documentation uses.
 */
const DELIVERED: Record<string, string> = {
  citizen: 'Unique health identity',
  phr: 'Your records, in one place',
  hospital: 'Interoperable medical records',
  doctor: 'History at the point of care',
  lab: 'Reports that reach you',
  pharmacy: 'Prescriptions that travel',
  insurer: 'Faster insurance claims',
  nha: 'Unified health services',
};

/** What the board rests on. The site's own name is the idle state. */
const RESTING = 'ABDM Developer Portal';

/** Wide enough for the longest line above, so the flaps never resize. */
const CELLS = Math.max(
  RESTING.length,
  ...Object.values(DELIVERED).map((line) => line.length),
);

/** How long the network stays quiet before the board falls back to the name. */
const SETTLE_MS = 4200;

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
  const quiet = useRef<number | undefined>(undefined);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const follow = () => setStill(reduced.matches);
    follow();
    reduced.addEventListener('change', follow);
    return () => {
      reduced.removeEventListener('change', follow);
      window.clearTimeout(quiet.current);
    };
  }, []);

  // A record landed. Say what that was, then fall back to the name once the
  // network has been quiet for a moment, so the resting state is the site's
  // own identity rather than whichever message happened to be last.
  const delivered = useCallback((id: string) => {
    const line = DELIVERED[id];
    if (!line) return;
    setMessage(line);
    window.clearTimeout(quiet.current);
    quiet.current = window.setTimeout(() => setMessage(RESTING), SETTLE_MS);
  }, []);

  return (
    <section className="landing-hero">
      {/* The network the page is about, drawn behind the words. */}
      <BrowserOnly>
        {() => <NetworkWeb onArrive={still ? undefined : delivered} />}
      </BrowserOnly>

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
                    <Link to={unfiltered(to)} className="landing-hero__goal">
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

    </section>
  );
}
