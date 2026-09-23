/**
 * Finding a page to attach, from inside a conversation.
 *
 * The list is the docs site's own llms.txt: every page with its title and a
 * line about it, published on every deployment and readable by any embed, so
 * this needs no search service. Its links carry whatever site address the
 * build was configured with, so only each link's path is kept and it is put
 * back on the docs origin the widget was given. A page's text is the same
 * path with `.md` on the end, which the site's build writes beside every page.
 */
export type PageEntry = {title: string; path: string; description: string};

const LINE = /^- \[([^\]]+)\]\(([^)\s]+)\)(?::\s*(.*))?$/;

export function parseLlms(text: string): PageEntry[] {
  const out: PageEntry[] = [];
  const seen = new Set<string>();
  for (const raw of text.split('\n')) {
    const m = LINE.exec(raw.trim());
    if (!m) continue;
    let path: string;
    try {
      path = new URL(m[2], 'https://placeholder.invalid').pathname.replace(/\/$/, '');
    } catch {
      continue;
    }
    if (!path.startsWith('/docs/') || seen.has(path)) continue;
    seen.add(path);
    out.push({title: m[1], path, description: (m[3] ?? '').trim()});
  }
  return out;
}

const escape = (word: string) => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Pages matching every word typed, best first: a word starting a word in the
 * title beats one inside it, which beats one only in the path or description.
 * Ties go to the shorter title, which is usually the more general page.
 */
export function searchPages(entries: PageEntry[], query: string, limit = 8): PageEntry[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const scored: {entry: PageEntry; score: number}[] = [];
  for (const entry of entries) {
    const title = entry.title.toLowerCase();
    const rest = `${entry.path} ${entry.description}`.toLowerCase();
    let score = 0;
    let every = true;
    for (const word of words) {
      if (new RegExp(`\\b${escape(word)}`).test(title)) score += 3;
      else if (title.includes(word)) score += 2;
      else if (rest.includes(word)) score += 1;
      else {
        every = false;
        break;
      }
    }
    if (every) scored.push({entry, score});
  }
  return scored
    .sort((a, b) => b.score - a.score || a.entry.title.length - b.entry.title.length)
    .slice(0, limit)
    .map((hit) => hit.entry);
}

const trim = (origin: string) => origin.replace(/\/$/, '');
export const pageUrl = (docsOrigin: string, path: string) => `${trim(docsOrigin)}${path}`;
export const markdownUrl = (docsOrigin: string, path: string) => `${trim(docsOrigin)}${path}.md`;

/**
 * Whether what came back for a page's markdown is really a web page. A
 * static host that serves its app shell for any path it does not have, the
 * docs dev server and many production hosts among them, answers a missing
 * `.md` with a 200 and a whole HTML document. That is not the page, and
 * sending it to the model as if it were would be worse than attaching
 * nothing, so it is treated as the failure it is.
 */
export function isHtmlDocument(text: string): boolean {
  return /^\s*(?:<!doctype html|<html[\s>])/i.test(text);
}

let pages: Promise<PageEntry[]> | null = null;

/**
 * The page list, fetched once per page load. A failed fetch is not cached,
 * so the next search tries again rather than staying empty.
 */
export function loadPages(docsOrigin: string): Promise<PageEntry[]> {
  if (!pages) {
    pages = fetch(`${trim(docsOrigin)}/llms.txt`)
      .then((res) => (res.ok ? res.text() : Promise.reject(new Error(`status ${res.status}`))))
      .then(parseLlms)
      .catch((err) => {
        pages = null;
        throw err;
      });
  }
  return pages;
}
