import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {useHistory} from '@docusaurus/router';
import SearchBar from '@theme/SearchBar';
import QuickActions, {useRows} from './QuickActions';
import {activePlatform, useRoutePath} from '@site/src/config/navigation';

/**
 * Search and the assistant are one control, not two: the same field, with the
 * assistant on its right edge, so the box reads as an AI enabled search rather
 * than a text search standing next to a separate robot. It sits in the middle
 * of the top bar and stays there.
 *
 * The assistant itself is not a component of this site. It is
 * `<abdm-support-agent>`, a standalone custom element loaded by a script tag
 * (see docusaurus.config.ts) and rendered in its own shadow root, so the same
 * element goes on the developer console or a partner's wiki unchanged. This
 * site configures it by attribute like any other embedder would, and styles
 * only the box it sits in.
 */
/**
 * The openers the assistant shows on a gateway's own pages, in place of its
 * general four. A reader on HIE-CM came to do one of these two things, and
 * naming them is a better first question than any we could guess.
 */
const STARTERS: Record<string, string> = {
  hiecm: [
    'I want to create an ABHA',
    'I want to share health records',
    'What format does the TIMESTAMP header need?',
    'What does ABDM-1016 mean and how do I fix it?',
  ].join('\n'),
};

export default function Omnibox() {
  const {siteConfig} = useDocusaurusContext();
  const platform = activePlatform(useRoutePath());
  const starters = platform ? STARTERS[platform.id] : undefined;
  const chatUrl = siteConfig.customFields?.chatUrl as string | null;
  // The panel hands this out in its install flow. Absent in a build with no
  // backend, and the flow says so rather than printing a placeholder command.
  const mcpUrl = siteConfig.customFields?.mcpUrl as string | null;
  const support = useBaseUrl('/docs/support');
  const history = useHistory();
  const box = React.useRef<HTMLDivElement>(null);
  const panel = React.useRef<HTMLDivElement>(null);
  const [focused, setFocused] = React.useState(false);
  // What the launcher chip says its key is. Empty until the platform is
  // known, and on a touch device it stays empty: there is no key to press.
  const [shortcut, setShortcut] = React.useState('');
  const [active, setActive] = React.useState(-1);
  // The rows live here as well as in the panel, because the arrow keys are
  // caught on the search field and have to know what they are walking.
  const rows = useRows();
  const activeRef = React.useRef(-1);
  activeRef.current = active;

  // The search theme takes its placeholder from a translation string, and the
  // usual override, i18n/en/code.json, turns on translation validation for the
  // whole site, which the sidebar does not currently pass. So the word is
  // corrected on the node instead. React holds the prop constant, so it never
  // writes over this.
  React.useEffect(() => {
    const root = box.current;
    if (!root) return;
    root
      .querySelector('input.navbar__search-input')
      ?.setAttribute('placeholder', 'Search or ask AI');

    // The search theme hardcodes the Apple command mark. On Windows, Linux and
    // Android that key does not exist, so the hint tells the reader to press
    // something they do not have. Correct it from the platform, and drop it
    // entirely where there is no hardware keyboard to press.
    const ua = navigator.userAgent;
    const isApple = /Mac|iPhone|iPad|iPod/.test(ua);
    const isTouchOnly = /Android|iPhone|iPad|iPod/.test(ua);
    for (const hint of Array.from(
      root.querySelectorAll<HTMLElement>("kbd[class*='searchHint']"),
    )) {
      if (isTouchOnly) {
        hint.style.display = 'none';
        continue;
      }
      if (hint.textContent && hint.textContent.trim() !== 'K') {
        hint.textContent = isApple ? '⌘' : 'Ctrl';
      }
    }

    // The shortcut and a click on the field are the same act, and the search
    // theme already treats them so: both put the caret here and both answer
    // as the reader types. This watches that field rather than replacing it,
    // for the one thing the search cannot do on its own: while the field is
    // empty, the quick actions below offer the sections and the assistant.
    //
    // Nothing here sets React state per keystroke, and that is not tidiness.
    // The search field belongs to the search theme; re-rendering this
    // component around it while somebody is typing dropped every second
    // character. The panel is shown and hidden on the node instead.
    const input = root.querySelector<HTMLInputElement>(
      'input.navbar__search-input',
    );
    const agent = root.querySelector('abdm-support-agent');
    if (!input) return;
    // A half written question survives the move from the field to the panel.
    // The words are handed over when the reader leaves the field or presses
    // the assistant's own chip, not on every keystroke: the chip lives in the
    // widget's shadow root, so this catches the press on the host on the way
    // down, before the widget opens itself.
    const carry = (send: boolean) => {
      if (!agent) return;
      const asked = input.value.trim();
      if (asked) agent.setAttribute('question', asked);
      else {
        agent.removeAttribute('question');
        agent.removeAttribute('send');
      }
      // Words the reader has already typed and then pressed the assistant
      // with are a question they have finished asking. Seeding the composer
      // and waiting made them press send on their own sentence. Leaving the
      // field is not asking, so it only seeds, and it must not clear a send
      // set a moment earlier: pressing the chip blurs the field, so the blur
      // arrives immediately after the press it belongs to.
      if (asked && send) agent.setAttribute('send', '');
    };

    /** Hands the field's words to the assistant and lets it answer them. */
    const askAi = () => {
      const asked = input.value.trim();
      input.blur();
      setFocused(false);
      window.dispatchEvent(
        new CustomEvent('abdm:ask-ai', {
          detail: {question: asked, send: asked !== ''},
        }),
      );
    };

    /** The row the arrow keys are on in the search theme's own results. */
    const onARow = () =>
      !!root.querySelector(
        "[class*='dropdownMenu'] [class*='suggestion'][class*='cursor']",
      );
    const sync = () => {
      const el = panel.current;
      if (el) el.hidden = input.value.trim() !== '';
    };
    const onFocus = () => {
      setFocused(true);
      setActive(-1);
      // The panel mounts on the render this focus causes, so it is synced on
      // the next frame rather than now.
      window.requestAnimationFrame(sync);
    };
    // Late, so a click on a row below lands before the panel goes.
    const onBlur = () => {
      carry(false);
      window.setTimeout(() => setFocused(false), 140);
    };
    // Up, down and enter belong to these rows only while they are the thing
    // on screen, which is while the field is empty. The moment anything is
    // typed the search theme's own results take the same keys back.
    const onKey = (event: KeyboardEvent) => {
      // Command or control and return is the assistant, and it is bound on
      // the window with the assistant's own key, below.
      if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) return;
      if (input.value.trim() !== '') {
        // Return with no row under the arrow keys used to do nothing at all:
        // the theme only acts on a selected row, so the most obvious key in
        // the box was dead. It is the whole search, which is the page that
        // lists every match.
        if (event.key === 'Enter' && !onARow()) {
          event.preventDefault();
          event.stopPropagation();
          const asked = input.value.trim();
          input.blur();
          setFocused(false);
          history.push(`/search?q=${encodeURIComponent(asked)}`);
        }
        return;
      }
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        event.stopPropagation();
        const step = event.key === 'ArrowDown' ? 1 : -1;
        const next =
          (activeRef.current + step + rows.length + (activeRef.current < 0 && step < 0 ? 1 : 0)) %
          rows.length;
        setActive(next);
      } else if (event.key === 'Enter' && activeRef.current >= 0) {
        event.preventDefault();
        event.stopPropagation();
        const row = rows[activeRef.current];
        input.blur();
        setFocused(false);
        row.run();
      } else if (event.key === 'Escape') {
        input.blur();
        setFocused(false);
      }
    };

    input.addEventListener('input', sync);
    input.addEventListener('focus', onFocus);
    input.addEventListener('blur', onBlur);
    input.addEventListener('keydown', onKey, true);
    const onChip = () => carry(true);
    agent?.addEventListener('mousedown', onChip, true);
    return () => {
      agent?.removeEventListener('mousedown', onChip, true);
      input.removeEventListener('input', sync);
      input.removeEventListener('focus', onFocus);
      input.removeEventListener('blur', onBlur);
      input.removeEventListener('keydown', onKey, true);
    };
  }, [rows]);

  // The assistant has a key of its own. Search has the command mark and K;
  // a reader who wants to ask rather than search should not have to reach for
  // the pointer to say so. Command or control and I, which no browser claims
  // on its own. The chip is told what to display rather than working it out,
  // because the key is bound here, not in the widget.
  React.useEffect(() => {
    const ua = navigator.userAgent;
    if (/Android|iPhone|iPad|iPod/.test(ua)) return;
    setShortcut(/Mac|iPhone|iPad|iPod/.test(ua) ? '\u2318I' : 'Ctrl I');
    const onKey = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || event.altKey) return;
      const field = box.current?.querySelector<HTMLInputElement>(
        'input.navbar__search-input',
      );
      // The key on its own from anywhere on the page, and return while the
      // caret is in the search field: a reader who has typed a question
      // there wants it answered rather than matched.
      const key = event.key.toLowerCase();
      const opening = key === 'i' && !event.shiftKey;
      const asking = event.key === 'Enter' && document.activeElement === field;
      if (!opening && !asking) return;
      event.preventDefault();
      const asked = field?.value.trim() ?? '';
      field?.blur();
      window.dispatchEvent(
        new CustomEvent('abdm:ask-ai', {
          detail: {question: asked, send: asked !== ''},
        }),
      );
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div ref={box} className="omnibox">
      <SearchBar />
      <QuickActions
        ref={panel}
        open={focused}
        active={active}
        onActive={setActive}
        onLeave={() => setFocused(false)}
      />
      {/* Citations are absolute against this site, because a relative
          /docs/... link is wrong on every host except this one. An absent
          api-base leaves the panel a labelled mock, which is what preview
          builds ship. */}
      <abdm-support-agent
        {...(chatUrl ? {'api-base': chatUrl} : {})}
        docs-origin={siteConfig.url + siteConfig.baseUrl.replace(/\/$/, '')}
        {...(mcpUrl ? {'mcp-url': mcpUrl} : {})}
        {...(starters ? {starters} : {})}
        {...(shortcut ? {shortcut} : {})}
        support-url={support}
      />
    </div>
  );
}
