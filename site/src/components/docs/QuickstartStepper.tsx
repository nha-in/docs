import React from 'react';
import {Check} from 'lucide-react';

/**
 * The stepper and the step card both quickstart runners share: the ABHA one on
 * HIE-CM and the UHI search builder. Styles are in src/css/quickstart.css.
 */
export type StepDef<K extends string> = {key: K; n: number; title: string};

/**
 * All the steps, always, above the one card that is open.
 *
 * Showing them is not about progress. It is the claim the page is making: the
 * whole use case is this many steps, and a reader should be able to see that
 * before they start rather than discover it a card at a time. Every step is
 * reachable at any point.
 */
export function Stepper<K extends string>({
  steps,
  active,
  done,
  onSelect,
  label,
}: {
  steps: StepDef<K>[];
  active: K;
  done: Record<K, boolean>;
  onSelect: (step: K) => void;
  label: string;
}) {
  // The line runs between the first marker and the last, so it has one
  // segment fewer than there are steps. Finishing a step fills the segment
  // that leads to the next one, which is why the last finished step cannot
  // add any more.
  const finished = steps.filter(({key}) => done[key]).length;
  const progress = Math.min(finished, steps.length - 1) / (steps.length - 1);
  return (
    <ol
      className="quickstart__stepper"
      aria-label={label}
      style={
        {'--quickstart-progress': progress, '--quickstart-steps': steps.length} as React.CSSProperties
      }>
      {steps.map(({key, n, title}) => (
        <li key={key}>
          <button
            type="button"
            onClick={() => onSelect(key)}
            aria-current={key === active ? 'step' : undefined}
            className={`quickstart__stepper-step${
              key === active ? ' quickstart__stepper-step--active' : ''
            }${done[key] ? ' quickstart__stepper-step--done' : ''}`}>
            <span className="quickstart__marker" aria-hidden="true">
              {done[key] ? <Check className="size-4" /> : n}
            </span>
            <span className="quickstart__stepper-title">{title}</span>
          </button>
        </li>
      ))}
    </ol>
  );
}

/**
 * One step's form. Every pane renders, and the ones that are not open are
 * hidden rather than dropped. They all sit in one grid cell, so the card is
 * the height of the tallest of them at whatever width it is being read at,
 * and moving between steps does not resize the card or shift the page under
 * it. `visibility` rather than `display`, because a hidden pane must keep its
 * size, and it takes the pane out of the tab order and the accessibility tree
 * either way.
 */
export function StepCard<K extends string>({
  step,
  active,
  title,
  lede,
  children,
}: {
  step: K;
  active: K;
  title: string;
  lede: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section
      className={`quickstart__pane${step === active ? '' : ' quickstart__pane--hidden'}`}
      aria-labelledby={`quickstart-step-${step}`}>
      <div className="quickstart__step-head">
        <h3 className="quickstart__step-title" id={`quickstart-step-${step}`}>
          {title}
        </h3>
        <p className="quickstart__step-lede">{lede}</p>
      </div>
      <div className="quickstart__step-body">{children}</div>
    </section>
  );
}
