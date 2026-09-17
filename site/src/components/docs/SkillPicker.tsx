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
 * The order is the order a reader arrives in: the provider milestones, then
 * the patient side, then the two that belong to neither. One chip per skill,
 * and a skill is a whole module: scaffolding it, integrating it, debugging it
 * and testing it are sections inside, not skills of their own.
 */
type Choice = {
  slug: string;
  label: string;
  note: string;
};

const CHOICES: Choice[] = [
  {
    slug: 'abdm-m1',
    label: 'ABHA Creation and Verification (M1)',
    note: 'The whole of M1: the calls, the loop that builds them, every error code and the tests.',
  },
  {
    slug: 'abdm-m2',
    label: 'Health Information Provider Services (M2)',
    note: 'The whole of M2: linking care contexts, discovery, and pushing records to a requester.',
  },
  {
    slug: 'abdm-m3',
    label: 'Health Information User Services (M3)',
    note: 'The whole of M3: raising a consent request, reading the artefact, fetching what it covers.',
  },
  {
    slug: 'abdm-m4',
    label: 'National Healthcare Providers Registry (M4)',
    note: 'The HPR and the HFR: the operations NHA has published, the registration order and the identifier formats.',
  },
  {
    slug: 'abdm-p1',
    label: 'PHR registration and login (P1)',
    note: 'Creating an ABHA address in a PHR app and logging in to it.',
  },
  {
    slug: 'abdm-p2',
    label: 'PHR management (P2)',
    note: 'The PHR profile, linking an ABHA number, switching profiles, and linking, sharing and consent for the patient.',
  },
  {
    slug: 'abdm-p3',
    label: 'PHR subscriptions (P3)',
    note: 'Reading, approving, denying, enabling, disabling and updating the patient\'s subscriptions and subscription requests.',
  },
  {
    slug: 'abdm-p4',
    label: 'Health lockers (P4)',
    note: 'Setting up a health locker and listing the lockers and requests on an ABHA address.',
  },
  {
    slug: 'abdm-fhir',
    label: 'FHIR bundles',
    note: 'Generating NRCES compliant bundles, and auditing the ones an existing store already emits.',
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
