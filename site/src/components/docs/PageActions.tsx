import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useLocation} from '@docusaurus/router';
import {Button} from '@site/src/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@site/src/components/ui/dropdown-menu';
import {Bot, ChevronDown, Copy, ExternalLink, MessageSquare, Sparkles} from 'lucide-react';

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
 * Copy the page's plain-Markdown source, view it directly, or hand it to an
 * assistant. All four external actions read the `index.md` a postbuild step
 * writes beside every route (see scripts/emit-page-markdown.mjs), so none of
 * it exists in `npm start`: the fetch 404s and the copy button reports
 * "unavailable" rather than failing silently. That is expected there, not a
 * bug.
 *
 * The URL is built from `pathname` alone, not `useBaseUrl`: `pathname`
 * already carries the site's base URL, and `useBaseUrl` would prefix it a
 * second time and 404 on any deployment with a non-root base (PR previews
 * set one via DOCUSAURUS_BASE_URL).
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
  // fresh chat with it. The URL has to be absolute, and only known once a
  // browser is actually navigating to it, so it's built here rather than
  // alongside `mdUrl` above.
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
  // the top bar; dispatching the event rather than reaching for that
  // element directly keeps this component from needing to know where the
  // panel lives.
  const askAi = useCallback(() => {
    window.dispatchEvent(
      new CustomEvent('abdm:ask-ai', {detail: {page: pathname, title: document.title}}),
    );
  }, [pathname]);

  return (
    <div className="docs-page-actions">
      <Button
        variant="outline"
        size="sm"
        onClick={copy}
        className="docs-page-actions__copy rounded-r-none text-[13px]">
        <Copy className="size-3.5" aria-hidden="true" />
        {BUTTON_TEXT[status]}
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon-sm"
            className="docs-page-actions__trigger -ml-px rounded-l-none"
            aria-label="More page actions">
            <ChevronDown className="size-3.5" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onSelect={copy}>
            <Copy aria-hidden="true" />
            Copy page
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a href={mdUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink aria-hidden="true" />
              View as Markdown
            </a>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => openWith('https://chatgpt.com/')}>
            <MessageSquare aria-hidden="true" />
            Open in ChatGPT
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => openWith('https://claude.ai/new')}>
            <Bot aria-hidden="true" />
            Open in Claude
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={askAi}>
            <Sparkles aria-hidden="true" />
            Ask AI
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* Visually hidden but announced: a button's own label change is not
          reliably read out by a screen reader, so the result is also spoken
          through this live region. */}
      <span className="sr-only" role="status" aria-live="polite">
        {STATUS_TEXT[status]}
      </span>
    </div>
  );
}
