import React from 'react';
import Footer from '@theme-original/Footer';
import {isLanding, useRoutePath} from '@site/src/config/navigation';

/**
 * The site map at the foot of every page, except the landing page.
 *
 * That page is one screen with one gesture: scrolling down hands off to the
 * API references. A footer under it gave the scroll somewhere else to go, so
 * the first flick of the wheel revealed a column of links instead of leaving,
 * which read as the page fighting the reader.
 */
export default function FooterWrapper(): React.ReactNode {
  const pathname = useRoutePath();
  if (isLanding(pathname)) {
    return null;
  }
  return <Footer />;
}
