import React, {useId, type ReactNode} from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import {isSamePath} from '@docusaurus/theme-common/internal';
import {useVisibleSidebarItems} from '@docusaurus/plugin-content-docs/client';
import Link from '@docusaurus/Link';
import DocSidebarItems from '@theme/DocSidebarItems';
import Original from '@theme-original/DocSidebarItem/Category';
import type {Props} from '@theme/DocSidebarItem/Category';

/**
 * On the reference site a top level sidebar category is a section header, not a
 * row: static text, no caret, no hover surface, always expanded, its children
 * are the links. Docusaurus renders it as a collapsible <a role="button">, so
 * that one case is replaced here. Every deeper level keeps the original
 * collapsible behaviour.
 *
 * A category that has its own page (`_category_.json` `link`) keeps that page
 * reachable: the header itself is the link, because the page appears nowhere
 * else in the sidebar. `linkUnlisted` mirrors the original's rule that an
 * unlisted category page is not linked.
 */
export default function DocSidebarItemCategory(props: Props): ReactNode {
  const {item, level, activePath, onItemClick} = props;
  const headingId = useId();
  // A category with no visible children is rendered as a plain link upstream.
  const visibleChildren = useVisibleSidebarItems(item.items, activePath);

  if (level !== 1 || visibleChildren.length === 0) {
    return <Original {...props} />;
  }

  const href = item.linkUnlisted ? undefined : item.href;
  const isCurrentPage = isSamePath(href, activePath);
  const titleClassName = clsx(
    'docs-sidebar-section__title',
    isCurrentPage && 'docs-sidebar-section__title--active',
  );

  return (
    <li
      className={clsx(
        ThemeClassNames.docs.docSidebarItemCategory,
        ThemeClassNames.docs.docSidebarItemCategoryLevel(level),
        'menu__list-item',
        'docs-sidebar-section',
        item.className,
      )}>
      {href ? (
        <Link
          id={headingId}
          className={titleClassName}
          href={href}
          aria-current={isCurrentPage ? 'page' : undefined}
          onClick={() => onItemClick?.(item)}>
          {item.label}
        </Link>
      ) : (
        <div id={headingId} className={titleClassName}>
          {item.label}
        </div>
      )}
      <ul className="menu__list" aria-labelledby={headingId}>
        <DocSidebarItems
          items={item.items}
          activePath={activePath}
          onItemClick={onItemClick}
          level={level + 1}
        />
      </ul>
    </li>
  );
}
