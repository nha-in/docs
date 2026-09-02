import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useLocation} from '@docusaurus/router';
import {Button} from '@site/src/components/ui/button';
import {Bot, Copy, ExternalLink, MessageSquare, Sparkles} from 'lucide-react';

type Status = 'idle' | 'copied' | 'unavailable';

const BUTTON_TEXT: Record<Status, string> = {
  idle: 'Copy page',
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
 * One horizontal row of page actions on the title line: copy the page as
 * Markdown, open it as Markdown, hand it to ChatGPT or Claude, or ask the
 * site's own assistant. Every action reads the `index.md` a postbuild step
 * writes beside every route (see scripts/emit-page-markdown.mjs), so none of
 * it exists in `npm start`: the fetch 404s and the copy button reports
 * "unavailable" rather than failing silently. That is expected there.
 *
 * The URL is built from `pathname` alone, not `useBaseUrl`: `pathname`
 * already carries the site's base URL, and `useBaseUrl` would prefix it a
 * second time and 404 on any deployment with a non-root base.
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

  // ChatGPT and Claude both take a prompt as a `q` search param and start a
  // fresh chat with it. The URL has to be absolute, so it is built at click
  // time from the browser's own origin.
  const openWith = useCallback(
    (origin: string) => {
      const absoluteMdUrl = window.location.origin + mdUrl;
      const prompt = `Read ${absoluteMdUrl} so I can ask questions about it.`;
      window.open(`${origin}?q=${encodeURIComponent(prompt)}`, '_blank', 'noopener');
    },
    [mdUrl],
  );

  // Opens the site's own assistant. `chrome/AskAiBridge.tsx` listens for
  // this on window and sets `open` on the `<abdm-support-agent>` element in
  // the top bar.
  const askAi = useCallback(() => {
    window.dispatchEvent(
      new CustomEvent('abdm:ask-ai', {detail: {page: pathname, title: document.title}}),
    );
  }, [pathname]);

  const cls = 'docs-page-actions__btn text-[13px]';

  return (
    <div className="docs-page-actions" role="group" aria-label="Page actions">
      <Button variant="outline" size="sm" onClick={copy} className={cls}>
        <Copy className="size-3.5" aria-hidden="true" />
        {BUTTON_TEXT[status]}
      </Button>
      <Button variant="outline" size="sm" asChild className={cls}>
        <a href={mdUrl} target="_blank" rel="noopener noreferrer">
          <ExternalLink className="size-3.5" aria-hidden="true" />
          View as Markdown
        </a>
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => openWith('https://chatgpt.com/')}
        className={cls}>
        <MessageSquare className="size-3.5" aria-hidden="true" />
        Open in ChatGPT
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => openWith('https://claude.ai/new')}
        className={cls}>
        <Bot className="size-3.5" aria-hidden="true" />
        Open in Claude
      </Button>
      <Button variant="outline" size="sm" onClick={askAi} className={cls}>
        <Sparkles className="size-3.5" aria-hidden="true" />
        Ask AI
      </Button>
      {/* Visually hidden but announced: a button's own label change is not
          reliably read out by a screen reader, so the result is also spoken
          through this live region. */}
      <span className="sr-only" role="status" aria-live="polite">
        {STATUS_TEXT[status]}
      </span>
    </div>
  );
}
