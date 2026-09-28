// Atom contract v2: the sections each type needs, the join to the spec, and
// the machine-readable fields (facts, side, status). lint-atoms applies it to
// every atom; it is a pure function so its rules can be tested.
const SECTIONS = ["In plain words", "Before you start", "What happens",
                  "How you know it worked", "When it goes wrong"];
const [PLAIN, BEFORE, HAPPENS, WORKED, WRONG] = SECTIONS;

// The sections each type must carry. Any of the five may appear, in order;
// these must. One template for eleven types filled 310 error atoms with the
// same "Before you start" paragraph, and identical chunks compete in search.
const REQUIRED = {
  glossary: [PLAIN], concept: [PLAIN], decision: [PLAIN], sandbox: [PLAIN], fhir: [PLAIN],
  flow: SECTIONS, endpoint: SECTIONS, callback: SECTIONS, test: SECTIONS,
  error: [PLAIN, WRONG],
  troubleshooting: [PLAIN, HAPPENS, WRONG],
};
const SIDES = ["provider", "payer", "hip", "hiu", "both"];
const STATUSES = ["current", "deprecated", "draft"];

// contractProblems returns the contract v2 failures for one atom.
// ctx.operations maps a gateway to the set of operationIds its specifications
// define; ctx.atomIds is every atom id in the Catalogue.
export function contractProblems(fm, body, ctx) {
  const out = [];
  const headings = [...body.matchAll(/^##\s+(.+?)\s*$/gm)].map((h) => h[1]);
  // A generated atom leaves out any section its page has nothing for, and
  // build-sections.mjs writes the rest in order, so it needs only the first.
  const required = fm.generated === true ? [PLAIN] : (REQUIRED[fm.type] ?? SECTIONS);
  for (const s of required) if (!headings.includes(s)) out.push(`missing mandatory section: ## ${s}`);
  const present = SECTIONS.filter((s) => headings.includes(s));
  for (let i = 1; i < present.length; i++) {
    if (headings.indexOf(present[i]) < headings.indexOf(present[i - 1])) { out.push(`sections are out of order at "## ${present[i]}"`); break; }
  }

  // The join to the spec. NHCX atoms may leave it out until the NHCX source
  // is decided: no NHCX specification is in this repository to resolve against.
  if (fm.type === "endpoint" || fm.type === "callback") {
    if (fm.operation === undefined) {
      if (fm.gateway !== "nhcx") out.push(`${fm.type} atoms need operation: the operationId this atom documents`);
    } else if (!ctx.operations[fm.gateway]?.has(fm.operation)) {
      out.push(`operation "${fm.operation}" is not an operationId in catalogue/openapi/${fm.gateway}/`);
    }
  }
  if (fm.side !== undefined && !SIDES.includes(fm.side)) out.push(`side must be one of ${SIDES.join(", ")}`);
  if (fm.status !== undefined && !STATUSES.includes(fm.status)) out.push(`status must be one of ${STATUSES.join(", ")}`);
  if (fm.superseded_by !== undefined && !ctx.atomIds.has(fm.superseded_by)) out.push(`superseded_by names "${fm.superseded_by}", which no atom defines`);
  if (fm.facts !== undefined) {
    if (!Array.isArray(fm.facts)) out.push("facts must be a list of {key, value, source}");
    else fm.facts.forEach((f, i) => {
      if (typeof f?.key !== "string" || !f.key) out.push(`facts[${i}] needs a key`);
      if (f?.value === undefined || f.value === null || f.value === "") out.push(`facts[${i}] needs a value`);
      const n = (fm.sources ?? []).length;
      if (!Number.isInteger(f?.source) || f.source < 0 || f.source >= n) out.push(`facts[${i}].source ${f?.source} is not an index into sources (0 to ${n - 1})`);
    });
  }
  return out;
}
