/**
 * The conversations this browser has already had.
 *
 * They are kept in localStorage and nowhere else: the panel has no account to
 * hang a conversation on, and a support question is the reader's, not ours to
 * hold on a server. So "recent" means recent on this machine, in this browser,
 * and clearing it clears it for good.
 */

/** The little a conversation has to be for this module to work with it. */
type Said = {from: 'you' | 'assistant'; text: string};

export type Session<T extends Said = Said> = {
  id: string;
  /** When the last answer in it finished, as epoch milliseconds. */
  at: number;
  title: string;
  turns: T[];
};

const KEY = 'abdm-ask-ai-history';
/**
 * Every conversation a reader is likely to come back to. Attachment text is
 * stripped before saving, so fifty stay well inside the storage quota.
 */
const KEEP = 50;
/**
 * How long a conversation stays on the machine.
 *
 * A reader can paste a log or a FHIR bundle with a real patient's details in
 * it, and this list is written into whichever origin embeds the panel, which
 * on a partner's page is theirs and not ours. Nothing here expires on its
 * own, so it is expired on the way out instead: a shared or kiosk browser
 * forgets last month's question without anybody pressing Clear.
 */
const KEEP_FOR = 30 * 24 * 60 * 60 * 1000;
const TITLE_MAX = 72;

/** A conversation is named after the first thing the reader asked in it. */
export function titleOf(turns: Said[]): string {
  const asked = turns.find((turn) => turn.from === 'you')?.text.trim() ?? '';
  const oneLine = asked.replace(/\s+/g, ' ');
  return oneLine.length > TITLE_MAX
    ? `${oneLine.slice(0, TITLE_MAX - 1)}…`
    : oneLine;
}

/**
 * Puts a conversation at the top of the list, replacing the older copy of
 * itself. The same conversation is written again after every answer, which is
 * why matching on id matters more than appending.
 */
export function remember<T extends Said>(
  list: Session<T>[],
  session: Session<T>,
): Session<T>[] {
  return [session, ...list.filter((old) => old.id !== session.id)].slice(
    0,
    KEEP,
  );
}

export function load<T extends Said>(now = Date.now()): Session<T>[] {
  try {
    const held = JSON.parse(localStorage.getItem(KEY) ?? '[]');
    return Array.isArray(held)
      ? held.filter(
          (one) => one?.id && one?.turns && now - (one.at ?? 0) < KEEP_FOR,
        )
      : [];
  } catch {
    // A browser with storage turned off, or a half written entry. Either way
    // the panel opens on a fresh conversation rather than not at all.
    return [];
  }
}

export function save<T extends Said>(list: Session<T>[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    // Over quota, most likely because one long conversation grew past what
    // is left. Drop the oldest and try once more, so a full store keeps the
    // newest conversation rather than silently never writing again.
    try {
      localStorage.setItem(KEY, JSON.stringify(list.slice(0, -1)));
    } catch {
      // Blocked outright, as in Safari's private mode. The conversation on
      // screen is unaffected; it just will not be there tomorrow.
    }
  }
}

/** One conversation taken out of the list, the rest left as they were. */
export function forgetOne<T extends Said>(list: Session<T>[], id: string): Session<T>[] {
  return list.filter((session) => session.id !== id);
}

export function forget(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {}
}

/** Short and plain, because a date on a list of ten is noise. */
export function whenSaid(at: number, now = Date.now()): string {
  const mins = Math.floor((now - at) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return days < 7 ? `${days}d ago` : new Date(at).toLocaleDateString();
}
