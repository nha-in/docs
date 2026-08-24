import React from 'react';
import clsx from 'clsx';
import TOCItems from '@theme/TOCItems';
import type {Props} from '@theme/TOC';

// A custom class name, so TOCInline and TOCCollapsible are not highlighted by
// mistake. Same contract as the classic theme.
const LINK_CLASS_NAME = 'table-of-contents__link toc-highlight';
const LINK_ACTIVE_CLASS_NAME = 'table-of-contents__link--active';

export default function TOC({className, ...props}: Props): React.ReactNode {
  return (
    <nav
      aria-labelledby="docs-toc-heading"
      className={clsx('docs-toc', 'thin-scrollbar', className)}>
      <p id="docs-toc-heading" className="docs-toc-heading">
        On this page
      </p>
      <TOCItems
        {...props}
        linkClassName={LINK_CLASS_NAME}
        linkActiveClassName={LINK_ACTIVE_CLASS_NAME}
      />
    </nav>
  );
}
