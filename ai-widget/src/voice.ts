/**
 * Voice: reading an answer aloud, and dictating a question.
 *
 * Reading aloud is the browser's own voice and needs no server. Dictation
 * records here and sends the recording to the server this panel already
 * talks to, which turns it into words; those go into the box for the reader
 * to check, and are sent like anything typed. The browser's own speech
 * recognition is not used: in most browsers it sends the audio to a third
 * party, and a question here may carry a patient's identifier.
 */
const SPOKEN_PATH = 'the path shown on screen';
const SPOKEN_PATHS = new RegExp(`${SPOKEN_PATH}(?:,? (?:and |then |or )?${SPOKEN_PATH})+`, 'g');

/**
 * What an answer sounds like. An API path read character by character is
 * noise, and a code example is worse, so both are named and left on screen;
 * a header or an error code is short enough to say.
 */
export function speakable(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?(?:```|$)/g, '\nThe example is on screen.\n')
    .replace(/\[([^\]]+)\]\([^)\s]+\)/g, '$1')
    .replace(/`([^`]+)`/g, (_, code: string) => (/[/_{}=]/.test(code) ? SPOKEN_PATH : code))
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^\s*[-*]\s+/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(SPOKEN_PATHS, 'the paths shown on screen')
    .replace(/[ \t]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{2,}/g, '\n')
    .trim();
}

/** The voice to read with: Hindi for Devanagari, Indian English otherwise. */
export function speechLang(text: string): string {
  return /[ऀ-ॿ]/.test(text) ? 'hi-IN' : 'en-IN';
}

const RECORDING_TYPES = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus'];

/** The first recording format this browser supports, or null. */
export function recordingType(supports: (type: string) => boolean): string | null {
  return RECORDING_TYPES.find(supports) ?? null;
}

/** Whether this browser can record at all. */
export function canRecord(): boolean {
  return typeof MediaRecorder !== 'undefined' && Boolean(navigator.mediaDevices?.getUserMedia);
}

/**
 * How long a recording the server takes, in seconds, or 0 when it takes
 * none: voice input is a deployment's choice, and the panel shows no
 * microphone where it is off.
 */
export async function voiceInputSeconds(apiBase: string): Promise<number> {
  try {
    const res = await fetch(`${apiBase.replace(/\/$/, '')}/api/transcribe`);
    if (!res.ok) return 0;
    const out = (await res.json()) as {enabled?: boolean; max_seconds?: number};
    return out.enabled ? (out.max_seconds ?? 60) : 0;
  } catch {
    return 0;
  }
}

export type Recording = {
  /** Ends the recording and returns it. */
  stop: () => Promise<Blob>;
  /** Ends the recording and throws it away. */
  cancel: () => void;
};

/**
 * Starts recording the microphone. Rejects when the reader or the browser
 * refuses it. `onLimit` fires when the recording reaches `maxMs`, so the
 * caller can end it the same way a press would.
 */
export async function record(maxMs: number, onLimit: () => void): Promise<Recording> {
  const stream = await navigator.mediaDevices.getUserMedia({audio: true});
  const type = recordingType((t) => MediaRecorder.isTypeSupported(t));
  const recorder = new MediaRecorder(stream, type ? {mimeType: type} : undefined);
  const chunks: Blob[] = [];
  recorder.ondataavailable = (event) => {
    if (event.data.size) chunks.push(event.data);
  };
  const done = new Promise<Blob>((resolve) => {
    recorder.onstop = () =>
      resolve(new Blob(chunks, {type: recorder.mimeType || type || 'audio/webm'}));
  });
  // The microphone is let go the moment the recording ends, so the browser's
  // recording mark goes out with it.
  const release = () => stream.getTracks().forEach((track) => track.stop());
  const timer = window.setTimeout(onLimit, maxMs);
  const end = () => {
    window.clearTimeout(timer);
    if (recorder.state !== 'inactive') recorder.stop();
  };
  recorder.start();
  return {
    stop: () => {
      end();
      return done.finally(release);
    },
    cancel: () => {
      end();
      release();
    },
  };
}

/** Sends a recording for its words. Throws when the server cannot give them. */
export async function transcribe(apiBase: string, audio: Blob): Promise<string> {
  const res = await fetch(`${apiBase.replace(/\/$/, '')}/api/transcribe`, {
    method: 'POST',
    headers: {'Content-Type': audio.type || 'audio/webm'},
    body: audio,
  });
  if (!res.ok) throw new Error(`transcribe ${res.status}`);
  const out = (await res.json()) as {text?: string};
  return (out.text ?? '').trim();
}
