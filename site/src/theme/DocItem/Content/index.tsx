import React, {useEffect, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import Content from '@theme-original/DocItem/Content';
import type ContentType from '@theme/DocItem/Content';
import type {WrapperProps} from '@docusaurus/types';
import PageActions from '@site/src/components/docs/PageActions';

type Props = WrapperProps<typeof ContentType>;

/**
 * Open a rendered mermaid diagram in its own tab at its natural size. The
 * diagram in the page is scaled to fit the column (site/src/css/mdx.css),
 * which keeps the shape readable and the labels small; this is the way back
 * to the labels. The svg is copied out with its viewBox as its size, so the
 * new tab shows it at the size mermaid drew it.
 */
function openFullSize(box: HTMLElement): void {
  const svg = box.querySelector('svg');
  if (!svg) return;
  const copy = svg.cloneNode(true) as SVGSVGElement;
  copy.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  const [, , w, h] = (copy.getAttribute('viewBox') ?? '').split(/\s+/);
  if (w && h) {
    copy.setAttribute('width', w);
    copy.setAttribute('height', h);
  }
  copy.style.maxWidth = '';
  const url = URL.createObjectURL(
    new Blob([new XMLSerializer().serializeToString(copy)], {type: 'image/svg+xml'}),
  );
  window.open(url, '_blank', 'noopener');
  // ponytail: one minute is past any tab open; revoke so blobs do not pile up.
  window.setTimeout(() => URL.revokeObjectURL(url), 60000);
}

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

  /**
   * A mermaid diagram that scrolls has to be reachable by a keyboard.
   *
   * On a narrow screen the diagram keeps its own size and its box scrolls
   * (site/src/css/mdx.css), which a mouse can do and a keyboard cannot: a
   * scroll container is only focusable if something says so, and Docusaurus
   * renders the container itself with no role, no label and no tab stop. So a
   * reader on a phone with a keyboard, or anyone using a screen reader, was
   * told there was a diagram and given no way to see the half of it that was
   * off screen. WCAG 2.1 SC 2.1.1.
   *
   * Tagged here rather than in the mermaid component because the container is
   * Docusaurus' own markup and this wrapper already owns reaching into the
   * rendered article.
   */
  useEffect(() => {
    const article = root.current;
    if (!article) return undefined;
    const tag = () => {
      for (const box of article.querySelectorAll<HTMLElement>(
        '.docusaurus-mermaid-container',
      )) {
        if (box.dataset.scrollable === 'true') continue;
        box.dataset.scrollable = 'true';
        box.setAttribute('role', 'region');
        box.setAttribute('tabindex', '0');
        box.setAttribute('aria-label', 'Diagram. Double-click or press Enter to open at full size');
        box.addEventListener('dblclick', () => openFullSize(box));
        box.addEventListener('keydown', (event) => {
          if (event.key === 'Enter') openFullSize(box);
        });
      }
    };
    // Mermaid renders its diagrams asynchronously, so the containers do not
    // exist on this effect's first pass and tagging once found nothing. The
    // observer catches them whenever they arrive, and the data attribute keeps
    // the work to each container once.
    tag();
    const watch = new MutationObserver(tag);
    watch.observe(article, {childList: true, subtree: true});
    return () => watch.disconnect();
  }, [props.children]);

  return (
    <div ref={root}>
      <Content {...props} />
      {host ? createPortal(<PageActions />, host) : null}
    </div>
  );
}
