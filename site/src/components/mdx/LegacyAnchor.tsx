import React from 'react';
import useBrokenLinks from '@docusaurus/useBrokenLinks';

export type LegacyAnchorProps = {
  /** The heading id this section used to have. */
  id: string;
};

/**
 * Keeps a renamed heading's old fragment working.
 *
 * A fragment never reaches the server, so no redirect rule can catch one:
 * `plugin-client-redirects` moves routes, and `#journey-2-...` is not part of
 * the route. The only thing that still resolves an old fragment is an element
 * on the page carrying that id, which is what this renders.
 *
 * It is a component rather than a bare `<a id>` in the MDX because the page
 * markdown an agent reads is built from the source, and raw HTML survives
 * that pass while a capitalised component does not. Written by hand, the
 * anchor and its explanation landed in the middle of the markdown; written
 * as this, the HTML carries the anchor and the markdown carries nothing.
 */
export default function LegacyAnchor({id}: LegacyAnchorProps): React.ReactNode {
  // Registered so the build's anchor check knows the fragment exists: an id
  // written as raw HTML in MDX is rendered but never collected.
  useBrokenLinks().collectAnchor(id);
  return <a id={id} aria-hidden="true" />;
}
