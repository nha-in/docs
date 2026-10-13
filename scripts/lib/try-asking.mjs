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

/** The file an integration is planned in and its progress kept in. */
export const PLAN_FILE = 'INTEGRATION-PLAN.md';

/**
 * How integration work is scoped and tracked, whatever starts it: a skill, an
 * agent, a start command, the setup prompt or the Docs MCP server. A person
 * who opens a new session, or switches tools, finds the plan and where it
 * stands in one file rather than in a conversation that has gone. The MCP
 * server carries the same rule in mcp/internal/server/onboarding.go.
 */
export const PLAN_RULE = [
  `Integration work starts from a plan file and keeps it current. Before the first change to the codebase and the first sandbox call:`,
  '',
  `1. Look for \`${PLAN_FILE}\` at the root of the repository. If it exists, read it, say in one line where the work stands, and resume from the first step that is not \`done\`.`,
  `2. If it does not exist, scope the work first: the goal, the role, the modules and the skill that carries each, the routes the interview switched on, and what is out of scope. Write the file with every step \`pending\` and its exit condition, show it to the person, and start when they agree.`,
  `3. After every step, update the file at once: its status, the evidence that proves its exit condition (a request id, a passing test, a file changed), the date, and the count and percentage of steps \`done\`.`,
  '',
  '| Status | Means |',
  '|---|---|',
  '| `pending` | Not started |',
  '| `in progress` | The step being worked on now. One at a time |',
  '| `done` | Its exit condition was observed, and the evidence is in the file |',
  '| `blocked` | Waiting on something only the person can give. The file names it and asks one question |',
  '',
  `The last steps are the module's functional test cases. Their run log is its own file, linked from the plan. Never write a secret to the plan: no token, client secret, OTP, password or patient identifier.`,
];

/** The plan file section, for a router or a start command. */
export function planSection() {
  return ['## The plan file', '', ...PLAN_RULE, ''];
}

/** The section every skill router carries, after its list of capabilities. */
export function tryAskingSection(entry) {
  return ['## Try asking', '', ...tryAsking(entry).map((p) => `- "${p}"`), '', IDLE_RULE, '', ...planSection()];
}
