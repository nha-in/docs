export type Draft = {
  method: string;
  /** Already substituted and query joined. What fetch will be handed. */
  url: string;
  /** Exactly the headers that will go out, in send order. */
  headers: Record<string, string>;
  body?: string;
};

const quote = (value: string) => value.replace(/'/g, `'\\''`);

/**
 * The same line shape the generator writes, so the console's cURL and the one
 * beside the page read as one thing rather than two dialects.
 */
export function curlFrom(draft: Draft): string {
  const lines = [`curl --request ${draft.method} \\`, `  --url ${draft.url} \\`];
  for (const [name, value] of Object.entries(draft.headers)) {
    lines.push(`  --header '${quote(`${name}: ${value}`)}' \\`);
  }
  if (draft.body) lines.push(`  --data '${quote(draft.body)}'`);
  else lines[lines.length - 1] = lines[lines.length - 1].replace(/ \\$/, '');
  return lines.join('\n');
}
