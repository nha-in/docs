import React, {useState} from 'react';
import {cn} from '@site/src/lib/utils';
import SkillInstall from './SkillInstall';

/**
 * Choose what you are building; see the one skill that serves it. Five
 * panels stacked whole read as a wall; the choice is the reader's first
 * question anyway, so the page asks it instead of answering all five at
 * once. The chips reuse the install panel's own tab styling.
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
    </div>
  );
}
