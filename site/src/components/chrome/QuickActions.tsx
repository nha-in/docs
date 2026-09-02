import React from 'react';
import {useHistory} from '@docusaurus/router';
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
 *
 * The arrow keys reach these rows, because a panel a keyboard cannot drive is
 * a panel that is only there for the mouse. The keys are caught on the search
 * field itself, in the capture phase: the field has focus the whole time, and
 * the search theme binds the same keys for its own results, which are not on
 * screen while this is.
 */
export type QuickActionsHandle = HTMLDivElement;

type Props = {
  open: boolean;
  /** Index of the row the keyboard is on, or -1 for none. */
  active: number;
  onActive: (index: number) => void;
  onLeave: () => void;
};

/** The rows, in the order the arrow keys walk them. */
export function useRows() {
  const pathname = useRoutePath();
  const history = useHistory();
  const rows = [
    {
      id: 'ask',
      label: 'Ask AI',
      hint: 'Assistant',
      run: () => {
        const field = document.querySelector<HTMLInputElement>(
          '.omnibox input.navbar__search-input',
        );
        const asked = field?.value.trim() ?? '';
        window.dispatchEvent(
          new CustomEvent('abdm:ask-ai', {detail: {question: asked}}),
        );
      },
    },
    ...tabs.map((tab) => ({
      id: tab.id,
      label: tab.label,
      hint: 'Go',
      run: () => history.push(tabHref(tab, pathname)),
    })),
  ];
  return rows;
}

const QuickActions = React.forwardRef<QuickActionsHandle, Props>(
  function QuickActions({open, active, onActive, onLeave}, ref) {
    const rows = useRows();
    if (!open) return null;
    return (
      <div
        ref={ref}
        className="quick-actions"
        role="listbox"
        aria-label="Quick actions">
        {rows.map((row, index) => (
          <button
            key={row.id}
            type="button"
            role="option"
            aria-selected={index === active}
            className={cn(
              'quick-actions__row',
              row.id === 'ask' && 'quick-actions__row--ask',
              index === active && 'quick-actions__row--active',
            )}
            onMouseEnter={() => onActive(index)}
            // Pressed rather than clicked: the field is about to lose focus,
            // and a click handler that fires after the blur has already been
            // beaten by the panel closing under the pointer.
            onMouseDown={(event) => {
              event.preventDefault();
              onLeave();
              row.run();
            }}>
            {row.id === 'ask' && (
              <Sparkles className="size-4" aria-hidden="true" />
            )}
            <span className="quick-actions__label">{row.label}</span>
            <span className="quick-actions__hint">{row.hint}</span>
          </button>
        ))}
      </div>
    );
  },
);

export default QuickActions;
