import React, {useState} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {cn} from '@site/src/lib/utils';
import SkillInstall from './SkillInstall';
import manifest from '@site/src/data/skills.json';

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
    label: 'ABHA identity (M1)',
    note: 'The whole of M1: the calls, the loop that builds them, every error code and the tests.',
  },
  {
    slug: 'abdm-m2',
    label: 'Link and share records (M2)',
    note: 'The whole of M2: linking care contexts, discovery, and pushing records to a requester.',
  },
  {
    slug: 'abdm-m3',
    label: 'Consent and fetching (M3)',
    note: 'The whole of M3: raising a consent request, reading the artefact, fetching what it covers.',
  },
  {
    slug: 'abdm-m4',
    label: 'Registries (M4)',
    note: 'The HPR and the HFR: the operations NHA has published, the registration order and the identifier formats.',
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
    note: 'The patient side of M3: subscriptions, auto approval, granting and revoking, and fetching a grant.',
  },
  {
    slug: 'abdm-phr-services',
    label: 'PHR extras',
    note: 'Services a PHR app may offer on top of ABDM. None of them is required to certify.',
  },
  {
    slug: 'abdm-fhir',
    label: 'FHIR bundles',
    note: 'Generating NRCES compliant bundles, and auditing the ones an existing store already emits.',
  },
];

// One skill per NHCX use case, in episode order. Each is a folder that
// installs and runs alone.
const NHCX_CHOICES: Choice[] = [
  {
    slug: 'nhcx-coverage',
    label: 'Coverage',
    note: 'Finds the policy, opens the claim episode on it, and asks the payer whether the cover is in force.',
  },
  {
    slug: 'nhcx-insurance',
    label: 'Insurance plan',
    note: "Requests the payer's package master once per facility and policy, reuses it, and quotes treatment lines from it.",
  },
  {
    slug: 'nhcx-preauth',
    label: 'Pre-authorisation',
    note: 'Sends the pre-authorisation, answers its queries, raises enhancements, cancels, and asks for a predetermination.',
  },
  {
    slug: 'nhcx-claim',
    label: 'Claim',
    note: "Records the discharge, files the claim under the pre-authorisation's number, and reads the decision.",
  },
  {
    slug: 'nhcx-payment',
    label: 'Payment',
    note: "Records the payer's payment notice once against its claim, and acknowledges it at once.",
  },
  {
    slug: 'nhcx-communication',
    label: 'Communication',
    note: "Sorts the payer's messages into queries and notifications, acknowledges notifications, and answers queries.",
  },
  {
    slug: 'nhcx-reprocess',
    label: 'Reprocess and status',
    note: 'Reopens a decided claim, asks for the balance of a short payment, and asks where a case stands.',
  },
];

const SETS: Record<string, Choice[]> = {abdm: CHOICES, nhcx: NHCX_CHOICES};

/** A skill of more than one file downloads as its archive, not its SKILL.md. */
const isFolder = (slug: string) =>
  (manifest as Record<string, {folder?: boolean}>)[slug]?.folder === true;

type SkillPickerProps = {
  /** Which gateway's skills to offer: ABDM's by default, or NHCX's. */
  set?: 'abdm' | 'nhcx';
};

export default function SkillPicker({set = 'abdm'}: SkillPickerProps): React.ReactNode {
  const choices = SETS[set] ?? CHOICES;
  const [choice, setChoice] = useState(choices[0]);
  const {siteConfig} = useDocusaurusContext();
  const base = `${siteConfig.url}${siteConfig.baseUrl}`.replace(/\/+$/, '');

  return (
    <div className="skill-picker">
      <div
        className="skill-install__targets skill-picker__choices"
        role="tablist"
        aria-label="What are you building?">
        {choices.map((option) => (
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

      {/* No packaged bundle exists (site/static/skills carries one folder per
          slug, plus an archive for a skill of more than one file, and no
          index), so this lists each skill rather than claiming a "download
          all" archive. */}
      <details className="skill-how skill-picker__all">
        <summary className="skill-how__summary">Download all skills</summary>
        <ul className="skill-picker__all-list">
          {choices.map((option) => (
            <li key={option.slug}>
              <a
                href={
                  isFolder(option.slug)
                    ? `${base}/skills/${option.slug}.tar.gz`
                    : `${base}/skills/${option.slug}/SKILL.md`
                }
                download>
                {option.label}
              </a>
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
