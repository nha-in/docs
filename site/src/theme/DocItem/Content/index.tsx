import React from 'react';
import Content from '@theme-original/DocItem/Content';
import type ContentType from '@theme/DocItem/Content';
import type {WrapperProps} from '@docusaurus/types';
import PageActions from '@site/src/components/docs/PageActions';

type Props = WrapperProps<typeof ContentType>;

/**
 * The page actions (copy as markdown, view as markdown, open in an external
 * assistant, ask this site's own assistant) belong on the H1's row, top
 * right. Content owns the title internally (breadcrumbs, then the version
 * badge, then the H1), so there is no seam to render this control inside
 * that row from here; `.docs-page-actions-row` gives it a positioning
 * context instead and CSS pins it over the top-right corner. See
 * docitem.css.
 */
export default function ContentWrapper(props: Props): React.ReactNode {
  return (
    <div className="docs-page-actions-row">
      <PageActions />
      <Content {...props} />
    </div>
  );
}
