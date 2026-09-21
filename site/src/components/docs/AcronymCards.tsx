import React from 'react';
import Link from '@docusaurus/Link';

export type AcronymCard = {
  /** The milestone's verb, for example "Create". */
  word: string;
  /** The milestone label, for example "M1". */
  label: string;
  /** The milestone's title, a few words. */
  text: string;
  to: string;
};

/**
 * One row of cards, one per milestone: the milestone label and word on one
 * line, and the milestone's title under it.
 */
export default function AcronymCards({
  cards,
  label,
}: {
  cards: AcronymCard[];
  label: string;
}): React.ReactNode {
  return (
    <div className="acronym-cards" role="list" aria-label={label}>
      {cards.map(({word, label: ms, text, to}) => (
        <Link key={to} to={to} className="acronym-card" role="listitem">
          <span className="acronym-card__word">
            <span className="acronym-card__label">{ms}</span>{' '}
            {word}
          </span>
          <span className="acronym-card__text">{text}</span>
        </Link>
      ))}
    </div>
  );
}
