import type {ReactNode} from 'react';
import Layout from '@theme/Layout';

/**
 * The landing route.
 *
 * The page itself is empty: what a reader sees at `/` is the curtain, drawn
 * by the theme Root (components/landing/LandingCurtain) so that it can outlive
 * the route change it makes. Keeping the hero here instead would unmount it at
 * the moment the references are pushed underneath, and the curtain would
 * vanish rather than lift.
 */
export default function Home(): ReactNode {
  return (
    <Layout
      title="ABDM Developer Portal"
      description="Developer documentation for the Ayushman Bharat Digital Mission gateways: HIE-CM, UHI and NHCX.">
      <main className="landing" />
    </Layout>
  );
}
