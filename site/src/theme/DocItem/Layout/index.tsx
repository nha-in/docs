import React from 'react';
import clsx from 'clsx';
import {useWindowSize} from '@docusaurus/theme-common';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import DocVersionBanner from '@theme/DocVersionBanner';
import DocVersionBadge from '@theme/DocVersionBadge';
import DocItemFooter from '@theme/DocItem/Footer';
import DocItemTOCMobile from '@theme/DocItem/TOC/Mobile';
import DocItemTOCDesktop from '@theme/DocItem/TOC/Desktop';
import DocItemContent from '@theme/DocItem/Content';
import DocBreadcrumbs from '@theme/DocBreadcrumbs';
import ContentVisibility from '@theme/ContentVisibility';
import PageNext from '@site/src/components/docs/PageNext';
import type {Props} from '@theme/DocItem/Layout';

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
 * The article column. The line above the title is the breadcrumb trail rather
 * than a single section name: the tree runs four levels deep under Registries,
 * and the reader needs the whole path, not the nearest parent.
 */
export default function DocItemLayout({children}: Props): React.ReactNode {
  const docTOC = useDocTOC();
  const {metadata, frontMatter} = useDoc();
  // A page asks for a different frame with `wrapperClassName`. The API
  // reference pages use it to widen the column for their request panel.
  // `wrapperClassName` is a Docusaurus frontmatter field that the DocFrontMatter
  // type does not declare, so read it through an index access.
  const declared = (frontMatter as Record<string, unknown>).wrapperClassName;
  const wrapperClassName = typeof declared === 'string' ? declared : undefined;

  return (
    <div className={clsx('docs-article-row', wrapperClassName)}>
      <div className="docs-article-main">
        <ContentVisibility metadata={metadata} />
        <DocVersionBanner />
        <div className="docs-content">
          <article>
            <DocBreadcrumbs />
            <DocVersionBadge />
            {docTOC.mobile}
            <DocItemContent>{children}</DocItemContent>
            <DocItemFooter />
          </article>
          {/* One foot on every page: the next page by name, and the rest of
              its section. See components/docs/PageNext. */}
          <PageNext />
        </div>
      </div>
      {docTOC.desktop && <div className="docs-toc-col">{docTOC.desktop}</div>}
    </div>
  );
}
