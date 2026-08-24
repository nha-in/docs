import React, {type CSSProperties, type ReactNode} from 'react';
import {cn} from '@site/src/lib/utils';

export type CardGroupProps = {
  /** Columns above 768px. One column below it, always. */
  cols?: number;
  children?: ReactNode;
  className?: string;
};

/** Responsive grid of Cards: 16px gap, `cols` columns, one column on mobile. */
export default function CardGroup({
  cols = 2,
  children,
  className,
}: CardGroupProps): ReactNode {
  return (
    <div
      className={cn('docs-card-group', className)}
      style={{'--docs-card-cols': cols} as CSSProperties}>
      {children}
    </div>
  );
}
