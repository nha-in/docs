import React from 'react';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import BrowserOnly from '@docusaurus/BrowserOnly';
import {ChevronDown} from 'lucide-react';
import NetworkWeb from '@site/src/components/landing/NetworkWeb';
import BrandMark from '@site/src/components/chrome/BrandMark';
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
    intent: 'I have health records to share',
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
 * The statement, the one control and the three gateways.
 *
 * Markup only. What lifts it off the references page underneath is the
 * curtain that renders it (components/landing/LandingCurtain).
 */
export default function LandingHero({
  onLift,
}: {
  /** Runs the same lift the scroll gesture runs. */
  onLift: () => void;
}): React.ReactNode {
  return (
    <section className="landing-hero">
      {/* The network the page is about, drawn behind the words. */}
      <BrowserOnly>{() => <NetworkWeb />}</BrowserOnly>

      <div className="landing-hero__copy">
        <p className="brand-chip brand-chip--eyebrow">
          <BrandMark />
          <span className="landing-hero__eyebrow">ABDM Developer Portal</span>
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
        {/* One action, and it goes straight to the docs get-started page,
            the same place the scroll gesture lands. */}
        <Link className="landing-hero__cta" to="/docs/hiecm/v3">
          Get started
        </Link>

        {/* The gateway question, asked as intent rather than as ABDM's own
            role names (HIP, HIU, PHR). Each card names what the visitor is
            trying to do; the gateway short name is a small label, and the
            full form only appears on hover or keyboard focus. */}
        <div className="landing-hero__goals">
          <p className="landing-hero__goals-prompt">What are you building?</p>
          <TooltipProvider>
            <nav className="landing-hero__goals-list" aria-label="Which gateway you need">
              {gateways.map(({intent, short, full, to}) => (
                <Tooltip key={to}>
                  <TooltipTrigger asChild>
                    <Link to={to} className="landing-hero__goal">
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

      {/* The lift is the page's main gesture, so it is advertised. */}
      <button
        type="button"
        className="landing-scroll-hint"
        onClick={onLift}
        aria-label="Show the documentation">
        <ChevronDown className="size-5" aria-hidden="true" />
      </button>
    </section>
  );
}
