import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useLocation} from '@docusaurus/router';
import {Button} from '@site/src/components/ui/button';

type Status = 'idle' | 'copied' | 'unavailable';

const BUTTON_TEXT: Record<Status, string> = {
  idle: 'Copy page as Markdown',
  copied: 'Copied',
  unavailable: 'Markdown unavailable',
};

const STATUS_TEXT: Record<Status, string> = {
  idle: '',
  copied: 'Copied the page as Markdown.',
  unavailable:
    'Markdown is not available here. It is only built for production, not the local dev server.',
};

/**
 * Copy the page's plain-Markdown source, or open it directly. Both read the
 * `index.md` a postbuild step writes beside every route (see
 * scripts/emit-page-markdown.mjs), so neither exists in `npm start`: the
 * fetch 404s and the copy button reports "unavailable" rather than failing
 * silently. That is expected there, not a bug.
 *
 * The URL is built from `pathname` alone, not `useBaseUrl`: `pathname`
 * already carries the site's base URL, and `useBaseUrl` would prefix it a
 * second time and 404 on any deployment with a non-root base (PR previews
 * set one via DOCUSAURUS_BASE_URL).
 */
export default function CopyPageMarkdown(): React.ReactNode {
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

  return (
    <div className="docs-copy-markdown">
      <Button variant="outline" size="sm" onClick={copy}>
        {BUTTON_TEXT[status]}
      </Button>
      <a href={mdUrl} className="docs-copy-markdown__view">
        View as Markdown
      </a>
      {/* Visually hidden but announced: a button's own label change is not
          reliably read out by a screen reader, so the result is also spoken
          through this live region. */}
      <span className="sr-only" role="status" aria-live="polite">
        {STATUS_TEXT[status]}
      </span>
    </div>
  );
}
