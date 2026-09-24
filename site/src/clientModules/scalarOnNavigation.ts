/**
 * Loads a Scalar reference page in full when the reader reaches it by a
 * client-side link.
 *
 * scalarOnReferencePagesOnly() in docusaurus.config.ts strips the Scalar
 * bundle from every built page except /reference/<spec>, so that 400 pages do
 * not carry a 1 MB script they cannot use. The bundle then arrives only with
 * a full page load. A link from a docs page to /reference/<spec> is a
 * client-side navigation, which loads no new script: the reference component
 * found no `window.Scalar`, returned early, and the page stayed blank (NHA
 * review, #7 and #29).
 *
 * So when a client-side navigation lands on a reference route and the bundle
 * is not in the page, the browser reloads that address. The server's HTML for
 * it carries the bundle, and the reference renders. In `docusaurus start` the
 * bundle is never stripped, so this does nothing there.
 */
import type {ClientModule} from '@docusaurus/types';

// /reference/<spec> at the site root, under any base path. The hand written
// pages at /docs/<gateway>/<version>/reference/... mount no Scalar reference.
const isScalarRoute = (pathname: string): boolean =>
  !pathname.includes('/docs/') && /\/reference\/[^/]+\/?$/.test(pathname);

const clientModule: ClientModule = {
  onRouteUpdate({location, previousLocation}) {
    // The first load has no previous location and is a full load already.
    if (!previousLocation || typeof window === 'undefined') return;
    if (location.pathname === previousLocation.pathname) return;
    if (!isScalarRoute(location.pathname)) return;
    if ((window as {Scalar?: unknown}).Scalar) return;
    window.location.reload();
  },
};

export default clientModule;
