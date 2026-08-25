import React from 'react';
import Link from '@docusaurus/Link';
import {ArrowRight} from 'lucide-react';

/**
 * The forward motion of the documentation.
 *
 * A milestone reads as a walk, not a filing cabinet: the overview offers the
 * ways in, and every ladder page ends by naming the next rung. The sidebar
 * stays for the reader who already knows where they are going; these are for
 * the reader who does not, which on a first visit is everyone.
 */

type Path = {
  /** The invitation, written as the reader's own intent: "See the journey". */
  label: string;
  /** One line on what they will find there. */
  detail: string;
  to: string;
};

/** The hub's ways in: two or three large cards under the overview. */
export function PathChoices({paths}: {paths: Path[]}): React.ReactNode {
  return (
    <nav className="path-choices" aria-label="Ways into this milestone">
      {paths.map((path) => (
        <Link key={path.to} to={path.to} className="path-choice card">
          <span className="path-choice__label">
            {path.label}
            <ArrowRight className="size-4" aria-hidden="true" />
          </span>
          <span className="path-choice__detail">{path.detail}</span>
        </Link>
      ))}
    </nav>
  );
}

/** The single next rung at the foot of a ladder page. */
export function NextStep({label, detail, to}: Path): React.ReactNode {
  return (
    <Link to={to} className="next-step card">
      <span className="next-step__eyebrow">Next</span>
      <span className="next-step__label">
        {label}
        <ArrowRight className="size-4" aria-hidden="true" />
      </span>
      <span className="next-step__detail">{detail}</span>
    </Link>
  );
}
