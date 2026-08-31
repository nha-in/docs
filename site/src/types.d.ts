/**
 * The support agent widget is loaded by a script tag, not imported, so its
 * element needs declaring for the page that places it.
 */
import 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'abdm-support-agent': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        'api-base'?: string;
        'docs-origin'?: string;
        'support-url'?: string;
        launcher?: string;
        open?: string;
      };
    }
  }
}
