import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useLocation} from '@docusaurus/router';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';

type ViewState =
  | {status: 'loading'}
  | {status: 'loaded'; text: string}
  | {status: 'error'; message: string};

type CopyStatus = 'idle' | 'copied' | 'unavailable';

/**
 * Same trust boundary Copy for LLM and View as Markdown cross in
 * PageActions.tsx: the `path` query parameter drives a same-origin fetch, so
 * it must be an absolute in-site path and nothing that could be read as
 * pointing somewhere else. Rejects a missing leading slash, a
 * protocol-relative prefix (`//`, and the backslash form browsers normalise
 * to it), `..` traversal, and anything that reads as a URL scheme right
 * after the leading slash (e.g. `/javascript:`).
 */
function isSafePath(path: string): boolean {
  if (!path.startsWith('/')) return false;
  if (path.startsWith('//') || path.startsWith('/\\')) return false;
  if (path.includes('..')) return false;
  if (/^\/[a-zA-Z][a-zA-Z0-9+.-]*:/.test(path)) return false;
  return true;
}

/**
 * `/markdown?path=<route>`: shows the raw `index.md` a postbuild step writes
 * beside every built route (see scripts/emit-page-markdown.mjs) as plain
 * text in the browser, so "View as Markdown" in PageActions.tsx opens a page
 * instead of downloading a file. That markdown only exists in a production
 * build, so this route 404s under `npm start` by design; the error state
 * says so rather than looking broken.
 */
export default function MarkdownView(): React.ReactNode {
  const location = useLocation();
  const rawPath = new URLSearchParams(location.search).get('path') ?? '';
  const safe = rawPath !== '' && isSafePath(rawPath);
  const mdUrl = safe ? `${rawPath.replace(/\/$/, '')}/index.md` : '';

  const [state, setState] = useState<ViewState>({status: 'loading'});
  const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle');
  const resetTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(resetTimer.current), []);

  useEffect(() => {
    if (!safe) {
      setState({
        status: 'error',
        message: rawPath
          ? `"${rawPath}" is not a valid page path.`
          : 'No page path was given.',
      });
      return;
    }
    let cancelled = false;
    setState({status: 'loading'});
    fetch(mdUrl)
      .then((res) => {
        if (!res.ok) {
          throw new Error(
            res.status === 404
              ? 'This page has no markdown build. Markdown is only produced by a production build, not npm start.'
              : `Could not load the markdown: ${res.status} ${res.statusText}.`,
          );
        }
        return res.text();
      })
      .then((text) => {
        if (!cancelled) setState({status: 'loaded', text});
      })
      .catch((err: Error) => {
        if (!cancelled) setState({status: 'error', message: err.message});
      });
    return () => {
      cancelled = true;
    };
  }, [mdUrl, safe, rawPath]);

  const copy = useCallback(async () => {
    if (state.status !== 'loaded') return;
    try {
      await navigator.clipboard.writeText(state.text);
      setCopyStatus('copied');
    } catch {
      setCopyStatus('unavailable');
    }
    clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setCopyStatus('idle'), 2000);
  }, [state]);

  const download = useCallback(() => {
    if (state.status !== 'loaded') return;
    const blob = new Blob([state.text], {type: 'text/markdown;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const filename = `${rawPath.replace(/^\/+|\/+$/g, '').replace(/\//g, '-') || 'page'}.md`;
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, [state, rawPath]);

  const copyLabel =
    copyStatus === 'copied' ? 'Copied' : copyStatus === 'unavailable' ? 'Copy failed' : 'Copy';

  return (
    <Layout title="View as Markdown" description="Raw markdown source for a documentation page.">
      <main className="markdown-view">
        <div className="markdown-view__bar">
          <code className="markdown-view__path">{rawPath || '(no path given)'}</code>
          <div className="markdown-view__actions">
            <button
              type="button"
              onClick={copy}
              disabled={state.status !== 'loaded'}>
              {copyLabel}
            </button>
            <button
              type="button"
              onClick={download}
              disabled={state.status !== 'loaded'}>
              Download
            </button>
            {safe && (
              <Link className="markdown-view__link" to={rawPath}>
                View page
              </Link>
            )}
          </div>
          <span className="sr-only" role="status" aria-live="polite">
            {copyStatus === 'copied' ? 'Copied the page as Markdown.' : ''}
            {copyStatus === 'unavailable' ? 'Could not copy to the clipboard.' : ''}
          </span>
        </div>
        {state.status === 'loading' && <p className="markdown-view__status">Loading...</p>}
        {state.status === 'error' && (
          <p className="markdown-view__status markdown-view__status--error">{state.message}</p>
        )}
        {state.status === 'loaded' && <pre className="markdown-view__pre">{state.text}</pre>}
      </main>
    </Layout>
  );
}
