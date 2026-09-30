import React, {useEffect, useState} from 'react';

const KEY = 'agent-notes';

function apply(shown: boolean): void {
  if (shown) document.documentElement.dataset.agentNotes = 'shown';
  else delete document.documentElement.dataset.agentNotes;
}

/**
 * A quiet link under the footer that shows or hides the notes written for AI
 * agents. Kept out of the page chrome on purpose: readers do not need it, and
 * NHA is not asked to review the notes. ?agent-notes=1 turns them on too, so
 * a link can be shared with anyone who wants to check what agents are told.
 */
export default function AgentNotesToggle(): React.ReactNode {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    let on = false;
    try { on = localStorage.getItem(KEY) === 'shown'; } catch {}
    if (new URLSearchParams(window.location.search).get('agent-notes') === '1') on = true;
    setShown(on);
    apply(on);
  }, []);
  const flip = () => {
    const next = !shown;
    setShown(next);
    apply(next);
    try { localStorage.setItem(KEY, next ? 'shown' : 'hidden'); } catch {}
  };
  return (
    <div className="agent-notes-toggle">
      <button type="button" onClick={flip} aria-pressed={shown}>
        {shown ? 'Hide notes for AI agents' : 'Show notes for AI agents'}
      </button>
    </div>
  );
}
