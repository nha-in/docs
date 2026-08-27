import {useEffect} from 'react';

/**
 * Marks the document as scrolled, so the chrome can take its colour on.
 *
 * The bar is a blur and nothing else while the page is at the top; the wash of
 * page colour arrives only once there is content passing underneath it. That
 * is the Claude Code docs' behaviour, and the reason for it is that a bar with
 * a solid fill at rest hides whatever it sits over even when there is nothing
 * to separate it from.
 */
export default function ScrolledFlag(): null {
  useEffect(() => {
    const root = document.documentElement;
    let on: boolean | null = null;
    // Written straight from the scroll listener rather than through a frame:
    // the work is one comparison and, on the two scrolls a page where it
    // changes, one attribute write. Deferring that to a frame buys nothing and
    // means the bar has the wrong colour in any context where frames are not
    // being served.
    const read = () => {
      const next = window.scrollY > 8;
      if (next === on) return;
      on = next;
      root.dataset.scrolled = next ? 'true' : 'false';
    };
    read();
    window.addEventListener('scroll', read, {passive: true});
    return () => {
      window.removeEventListener('scroll', read);
      delete root.dataset.scrolled;
    };
  }, []);

  return null;
}
