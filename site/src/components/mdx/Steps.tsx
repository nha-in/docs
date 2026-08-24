import React, {type ReactNode} from 'react';
import {cn} from '@site/src/lib/utils';

export type StepsProps = {children?: ReactNode; className?: string};
export type StepProps = {
  /** Step heading, weight 600. */
  title?: ReactNode;
  children?: ReactNode;
  className?: string;
};

/**
 * Numbered vertical list. The numbers come from a CSS counter in mdx.css, so
 * a Step can be added or reordered in MDX without renumbering anything.
 */
export default function Steps({children, className}: StepsProps): ReactNode {
  // role="list" because `list-style: none` drops list semantics in WebKit.
  return (
    <ol role="list" className={cn('docs-steps', className)}>
      {children}
    </ol>
  );
}

export function Step({title, children, className}: StepProps): ReactNode {
  return (
    <li className={cn('docs-step', className)}>
      <span className="docs-step__marker" aria-hidden="true" />
      {title ? <div className="docs-step__title">{title}</div> : null}
      <div className="docs-step__body">{children}</div>
    </li>
  );
}
