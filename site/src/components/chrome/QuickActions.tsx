import React from 'react';
import Link from '@docusaurus/Link';
import {Sparkles} from 'lucide-react';
import {cn} from '@site/src/lib/utils';
import {tabHref, tabs, useRoutePath} from '@site/src/config/navigation';

/**
 * What the search field offers before anything is typed.
 *
 * The shortcut and a click on the field do the same thing, because they are
 * the same thing: the field takes focus and the site's own search answers as
 * the reader types. That leaves one gap, the moment before they type, when a
 * blank dropdown says nothing. This fills it with the two questions a reader
 * arrives with, where do I go and can I just ask, and gets out of the way the
 * moment a search is under way.
 */
export default function QuickActions({
  open,
  query,
  onLeave,
}: {
  open: boolean;
  query: string;
  onLeave: () => void;
}) {
  const pathname = useRoutePath();
  if (!open || query.trim() !== '') return null;
  return (
    <div className="quick-actions" role="listbox" aria-label="Quick actions">
      <button
        type="button"
        className={cn('quick-actions__row', 'quick-actions__row--ask')}
        // Pressed rather than clicked: the field is about to lose focus, and
        // a click handler that fires after the blur has already been beaten
        // by the dropdown closing under the pointer.
        onMouseDown={(event) => {
          event.preventDefault();
          onLeave();
          window.dispatchEvent(new CustomEvent('abdm:ask-ai'));
        }}>
        <Sparkles className="size-4" aria-hidden="true" />
        <span className="quick-actions__label">Ask AI</span>
        <span className="quick-actions__hint">Assistant</span>
      </button>
      {tabs.map((tab) => (
        <Link
          key={tab.id}
          to={tabHref(tab, pathname)}
          className="quick-actions__row"
          onMouseDown={() => onLeave()}>
          <span className="quick-actions__label">{tab.label}</span>
          <span className="quick-actions__hint">Go</span>
        </Link>
      ))}
    </div>
  );
}
