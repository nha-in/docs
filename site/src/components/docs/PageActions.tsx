import React, {useCallback, useEffect, useRef, useState} from 'react';
import Link from '@docusaurus/Link';
import {useLocation} from '@docusaurus/router';
import {ClipboardList, Download, Sparkles} from 'lucide-react';

type Status = 'idle' | 'copied' | 'unavailable';

const COPY_TEXT: Record<Status, string> = {
  idle: 'Copy for LLM',
  copied: 'Copied',
  unavailable: 'Markdown unavailable',
};

const STATUS_TEXT: Record<Status, string> = {
  idle: '',
  copied: 'Copied the page as Markdown.',
  unavailable:
    'Markdown is not available here. It is only built for production, not the local dev server.',
};

/** The Markdown mark: a rounded box with an M and a down arrow. */
function MarkdownMark(): React.ReactNode {
  return (
    <svg viewBox="0 0 208 128" width="18" height="11" aria-hidden="true" fill="none">
      <rect
        x="5"
        y="5"
        width="198"
        height="118"
        rx="12"
        stroke="currentColor"
        strokeWidth="10"
      />
      <path
        d="M30 98V30h20l20 25 20-25h20v68H90V59L70 84 50 59v39zm125 0l-30-33h20V30h20v35h20z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * The four page actions, laid out exactly as the reference documentation
 * site lays out its own: one line of text buttons with dividers between
 * them, under the page's lede, above a rule. Ask about this page opens the
 * site's own assistant; Copy for LLM copies the page as Markdown; View as
 * Markdown opens it; Install tools goes to Build with AI.
 *
 * Copy and View read the `index.md` a postbuild step writes beside every
 * route (see scripts/emit-page-markdown.mjs), so neither exists in
 * `npm start`: the fetch 404s and the copy button reports "unavailable"
 * rather than failing silently. The URL is built from `pathname` alone, not
 * `useBaseUrl`, which would double the base URL on a non-root deployment.
 */
export default function PageActions(): React.ReactNode {
  const {pathname} = useLocation();
  const mdUrl = `${pathname.replace(/\/$/, '')}/index.md`;
  const [status, setStatus] = useState<Status>('idle');
  const resetTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(resetTimer.current), []);

  const copy = useCallback(async () => {
    try {
      const res = await fetch(mdUrl);
      if (!res.ok) throw new Error(String(res.status));
      await navigator.clipboard.writeText(await res.text());
      setStatus('copied');
    } catch {
      setStatus('unavailable');
    }
    clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setStatus('idle'), 2000);
  }, [mdUrl]);

  // `chrome/AskAiBridge.tsx` listens for this on window and opens the
  // `<abdm-support-agent>` element in the top bar.
  const askAi = useCallback(() => {
    window.dispatchEvent(
      new CustomEvent('abdm:ask-ai', {detail: {page: pathname, title: document.title}}),
    );
  }, [pathname]);

  return (
    <div className="page-actions" role="group" aria-label="Page actions">
      <button type="button" className="page-actions__item" onClick={askAi}>
        <Sparkles className="page-actions__icon" aria-hidden="true" />
        Ask about this page
      </button>
      <button type="button" className="page-actions__item" onClick={copy}>
        <ClipboardList className="page-actions__icon" aria-hidden="true" />
        {COPY_TEXT[status]}
      </button>
      <a className="page-actions__item" href={mdUrl} target="_blank" rel="noopener noreferrer">
        <MarkdownMark />
        View as Markdown
      </a>
      <Link className="page-actions__item" to="/docs/hiecm/v3/getting-started/build-with-ai">
        <Download className="page-actions__icon" aria-hidden="true" />
        Install tools
      </Link>
      {/* Visually hidden but announced: a button's own label change is not
          reliably read out by a screen reader, so the result is also spoken
          through this live region. */}
      <span className="sr-only" role="status" aria-live="polite">
        {STATUS_TEXT[status]}
      </span>
    </div>
  );
}
