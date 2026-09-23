import React, {type ReactNode} from 'react';
import Link from '@docusaurus/Link';

export type UseCaseProps = {
  /** The use case number, such as `B3`. Also the anchor. */
  no: string;
  title: string;
  /** The endpoint the use case calls, or a note such as `hosted only`. */
  api: string;
  /** The endpoint the answer comes back on. Leave empty when there is none. */
  callback?: string;
  /** The API reference page for `api`. */
  apiHref?: string;
  /** The API reference page for `callback`. */
  callbackHref?: string;
  children?: ReactNode;
};

/**
 * A path breaks only between its segments, never inside one. With `href` it
 * links to the endpoint's page in the API reference.
 */
function Path({value, href}: {value: string; href?: string}) {
  if (!value.startsWith('/')) return <>{value}</>;
  const parts = value.split('/').slice(1);
  const code = (
    <code>
      {parts.map((part, i) => (
        <React.Fragment key={i}>
          {i > 0 && <wbr />}/{part}
        </React.Fragment>
      ))}
    </code>
  );
  if (!href) return code;
  return (
    <Link className="usecase-card__ref" to={href}>
      {code}
      <span className="usecase-card__ref-label">API reference</span>
    </Link>
  );
}

/**
 * One use case in the matrix on the NHCX use cases page: a coloured header
 * with the number and title that opens to a plain-language explanation and
 * the API call and callback. The colour comes from the surrounding
 * `.usecase-grid--<role>`.
 */
export default function UseCase({
  no,
  title,
  api,
  callback,
  apiHref,
  callbackHref,
  children,
}: UseCaseProps): React.JSX.Element {
  return (
    <details className="usecase-card" id={no.toLowerCase()}>
      <summary className="usecase-card__head">
        <span className="usecase-card__no">{no}</span>
        <span className="usecase-card__title">{title}</span>
      </summary>
      <div className="usecase-card__body">
        <div className="usecase-card__text">{children}</div>
        <div className="usecase-card__calls">
          <div>
            <span className="usecase-card__label">API call</span>
            <Path value={api} href={apiHref} />
          </div>
          <div>
            <span className="usecase-card__label">Callback</span>
            {callback ? <Path value={callback} href={callbackHref} /> : 'None'}
          </div>
        </div>
      </div>
    </details>
  );
}
