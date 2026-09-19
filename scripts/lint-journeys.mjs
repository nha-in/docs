import {validateJourneys} from './lib/journeys.mjs';
const problems = validateJourneys();
for (const p of problems) console.error(`  ${p}`);
console.log(problems.length ? `lint-journeys: ${problems.length} problem(s)` : 'lint-journeys: every step names an operation and an example that exist');
if (problems.length) process.exit(1);
