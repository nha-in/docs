import React from 'react';
import Link from '@docusaurus/Link';
import {House} from 'lucide-react';
import {cn} from '@site/src/lib/utils';
import {
  activeTab,
  isLanding,
  tabHref,
  visibleTabs,
  useRoutePath,
} from '@site/src/config/navigation';

/**
 * Row two of the chrome: the four sections, sticky directly under the top bar.
 * `.docs-tabs` and `.docs-tab` carry the measured 48px strip, the 1px bottom
 * border and the flush accent underline (site/src/css/layout.css).
 */
export default function DocsTabs() {
  const pathname = useRoutePath();
  const current = activeTab(pathname);

  // The landing page is its own thing: one page, no sections to move between.
  if (isLanding(pathname)) {
    return null;
  }

  return (
    <nav className="docs-tabs" aria-label="Documentation sections">
      <Link to="/" className="docs-tab" aria-label="Home" title="Home">
        <House className="size-4" aria-hidden="true" />
      </Link>
      {visibleTabs(pathname).map((tab) => {
        const isActive = tab === current;
        const Icon = tab.icon;
        return (
          <Link
            key={tab.to}
            to={tabHref(tab, pathname)}
            className={cn(
              'docs-tab',
              isActive && 'docs-tab--active',
              Icon && 'docs-tab--feature',
            )}
            aria-current={isActive ? 'page' : undefined}>
            {Icon && <Icon className="docs-tab__icon" aria-hidden="true" />}
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
