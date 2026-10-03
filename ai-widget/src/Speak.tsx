/**
 * Reads an answer aloud with the browser's own voice. Nothing leaves the
 * page. Where the browser has no voice the button does not render, the way
 * the copy button does not where there is no clipboard.
 */
import {useEffect, useState} from 'preact/hooks';
import {Square, Volume} from './icons';
import {speakable, speechLang} from './voice';

export function SpeakButton({text, className}: {text: string; className: string}) {
  const [speaking, setSpeaking] = useState(false);

  // An answer that leaves the screen, because the panel closed or a new chat
  // began, stops being read.
  useEffect(() => {
    if (!speaking) return;
    return () => window.speechSynthesis.cancel();
  }, [speaking]);

  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

  return (
    <button
      type="button"
      class={className}
      aria-label={speaking ? 'Stop reading' : 'Read aloud'}
      aria-pressed={speaking}
      onClick={() => {
        const synth = window.speechSynthesis;
        // One voice at a time: starting here ends whatever else was reading.
        synth.cancel();
        if (speaking) {
          setSpeaking(false);
          return;
        }
        const said = speakable(text);
        const utterance = new SpeechSynthesisUtterance(said);
        utterance.lang = speechLang(said);
        utterance.onend = () => setSpeaking(false);
        utterance.onerror = () => setSpeaking(false);
        setSpeaking(true);
        synth.speak(utterance);
      }}>
      {speaking ? <Square /> : <Volume />}
    </button>
  );
}
