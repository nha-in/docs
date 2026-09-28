import {listSpecTree, platformFeatures} from './specs.mjs';
import {loadJourneys, operationIndex, validateJourneys} from './lib/journeys.mjs';

// Every gateway version whose reference follows journeys is linted against
// its own operations, so a step can only name a call in the same gateway.
const problems = [];
for (const {platform, version} of listSpecTree()) {
  if (!platformFeatures(platform, version).journeys) continue;
  const journeys = loadJourneys({platform, version});
  problems.push(...validateJourneys(journeys, operationIndex({platform, version})).map((p) => `${platform}/${version} ${p}`));
  console.log(`journeys: ${platform}/${version} ${[...journeys.values()].flat().length}`);
}
for (const p of problems) console.error(`  ${p}`);
console.log(problems.length ? `lint-journeys: ${problems.length} problem(s)` : 'lint-journeys: every step names an operation and an example that exist');
if (problems.length) process.exit(1);
