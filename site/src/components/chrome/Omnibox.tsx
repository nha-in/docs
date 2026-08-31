import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import SearchBar from '@theme/SearchBar';

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
export default function Omnibox() {
  const {siteConfig} = useDocusaurusContext();
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
  }, []);

  return (
    <div ref={box} className="omnibox">
      <SearchBar />
      {/* Citations are absolute against this site, because a relative
          /docs/... link is wrong on every host except this one. An absent
          api-base leaves the panel a labelled mock, which is what preview
          builds ship. */}
      <abdm-support-agent
        {...(chatUrl ? {'api-base': chatUrl} : {})}
        docs-origin={siteConfig.url + siteConfig.baseUrl.replace(/\/$/, '')}
        support-url={support}
      />
    </div>
  );
}
