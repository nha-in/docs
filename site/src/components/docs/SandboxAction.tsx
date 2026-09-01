import React from 'react';
import Link from '@docusaurus/Link';
import {sandboxLinks, type SandboxActionName} from '@site/src/data/sandboxLinks';

/** A link out to the NHA sandbox app for one named action. Every sandbox URL
 * on the site is resolved through `sandboxLinks`, never inlined here or in a
 * page, so wiring up the real deep-link integration later is a one-file
 * change. `href`, not `to`: these links leave the site. */
export default function SandboxAction({
  action,
  children,
}: {
  action: SandboxActionName;
  children?: React.ReactNode;
}): React.ReactNode {
  return (
    <Link href={sandboxLinks[action]} className="button button--sm button--primary">
      {children ?? 'Open in sandbox'}
    </Link>
  );
}
