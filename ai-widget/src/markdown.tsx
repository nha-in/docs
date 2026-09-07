import {useEffect, useState} from 'preact/hooks';
import type {ComponentChildren} from 'preact';
import {Check, Copy} from './icons';
import {ASSET_BASE, loadScript} from './assets';

/**
 * Renders the small markdown subset the support agent emits: paragraphs,
 * bulleted and numbered lists, fenced code blocks, bold, italics, inline code
 * and links. Nothing else, deliberately. A full markdown library would be a
 * new dependency and a bigger attack surface for text that streams straight
 * from a model; this renderer produces elements only, so model output can
 * never inject markup.
 *
 * The text re-renders on every streamed delta, so a marker that is still
 * half-open ("**bo") shows literally for a moment and resolves when its
 * closing half arrives. Fences are the exception: an unclosed fence renders
 * as a code block right away, because an answer that is mid-way through a
 * curl example should look like code while it arrives, not like prose.
 */

const INLINE = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)\s]+\))/g;

/**
 * A site-relative destination is absolute against the docs origin. The widget
 * runs on pages that are not the docs site, where "/docs/..." points at
 * whatever the host happens to publish there.
 */
export function absolute(href: string, docsOrigin: string): string | null {
  if (href.startsWith('/')) return `${docsOrigin.replace(/\/$/, '')}${href}`;
  if (href.startsWith('https://') || href.startsWith('http://')) return href;
  return null;
}

function renderInline(text: string, docsOrigin: string): ComponentChildren[] {
  const parts = text.split(INLINE);
  return parts.map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return <code key={i}>{part.slice(1, -1)}</code>;
    }
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return <b key={i}>{renderInline(part.slice(2, -2), docsOrigin)}</b>;
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return <em key={i}>{renderInline(part.slice(1, -1), docsOrigin)}</em>;
    }
    const link = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(part);
    if (link) {
      const [, label, href] = link;
      // Site-relative and http(s) destinations only; anything else renders as
      // the text it was.
      const url = absolute(href, docsOrigin);
      if (url) {
        return (
          <a key={i} href={url} target="_blank" rel="noopener noreferrer">
            {label}
          </a>
        );
      }
      return part;
    }
    return part;
  });
}

/** Copies text to the clipboard and says so for a moment. */
export function CopyButton({
  text,
  label,
  className,
}: {
  text: string;
  label: string;
  className: string;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 1600);
    return () => window.clearTimeout(id);
  }, [copied]);

  // The clipboard API needs a secure context. Where it is missing the button
  // would silently do nothing, so it does not render at all.
  if (typeof navigator === 'undefined' || !navigator.clipboard) return null;

  return (
    <button
      type="button"
      class={className}
      aria-label={copied ? 'Copied' : label}
      onClick={() => {
        navigator.clipboard.writeText(text).then(
          () => setCopied(true),
          () => undefined,
        );
      }}>
      {copied ? <Check /> : <Copy />}
    </button>
  );
}

/**
 * A mermaid diagram, drawn in the reader's browser.
 *
 * The documentation carries diagrams of its own, written as fenced mermaid
 * blocks inside the pages the agent's tools return, and the agent may quote
 * one back when it is the answer. This is what turns the quoted block into a
 * picture. Until it existed the block arrived as diagram source under the
 * words "here it is rendered", which is worse than not offering. The agent
 * never composes one: that rule is in its playbook, because a diagram is a
 * statement about the order of calls in a health network.
 *
 * mermaid is three and a half megabytes, so it is not in this bundle. It sits
 * beside the widget and is fetched the first time a diagram actually appears,
 * the same arrangement the PDF reader and the OCR engine use. A reader who
 * never asks for a diagram never pays for one.
 *
 * The source is shown instead if the load fails or the diagram will not
 * parse. A model can emit invalid mermaid, and a broken picture that hides
 * what it was trying to say is worse than the text it came from.
 */
let ready: Promise<any> | null = null;

function mermaidLib(): Promise<any> {
  ready ??= loadScript(`${ASSET_BASE}mermaid.min.js`).then(() => {
    const lib = (globalThis as unknown as {mermaid?: any}).mermaid;
    if (!lib) throw new Error('mermaid loaded but registered nothing');
    lib.initialize({
      startOnLoad: false,
      // The model's text reaches mermaid, so labels are escaped rather than
      // parsed as HTML. This is the library's own strictest setting.
      securityLevel: 'strict',
      theme: dark() ? 'dark' : 'default',
      fontFamily: 'inherit',
    });
    return lib;
  });
  return ready;
}

/** The colour scheme the diagram is being drawn into. */
function dark(): boolean {
  const stated = document.documentElement.dataset.theme;
  if (stated === 'dark') return true;
  if (stated === 'light') return false;
  return globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
}

let drawn = 0;

function Diagram({text}: {text: string}) {
  const [svg, setSvg] = useState('');
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let live = true;
    setFailed(false);
    setSvg('');
    drawn += 1;
    const id = `ask-ai-diagram-${drawn}`;
    mermaidLib()
      .then((lib) => lib.render(id, text))
      .then((result: {svg: string}) => {
        if (live) setSvg(result.svg);
      })
      .catch(() => {
        if (live) setFailed(true);
        // mermaid leaves the element it measured in on a parse failure.
        document.getElementById(id)?.remove();
        document.getElementById(`d${id}`)?.remove();
      });
    return () => {
      live = false;
    };
  }, [text]);

  if (failed) {
    return (
      <div class="ask-ai__code">
        <pre>
          <code>{text}</code>
        </pre>
        <CopyButton
          text={text}
          label="Copy diagram source"
          className="ask-ai__code-copy"
        />
      </div>
    );
  }
  // The markup is mermaid's own output, not the model's: the model's text
  // reached it as diagram source and came back as shapes and escaped labels.
  return (
    <div
      class="ask-ai__diagram"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{__html: svg}}
    />
  );
}

type Block =
  | {kind: 'p'; text: string}
  | {kind: 'code'; text: string; lang: string; closed: boolean}
  | {kind: 'ul' | 'ol'; items: string[]};

const BULLET = /^\s*[-*]\s+(.*)$/;
const NUMBERED = /^\s*\d+[.)]\s+(.*)$/;

export function toBlocks(text: string): Block[] {
  const blocks: Block[] = [];
  let list: {kind: 'ul' | 'ol'; items: string[]} | null = null;
  let para: string[] = [];
  let code: string[] | null = null;
  let lang = '';

  const flushPara = () => {
    if (para.length > 0) {
      blocks.push({kind: 'p', text: para.join(' ')});
      para = [];
    }
  };
  const flushList = () => {
    if (list) {
      blocks.push(list);
      list = null;
    }
  };

  for (const line of text.split('\n')) {
    if (line.trimStart().startsWith('```')) {
      if (code) {
        blocks.push({kind: 'code', text: code.join('\n'), lang, closed: true});
        code = null;
        lang = '';
      } else {
        flushPara();
        flushList();
        // The info string is kept but never shown: nothing here highlights,
        // and a stray word above the sample helps nobody. It is kept because
        // one value of it is not a label at all. ```mermaid is a picture, and
        // the block below draws it.
        lang = line.trim().slice(3).trim().toLowerCase();
        code = [];
      }
      continue;
    }
    if (code) {
      code.push(line);
      continue;
    }

    const bullet = BULLET.exec(line);
    const numbered = bullet ? null : NUMBERED.exec(line);
    if (bullet || numbered) {
      flushPara();
      const kind = bullet ? 'ul' : 'ol';
      if (!list || list.kind !== kind) {
        flushList();
        list = {kind, items: []};
      }
      list.items.push((bullet ?? numbered)![1]);
      continue;
    }
    if (line.trim() === '') {
      flushPara();
      flushList();
      continue;
    }
    // A wrapped continuation of the previous list item, or plain prose.
    if (list && /^\s{2,}/.test(line)) {
      list.items[list.items.length - 1] += ` ${line.trim()}`;
      continue;
    }
    flushList();
    // Headings arrive rarely; they render as emphasized prose rather than
    // taking heading levels inside a chat bubble.
    para.push(line.replace(/^#{1,4}\s+/, '').trim());
  }
  // A fence still open at the end of the text is a code block mid-stream.
  if (code) blocks.push({kind: 'code', text: code.join('\n'), lang, closed: false});
  flushPara();
  flushList();
  return blocks;
}

export default function ChatMarkdown({
  text,
  docsOrigin,
}: {
  text: string;
  docsOrigin: string;
}) {
  return (
    <>
      {toBlocks(text).map((block, i) => {
        if (block.kind === 'p') {
          return <p key={i}>{renderInline(block.text, docsOrigin)}</p>;
        }
        if (block.kind === 'code') {
          // Only once the fence has closed: half a diagram is a syntax error,
          // and mermaid draws syntax errors as a red box rather than throwing.
          if (block.lang === 'mermaid' && block.closed) {
            return <Diagram key={i} text={block.text} />;
          }
          return (
            <div key={i} class="ask-ai__code">
              <pre>
                <code>{block.text}</code>
              </pre>
              <CopyButton
                text={block.text}
                label="Copy code"
                className="ask-ai__code-copy"
              />
            </div>
          );
        }
        const ListTag = block.kind;
        return (
          <ListTag key={i}>
            {block.items.map((item, j) => (
              <li key={j}>{renderInline(item, docsOrigin)}</li>
            ))}
          </ListTag>
        );
      })}
    </>
  );
}

/**
 * The second level headings of a page, in order, with fenced code skipped so
 * a comment beginning with ## is not mistaken for one. A reader who has a
 * page attached is better served by that page's own sections than by any four
 * questions we could guess at.
 */
export function headings(text: string): string[] {
  const found: string[] = [];
  let fenced = false;
  for (const line of text.split('\n')) {
    if (/^\s*```/.test(line)) fenced = !fenced;
    else if (!fenced && /^##\s+/.test(line))
      found.push(line.slice(2).replace(/[*`_]/g, '').trim());
  }
  return found.filter(Boolean);
}
