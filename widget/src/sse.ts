/** One catalogue atom an answer drew on, surfaced as a citation chip. */
export type Source = {id: string; title: string; status: string; url: string};

/** Fallback text when the live backend cannot be reached mid-stream. */
export const UNREACHABLE =
  'The assistant is unreachable right now. Try again shortly.';

type StreamHandlers = {
  onText: (delta: string) => void;
  onTool: (detail: string) => void;
  onSources: (sources: Source[]) => void;
  onError: (message: string) => void;
};

/**
 * A minimal SSE reader over a fetch body. The backend sends four event types,
 * one JSON payload each: "tool" while the model is consulting the catalogue,
 * "text" for streamed answer deltas, "sources" at most once with the
 * citations for the reply, and "done" when the turn is over. "error" carries
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
        handlers.onTool(tool.detail || tool.name);
        break;
      }
      case 'sources':
        handlers.onSources(payload as Source[]);
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
