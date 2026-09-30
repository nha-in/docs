import type {SkillUse} from './commands';

/** One catalogue atom an answer drew on, surfaced as a citation chip. */
export type Source = {id: string; title: string; status: string; url: string};

/**
 * An API literal the answer may quote, paired with the reference page that
 * documents it. The server builds these from the passages it retrieved, so
 * a path the model invented never gets one.
 */
export type Link = {literal: string; url: string};

/** A next question offered as a pill under an answer; prompt is what is sent. */
export type Suggestion = {id: string; title: string; prompt: string};

/** Fallback text when the live backend cannot be reached mid-stream. */
export const UNREACHABLE =
  'The assistant is unreachable right now. Try again shortly.';

/**
 * What to show when the server refused the question before answering. A
 * rate limit is not an unreachable assistant: the server's 429 carries which
 * limit and how long to wait, and the reader is told that. Anything the
 * panel cannot name stays UNREACHABLE.
 */
export function failureMessage(status: number, body: unknown): string {
  if (status !== 429) return UNREACHABLE;
  const b = (body ?? {}) as {limit?: string; retry_after_seconds?: number};
  if (b.limit === 'day') {
    return "This connection has used today's questions. The limit resets at midnight UTC.";
  }
  if (b.limit === 'minute') {
    const s = Math.ceil(b.retry_after_seconds ?? 0);
    const wait = s > 5 ? `about ${s} seconds` : 'a moment';
    return `Too many questions in the last minute. Wait ${wait} and ask again.`;
  }
  return 'Too many questions in a short time. Wait a minute and ask again.';
}

type StreamHandlers = {
  onText: (delta: string) => void;
  onTool: (detail: string) => void;
  onSources: (sources: Source[]) => void;
  /** Literals with reference pages, sent once before "sources". */
  onLinks?: (links: Link[]) => void;
  /** Next questions to offer under the answer, sent once before "sources". */
  onSuggestions?: (suggestions: Suggestion[]) => void;
  onError: (message: string) => void;
  /** Which skill section a command used, sent once before the answer. */
  onSkill?: (use: SkillUse) => void;
};

/**
 * A minimal SSE reader over a fetch body. The backend sends four event types,
 * one JSON payload each: "tool" while the model is consulting the catalogue,
 * "text" for streamed answer deltas, "sources" at most once with the
 * citations for the reply, and "done" when the turn is over. A question
 * asked with a command also gets "skill", once, before any text. "error" carries
 * a message when the loop cannot continue.
 */
export async function readStream(
  body: ReadableStream<Uint8Array>,
  handlers: StreamHandlers,
): Promise<void> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  const dispatch = (block: string) => {
    let event = 'message';
    const dataLines: string[] = [];
    for (const line of block.split('\n')) {
      if (line.startsWith('event:')) {
        event = line.slice(6).trim();
      } else if (line.startsWith('data:')) {
        dataLines.push(line.slice(5).trim());
      }
    }
    if (dataLines.length === 0) return;
    let payload: unknown;
    try {
      payload = JSON.parse(dataLines.join('\n'));
    } catch {
      return;
    }
    switch (event) {
      case 'text':
        handlers.onText((payload as {delta: string}).delta ?? '');
        break;
      case 'tool': {
        const tool = payload as {name: string; detail: string};
        handlers.onTool(activityFor(tool.name));
        break;
      }
      case 'sources':
        handlers.onSources(payload as Source[]);
        break;
      case 'links':
        handlers.onLinks?.(payload as Link[]);
        break;
      case 'suggestions':
        handlers.onSuggestions?.(payload as Suggestion[]);
        break;
      case 'skill':
        handlers.onSkill?.(payload as SkillUse);
        break;
      case 'error':
        handlers.onError((payload as {message: string}).message || UNREACHABLE);
        break;
      default:
        break;
    }
  };

  for (;;) {
    const {done, value} = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, {stream: true});
    let sep;
    while ((sep = buffer.indexOf('\n\n')) !== -1) {
      const block = buffer.slice(0, sep);
      buffer = buffer.slice(sep + 2);
      dispatch(block);
    }
  }
}

/**
 * What the activity line says while the assistant uses a tool. It names the
 * action, never the tool's input: a search query is the reader's question
 * reworded, and showing it read as the question repeated back to them.
 */
const ACTIVITY: Record<string, string> = {
  search_docs: 'Searching the docs',
  search: 'Searching the docs',
  get_atom: 'Reading the docs',
  related_atoms: 'Reading the docs',
  list_atoms: 'Reading the docs',
  get_operation: 'Reading the API reference',
  list_operations: 'Reading the API reference',
  decode_error: 'Looking up the error',
  validate_request: 'Checking the request',
  validate_fhir: 'Checking the FHIR bundle',
  get_fhir_example: 'Reading the FHIR profiles',
  get_fhir_profile: 'Reading the FHIR profiles',
  list_fhir_profiles: 'Reading the FHIR profiles',
  catalogue_info: 'Checking the catalogue',
};

export function activityFor(name: string): string {
  return ACTIVITY[name] ?? 'Looking this up';
}
