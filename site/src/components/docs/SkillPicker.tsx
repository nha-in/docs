import React, {useState} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {cn} from '@site/src/lib/utils';
import SkillInstall from './SkillInstall';

/**
 * Choose what you are building; see the one skill that serves it. Twenty two
 * panels stacked whole read as a wall; the choice is the reader's first
 * question anyway, so the page asks it instead of answering all of them at
 * once. The chips reuse the install panel's own tab styling.
 *
 * The order is the order a reader arrives in: the module references first,
 * provider side then patient side, then the guided loops that build and
 * debug a milestone, then the two FHIR procedures.
 */
type Choice = {
  slug: string;
  label: string;
  note: string;
};

const CHOICES: Choice[] = [
  {
    slug: 'abdm-m1',
    label: 'ABHA identity (M1)',
    note: 'The whole of M1 as one file an agent reads. Generated from these pages, so it says what they say.',
  },
  {
    slug: 'abdm-m2',
    label: 'Link and share records (M2)',
    note: 'The whole of M2 as one file an agent reads. Generated from these pages, so it says what they say.',
  },
  {
    slug: 'abdm-m3',
    label: 'Consent and fetching (M3)',
    note: 'The whole of M3 as one file an agent reads. Generated from these pages, so it says what they say.',
  },
  {
    slug: 'abdm-m4',
    label: 'Registries (M4)',
    note: 'The HPR and HFR as one file: the operations NHA has published, the registration order and the identifier formats.',
  },
  {
    slug: 'abdm-p1',
    label: 'PHR identity (P1)',
    note: 'The patient side of M1: registration in a PHR app, the four login routes, and the profile the user holds.',
  },
  {
    slug: 'abdm-p2',
    label: 'PHR linking (P2)',
    note: 'The patient side of M2: discovering records held elsewhere and linking them to an ABHA address.',
  },
  {
    slug: 'abdm-p3',
    label: 'PHR consent (P3)',
    note: 'The patient side of M3: subscriptions, auto approval, granting and revoking, and fetching what a grant covers.',
  },
  {
    slug: 'abdm-phr-services',
    label: 'PHR extras',
    note: 'Services a PHR app may offer on top of ABDM. None of them is required to certify.',
  },
  {
    slug: 'hiecm-m1-build',
    label: 'Scaffold M1',
    note: 'Builds each M1 flow against the sandbox as a loop that ends on an observed result, not on a call returning 200.',
  },
  {
    slug: 'hiecm-m1-debug',
    label: 'Debug M1',
    note: 'Matches a failed M1 call to a recorded error and walks to a named fix, done only when the original step succeeds.',
  },
  {
    slug: 'hiecm-m2-build',
    label: 'Scaffold M2',
    note: 'Builds M2 linking against the sandbox as a loop that ends on the callback, not on the acknowledgement.',
  },
  {
    slug: 'hiecm-m2-debug',
    label: 'Debug M2',
    note: 'Fifteen recorded M2 errors, each with what it looks like, what to change, and how you know it worked.',
  },
  {
    slug: 'hiecm-m3-build',
    label: 'Scaffold M3',
    note: 'Builds the consent request and the fetch that follows it, each ending on an observed callback.',
  },
  {
    slug: 'hiecm-m3-debug',
    label: 'Debug M3',
    note: 'Matches a failed consent or fetch call to a recorded error and walks to a named fix.',
  },
  {
    slug: 'hiecm-m4-build',
    label: 'Scaffold M4',
    note: 'Builds the HPR and HFR registrations in order, each step ending on the registry showing the thing it created.',
  },
  {
    slug: 'hiecm-m4-debug',
    label: 'Debug M4',
    note: 'Matches a failed HPR or HFR call to a recorded HIS error and walks to a named fix.',
  },
  {
    slug: 'hiecm-p1-build',
    label: 'Scaffold P1',
    note: 'Builds ABHA address creation and all four login routes into a PHR app.',
  },
  {
    slug: 'hiecm-p1-debug',
    label: 'Debug a PHR app',
    note: 'The AS error codes, which NHA records once for the whole patient side, so this one covers P1, P2 and P3.',
  },
  {
    slug: 'hiecm-p2-build',
    label: 'Scaffold P2',
    note: 'Builds discovery, user initiated linking and scan and share, with the wording NHA specifies for each outcome.',
  },
  {
    slug: 'hiecm-p3-build',
    label: 'Scaffold P3',
    note: 'Builds subscriptions, auto approval and the fetch that turns a linked care context into a stored record.',
  },
  {
    slug: 'fhir-generate',
    label: 'Generate FHIR bundles',
    note: 'Builds FHIR document bundle generation into your codebase, iterating against the validator until clean.',
  },
  {
    slug: 'fhir-audit',
    label: 'Audit a FHIR store',
    note: "Checks your FHIR store's bundles against the NRCES profiles and pins down what to fix, and where.",
  },
];

export default function SkillPicker(): React.ReactNode {
  const [choice, setChoice] = useState(CHOICES[0]);
  const {siteConfig} = useDocusaurusContext();
  const base = `${siteConfig.url}${siteConfig.baseUrl}`.replace(/\/+$/, '');

  return (
    <div className="skill-picker">
      <div
        className="skill-install__targets skill-picker__choices"
        role="tablist"
        aria-label="What are you building?">
        {CHOICES.map((option) => (
          <button
            key={option.slug}
            type="button"
            role="tab"
            aria-selected={option.slug === choice.slug}
            className={cn(
              'skill-install__target',
              option.slug === choice.slug && 'skill-install__target--active',
            )}
            onClick={() => setChoice(option)}>
            {option.label}
          </button>
        ))}
      </div>
      <SkillInstall key={choice.slug} slug={choice.slug} note={choice.note} />

      {/* No packaged bundle exists yet (site/static/skills carries one
          SKILL.md per slug, no zip or index), so this lists each file
          directly rather than claiming a "download all" archive. */}
      <details className="skill-how skill-picker__all">
        <summary className="skill-how__summary">Download all skills</summary>
        <ul className="skill-picker__all-list">
          {CHOICES.map((option) => (
            <li key={option.slug}>
              <a href={`${base}/skills/${option.slug}/SKILL.md`} download>
                {option.label}
              </a>
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
