import React from 'react';
import Footer from '@theme-original/DocItem/Footer';
import {useDoc} from '@docusaurus/plugin-content-docs/client';

/**
 * The classic footer keeps the tags row and the edit/last-updated row. A page
 * whose front matter sets `hide_last_update: true` drops that row: on a
 * generated or data page such as the error code tables, the date is the last
 * build, not a change a reader should weigh.
 */
export default function DocItemFooter(): React.ReactNode {
  const {frontMatter} = useDoc();
  if ((frontMatter as {hide_last_update?: boolean}).hide_last_update) {
    return null;
  }
  return <Footer />;
}
