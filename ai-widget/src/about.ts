/**
 * What the panel says about itself.
 *
 * "What can the Ask AI assistant do?" is a question about this panel, not
 * about ABDM, and sent to the model it was answered from whatever search
 * ranked highest: on one page that was an NHCX payer query. The answer is the
 * same for every reader on every page, so the panel gives it, the way it
 * gives the install steps, and the model is not asked.
 *
 * Kept in step with the catalogue's own page on the assistant,
 * catalogue/shared/concepts/ask-ai-assistant.md. Change one, change the other.
 */
export const ABOUT = [
  "I answer questions about integrating with ABDM, from this portal's documentation and API references. Every answer lists the pages it used, so you can check the source.",
  '',
  '**What you can ask**',
  '',
  '- How to do something: create an ABHA, link records, request consent.',
  '- What an error code means, and how to fix it.',
  '- What a field, header or term means.',
  '',
  '**What you can give me**',
  '',
  '- **A page.** Press **+** and attach any page on this portal, or open me from **Ask about this page**.',
  '- **A file.** A request, a response, a log, a PDF or a screenshot. It is read in your browser, and only its text is sent.',
  "- **A command.** **Scaffold**, **Design**, **Integrate** and **Debug** under the chat bar draw on that part of a module's agent skill.",
  '',
  '**What I will not do**',
  '',
  '- Write code for your project. I show curl requests. For code, install the agent skills or the MCP server in your own coding agent.',
  '- Answer from general knowledge. A path, a header or an error code comes from this portal or not at all.',
  '- Stand in for support, for accounts, credentials or production approval.',
  '',
  'Your conversations stay in this browser. **History** lists them, and **New** starts again.',
].join('\n');

/**
 * Whether a question is about the panel itself. Deliberately narrow: only a
 * question that is plainly asking what the assistant is or does, so an ABDM
 * question that happens to say "you" still goes to the model.
 */
const ABOUT_RE =
  /^(?:what (?:can|do|does) (?:you|this (?:assistant|bot|chat)|the (?:ask ai )?(?:assistant|bot)|ask ai) do|what (?:is|are) (?:you|ask ai|this (?:assistant|bot))|who are you|how (?:do|can) i use (?:you|this|ask ai|the assistant)|help)\s*\??$/i;

export function isAboutQuestion(question: string): boolean {
  return ABOUT_RE.test(question.trim().replace(/\s+/g, ' '));
}
