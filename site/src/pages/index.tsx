import type {ReactNode} from 'react';
import {useCallback, useEffect, useRef} from 'react';
import Link from '@docusaurus/Link';
import {useHistory} from '@docusaurus/router';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import NetworkWeb from '@site/src/components/landing/NetworkWeb';
import BrandMark from '@site/src/components/chrome/BrandMark';
import BrowserOnly from '@docusaurus/BrowserOnly';
import {ChevronDown} from 'lucide-react';

/** Where a scroll past the statement takes the reader. */
const API_REFERENCE = '/docs/hiecm/v3/api';

/** The three gateways, as text separated by interpuncts (see home.css). */
const ways = [
  {label: 'HIE-CM', to: '/docs/hiecm/v3'},
  {label: 'UHI', to: '/docs/uhi/v1'},
  {label: 'NHCX', to: '/docs/nhcx/v1'},
];

/**
 * The landing page is one screen, and leaving it goes to the API references.
 *
 * The exit is a scroll, because that is what the reader was going to do
 * anyway: pressing Get started runs the page down to the bottom of the cue
 * below the hero, and the route changes when it gets there. The button
 * therefore does visibly the same thing the gesture does, rather than being a
 * second, different way out.
 *
 * The `scroll` listener catches the manual gesture. `wheel` fires per device
 * with wildly different deltas; `scrollY` is the one number every input
 * method agrees on, keyboard and dragged scrollbar included. Either path ends
 * in the same place, and `leaving` makes sure only the first one counts.
 *
 * A timeout, not a `scrollend` listener: Safari did not ship `scrollend`, and
 * a reader whose system asks for reduced motion gets an instant jump with no
 * end event to wait for. The route change must not depend on either.
 */
function useScrollHandoff(): () => void {
  const history = useHistory();
  const leaving = useRef(false);

  const leave = useCallback(() => {
    if (leaving.current) return;
    leaving.current = true;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduced) {
      window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'});
    }
    window.setTimeout(
      () => {
        // The reference page opens at its own top, not part way down it: a
        // route change does not reset scroll the way a page load does.
        window.scrollTo(0, 0);
        history.push(API_REFERENCE);
      },
      reduced ? 0 : 420,
    );
  }, [history]);

  useEffect(() => {
    const onScroll = () => {
      // 24px: past the settle after load and past touch jitter, but reached
      // by the first real scroll of any input device.
      if (window.scrollY > 24) leave();
    };
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, [leave]);

  return leave;
}

export default function Home(): ReactNode {
  const leave = useScrollHandoff();

  return (
    <Layout
      title="ABDM Developer Portal"
      description="Developer documentation for the Ayushman Bharat Digital Mission gateways: HIE-CM, UHI and NHCX.">
      <main className="landing">
        <section className="landing-hero">
          {/* The network the page is about, drawn behind the words. */}
          <BrowserOnly>{() => <NetworkWeb />}</BrowserOnly>

          <div className="landing-hero__copy">
            <p className="brand-chip brand-chip--eyebrow">
              <BrandMark />
              <span className="landing-hero__eyebrow">ABDM Developer Portal</span>
            </p>
            {/* The three lines are set here rather than left to the measure:
                the break after "Build on" is the point of the sentence. They
                fold back into a natural wrap under 768px, where the longest
                line does not fit. */}
            <Heading as="h1" className="landing-hero__statement">
              Build on
              <br />
              India&rsquo;s Interoperable
              <br />
              Digital Health Infrastructure
            </Heading>
            <p className="landing-hero__lede">
              Ayushman Bharat Digital Mission
              <br />
              Secure. Private. Robust.
            </p>
            {/* Get started does what a scroll does, so it is a button rather
                than a link: it carries the reader down to the references
                through the same transition, instead of jumping to a different
                page than the gesture beside it. The arrow is gone with the
                link, because it pointed sideways at a destination this no
                longer goes to. */}
            <button type="button" className="landing-hero__cta" onClick={leave}>
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

          {/* The scroll is the page's main gesture, so it is advertised. */}
          <button
            type="button"
            className="landing-scroll-hint"
            onClick={leave}
            aria-label="Go to the API references">
            <ChevronDown className="size-5" aria-hidden="true" />
          </button>
        </section>

        {/* Scroll room, nothing else: somewhere for a real scroll to travel
            before the handoff fires. Not meant to be seen. */}
        <div className="landing-scroll-cue" aria-hidden="true" />
      </main>
    </Layout>
  );
}
