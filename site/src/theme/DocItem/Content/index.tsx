import React, {useEffect, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import Content from '@theme-original/DocItem/Content';
import type ContentType from '@theme/DocItem/Content';
import type {WrapperProps} from '@docusaurus/types';
import PageActions from '@site/src/components/docs/PageActions';

type Props = WrapperProps<typeof ContentType>;

/**
 * The page actions sit under the lede: after the H1 and the first paragraph
 * that follows it, above the body. Content renders the title and the MDX
 * body as one unit, so there is no prop to slot a row in at that point.
 * Instead, once mounted, a host element is inserted into the article right
 * after the lede and the actions are portalled into it. React owns the
 * portal's children, so navigation and unmounting stay clean.
 *
 * Nothing renders on the server; the row appears on hydration. A page with
 * no H1 in its body gets the row before the first element instead.
 */
export default function ContentWrapper(props: Props): React.ReactNode {
  const root = useRef<HTMLDivElement>(null);
  const [host, setHost] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const article = root.current?.querySelector<HTMLElement>('.markdown');
    if (!article) return undefined;
    const h1 = article.querySelector('h1');
    // The body H1 is wrapped in a <header>; the lede is the element after
    // that wrapper, not after the H1 itself.
    const titleBlock = h1?.parentElement?.tagName === 'HEADER' ? h1.parentElement : h1;
    const next = titleBlock?.nextElementSibling;
    const anchor =
      next && next.tagName === 'P' ? next : (titleBlock ?? article.firstElementChild);
    const slot = document.createElement('div');
    slot.className = 'page-actions-slot';
    if (anchor) anchor.insertAdjacentElement('afterend', slot);
    else article.prepend(slot);
    setHost(slot);
    return () => {
      slot.remove();
      setHost(null);
    };
  }, [props.children]);

  return (
    <div ref={root}>
      <Content {...props} />
      {host ? createPortal(<PageActions />, host) : null}
    </div>
  );
}
