import React, {useEffect, useRef, useState} from 'react';
import {Check, ChevronDown, Copy} from 'lucide-react';
import {Button} from '@site/src/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@site/src/components/ui/dropdown-menu';

/**
 * The copy control that sits to the right of the page title.
 *
 * This site does not publish a raw markdown endpoint, so "copy" reads the
 * rendered article text out of the DOM instead of fetching a `.md` twin, and
 * the menu says so rather than offering a link that would 404.
 */
export default function PageActions(): React.ReactNode {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copyPage() {
    if (typeof document === 'undefined') {
      return;
    }
    const text = document.querySelector<HTMLElement>('.markdown')?.innerText;
    if (!text || !navigator.clipboard) {
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      return; // Clipboard refused; say nothing rather than claim success.
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="docs-page-actions">
      <Button
        variant="ghost"
        size="sm"
        onClick={copyPage}
        aria-live="polite"
        title="Copy the text of this page">
        {copied ? <Check aria-hidden /> : <Copy aria-hidden />}
        {copied ? 'Copied' : 'Copy page'}
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label="More page actions">
            <ChevronDown aria-hidden />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuItem disabled>View as markdown</DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              if (typeof window !== 'undefined') {
                window.open(window.location.href, '_blank', 'noopener');
              }
            }}>
            Open in a new tab
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-faint text-xs font-normal whitespace-normal">
            A raw markdown endpoint is not published yet, so "copy page" copies
            the visible article text.
          </DropdownMenuLabel>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
