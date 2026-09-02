import React from 'react';

/**
 * One date's worth of changes, laid out as the reference changelogs are: the
 * date holds the left column, the entries for that date run down the right.
 *
 * A changelog read as one column is a run of headings with nothing to say
 * where one release stops and the next starts. Putting the date beside its
 * entries, with a rule above each group, makes the boundary the reader is
 * looking for the most visible thing on the page.
 */
type Props = {
  /** ISO date, `YYYY-MM-DD`. Also the group's anchor. */
  date: string;
  /** Shown under the date instead of the entry count, when a count is not what the group is about. */
  label?: string;
  /**
   * The heading level for the date. `h1` on a page that is nothing but this
   * one group, so the page still has exactly one first level heading; `h2`
   * where groups are listed together.
   */
  as?: 'h1' | 'h2';
  children: React.ReactNode;
};

/**
 * Entries are the `###` headings inside the group. Markdown headings are the
 * only children that arrive with an `id`, which Docusaurus's heading slugger
 * puts there, so counting them counts entries without the page having to
 * declare a number that can drift from the prose beneath it.
 */
function countEntries(children: React.ReactNode): number {
  return React.Children.toArray(children).filter(
    (child) => React.isValidElement<{id?: string}>(child) && Boolean(child.props.id),
  ).length;
}

export default function ReleaseGroup({
  date,
  label,
  as: DateHeading = 'h2',
  children,
}: Props): React.ReactNode {
  const entries = countEntries(children);
  const formatted = new Date(`${date}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });

  return (
    <section className="release-group" aria-labelledby={date}>
      <div className="release-group__meta">
        {/* The ISO date is the anchor the flat page used, so a link written
            against the old single page still lands on its group. */}
        <DateHeading className="release-group__date" id={date}>
          <time dateTime={date}>{formatted}</time>
        </DateHeading>
        {label !== undefined || entries > 0 ? (
          <p className="release-group__count">
            {label ?? `${entries} change${entries === 1 ? '' : 's'}`}
          </p>
        ) : null}
      </div>
      <div className="release-group__entries">{children}</div>
    </section>
  );
}
