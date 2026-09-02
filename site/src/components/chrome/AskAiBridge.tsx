import {useEffect} from 'react';
import {useLocation} from '@docusaurus/router';

/** What the assistant element accepts as attached context. */
type PageAttachment = {title: string; url: string; markdown: string};

type SupportAgent = HTMLElement & {
  attachPage?: (page: PageAttachment | null) => void;
};

function agent(): SupportAgent | null {
  return document.querySelector('abdm-support-agent');
}

/**
 * Lets any page open the Ask AI panel, and hand the panel the page itself or
 * the words the reader already typed, without knowing where the panel lives.
 *
 * Dispatch `window.dispatchEvent(new CustomEvent('abdm:ask-ai', {detail:
 * {page, title, question}}))` and the `<abdm-support-agent>` element in the
 * top bar opens, the same way its own chip opens it, by setting its `open`
 * attribute. `question` seeds the composer, and nothing is sent: the reader
 * still presses send. `page` hands the panel the page as Markdown, so their
 * first question is answered against what they are looking at.
 *
 * The Markdown is the `index.md` a postbuild step writes beside every route
 * (see scripts/emit-page-markdown.mjs), which is also what Copy for LLM
 * reads. It does not exist in `npm start`, so the fetch 404s there: the
 * panel is told so with an empty `markdown` and says the page could not be
 * attached, rather than answering as though it had it.
 *
 * The site fetches rather than the widget, because the widget is a
 * standalone element that any host embeds and it has no business knowing
 * this site's routes.
 */
export default function AskAiBridge(): null {
  const {pathname} = useLocation();

  useEffect(() => {
    const open = (event: Event) => {
      const el = agent();
      if (!el) return;
      const {page, title, question} = (event as CustomEvent).detail ?? {};
      // A caller that already has the reader's words hands them over, and the
      // panel seeds its composer with them.
      if (question) el.setAttribute('question', question);
      el.setAttribute('open', '');
      if (!page || !el.attachPage) return;
      const url = `${String(page).replace(/\/$/, '')}/index.md`;
      // The panel opens now and the page lands a moment later. Fetching
      // first would hold the panel shut behind a network round trip for a
      // static file on the same origin, which is the worse trade: an empty
      // panel that is open reads as ready, one that has not appeared reads
      // as broken.
      void fetch(url)
        .then((res) => (res.ok ? res.text() : ''))
        .catch(() => '')
        .then((markdown) => {
          agent()?.attachPage?.({title: title ?? 'this page', url, markdown});
        });
    };
    window.addEventListener('abdm:ask-ai', open);
    return () => window.removeEventListener('abdm:ask-ai', open);
  }, []);

  // A page attached on one route is wrong on the next one, and the reader
  // opening the panel from the top bar after navigating would otherwise see
  // a page they have left still named as the one in use.
  useEffect(() => {
    agent()?.attachPage?.(null);
  }, [pathname]);

  return null;
}
