import React from 'react';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import BrowserOnly from '@docusaurus/BrowserOnly';
import {ChevronDown} from 'lucide-react';
import NetworkWeb from '@site/src/components/landing/NetworkWeb';
import BrandMark from '@site/src/components/chrome/BrandMark';

/** The three gateways, as text separated by interpuncts (see home.css). */
const ways = [
  {label: 'HIE-CM', to: '/docs/hiecm/v3'},
  {label: 'UHI', to: '/docs/uhi/v1'},
  {label: 'NHCX', to: '/docs/nhcx/v1'},
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
        <button type="button" className="landing-hero__cta" onClick={onLift}>
          Get started
        </button>

        <nav className="landing-hero__ways" aria-label="The three gateways">
          {ways.map(({label, to}) => (
            <Link key={to} to={to} className="landing-hero__way">
              {label}
            </Link>
          ))}
        </nav>
      </div>

      {/* The lift is the page's main gesture, so it is advertised. */}
      <button
        type="button"
        className="landing-scroll-hint"
        onClick={onLift}
        aria-label="Show the API references">
        <ChevronDown className="size-5" aria-hidden="true" />
      </button>
    </section>
  );
}
