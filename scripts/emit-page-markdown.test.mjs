import {test} from 'node:test';
import assert from 'node:assert';
import {renderOperationMarkdown, stripToMarkdown} from './emit-page-markdown.mjs';

test('operation JSON renders to markdown with method, path and curl', () => {
  const op = {
    title: 'Link care contexts to an ABHA address',
    method: 'post',
    path: '/hiecm/hip/v3/link/carecontext',
    description: 'Links one or more care contexts.',
    curl: "curl --request POST --url https://dev.abdm.gov.in/api/hiecm/hip/v3/link/carecontext",
  };
  const md = renderOperationMarkdown(op);
  assert.match(md, /^# Link care contexts to an ABHA address/);
  assert.match(md, /POST \/hiecm\/hip\/v3\/link\/carecontext/);
  assert.match(md, /```bash\ncurl --request POST/);
});

test('mdx page strips frontmatter and imports, keeps body and title', () => {
  const src = `---\ntitle: "What you can build"\ndescription: d\n---\n\nimport X from '@site/x';\n\n# What you can build\n\nBody text.`;
  const md = stripToMarkdown(src);
  assert.match(md, /^# What you can build/);
  assert.match(md, /Body text\./);
  assert.doesNotMatch(md, /import X/);
  assert.doesNotMatch(md, /^---/m);
});

test('operation JSON with real catalogue field names (summary, no title) still renders', () => {
  const op = {
    summary: 'Find Bridge Service by Service ID',
    method: 'GET',
    path: '/api/hiecm/gateway/v3/bridge-service/serviceId/{serviceId}',
    description: 'Look up a specific registered HIP/HIU service by its service ID.',
    curl: "curl --request GET \\\n  --url https://dev.abdm.gov.in/api/hiecm/gateway/v3/bridge-service/serviceId/{serviceId}",
  };
  const md = renderOperationMarkdown(op);
  assert.match(md, /^# Find Bridge Service by Service ID/);
  assert.match(md, /GET \/api\/hiecm\/gateway\/v3\/bridge-service\/serviceId\/\{serviceId\}/);
});
