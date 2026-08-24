import React from 'react';
import {useLocation} from '@docusaurus/router';
import {useWindowSize} from '@docusaurus/theme-common';
import {
  findSidebarCategory,
  isActiveSidebarItem,
  useDoc,
  useDocsSidebar,
} from '@docusaurus/plugin-content-docs/client';
import DocItemPaginator from '@theme/DocItem/Paginator';
import DocVersionBanner from '@theme/DocVersionBanner';
import DocVersionBadge from '@theme/DocVersionBadge';
import DocItemFooter from '@theme/DocItem/Footer';
import DocItemTOCMobile from '@theme/DocItem/TOC/Mobile';
import DocItemTOCDesktop from '@theme/DocItem/TOC/Desktop';
import DocItemContent from '@theme/DocItem/Content';
import ContentVisibility from '@theme/ContentVisibility';
import type {Props} from '@theme/DocItem/Layout';
import PageActions from '@site/src/components/docs/PageActions';
import {activeTab} from '@site/src/config/navigation';

/** Decide if the toc should be rendered, on mobile or desktop viewports. */
function useDocTOC() {
  const {frontMatter, toc} = useDoc();
  const windowSize = useWindowSize();
  const hidden = frontMatter.hide_table_of_contents;
  const canRender = !hidden && toc.length > 0;
  const mobile = canRender ? <DocItemTOCMobile /> : undefined;
  const desktop =
    canRender && (windowSize === 'desktop' || windowSize === 'ssr') ? (
      <DocItemTOCDesktop />
    ) : undefined;
  return {hidden, mobile, desktop};
}

/**
 * The line above the title: the section this page sits in. Preference is the
 * sidebar category that contains the page; failing that, the tab it belongs
 * to. Nothing is rendered when neither is available, or when the name would
 * just repeat the title.
 */
function useEyebrow(): string | undefined {
  const sidebar = useDocsSidebar();
  const {pathname} = useLocation();
  const {metadata} = useDoc();
  const category = sidebar
    ? findSidebarCategory(sidebar.items, (item) =>
        isActiveSidebarItem(item, pathname),
      )
    : undefined;
  const label = category?.label ?? activeTab(pathname)?.label;
  return label && label.toLowerCase() !== metadata.title.toLowerCase()
    ? label
    : undefined;
}

export default function DocItemLayout({children}: Props): React.ReactNode {
  const docTOC = useDocTOC();
  const {metadata} = useDoc();
  const eyebrow = useEyebrow();

  return (
    <div className="docs-article-row">
      <div className="docs-article-main">
        <ContentVisibility metadata={metadata} />
        <DocVersionBanner />
        <div className="docs-content">
          <article>
            <DocVersionBadge />
            {docTOC.mobile}
            {eyebrow && <p className="docs-eyebrow">{eyebrow}</p>}
            <PageActions />
            <DocItemContent>{children}</DocItemContent>
            <DocItemFooter />
          </article>
          <DocItemPaginator />
        </div>
      </div>
      {docTOC.desktop && <div className="docs-toc-col">{docTOC.desktop}</div>}
    </div>
  );
}
