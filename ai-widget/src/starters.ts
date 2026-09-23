/**
 * The empty state's openers, shown as pills under the greeting.
 *
 * A pill carries a short label and the full question it asks, because a pill
 * has room for two or three words and a good question needs more. A blank
 * chat box is the hardest question a reader answers; these teach the panel's
 * range in one glance, and each is one the catalogue genuinely answers.
 */
export type Starter = {label: string; prompt: string};

export const DEFAULT_STARTERS: Starter[] = [
  {label: 'Create an ABHA', prompt: 'How do I create an ABHA with an Aadhaar OTP?'},
  {label: 'Link care contexts', prompt: 'How do I link care contexts to an ABHA?'},
  {label: 'Request consent', prompt: 'How does an HIU raise a consent request?'},
  {label: 'Decode an error', prompt: 'What does ABDM-1016 mean and how do I fix it?'},
  {label: 'Learn about Ask AI', prompt: 'What can the Ask AI assistant do?'},
];

/**
 * Reads the host's `starters` attribute: one opener per line, at most five.
 * A line may be `label | prompt`; a line with no bar is its own label, which
 * is how every host wrote them before pills had labels.
 */
export function startersFrom(given: string): Starter[] {
  const lines = given
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
  if (!lines.length) return DEFAULT_STARTERS;
  return lines.slice(0, 5).map((line) => {
    const bar = line.indexOf('|');
    if (bar < 0) return {label: line, prompt: line};
    const label = line.slice(0, bar).trim();
    const prompt = line.slice(bar + 1).trim();
    return {label: label || prompt, prompt: prompt || label};
  });
}
