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
    label: 'Create and verify ABHA (M1)',
    note: 'The whole of M1: the calls, the loop that builds them, every error code and the tests.',
  },
  {
    slug: 'abdm-m2',
    label: 'Creation, Linking and Sharing of Health Records (M2)',
    note: 'The whole of M2: linking care contexts, discovery, and pushing records to a requester.',
  },
  {
    slug: 'abdm-m3',
    label: 'Health Information Exchange with Consent (M3)',
    note: 'The whole of M3: raising a consent request, reading the artefact, fetching what it covers.',
  },
  {
    slug: 'abdm-m4',
    label: 'Register Healthcare Professionals and Health Facilities (M4)',
    note: 'The HPR and the HFR: the operations NHA has published, the registration order and the identifier formats.',
  },
  {
    slug: 'abdm-p1',
    label: 'PHR registration and login (P1)',
    note: 'Creating an ABHA address in a PHR app and logging in to it.',
  },
  {
    slug: 'abdm-p2',
    label: 'Consents Management (P2)',
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

// One skill for the whole integration, and one per NHCX use case. Each
// carries both sides of its exchanges, and is a folder that installs and runs alone.
const NHCX_CHOICES: Choice[] = [
  {
    slug: 'nhcx-full',
    label: 'Everything',
    note: 'The whole integration, every exchange end to end on either side, with the NHCX gateway embedded in the application.',
  },
  {
    slug: 'nhcx-coverage',
    label: 'Coverage',
    note: "Policy search and the coverage eligibility check, asked and answered, before admission or pre-authorisation.",
  },
  {
    slug: 'nhcx-preauth',
    label: 'Preauth',
    note: 'The insurance plan, the line items, and the pre-authorisation with its enhancements, queries, answers and cancellation, on either side.',
  },
  {
    slug: 'nhcx-claim',
    label: 'Claim',
    note: 'The discharge, the claim with its documents, its queries and answers, and the verdict, on either side.',
  },
  {
    slug: 'nhcx-communication',
    label: 'Communication',
    note: 'Queries, notifications and notes on a case, replies with text and documents, and acknowledgements, on either side.',
  },
  {
    slug: 'nhcx-payment',
    label: 'Payment',
    note: 'The payment notice and its breakdown, sent, matched to the claim and acknowledged.',
  },
  {
    slug: 'nhcx-reprocess',
    label: 'Reprocess',
    note: 'A second look at a decided claim, and the unpaid balance of a partly paid one, asked for and answered.',
  },
];

// One skill per UHI service. Each is a folder that installs and runs alone.
const UHI_CHOICES: Choice[] = [
  {
    slug: 'uhi-consultation',
    label: 'Physical consultation',
    note: 'Lets patients in your app book a physical consultation, as an EUA or an HSPA.',
  },
  {
    slug: 'uhi-ambulance',
    label: 'Ambulance',
    note: 'Adds ambulance search and a quote to your app, as an EUA or an HSPA.',
  },
  {
    slug: 'uhi-pmjay-hem',
    label: 'PM-JAY HEM',
    note: 'Shows PM-JAY empanelled hospitals near the patient.',
  },
  {
    slug: 'uhi-blood-bank',
    label: 'Blood bank',
    note: 'Shows blood banks near the patient that hold the group they need.',
  },
  {
    slug: 'uhi-jan-aushadhi',
    label: 'Jan Aushadhi',
    note: 'Lets patients find a Jan Aushadhi Kendra that stocks their medicine.',
  },
  {
    slug: 'uhi-notto',
    label: 'NOTTO',
    note: 'Shows hospitals authorised for a transplant in a state.',
  },
];

const SETS: Record<string, Choice[]> = {abdm: CHOICES, nhcx: NHCX_CHOICES, uhi: UHI_CHOICES};

/** A skill of more than one file downloads as its archive, not its SKILL.md. */
const isFolder = (slug: string) =>
  (manifest as Record<string, {folder?: boolean}>)[slug]?.folder === true;

type SkillPickerProps = {
  /** Which gateway's skills to offer: ABDM's by default, or NHCX's or UHI's. */
  set?: 'abdm' | 'nhcx' | 'uhi';
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
