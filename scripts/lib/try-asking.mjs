// The prompts a person can paste the moment a skill, a plugin or the Docs MCP
// server is installed. Each is derived from a skill's row in the skills
// manifest, so a prompt names only what the skill carries: the error prompt
// names a code from the module's own specification, and a module with no test
// section gets no test prompt. Nothing here is typed in per module, so nothing
// here goes stale when a journey or a code changes.

/** What a person calls the skill's subject in a sentence. */
function subject(entry) {
  if (entry.gateway === 'uhi') return `UHI ${entry.title}`;
  if (entry.gateway === 'nhcx') return entry.title.split(',')[0];
  return entry.module;
}

/** Up to four prompts for one skill, the build prompt first. */
export function tryAsking(entry) {
  const name = subject(entry);
  const sections = entry.sections ?? [];
  const prompts = [entry.example];
  if (entry.operations) prompts.push(`What has to be in place before my first ${name} call?`);
  if (sections.includes('debug')) {
    prompts.push(
      entry.errorExample
        ? `My ${name} call returned ${entry.errorExample}. What is wrong, and how do I fix it?`
        : `My ${name} call failed. Here is the response: what is wrong, and how do I fix it?`,
    );
  }
  if (sections.includes('audit')) prompts.push('Audit the FHIR bundles this codebase already emits');
  if (sections.includes('test')) prompts.push(`Walk me through the ${name} test cases before go-live`);
  return prompts;
}

/** What an agent does when it has the skill loaded and nothing asked of it. */
export const IDLE_RULE =
  'Loaded with no task? Say in three lines what this skill does. Offer the prompts above. Then ask what the person is building, and whether the code for it exists yet.';

/** The section every skill router carries, after its list of capabilities. */
export function tryAskingSection(entry) {
  return ['## Try asking', '', ...tryAsking(entry).map((p) => `- "${p}"`), '', IDLE_RULE, ''];
}
