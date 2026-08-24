import type {ReactNode} from 'react';
import {Redirect} from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';

/**
 * The portal has no separate marketing page. The overview page is the landing
 * page, the same way the reference documentation site lands on its overview.
 */
export default function Home(): ReactNode {
  return <Redirect to={useBaseUrl('/docs/overview')} />;
}
