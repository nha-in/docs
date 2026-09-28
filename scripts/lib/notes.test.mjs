// scripts/lib/notes.test.mjs
import {test} from 'node:test';
import assert from 'node:assert';
import {mkdtempSync, mkdirSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {notesFor, toMdx} from './notes.mjs';

test('a notes partial is found by platform and name, and only when it exists', () => {
  const root = mkdtempSync(join(tmpdir(), 'notes-'));
  mkdirSync(join(root, 'site', 'docs', '_notes', 'hiecm', 'errors'), {recursive: true});
  writeFileSync(join(root, 'site', 'docs', '_notes', 'hiecm', 'm1_post_x.mdx'), '## X {/* #x */}\n');
  writeFileSync(join(root, 'site', 'docs', '_notes', 'hiecm', 'errors', 'm1.mdx'), '## Y {/* #y */}\n');
  assert.equal(notesFor(root, 'hiecm', 'm1_post_x'), '@site/docs/_notes/hiecm/m1_post_x.mdx');
  assert.equal(notesFor(root, 'hiecm', 'errors/m1'), '@site/docs/_notes/hiecm/errors/m1.mdx');
  assert.equal(notesFor(root, 'hiecm', 'm1_post_y'), null);
  assert.equal(notesFor(root, 'nhcx', 'm1_post_x'), null);
});

test('a CommonMark page becomes MDX that imports the notes and parses', () => {
  const md = [
    '---', 'title: M1 errors', 'generated: true', '---', '',
    '# M1 errors', '',
    '| `ABDM-1157` | 422 | Limit exceeded for ‘<ABHA_NUMBER> | `m1_{x}` |',
    '| `ABDM-9002` |  | No registration found at <<hospital name>> {here} |  |', '',
    '<Notes />', '',
    '<a class="next-step" href="/docs/support">',
    '<span class="next-step__eyebrow">Next</span>',
    '</a>', '',
  ];
  const out = toMdx(md, '@site/docs/_notes/hiecm/errors/m1.mdx');
  assert.deepEqual(out.slice(0, 7), ['---', 'title: M1 errors', 'generated: true', '---', '', "import Notes from '@site/docs/_notes/hiecm/errors/m1.mdx';", '']);
  assert.ok(out.includes('| `ABDM-1157` | 422 | Limit exceeded for ‘&#60;ABHA_NUMBER&#62; | `m1_{x}` |'));
  assert.ok(out.includes('| `ABDM-9002` |  | No registration found at &#60;&#60;hospital name&#62;&#62; &#123;here&#125; |  |'));
  assert.ok(out.includes('<Notes />'));
  assert.ok(out.includes('<a className="next-step" href="/docs/support">'));
  assert.ok(out.includes('<span className="next-step__eyebrow">Next</span>'));
});
