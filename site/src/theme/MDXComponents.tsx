import React from 'react';
import MDXComponents from '@theme-original/MDXComponents';
import {
  Card,
  CardGroup,
  Expandable,
  ParamField,
  Step,
  Steps,
} from '@site/src/components/mdx';

/**
 * A table cannot scroll itself: `display: table` has no overflow box. A table
 * wider than the article column therefore spilled out of it and ran underneath
 * the sticky outline on the right, which the error tables made obvious. Every
 * markdown table is wrapped in a container that does scroll.
 */
function Table(props: React.ComponentProps<'table'>) {
  return (
    <div className="table-scroll" role="region" tabIndex={0}>
      <table {...props} />
    </div>
  );
}

/**
 * Every mapping from @docusaurus/theme-classic (Head, details, code, a, pre,
 * ul, li, img, h1-h6, admonition, mermaid) plus the portal's authoring set, so
 * pages use these without an import.
 */
export default {
  ...MDXComponents,
  table: Table,
  Card,
  CardGroup,
  Steps,
  Step,
  Expandable,
  ParamField,
};
