import React, {type ReactNode} from 'react';
import Card from '@site/src/components/mdx/Card';
import CardGroup from '@site/src/components/mdx/CardGroup';

/**
 * The way out of a milestone page and into the calls it describes.
 *
 * A milestone page explains what a milestone is for and the order to build it
 * in. The moment a reader is convinced, they want the calls, and the one link
 * at the foot of the page was easy to miss after two thousand words of
 * prose. This puts the doors near the top, where the decision is made: the
 * reference, and the error codes, which is what a reader arrives on the page
 * holding.
 *
 * There were three. The middle one said "Try the calls" and went to
 * /reference/hiecm-<module>, the standalone Scalar rendering of the same
 * specification. It renders, but it is a dead end: no sidebar, no tabs, no way
 * back into the milestone, and the request builder a reader wants is already
 * on every endpoint page under the reference itself. So both cards led to the
 * same material by two routes, one of which dropped the reader out of the
 * site. The reference is the route that keeps them in it.
 */
type Module = 'm1' | 'm2' | 'm3' | 'm4' | 'p1' | 'p2' | 'p3';

const NAMES: Record<Module, string> = {
  m1: 'M1',
  m2: 'M2',
  m3: 'M3',
  m4: 'M4',
  p1: 'P1',
  p2: 'P2',
  p3: 'P3',
};

export default function ApiLinks({module}: {module: Module}): ReactNode {
  const name = NAMES[module];
  const docs = `/docs/hiecm/v3/api/${module}`;
  return (
    <CardGroup cols={2}>
      <Card title={`${name} API reference`} icon="book-open" href={docs}>
        Every call in {name}, one page each: the headers it needs, the payload
        it takes, the callback it triggers, and a request builder you can fire
        at the sandbox.
      </Card>
      <Card title="Error codes" icon="triangle-alert" href={`${docs}/errors`}>
        What each code {name} returns actually means, and the first thing to
        check when you see one.
      </Card>
    </CardGroup>
  );
}
