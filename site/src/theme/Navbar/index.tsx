import React from 'react';
import TopBar from '@site/src/components/chrome/TopBar';
import DocsTabs from '@site/src/components/chrome/DocsTabs';
import MobileNav from '@site/src/components/chrome/MobileNav';

/**
 * Replaces the classic navbar with the two-row chrome: a 64px bar and a 48px
 * tab strip. Both are siblings of the main wrapper, so both stick against the
 * document scroll and together fill `--chrome-height`, the offset the doc
 * sidebar and the on-this-page rail already sit under.
 */
export default function Navbar() {
  return (
    <>
      <TopBar />
      <DocsTabs />
      {/* Narrow widths only: the tab strip gives way to this. */}
      <MobileNav />
    </>
  );
}
