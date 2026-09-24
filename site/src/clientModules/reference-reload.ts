/**
 * A reference page needs a full page load.
 *
 * The build strips the Scalar bundle from every page except the /reference/*
 * pages (see scalar-on-reference-pages-only in docusaurus.config.ts), so the
 * bundle only arrives when a reference page is the document the browser
 * loaded. A link clicked inside the site is a client side route change: the
 * reference route renders, the bundle never loads, and the page is blank.
 * Every in-site link into a reference, from a docs page, the navbar, search or
 * a card, reached a blank page that way; opening the same URL directly worked.
 *
 * So when the router lands on a reference page by a client side transition,
 * load that URL again as a document. The first load of a page is not a
 * transition and is left alone.
 */
import type {ClientModule} from '@docusaurus/types';

const REFERENCE = /\/reference\/[^/]+\/?$/;

const clientModule: ClientModule = {
  onRouteUpdate({location, previousLocation}) {
    if (!previousLocation || previousLocation.pathname === location.pathname) return;
    if (!REFERENCE.test(location.pathname) || location.pathname.includes('/docs/')) return;
    window.location.assign(location.pathname + location.search + location.hash);
  },
};

export default clientModule;
