import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import SearchBar from '@theme/SearchBar';
import CommandPalette from './CommandPalette';
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

    // One field, so a half typed question survives the move between its two
    // halves. Whatever is in the search box is mirrored onto the assistant,
    // which seeds its composer when it opens. Nothing is asked on the
    // reader's behalf: the words are handed over, and they still press send.
    const input = root.querySelector<HTMLInputElement>(
      'input.navbar__search-input',
    );
    const agent = root.querySelector('abdm-support-agent');
    if (!input || !agent) return;
    const carry = () => {
      const asked = input.value.trim();
      if (asked) agent.setAttribute('question', asked);
      else agent.removeAttribute('question');
    };
    carry();
    input.addEventListener('input', carry);
    return () => input.removeEventListener('input', carry);
  }, []);

  return (
    <div ref={box} className="omnibox">
      <SearchBar />
      <CommandPalette />
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
