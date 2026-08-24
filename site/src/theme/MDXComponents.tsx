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
 * Every mapping from @docusaurus/theme-classic (Head, details, code, a, pre,
 * ul, li, img, h1-h6, admonition, mermaid) plus the portal's authoring set, so
 * pages use these without an import.
 */
export default {
  ...MDXComponents,
  Card,
  CardGroup,
  Steps,
  Step,
  Expandable,
  ParamField,
};
