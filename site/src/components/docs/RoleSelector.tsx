import React, {useEffect, useState} from 'react';
import Link from '@docusaurus/Link';
import {useRole} from '@site/src/config/roles';

/**
 * "Who are you?" on the Get started page.
 *
 * The site already has a role model: `useRole('hiecm')` holds 'ims' or 'phr',
 * shares the choice across the page and remembers it, and the sidebar is
 * scoped by the same value. This block is a friendlier front door to it, so a
 * reader who does not yet know the word HIP can still pick a side.
 *
 * Two of the four choices set the same role, so the role alone cannot say
 * which card to light up after a reload. The card id is kept beside it, and
 * the role stays the thing everything else reads.
 */

type Choice = {
  id: string;
  /** The role this choice sets: null shows everything. */
  role: string | null;
  label: string;
  /** One line on what the reader is in the ABDM ecosystem. */
  what: string;
};

const CHOICES: Choice[] = [
  {
    id: 'facility',
    role: 'ims',
    label: 'Health facility',
    what: 'A hospital, clinic, lab or pharmacy. You hold records and share them: a HIP, and often an HIU too.',
  },
  {
    id: 'vendor',
    role: 'ims',
    label: 'IMS vendor',
    what: 'You build the EMR, HIMS, LIMS or PMS a facility runs, so you write its HIP and HIU code.',
  },
  {
    id: 'phr',
    role: 'phr',
    label: 'PHR app',
    what: 'You build the app a patient uses to hold their own records and give consent.',
  },
  {
    id: 'unsure',
    role: null,
    label: 'Not sure yet',
    what: 'Still working out where you fit. Nothing is filtered and you see the whole path.',
  },
];

type Step = {label: string; detail: string; to: string};

const IMS_JOURNEY: Step[] = [
  {
    label: 'Create',
    detail: 'Create and verify an ABHA, the identity every record hangs off.',
    to: '/docs/hiecm/v3/milestones/m1',
  },
  {
    label: 'Attach',
    detail: 'Attach records to that ABHA as care contexts, so they can be found.',
    to: '/docs/hiecm/v3/milestones/m2',
  },
  {
    label: 'Retrieve',
    detail: 'Retrieve records from other systems under a consent you requested.',
    to: '/docs/hiecm/v3/milestones/m3',
  },
  {
    label: 'Enrol',
    detail: 'Enrol your facility and its professionals in the national registries.',
    to: '/docs/hiecm/v3/milestones/m4',
  },
];

const PHR_JOURNEY: Step[] = [
  {
    label: 'P1 Identity and profile',
    detail: 'Sign a patient in with their ABHA and hold their profile.',
    to: '/docs/hiecm/v3/milestones/p1',
  },
  {
    label: 'P2 Linking and records',
    detail: 'Find their records across facilities and link them to the account.',
    to: '/docs/hiecm/v3/milestones/p2',
  },
  {
    label: 'P3 Consent and notifications',
    detail: 'Let them grant, see and revoke consent, and receive what the gateway sends.',
    to: '/docs/hiecm/v3/milestones/p3',
  },
];

/** Remembers which card was pressed, since two of them set the same role. */
const CHOICE_KEY = 'abdm-portal.audience.hiecm';

export default function RoleSelector(): React.ReactNode {
  const [role, setRole] = useRole('hiecm');
  const [stored, setStored] = useState<string | null>(null);

  useEffect(() => {
    setStored(window.localStorage.getItem(CHOICE_KEY));
  }, []);

  // The role wins. The remembered card only breaks the tie between the two
  // choices that both mean 'ims', and is ignored once it disagrees with the
  // role something else on the page set.
  const remembered = CHOICES.find((c) => c.id === stored);
  const selected =
    remembered && remembered.role === role
      ? remembered
      : role
        ? CHOICES.find((c) => c.role === role)
        : undefined;

  const choose = (choice: Choice) => {
    setStored(choice.id);
    window.localStorage.setItem(CHOICE_KEY, choice.id);
    setRole(choice.role);
  };

  const journey = selected?.role === 'ims' ? IMS_JOURNEY : selected?.role === 'phr' ? PHR_JOURNEY : null;

  return (
    <section className="role-selector" aria-labelledby="who-are-you">
      <h2 id="who-are-you" className="role-selector__title">
        Who are you?
      </h2>
      <p className="role-selector__lede">
        This is where you choose your path. Pick the one that fits and the rest of
        the documentation follows it, in the sidebar and on every page. You can
        change it whenever you like from the filter at the top of the sidebar.
      </p>

      <div className="role-selector__choices">
        {CHOICES.map((choice) => (
          <button
            key={choice.id}
            type="button"
            aria-pressed={selected?.id === choice.id}
            className="role-choice"
            onClick={() => choose(choice)}>
            <span className="role-choice__label">{choice.label}</span>
            <span className="role-choice__what">{choice.what}</span>
          </button>
        ))}
      </div>

      {selected?.id === 'facility' && (
        <p className="role-selector__note">
          You do not have to build this yourself. A facility can adopt a certified
          information management system instead, and the vendor carries the
          integration.{' '}
          <Link to="https://abdm.gov.in/our-partners/HMIS">See the certified partners</Link>.
        </p>
      )}

      {journey && (
        <ol className="role-journey">
          {journey.map((step) => (
            <li key={step.to} className="role-journey__step">
              <Link to={step.to} className="role-journey__link">
                {step.label}
              </Link>
              <span className="role-journey__detail">{step.detail}</span>
            </li>
          ))}
        </ol>
      )}

      {selected?.id === 'unsure' && (
        <p className="role-selector__note">
          Showing everything. <Link to="/docs/hiecm/v3/milestones">The milestones</Link> lay
          out every step in order.
        </p>
      )}
    </section>
  );
}
