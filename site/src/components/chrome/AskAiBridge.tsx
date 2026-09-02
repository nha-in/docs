import {useEffect} from 'react';

/**
 * Lets any page open the Ask AI panel without knowing where it lives.
 * Dispatch `window.dispatchEvent(new CustomEvent('abdm:ask-ai'))` and the
 * `<abdm-support-agent>` element in the top bar opens, the same way its own
 * chip opens it: by setting its `open` attribute.
 */
export default function AskAiBridge(): null {
  useEffect(() => {
    const open = () => {
      const el = document.querySelector('abdm-support-agent');
      if (el) el.setAttribute('open', '');
    };
    window.addEventListener('abdm:ask-ai', open);
    return () => window.removeEventListener('abdm:ask-ai', open);
  }, []);
  return null;
}
