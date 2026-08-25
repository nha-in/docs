import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import NetworkWeb from '@site/src/components/landing/NetworkWeb';
import BrowserOnly from '@docusaurus/BrowserOnly';
import {ArrowRight} from 'lucide-react';

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
  return (
    <Layout
      title="ABDM Developer Portal"
      description="Developer documentation for the Ayushman Bharat Digital Mission gateways: HIE-CM, UHI and NHCX.">
      <main className="landing">
        <section className="landing-hero">
          {/* The network the page is about, drawn behind the words. */}
          <BrowserOnly>{() => <NetworkWeb />}</BrowserOnly>

          <div className="landing-hero__copy">
            <p className="landing-hero__eyebrow">ABDM Developer Portal</p>
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
      </main>
    </Layout>
  );
}
