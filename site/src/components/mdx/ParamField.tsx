import React, {type ReactNode} from 'react';
import {Badge} from '@site/src/components/ui/badge';
import {cn} from '@site/src/lib/utils';

export type ParamFieldProps = {
  /** Parameter name, shown in the mono face. */
  name: string;
  /** Declared type, e.g. "string" or "array<object>". */
  type?: string;
  required?: boolean;
  /** Description. `children` wins when both are given. */
  description?: ReactNode;
  children?: ReactNode;
  className?: string;
};

/** One API parameter. Consecutive fields are separated by a hairline. */
export default function ParamField({
  name,
  type,
  required = false,
  description,
  children,
  className,
}: ParamFieldProps): ReactNode {
  const body = children ?? description;
  return (
    <div className={cn('docs-param', className)}>
      <div className="docs-param__head">
        <code className="docs-param__name">{name}</code>
        {type ? <span className="docs-param__type">{type}</span> : null}
        {required ? (
          <Badge variant="ghost" className="docs-param__required">
            required
          </Badge>
        ) : null}
      </div>
      {body ? <div className="docs-param__body">{body}</div> : null}
    </div>
  );
}
