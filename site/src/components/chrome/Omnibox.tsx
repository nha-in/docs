import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
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
  const support = useBaseUrl('/docs/support');
  const box = React.useRef<HTMLDivElement>(null);
  const panel = React.useRef<HTMLDivElement>(null);
  const [focused, setFocused] = React.useState(false);
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
    const carry = () => {
      if (!agent) return;
      const asked = input.value.trim();
      if (asked) agent.setAttribute('question', asked);
      else agent.removeAttribute('question');
    };
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
      carry();
      window.setTimeout(() => setFocused(false), 140);
    };
    // Up, down and enter belong to these rows only while they are the thing
    // on screen, which is while the field is empty. The moment anything is
    // typed the search theme's own results take the same keys back.
    const onKey = (event: KeyboardEvent) => {
      if (input.value.trim() !== '') return;
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
    agent?.addEventListener('mousedown', carry, true);
    return () => {
      agent?.removeEventListener('mousedown', carry, true);
      input.removeEventListener('input', sync);
      input.removeEventListener('focus', onFocus);
      input.removeEventListener('blur', onBlur);
      input.removeEventListener('keydown', onKey, true);
    };
  }, [rows]);

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
        {...(starters ? {starters} : {})}
        support-url={support}
      />
    </div>
  );
}
