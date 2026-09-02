import React from 'react';
import Link from '@docusaurus/Link';

export type AcronymCard = {
  /** The word whose first letter carries the acronym, for example "Create". */
  word: string;
  /** The milestone label, for example "M1". */
  label: string;
  /** One line of what the milestone gives you. */
  text: string;
  to: string;
};

/**
 * A horizontal row of cards, one per milestone, with the first letter of
 * each word set large and in the accent colour so the acronym reads across
 * the row. Wraps to two columns on narrow screens.
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
          <span className="acronym-card__word" aria-label={word}>
            <span className="acronym-card__letter" aria-hidden="true">
              {word.charAt(0)}
            </span>
            <span aria-hidden="true">{word.slice(1)}</span>
          </span>
          <span className="acronym-card__label">{ms}</span>
          <span className="acronym-card__text">{text}</span>
        </Link>
      ))}
    </div>
  );
}
