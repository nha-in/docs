import type {ReactNode} from 'react';
import {useEffect} from 'react';
import Link from '@docusaurus/Link';
import {useHistory} from '@docusaurus/router';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import NetworkWeb from '@site/src/components/landing/NetworkWeb';
import BrandMark from '@site/src/components/chrome/BrandMark';
import BrowserOnly from '@docusaurus/BrowserOnly';
import {ArrowRight} from 'lucide-react';

/** Where a scroll past the statement takes the reader: the API references,
 * the landing page's own next screen away from a choice. */
const API_REFERENCE = '/docs/hiecm/v3/api';

/**
 * Scrolling past the one screen the hero occupies reads as intent, the same
 * way it does on the sites this page borrows its shape from: not a request
 * for more hero, a request for the next thing. There is no second screen of
 * landing content to scroll into, so the gesture carries the reader straight
 * into the API references instead of dead-ending on blank page.
 *
 * A `scroll` listener, not `wheel`: `wheel` fires per device with wildly
 * different deltas (a trackpad flick and a mouse click-wheel are not the same
 * gesture), while `scrollY` is the one number every input method, including a
 * keyboard or a dragged scrollbar, agrees on. The threshold is small enough
 * to fire on the first real scroll and large enough that the page settling
 * after load, or a stray pixel of touch jitter, does not count as one.
 */
function useScrollsIntoReference(): void {
  const history = useHistory();
  useEffect(() => {
    let navigated = false;
    const threshold = 24;
    const onScroll = () => {
      if (navigated || window.scrollY <= threshold) {
        return;
      }
      navigated = true;
      window.removeEventListener('scroll', onScroll);
      // Land at the top of the reference page, not part way down it: a route
      // change does not reset scroll position the way a full page load does,
      // so without this the new page opens already scrolled by the same
      // amount that triggered the navigation.
      window.scrollTo(0, 0);
      history.push(API_REFERENCE);
    };
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, [history]);
}

/**
 * The landing page: one screen, holding the statement, the one control and the
 * three gateways, and nothing else. The two official marks sit in the bar, top
 * left.
 *
 * The gateways used to be a second screen of cards below the fold. They are
 * the only choice this page asks a reader to make, so they are on it rather
 * than under it, as the three ways in beneath Get started.
 */
const ways = [
  {label: 'HIE-CM', to: '/docs/hiecm/v3'},
  {label: 'UHI', to: '/docs/uhi/v1'},
  {label: 'NHCX', to: '/docs/nhcx/v1'},
];

export default function Home(): ReactNode {
  useScrollsIntoReference();
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
            <Link className="landing-hero__cta" to="/docs/hiecm/v3">
              Get started
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>

            <nav className="landing-hero__ways" aria-label="The three gateways">
              {ways.map((way) => (
                <Link key={way.to} to={way.to} className="landing-hero__way">
                  {way.label}
                </Link>
              ))}
            </nav>
          </div>

        </section>

        {/* Scroll room, nothing else. The reader crosses into it and the
            effect above carries them into the API references before they see
            what, if anything, is down here. */}
        <div className="landing-scroll-cue" aria-hidden="true" />
      </main>
    </Layout>
  );
}
