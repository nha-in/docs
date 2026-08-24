import React from 'react';
import Footer from '@theme-original/DocItem/Footer';
import PageFeedback from '@site/src/components/docs/PageFeedback';

/**
 * The classic footer keeps the tags row and the edit/last-updated row. The
 * feedback prompt is appended under it.
 */
export default function DocItemFooter(): React.ReactNode {
  return (
    <>
      <Footer />
      <PageFeedback />
    </>
  );
}
