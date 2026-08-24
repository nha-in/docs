import React, {type ReactNode} from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@site/src/components/ui/accordion';
import {cn} from '@site/src/lib/utils';

export type ExpandableProps = {
  /** Label on the trigger row. */
  title?: ReactNode;
  /** Render the section already open. */
  defaultOpen?: boolean;
  children?: ReactNode;
  className?: string;
};

/** Optional detail, folded away behind a single collapsible row. */
export default function Expandable({
  title,
  defaultOpen = false,
  children,
  className,
}: ExpandableProps): ReactNode {
  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={defaultOpen ? 'section' : undefined}
      className={cn('docs-expandable', className)}>
      <AccordionItem value="section" className="docs-expandable__item">
        <AccordionTrigger className="docs-expandable__trigger hover:no-underline">
          {title}
        </AccordionTrigger>
        <AccordionContent className="docs-expandable__content">
          {children}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
