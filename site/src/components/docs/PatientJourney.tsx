import React from 'react';
import Link from '@docusaurus/Link';
import {ArrowRight} from 'lucide-react';
import {DynamicIcon, type IconName} from 'lucide-react/dynamic';

/**
 * One patient walking through the milestones, drawn as a vertical timeline.
 *
 * The milestone list reads as four capabilities. This reads as one person
 * arriving at a clinic, which is the same four capabilities in the order a
 * reader can hold in their head.
 */

export type JourneyStep = {
  /** Small caps label above the title: "MILESTONE 1 · CREATE". */
  eyebrow: string;
  title: string;
  /** One or two sentences of story, in the reader's own build terms. */
  story: string;
  /** Button text. */
  cta: string;
  to: string;
  /** Lucide icon name, kebab-case, e.g. "id-card". */
  icon: IconName;
};

export default function PatientJourney({
  steps,
  label = 'Patient journey',
}: {
  steps: JourneyStep[];
  label?: string;
}): React.ReactNode {
  return (
    <ol className="patient-journey" aria-label={label}>
      {steps.map((step) => (
        <li key={step.to} className="patient-journey__step">
          <span className="patient-journey__node" aria-hidden="true">
            <DynamicIcon name={step.icon} size={16} strokeWidth={1.75} />
          </span>
          <div className="patient-journey__card">
            <span className="patient-journey__eyebrow">{step.eyebrow}</span>
            <span className="patient-journey__title">{step.title}</span>
            <p className="patient-journey__story">{step.story}</p>
            <Link to={step.to} className="patient-journey__cta card">
              {step.cta}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </li>
      ))}
    </ol>
  );
}
