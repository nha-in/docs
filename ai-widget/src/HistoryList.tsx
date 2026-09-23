/**
 * Every conversation this browser has had, laid out the way Claude's sidebar
 * lays out its chats: a small label, then one quiet line per conversation,
 * named after its first question, with the one on screen filled in. A
 * conversation can be deleted from its own row, or all of them at once.
 */
import {Trash} from './icons';
import type {Session} from './history';

type Props<T extends {from: 'you' | 'assistant'; text: string}> = {
  sessions: Session<T>[];
  currentId: string;
  onOpen: (session: Session<T>) => void;
  onForget: (id: string) => void;
  onClearAll: () => void;
};

export function HistoryList<T extends {from: 'you' | 'assistant'; text: string}>({
  sessions,
  currentId,
  onOpen,
  onForget,
  onClearAll,
}: Props<T>) {
  if (!sessions.length) {
    return (
      <div class="ask-ai__history ask-ai__history--empty">
        <p class="ask-ai__history-none">No conversations yet.</p>
        <p class="ask-ai__history-note">
          What you ask here is kept in this browser only.
        </p>
      </div>
    );
  }
  return (
    <div class="ask-ai__history">
      <p class="ask-ai__history-label">Recents</p>
      <ul class="ask-ai__history-list">
        {sessions.map((session) => {
          const current = session.id === currentId;
          const title = session.title || 'Untitled conversation';
          return (
            <li
              key={session.id}
              class={`ask-ai__history-row${current ? ' ask-ai__history-row--current' : ''}`}>
              <button
                type="button"
                class="ask-ai__history-open"
                aria-current={current ? 'true' : undefined}
                title={title}
                onClick={() => onOpen(session)}>
                {title}
              </button>
              <button
                type="button"
                class="ask-ai__history-forget"
                aria-label={`Delete ${title}`}
                title="Delete"
                onClick={() => onForget(session.id)}>
                <Trash />
              </button>
            </li>
          );
        })}
      </ul>
      <div class="ask-ai__history-foot">
        <span>Kept in this browser only.</span>
        <button type="button" class="ask-ai__history-clear" onClick={onClearAll}>
          Clear all
        </button>
      </div>
    </div>
  );
}
