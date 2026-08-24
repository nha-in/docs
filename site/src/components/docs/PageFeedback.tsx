import React, {useState} from 'react';
import {ThumbsDown, ThumbsUp} from 'lucide-react';
import {Button} from '@site/src/components/ui/button';

/**
 * "Was this page helpful?" Nothing is recorded and nothing is sent anywhere,
 * so the acknowledgement says that instead of implying a collector exists.
 */
export default function PageFeedback(): React.ReactNode {
  const [answered, setAnswered] = useState(false);

  return (
    // The live region has to be in the DOM before the text it announces, so it
    // is the wrapper, which is always mounted, not the paragraph, which is not.
    <div className="docs-feedback" aria-live="polite">
      {answered ? (
        <p className="docs-feedback__thanks">
          Thanks. Feedback is not wired to a collector yet.
        </p>
      ) : (
        <>
          <span className="docs-feedback__prompt">Was this page helpful?</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAnswered(true)}
            aria-label="Yes, this page was helpful">
            <ThumbsUp aria-hidden />
            Yes
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAnswered(true)}
            aria-label="No, this page was not helpful">
            <ThumbsDown aria-hidden />
            No
          </Button>
        </>
      )}
    </div>
  );
}
