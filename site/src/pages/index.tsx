import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import ThemedImage from '@theme/ThemedImage';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import NetworkWeb from '@site/src/components/landing/NetworkWeb';
import BrowserOnly from '@docusaurus/BrowserOnly';
import {ArrowDown, ArrowRight, ArrowUpRight} from 'lucide-react';

/**
 * The landing page. The first screen holds the statement and the ways in and
 * nothing else. The gateways are a scroll below it, for a reader who wants to
 * compare before choosing.
 */

/** The three places a reader can go, under the one control. */
const ways = [
  {label: 'Overview', to: '/docs/abdm/v3'},
  {label: 'API reference', to: '/docs/abdm/v3/api'},
  {label: 'Gateways', to: '#gateways', samePage: true},
];

const gateways = [
  {
    kind: 'Records and consent',
    name: 'HIE-CM',
    expansion: 'Health Information Exchange and Consent Manager',
    body:
      'Give a patient an ABHA identity, link the records you hold to it, and exchange records with other systems on the patient’s consent.',
    to: '/docs/abdm/v3',
  },
  {
    kind: 'Discovery and booking',
    name: 'UHI',
    expansion: 'Unified Health Interface',
    body:
      'Publish or find a health service on an open network: consultations, ambulances, blood banks, pharmacies.',
    to: '/docs/uhi/v1',
  },
  {
    kind: 'Claims',
    name: 'NHCX',
    expansion: 'National Health Claims Exchange',
    body:
      'Exchange health insurance claims between providers and payers on a common format.',
    to: '/docs/nhcx/v1',
  },
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
            {/* The two official marks: the authority that runs the network,
                and the mission the network belongs to. */}
            <div className="landing-hero__marks">
              <ThemedImage
                className="landing-hero__mark"
                sources={{
                  light: useBaseUrl('img/nha-logo.svg'),
                  dark: useBaseUrl('img/nha-logo-dark.svg'),
                }}
                alt="National Health Authority"
              />
              <ThemedImage
                className="landing-hero__mark"
                sources={{
                  light: useBaseUrl('img/logo.svg'),
                  dark: useBaseUrl('img/logo-dark.svg'),
                }}
                alt="Ayushman Bharat Digital Mission"
              />
            </div>
            <p className="landing-hero__eyebrow">ABDM Developer Portal</p>
            <Heading as="h1" className="landing-hero__statement">
              A health record should follow the person, not the building it was
              written in.
            </Heading>
            <p className="landing-hero__lede">
              The Ayushman Bharat Digital Mission is the network that moves it.
              This is the documentation for the engineer connecting to it.
            </p>
            <Link className="landing-hero__cta" to="/docs/abdm/v3">
              Get started
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>

            <nav className="landing-hero__ways" aria-label="Jump to">
              {ways.map((way) =>
                way.samePage ? (
                  <a key={way.to} href={way.to} className="landing-hero__way">
                    {way.label}
                  </a>
                ) : (
                  <Link key={way.to} to={way.to} className="landing-hero__way">
                    {way.label}
                  </Link>
                ),
              )}
            </nav>
          </div>

          <a className="landing-hero__scroll" href="#gateways">
            <span>The three gateways</span>
            <ArrowDown className="size-4" aria-hidden="true" />
          </a>
        </section>

        <section className="landing-gateways" id="gateways">
          <div className="landing-gateways__head">
            <Heading as="h2" className="landing-gateways__title">
              Three gateways, three different networks
            </Heading>
            <p className="landing-gateways__lede">
              ABDM is not one API. Each gateway has its own roles, its own
              contract and its own guides. Pick the one your product needs.
            </p>
          </div>

          <ul className="landing-gateways__list">
            {gateways.map((gateway) => (
              <li key={gateway.name}>
                <Link to={gateway.to} className="landing-card">
                  <span className="landing-card__kind">{gateway.kind}</span>
                  <span className="landing-card__name">{gateway.name}</span>
                  <span className="landing-card__expansion">
                    {gateway.expansion}
                  </span>
                  <span className="landing-card__body">{gateway.body}</span>
                  <span className="landing-card__go" aria-hidden="true">
                    <ArrowUpRight className="size-4" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </Layout>
  );
}
