import React from 'react';
import Link from '@docusaurus/Link';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import {useDocsSidebar} from '@docusaurus/plugin-content-docs/client';
import {ArrowRight} from 'lucide-react';

type SidebarItem = {
  type: string;
  label?: string;
  href?: string;
  items?: SidebarItem[];
};

/**
 * Every page in the same sidebar category as this one, in sidebar order. The
 * tree is walked rather than flattened once, because a category's own link
 * page belongs to the category above it, not to the one it opens.
 */
function siblingsOf(items: SidebarItem[], href: string): SidebarItem[] {
  const pages = items.filter((item) => item.type === 'link' && item.href);
  if (pages.some((page) => page.href === href)) {
    return pages;
  }
  for (const item of items) {
    if (item.items) {
      const found = siblingsOf(item.items, href);
      if (found.length) {
        return found;
      }
    }
  }
  return [];
}

/**
 * The foot of every documentation page: the next page by name, and the rest of
 * the section around it.
 *
 * Both come from the sidebar, not from the page, so no page has to remember to
 * carry one and none of them can drift out of order. This replaces the theme's
 * previous/next pair, which named two pages without saying what either was.
 */
export default function PageNext(): React.ReactNode {
  const {metadata} = useDoc();
  const sidebar = useDocsSidebar();
  const next = metadata.next;

  const siblings = sidebar
    ? siblingsOf(sidebar.items as SidebarItem[], metadata.permalink)
    : [];
  const nearby = siblings
    .filter(
      (page) => page.href !== metadata.permalink && page.href !== next?.permalink,
    )
    .slice(0, 4);

  if (!next && !nearby.length) {
    return null;
  }

  return (
    <nav className="page-next" aria-label="Where to go next">
      {next ? (
        <Link to={next.permalink} className="next-step card">
          <span className="next-step__eyebrow">Next</span>
          <span className="next-step__label">
            {next.title}
            <ArrowRight className="size-4" aria-hidden="true" />
          </span>
        </Link>
      ) : null}

      {nearby.length ? (
        <div className="page-next__nearby">
          <p className="page-next__heading">Also in this section</p>
          <ul className="page-next__links">
            {nearby.map((page) => (
              <li key={page.href}>
                <Link to={page.href!} className="page-next__link card">
                  {page.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </nav>
  );
}
