import React from 'react';
import Link from '@docusaurus/Link';
import {useLocation} from '@docusaurus/router';
import {cn} from '@site/src/lib/utils';
import {activeTab, tabHref, tabs} from '@site/src/config/navigation';

/**
 * Row two of the chrome: the four sections, sticky directly under the top bar.
 * `.docs-tabs` and `.docs-tab` carry the measured 48px strip, the 1px bottom
 * border and the flush accent underline (site/src/css/layout.css).
 */
export default function DocsTabs() {
  const {pathname} = useLocation();
  const current = activeTab(pathname);

  // The landing page is its own thing: one page, no sections to move between.
  if (pathname === '/' || pathname === '/index.html') {
    return null;
  }

  return (
    <nav className="docs-tabs" aria-label="Documentation sections">
      {tabs.map((tab) => {
        const isActive = tab === current;
        return (
          <Link
            key={tab.to}
            to={tabHref(tab, pathname)}
            className={cn('docs-tab', isActive && 'docs-tab--active')}
            aria-current={isActive ? 'page' : undefined}>
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
