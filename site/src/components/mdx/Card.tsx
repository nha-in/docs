import React, {type ReactElement, type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import {DynamicIcon, type IconName} from 'lucide-react/dynamic';
import {Card as CardSurface} from '@site/src/components/ui/card';
import {cn} from '@site/src/lib/utils';

export type CardProps = {
  /** Card heading, serif 17px. */
  title?: ReactNode;
  /** Lucide icon name (kebab-case, e.g. "book-open") or a rendered element. */
  icon?: IconName | ReactElement;
  /** Turns the whole card into a link. Internal or external. */
  href?: string;
  /** Body copy. `children` wins when both are given. */
  description?: ReactNode;
  children?: ReactNode;
  className?: string;
};

/**
 * A bordered panel: 16px radius, 1px hairline, 24px padding.
 * With `href` it becomes a link that lifts 2px and takes an accent border.
 */
export default function Card({
  title,
  icon,
  href,
  description,
  children,
  className,
}: CardProps): ReactNode {
  const body = children ?? description;
  const surface = (
    <CardSurface
      className={cn('docs-card', href && 'docs-card--link', className)}>
      {icon ? (
        <span className="docs-card__icon" aria-hidden="true">
          {typeof icon === 'string' ? (
            // ponytail: DynamicIcon code-splits all ~1500 lucide icons so docs
            // authors can name one in MDX. Swap for a hand-written name->icon
            // map if the extra build chunks ever start to hurt.
            <DynamicIcon name={icon} size={20} strokeWidth={1.75} />
          ) : (
            icon
          )}
        </span>
      ) : null}
      {title ? <div className="docs-card__title">{title}</div> : null}
      {body ? <div className="docs-card__body">{body}</div> : null}
    </CardSurface>
  );

  return href ? (
    // `card` is the hook typography.css uses to keep a link out of the prose
    // underline treatment; the anchor's own styling is docs-card__anchor.
    <Link to={href} className="docs-card__anchor card">
      {surface}
    </Link>
  ) : (
    surface
  );
}
