import React, {type ReactNode} from 'react';
import Card from '@site/src/components/mdx/Card';
import CardGroup from '@site/src/components/mdx/CardGroup';

/**
 * The way out of a milestone page and into the calls it describes.
 *
 * A milestone page explains what a milestone is for and the order to build it
 * in. The moment a reader is convinced, they want the calls, and the one link
 * at the foot of the page was easy to miss after two thousand words of
 * prose. This puts the three doors near the top, where the decision is made:
 * the written reference, the interactive one, and the error codes, which is
 * what a reader arrives on the page holding.
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
    <CardGroup cols={3}>
      <Card title={`${name} API reference`} icon="book-open" href={docs}>
        Every call in {name}, one page each: the headers it needs, the payload
        it takes, the callback it triggers.
      </Card>
      <Card
        title="Try the calls"
        icon="terminal"
        href={`/reference/hiecm-${module}`}>
        The same operations in an interactive reference, with a request builder
        you can fire at the sandbox.
      </Card>
      <Card title="Error codes" icon="triangle-alert" href={`${docs}/errors`}>
        What each code {name} returns actually means, and the first thing to
        check when you see one.
      </Card>
    </CardGroup>
  );
}
