/**
 * The chat bar, and everything that rides along with a question.
 *
 * One card: what is going with the question sits on top of it as pills (the
 * page, the file), and under them one row with add on the left, the field in
 * the middle and send on the right. Add opens a small menu: upload a file
 * from the computer, or find a page to attach. Under the card sit the
 * commands, one of which can be on at a time.
 *
 * Nothing here decides anything about a conversation. The panel owns the
 * state; this draws it and says what the reader did.
 */
import type {Ref} from 'preact';
import {useEffect, useRef, useState} from 'preact/hooks';
import {
  ArrowUp,
  ChevronLeft,
  FileText,
  Paperclip,
  Plus,
  Search,
  Square,
  Upload,
  X,
} from './icons';
import {COMMANDS, type CommandId} from './commands';
import {loadPages, searchPages, type PageEntry} from './pages';
import type {Attached, PageAttachment} from './types';

export type Menu = 'closed' | 'add' | 'pages';

type Props = {
  draft: string;
  onDraft: (value: string) => void;
  field: Ref<HTMLTextAreaElement>;
  busy: boolean;
  onSend: () => void;
  onStop: () => void;
  menu: Menu;
  onMenu: (menu: Menu) => void;
  accept: string;
  onFile: (file: File | undefined) => void;
  file: Attached | null;
  fileNote: string | null;
  fileError: string | null;
  onRemoveFile: () => void;
  docsOrigin: string;
  page: PageAttachment | null;
  attaching: string | null;
  onPage: (entry: PageEntry) => void;
  onRemovePage: () => void;
  command: CommandId | null;
  onCommand: (command: CommandId | null) => void;
};

export function Composer(props: Props) {
  const {draft, busy, menu, onMenu, page, file, fileNote, fileError, attaching} = props;
  const picker = useRef<HTMLInputElement>(null);
  const addWrap = useRef<HTMLDivElement>(null);
  const pageReady = page !== null && page.markdown !== '';

  // A click anywhere else puts the menu away. The panel lives in a shadow
  // root, so the click is checked against the path it took, not its target.
  useEffect(() => {
    if (menu === 'closed') return;
    const away = (event: PointerEvent) => {
      if (addWrap.current && !event.composedPath().includes(addWrap.current)) onMenu('closed');
    };
    document.addEventListener('pointerdown', away, true);
    return () => document.removeEventListener('pointerdown', away, true);
  }, [menu]);

  const hasContext = Boolean(page || attaching || file || fileNote || fileError);

  return (
    <div class="ask-ai__foot">
      <form
        class="ask-ai__composer"
        onSubmit={(event) => {
          event.preventDefault();
          props.onSend();
        }}>
        {/* What is going with the question, said before it is sent. A pill
            the reader cannot see is an answer they cannot account for, so
            each is named here and comes off from here. */}
        {hasContext && (
          <div class="ask-ai__context">
            {attaching && (
              <span class="ask-ai__chip ask-ai__chip--pending">
                <FileText />
                <span class="ask-ai__chip-text">Attaching {attaching}</span>
              </span>
            )}
            {page && !attaching && (
              <span class={`ask-ai__chip${pageReady ? '' : ' ask-ai__chip--failed'}`}>
                <FileText />
                <span class="ask-ai__chip-text">
                  {pageReady ? page.title : `Could not attach ${page.title}`}
                </span>
                <button
                  type="button"
                  class="ask-ai__chip-remove"
                  aria-label={pageReady ? `Remove ${page.title}` : 'Dismiss'}
                  onClick={props.onRemovePage}>
                  <X />
                </button>
              </span>
            )}
            {fileNote ? (
              <span class="ask-ai__chip ask-ai__chip--pending">
                <Paperclip />
                <span class="ask-ai__chip-text">{fileNote}</span>
              </span>
            ) : (
              file && (
                <span class="ask-ai__chip">
                  <Paperclip />
                  <span class="ask-ai__chip-text">{file.name}</span>
                  <span class="ask-ai__chip-meta">
                    {file.text.length.toLocaleString()} characters
                  </span>
                  <button
                    type="button"
                    class="ask-ai__chip-remove"
                    aria-label={`Remove ${file.name}`}
                    onClick={props.onRemoveFile}>
                    <X />
                  </button>
                </span>
              )
            )}
            {fileError && <span class="ask-ai__context-error">{fileError}</span>}
          </div>
        )}
        {/* Identifiers are masked on the way out, but a person's name written
            in prose is not something any pattern finds, and a scan or a
            screenshot is where one usually is. Said once, beside the file. */}
        {file?.kind && !fileNote && (
          <p class="ask-ai__context-note">
            Read here in your browser; the file itself is not sent. Names in it
            are yours to check before you send.
          </p>
        )}

        <div class="ask-ai__bar">
          <div class="ask-ai__add-wrap" ref={addWrap}>
            <button
              type="button"
              class="ask-ai__add"
              aria-label="Add a file or a page"
              aria-haspopup="menu"
              aria-expanded={menu !== 'closed'}
              disabled={busy}
              onClick={() => onMenu(menu === 'closed' ? 'add' : 'closed')}>
              <Plus />
            </button>
            {menu === 'add' && (
              <div class="ask-ai__menu" role="menu">
                <button
                  type="button"
                  role="menuitem"
                  class="ask-ai__menu-item"
                  autoFocus
                  onClick={() => {
                    onMenu('closed');
                    picker.current?.click();
                  }}>
                  <Upload />
                  Upload from computer
                </button>
                <button
                  type="button"
                  role="menuitem"
                  class="ask-ai__menu-item"
                  onClick={() => onMenu('pages')}>
                  <FileText />
                  Attach a page
                </button>
              </div>
            )}
            {menu === 'pages' && (
              <PageSearch
                docsOrigin={props.docsOrigin}
                onPick={(entry) => {
                  onMenu('closed');
                  props.onPage(entry);
                }}
                onBack={() => onMenu('add')}
              />
            )}
          </div>

          {/* The file never leaves the browser as a file: it is read here and
              its text goes with the question. */}
          <input
            ref={picker}
            type="file"
            class="ask-ai__picker"
            accept={props.accept}
            onChange={(event) => {
              const input = event.currentTarget;
              props.onFile(input.files?.[0]);
              // Cleared so choosing the same file twice still fires a change.
              input.value = '';
            }}
          />

          {/* A textarea, not an input: an error body pasted in should be
              readable before it is sent. Enter sends; shift and enter takes
              a new line. */}
          <textarea
            ref={props.field}
            class="ask-ai__input"
            value={draft}
            rows={1}
            onInput={(event) => props.onDraft(event.currentTarget.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                props.onSend();
              }
            }}
            placeholder="Ask about ABDM"
            aria-label="Ask the assistant"
          />

          {busy ? (
            <button
              class="ask-ai__send ask-ai__send--stop"
              type="button"
              aria-label="Stop"
              onClick={props.onStop}>
              <Square />
            </button>
          ) : (
            <button
              class="ask-ai__send"
              type="submit"
              aria-label="Send"
              disabled={draft.trim() === ''}>
              <ArrowUp />
            </button>
          )}
        </div>
      </form>

      {/* The commands: each points the answer at one section of the module's
          agent skill. One at a time, and it stays on until turned off. */}
      <div class="ask-ai__commands" role="group" aria-label="Commands">
        {COMMANDS.map((command) => (
          <button
            key={command.id}
            type="button"
            class="ask-ai__command"
            aria-pressed={props.command === command.id}
            onClick={() => props.onCommand(props.command === command.id ? null : command.id)}>
            {command.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Finding any page on the docs site and attaching it, from inside a
 * conversation. The list loads the first time it is opened.
 */
function PageSearch({
  docsOrigin,
  onPick,
  onBack,
}: {
  docsOrigin: string;
  onPick: (entry: PageEntry) => void;
  onBack: () => void;
}) {
  const [query, setQuery] = useState('');
  const [pages, setPages] = useState<PageEntry[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let live = true;
    loadPages(docsOrigin).then(
      (list) => live && setPages(list),
      () => live && setFailed(true),
    );
    return () => {
      live = false;
    };
  }, [docsOrigin]);

  const hits = pages ? searchPages(pages, query) : [];
  const status = failed
    ? 'The page list could not be loaded.'
    : !pages
      ? 'Loading pages'
      : !query.trim()
        ? 'Type to search every page.'
        : hits.length
          ? null
          : 'No page matches that.';

  return (
    <div class="ask-ai__menu ask-ai__menu--pages" role="dialog" aria-label="Attach a page">
      <div class="ask-ai__search">
        <button type="button" class="ask-ai__search-back" aria-label="Back" onClick={onBack}>
          <ChevronLeft />
        </button>
        <Search />
        <input
          class="ask-ai__search-field"
          value={query}
          autoFocus
          placeholder="Search pages"
          aria-label="Search pages"
          role="combobox"
          aria-expanded={hits.length > 0}
          aria-controls="ask-ai-page-hits"
          onInput={(event) => {
            setQuery(event.currentTarget.value);
            setActive(0);
          }}
          onKeyDown={(event) => {
            // Inside the composer's form, Enter would send the question.
            if (event.key === 'Enter') {
              event.preventDefault();
              if (hits[active]) onPick(hits[active]);
            } else if (event.key === 'ArrowDown') {
              event.preventDefault();
              setActive((i) => Math.min(i + 1, hits.length - 1));
            } else if (event.key === 'ArrowUp') {
              event.preventDefault();
              setActive((i) => Math.max(i - 1, 0));
            }
          }}
        />
      </div>
      {hits.length > 0 && (
        <ul class="ask-ai__hits" id="ask-ai-page-hits" role="listbox">
          {hits.map((hit, index) => (
            <li key={hit.path} role="option" aria-selected={index === active}>
              <button
                type="button"
                class={`ask-ai__hit${index === active ? ' ask-ai__hit--active' : ''}`}
                onMouseEnter={() => setActive(index)}
                onClick={() => onPick(hit)}>
                <span class="ask-ai__hit-title">{hit.title}</span>
                <span class="ask-ai__hit-path">{hit.path.replace(/^\/docs\//, '')}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {status && <p class="ask-ai__search-status">{status}</p>}
    </div>
  );
}
