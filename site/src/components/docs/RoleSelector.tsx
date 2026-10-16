import React, {useEffect, useState} from 'react';
import Link from '@docusaurus/Link';
import {useRole} from '@site/src/config/roles';

/**
 * "Select your role" on the Get started page.
 *
 * The site already has a role model: `useRole('hiecm')` holds 'ims' or 'phr',
 * shares the choice across the page and remembers it, and the sidebar is
 * scoped by the same value. This block is a friendlier front door to it, so a
 * reader who does not yet know the word HIP can still pick a side.
 *
 * "Not sure yet" and no choice at all both leave the role empty, so the role
 * alone cannot say whether to light that card up after a reload. The card id
 * is kept beside it, and the role stays the thing everything else reads.
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
    id: 'vendor',
    role: 'ims',
    label: 'Health Software Provider',
    what: 'Technology providers (EMR, HMIS, LMIS or PMS) developing ABDM-enabled healthcare information systems and digital health applications.',
  },
  {
    id: 'phr',
    role: 'phr',
    label: 'Personal Health Record (PHR) Application',
    what: 'Applications that enable individuals to access, manage and share their health records and provide consent for health information exchange.',
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
    label: 'M1 Identity',
    detail: 'Create and verify an ABHA, the identity every record hangs off.',
    to: '/docs/hiecm/v3/milestones/m1',
  },
  {
    label: 'M2 Health Information Provider',
    detail: 'Attach records to that ABHA as care contexts, so they can be found.',
    to: '/docs/hiecm/v3/milestones/m2',
  },
  {
    label: 'M3 Health Information User',
    detail: 'Retrieve records from other systems under a consent you requested.',
    to: '/docs/hiecm/v3/milestones/m3',
  },
  {
    label: 'M4 Registry Integration',
    detail: 'Enrol your facility and its professionals in the national registries.',
    to: '/docs/hiecm/v3/milestones/m4',
  },
];

const PHR_JOURNEY: Step[] = [
  {
    label: 'P1 Registration and login',
    detail: 'Sign a patient in with their ABHA and hold their profile.',
    to: '/docs/hiecm/v3/milestones/p1',
  },
  {
    label: 'P2 Consents Management',
    detail: 'Find their records across facilities and link them to the account.',
    to: '/docs/hiecm/v3/milestones/p2',
  },
  {
    label: 'P3 Subscription',
    detail: 'Let them grant, see and revoke consent, and receive what the gateway sends.',
    to: '/docs/hiecm/v3/milestones/p3',
  },
  {
    label: 'P4 Locker',
    detail: 'Keep their records for the long term, fetched with consent as each one is linked.',
    to: '/docs/hiecm/v3/milestones/p4',
  },
];

/** Remembers which card was pressed, so "Not sure yet" survives a reload. */
const CHOICE_KEY = 'abdm-portal.audience.hiecm';

export default function RoleSelector(): React.ReactNode {
  const [role, setRole] = useRole('hiecm');
  const [stored, setStored] = useState<string | null>(null);

  useEffect(() => {
    setStored(window.localStorage.getItem(CHOICE_KEY));
  }, []);

  // The role wins. The remembered card only tells "Not sure yet" apart from
  // no choice, and is ignored once it disagrees with the role something else
  // on the page set.
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
        Select your role
      </h2>
      <p className="role-selector__lede">
        Select your role to view documentation tailored to your integration path.
        The sidebar and page content will automatically update based on your
        selection. You can change this selection at any time using the filter at
        the top of the sidebar.
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
