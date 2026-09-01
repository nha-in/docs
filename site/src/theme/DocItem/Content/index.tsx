import React from 'react';
import Content from '@theme-original/DocItem/Content';
import type ContentType from '@theme/DocItem/Content';
import type {WrapperProps} from '@docusaurus/types';
import CopyPageMarkdown from '@site/src/components/docs/CopyPageMarkdown';

type Props = WrapperProps<typeof ContentType>;

/**
 * The copy/view-as-markdown buttons sit above every doc article, ahead of
 * the title, so an agent handing the page to another tool sees them first.
 */
export default function ContentWrapper(props: Props): React.ReactNode {
  return (
    <>
      <CopyPageMarkdown />
      <Content {...props} />
    </>
  );
}
