import React from 'react';
import {useHistory} from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {cn} from '@site/src/lib/utils';
import {tabHref, tabs, useRoutePath} from '@site/src/config/navigation';

/**
 * The command palette behind the keyboard shortcut.
 *
 * Pressing the shortcut used to put the caret in the search field and nothing
 * more, which asks the reader to know what the site calls the thing they want
 * before they can move. This opens instead: the same typing goes to full text
 * search, to the assistant, or to a section, and the sections are listed so a
 * reader who does not know the words still has somewhere to press.
 *
 * Search itself is not reimplemented here. The rows hand the query to the
 * search page the local search plugin already publishes, which owns the index
 * and the ranking; this is a front door, not a second search engine.
 */
type Row = {
  id: string;
  label: string;
  hint: string;
  run: () => void;
};

export default function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [active, setActive] = React.useState(0);
  const dialog = React.useRef<HTMLDialogElement>(null);
  const field = React.useRef<HTMLInputElement>(null);
  const history = useHistory();
  const pathname = useRoutePath();
  const searchBase = useBaseUrl('/search');

  // The shortcut is caught before the search theme's own handler, which binds
  // the same keys to focus its field. Capture and stop, or both fire and the
  // caret lands in the bar behind this.
  React.useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'k' || !(event.metaKey || event.ctrlKey)) return;
      event.preventDefault();
      event.stopPropagation();
      setOpen((prior) => !prior);
    };
    document.addEventListener('keydown', onKey, true);
    return () => document.removeEventListener('keydown', onKey, true);
  }, []);

  React.useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (open && !el.open) {
      el.showModal();
      field.current?.focus();
    }
    if (!open && el.open) {
      el.close();
      setQuery('');
      setActive(0);
    }
  }, [open]);

  const close = () => setOpen(false);
  const go = (to: string) => {
    close();
    history.push(to);
  };

  const asked = query.trim();
  const rows: Row[] = [];
  if (asked) {
    rows.push({
      id: 'search',
      label: `Search for "${asked}"`,
      hint: 'Search',
      run: () => go(`${searchBase}?q=${encodeURIComponent(asked)}`),
    });
  }
  rows.push({
    id: 'ask',
    label: asked ? `Ask AI about "${asked}"` : 'Ask AI',
    hint: 'Assistant',
    run: () => {
      close();
      window.dispatchEvent(
        new CustomEvent('abdm:ask-ai', {detail: {question: asked}}),
      );
    },
  });
  for (const tab of tabs) {
    if (asked && !tab.label.toLowerCase().includes(asked.toLowerCase())) {
      continue;
    }
    rows.push({
      id: tab.id,
      label: tab.label,
      hint: 'Navigate',
      run: () => go(tabHref(tab, pathname)),
    });
  }

  const move = (step: number) =>
    setActive((prior) => (prior + step + rows.length) % rows.length);

  return (
    <dialog
      ref={dialog}
      className="palette"
      aria-label="Search and commands"
      onClose={close}
      onClick={(event) => {
        // The backdrop is the dialog's own box outside its content, so a click
        // that lands on the dialog element itself is a click outside.
        if (event.target === dialog.current) close();
      }}>
      <div className="palette__box">
        <input
          ref={field}
          className="palette__field"
          value={query}
          placeholder="Search the docs, or ask the assistant"
          aria-label="Search the docs, or ask the assistant"
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(0);
          }}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown') {
              event.preventDefault();
              move(1);
            } else if (event.key === 'ArrowUp') {
              event.preventDefault();
              move(-1);
            } else if (event.key === 'Enter') {
              event.preventDefault();
              rows[active]?.run();
            }
          }}
        />
        <kbd className="palette__esc">esc</kbd>
      </div>

      <ul className="palette__rows">
        {rows.map((row, index) => (
          <li key={row.id}>
            <button
              type="button"
              className={cn(
                'palette__row',
                index === active && 'palette__row--active',
              )}
              onMouseEnter={() => setActive(index)}
              onClick={row.run}>
              <span className="palette__label">{row.label}</span>
              <span className="palette__hint">{row.hint}</span>
            </button>
          </li>
        ))}
      </ul>

      <p className="palette__footer">
        Up and down to move, enter to open. Anything the assistant answers, it
        answers from these pages.
      </p>
    </dialog>
  );
}
