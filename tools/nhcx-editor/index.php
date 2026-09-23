<?php
/**
 * NHCX content editor.
 *
 * A single file PHP app for editing the hand-written NHCX content in this
 * repository: the site pages under site/docs/nhcx, the NHCX atoms under
 * catalogue/nhcx, and the NHCX OpenAPI sources under catalogue/openapi/nhcx.
 * Build outputs are never offered for editing; fix the source or the
 * generator instead.
 *
 * Run from the repository root:
 *   php -S 0.0.0.0:8090 -t tools/nhcx-editor tools/nhcx-editor/index.php
 *
 * Access control: without NHCX_EDITOR_PASSWORD set, only requests from this
 * machine are served. Set it to allow other machines, which then sign in
 * with HTTP basic auth (any user name, that password).
 */

declare(strict_types=1);

const REPO_ROOT_REL = '/../..';

$ROOT = realpath(__DIR__ . REPO_ROOT_REL);
if ($ROOT === false || !is_dir($ROOT . '/site/docs/nhcx')) {
    http_response_code(500);
    exit('The editor must live at tools/nhcx-editor inside the docs repository.');
}

/* The three editable areas. Each names a root, the extensions it offers,
 * and a test that rejects build outputs inside that root. */
$AREAS = [
    'pages' => [
        'label' => 'Site pages',
        'root'  => 'site/docs/nhcx',
        'ext'   => ['md', 'mdx'],
        'deny'  => 'is_generated_page',
    ],
    'atoms' => [
        'label' => 'Atoms',
        'root'  => 'catalogue/nhcx',
        'ext'   => ['md'],
        'deny'  => null,
    ],
    'specs' => [
        'label' => 'OpenAPI sources',
        'root'  => 'catalogue/openapi/nhcx',
        'ext'   => ['yaml', 'yml', 'md'],
        'deny'  => null,
    ],
];

/**
 * Under api/, scripts/build-api-reference.mjs writes the endpoint pages,
 * errors.md, _servers.md, the api/index.md overview and every _category_.json.
 * The module overview pages api/<module>/index.md are hand-written.
 */
function is_generated_page(string $rel): bool
{
    if (!preg_match('#^site/docs/nhcx/[^/]+/api/(.*)$#', $rel, $m)) {
        return false;
    }
    $inner = $m[1];
    if ($inner === 'README.md') {
        return false;
    }
    return !preg_match('#^[^/]+/index\.mdx?$#', $inner);
}

/* ---------- access control ---------- */

$password = getenv('NHCX_EDITOR_PASSWORD') ?: '';
$remote = $_SERVER['REMOTE_ADDR'] ?? '';
$isLocal = in_array($remote, ['127.0.0.1', '::1', '::ffff:127.0.0.1'], true);

if ($password === '') {
    if (!$isLocal) {
        http_response_code(403);
        header('Content-Type: text/plain; charset=utf-8');
        exit("This editor only serves this machine until NHCX_EDITOR_PASSWORD is set.\n");
    }
} elseif (!$isLocal) {
    $given = $_SERVER['PHP_AUTH_PW'] ?? '';
    if (!hash_equals($password, $given)) {
        header('WWW-Authenticate: Basic realm="NHCX editor"');
        http_response_code(401);
        exit('Sign in required.');
    }
}

/* ---------- path handling ---------- */

/** Resolve a repo-relative path and confirm it is editable. Returns [abs, areaKey] or null. */
function resolve_editable(string $rel, bool $mustExist = true): ?array
{
    global $ROOT, $AREAS;
    $rel = ltrim(str_replace('\\', '/', $rel), '/');
    if ($rel === '' || str_contains($rel, "\0") || preg_match('#(^|/)\.\.?(/|$)#', $rel)) {
        return null;
    }
    foreach ($AREAS as $key => $area) {
        if (!str_starts_with($rel, $area['root'] . '/')) {
            continue;
        }
        $ext = strtolower(pathinfo($rel, PATHINFO_EXTENSION));
        if (!in_array($ext, $area['ext'], true)) {
            return null;
        }
        if ($area['deny'] && ($area['deny'])($rel)) {
            return null;
        }
        $abs = $ROOT . '/' . $rel;
        $areaRoot = realpath($ROOT . '/' . $area['root']);
        $check = $mustExist ? realpath($abs) : realpath(dirname($abs));
        if ($check === false || $areaRoot === false || !str_starts_with($check . '/', $areaRoot . '/')) {
            return null;
        }
        if ($mustExist && !is_file($abs)) {
            return null;
        }
        return [$abs, $key];
    }
    return null;
}

function list_area(string $key): array
{
    global $ROOT, $AREAS;
    $area = $AREAS[$key];
    $base = $ROOT . '/' . $area['root'];
    $out = [];
    $it = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($base, FilesystemIterator::SKIP_DOTS)
    );
    foreach ($it as $file) {
        if (!$file->isFile()) {
            continue;
        }
        $rel = substr($file->getPathname(), strlen($ROOT) + 1);
        $rel = str_replace('\\', '/', $rel);
        if (str_contains($rel, '/.')) {
            continue;
        }
        if (resolve_editable($rel) !== null) {
            $out[] = $rel;
        }
    }
    sort($out, SORT_NATURAL | SORT_FLAG_CASE);
    return $out;
}

/** Writable folders for new pages and atoms: every existing folder in an area except generated ones. */
function new_file_dirs(): array
{
    global $ROOT, $AREAS;
    $dirs = [];
    foreach (['pages', 'atoms'] as $key) {
        $base = $ROOT . '/' . $AREAS[$key]['root'];
        $dirs[] = $AREAS[$key]['root'];
        $it = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($base, FilesystemIterator::SKIP_DOTS),
            RecursiveIteratorIterator::SELF_FIRST
        );
        foreach ($it as $f) {
            if (!$f->isDir()) {
                continue;
            }
            $rel = str_replace('\\', '/', substr($f->getPathname(), strlen($ROOT) + 1));
            if (str_contains($rel, '/.') || preg_match('#/api(/|$)#', $rel)) {
                continue;
            }
            $dirs[] = $rel;
        }
    }
    sort($dirs, SORT_NATURAL);
    return array_values(array_unique($dirs));
}

/** Where the Docusaurus dev server shows a page, or null for non-pages. */
function site_route(string $rel, string $content): ?string
{
    if (!preg_match('#^site/docs/(.+)\.mdx?$#', $rel, $m)) {
        return null;
    }
    $parts = explode('/', $m[1]);
    $last = array_pop($parts);
    $parts = array_map(fn($p) => preg_replace('/^\d+-/', '', $p), $parts);
    if (preg_match('/^---\R(.*?)\R---/s', $content, $fm) && preg_match('/^slug:\s*["\']?([^"\'\r\n]+)/m', $fm[1], $s)) {
        $slug = trim($s[1]);
        return str_starts_with($slug, '/') ? '/docs' . $slug : '/docs/' . implode('/', $parts) . '/' . $slug;
    }
    if (strtolower($last) !== 'index' && strtolower($last) !== 'readme') {
        $parts[] = preg_replace('/^\d+-/', '', $last);
    }
    return '/docs/' . implode('/', $parts);
}

/** Write atomically so the dev server never reads half a file. */
function write_atomic(string $abs, string $content): void
{
    $tmp = dirname($abs) . '/.' . basename($abs) . '.' . bin2hex(random_bytes(4)) . '.tmp';
    if (file_put_contents($tmp, $content) === false || !rename($tmp, $abs)) {
        @unlink($tmp);
        throw new RuntimeException('Could not write the file.');
    }
}

/** Run one repo lint script with a fixed argv. No request data reaches the command line. */
function run_lint(string $script): array
{
    global $ROOT;
    $node = trim((string) shell_exec('command -v node')) ?: 'node';
    $proc = proc_open([$node, 'scripts/' . $script], [1 => ['pipe', 'w'], 2 => ['pipe', 'w']], $pipes, $ROOT);
    if (!is_resource($proc)) {
        return [127, 'Could not start node.'];
    }
    $out = stream_get_contents($pipes[1]) . stream_get_contents($pipes[2]);
    fclose($pipes[1]);
    fclose($pipes[2]);
    return [proc_close($proc), $out];
}

function json_out(array $data, int $status = 200): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

/* ---------- API ---------- */

$action = $_GET['action'] ?? '';

if ($action !== '') {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Same origin only: blocks another site from posting into the editor.
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
        $host = $_SERVER['HTTP_HOST'] ?? '';
        if ($origin !== '' && parse_url($origin, PHP_URL_HOST) . (parse_url($origin, PHP_URL_PORT) ? ':' . parse_url($origin, PHP_URL_PORT) : '') !== $host) {
            json_out(['error' => 'Cross origin request refused.'], 403);
        }
        $body = json_decode((string) file_get_contents('php://input'), true) ?: [];
    }

    switch ($action) {
        case 'tree':
            $tree = [];
            foreach ($AREAS as $key => $area) {
                $tree[] = ['key' => $key, 'label' => $area['label'], 'root' => $area['root'], 'files' => list_area($key)];
            }
            json_out(['areas' => $tree, 'dirs' => new_file_dirs()]);

        case 'load':
            $r = resolve_editable((string) ($_GET['path'] ?? ''));
            if (!$r) {
                json_out(['error' => 'Not an editable NHCX file.'], 404);
            }
            $content = (string) file_get_contents($r[0]);
            json_out([
                'path'    => $_GET['path'],
                'content' => $content,
                'hash'    => sha1($content),
                'route'   => site_route((string) $_GET['path'], $content),
                'area'    => $r[1],
            ]);

        case 'save':
            $path = (string) ($body['path'] ?? '');
            $r = resolve_editable($path);
            if (!$r) {
                json_out(['error' => 'Not an editable NHCX file.'], 404);
            }
            $current = (string) file_get_contents($r[0]);
            if (empty($body['force']) && sha1($current) !== ($body['hash'] ?? '')) {
                json_out(['error' => 'The file changed on disk since you opened it.', 'conflict' => true], 409);
            }
            $content = str_replace("\r\n", "\n", (string) ($body['content'] ?? ''));
            try {
                write_atomic($r[0], $content);
            } catch (RuntimeException $e) {
                json_out(['error' => $e->getMessage()], 500);
            }
            json_out(['ok' => true, 'hash' => sha1($content), 'route' => site_route($path, $content)]);

        case 'create':
            $dir = trim((string) ($body['dir'] ?? ''), '/');
            $name = (string) ($body['name'] ?? '');
            if (!in_array($dir, new_file_dirs(), true)) {
                json_out(['error' => 'Pick one of the listed folders.'], 400);
            }
            if (!preg_match('/^[a-z0-9][a-z0-9-]*\.(md|mdx)$/', $name)) {
                json_out(['error' => 'Use a lowercase file name with hyphens, ending in .md or .mdx.'], 400);
            }
            $rel = $dir . '/' . $name;
            $r = resolve_editable($rel, false);
            if (!$r) {
                json_out(['error' => 'That location is not editable.'], 400);
            }
            if (file_exists($r[0])) {
                json_out(['error' => 'A file with that name already exists.'], 409);
            }
            $title = ucfirst(str_replace('-', ' ', pathinfo($name, PATHINFO_FILENAME)));
            if ($r[1] === 'pages') {
                $content = "---\ntitle: {$title}\nsidebar_label: {$title}\ndescription: \n---\n\n# {$title}\n\n";
            } else {
                $content = "---\nid: nhcx.\ntype: \ngateway: nhcx\nmilestone: n/a\nversion: nhcx-v1\ntitle: {$title}\nsummary: \nsources: []\n---\n\n";
            }
            try {
                write_atomic($r[0], $content);
            } catch (RuntimeException $e) {
                json_out(['error' => $e->getMessage()], 500);
            }
            json_out(['ok' => true, 'path' => $rel]);

        case 'lint':
            $which = (string) ($body['which'] ?? '');
            $scripts = ['content' => 'lint-content.mjs', 'atoms' => 'lint-atoms.mjs'];
            if (!isset($scripts[$which])) {
                json_out(['error' => 'Unknown check.'], 400);
            }
            [$code, $out] = run_lint($scripts[$which]);
            json_out(['code' => $code, 'output' => $out]);

        default:
            json_out(['error' => 'Unknown action.'], 400);
    }
}

/* ---------- page ---------- */

$siteUrl = getenv('NHCX_SITE_URL') ?: '';
header('Content-Type: text/html; charset=utf-8');
?><!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>NHCX Editor</title>
<style>
:root {
  --bg: #ffffff; --panel: #f6f7f9; --line: #e2e5ea; --text: #1d2330; --muted: #667085;
  --accent: #1f6feb; --accent-text: #ffffff; --warn: #b54708; --warn-bg: #fff6ed;
  --err: #b42318; --ok: #067647; --sel: #e8f0fe; --code-bg: #fbfbfc;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bg: #0f1115; --panel: #161a21; --line: #262c36; --text: #e6e9ef; --muted: #98a2b3;
    --accent: #4c8dff; --accent-text: #0f1115; --warn: #f79009; --warn-bg: #2a1d0e;
    --err: #f97066; --ok: #47cd89; --sel: #1c2a44; --code-bg: #12151b;
  }
}
* { box-sizing: border-box; }
[hidden] { display: none !important; }
html, body { height: 100%; margin: 0; }
body { background: var(--bg); color: var(--text); font: 14px/1.45 system-ui, -apple-system, "Segoe UI", sans-serif; display: grid; grid-template-columns: 320px 1fr; grid-template-rows: 100%; }
aside { background: var(--panel); border-right: 1px solid var(--line); display: flex; flex-direction: column; min-height: 0; }
aside header { padding: 14px 14px 10px; border-bottom: 1px solid var(--line); }
aside h1 { font-size: 15px; margin: 0 0 10px; }
input, select, button, textarea { font: inherit; color: inherit; }
input[type=search], input[type=text], select { width: 100%; padding: 7px 9px; border: 1px solid var(--line); border-radius: 6px; background: var(--bg); }
#tree { overflow: auto; flex: 1; padding: 6px 0 20px; }
.area > summary { font-weight: 600; padding: 8px 14px; cursor: pointer; position: sticky; top: 0; background: var(--panel); }
.area .count { color: var(--muted); font-weight: 400; }
.dir { padding: 6px 14px 2px 22px; color: var(--muted); font-size: 12px; word-break: break-all; }
.file { display: block; width: 100%; text-align: left; border: 0; background: none; padding: 3px 14px 3px 30px; cursor: pointer; word-break: break-all; border-radius: 0; }
.file:hover { background: var(--sel); }
.file.active { background: var(--sel); color: var(--accent); font-weight: 600; }
.file.dirty::after { content: " \2022"; color: var(--warn); }
main { display: flex; flex-direction: column; min-width: 0; min-height: 0; }
.bar { display: flex; gap: 8px; align-items: center; padding: 10px 14px; border-bottom: 1px solid var(--line); flex-wrap: wrap; }
.bar .path { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 13px; flex: 1; min-width: 200px; word-break: break-all; }
.btn { border: 1px solid var(--line); background: var(--bg); padding: 6px 12px; border-radius: 6px; cursor: pointer; white-space: nowrap; text-decoration: none; color: var(--text); }
.btn:hover { border-color: var(--accent); }
.btn.primary { background: var(--accent); border-color: var(--accent); color: var(--accent-text); }
.btn:disabled { opacity: .5; cursor: default; }
#status { color: var(--muted); font-size: 13px; }
#status.err { color: var(--err); }
#status.ok { color: var(--ok); }
#warnings { display: none; background: var(--warn-bg); color: var(--warn); padding: 8px 14px; border-bottom: 1px solid var(--line); font-size: 13px; }
#warnings.show { display: block; }
#warnings ul { margin: 0; padding-left: 18px; }
.panes { flex: 1; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); min-height: 0; }
.panes.nopreview { grid-template-columns: minmax(0, 1fr); }
.panes.nopreview #preview { display: none; }
.editor-wrap { display: grid; grid-template-columns: auto 1fr; min-height: 0; min-width: 0; background: var(--code-bg); }
#preview { overflow: auto; min-height: 0; padding: 20px 28px 60px; border-left: 1px solid var(--line); font-size: 15px; line-height: 1.6; }
#preview .fm { font-size: 12px; color: var(--muted); border: 1px solid var(--line); border-radius: 8px; padding: 8px 12px; margin-bottom: 18px; background: var(--panel); }
#preview .fm div { word-break: break-word; }
#preview .fm b { color: var(--text); font-weight: 600; }
#preview h1, #preview h2, #preview h3, #preview h4 { line-height: 1.25; margin: 1.4em 0 .5em; }
#preview h1 { font-size: 1.9em; margin-top: .2em; }
#preview h2 { font-size: 1.45em; border-bottom: 1px solid var(--line); padding-bottom: .25em; }
#preview h3 { font-size: 1.2em; }
#preview a { color: var(--accent); }
#preview code { font: .88em ui-monospace, SFMono-Regular, Menlo, monospace; background: var(--panel); border: 1px solid var(--line); border-radius: 4px; padding: .05em .3em; }
#preview pre { background: var(--panel); border: 1px solid var(--line); border-radius: 8px; padding: 12px 14px; overflow: auto; position: relative; }
#preview pre code { border: 0; padding: 0; background: none; font-size: 13px; }
#preview pre[data-lang]::before { content: attr(data-lang); position: absolute; top: 4px; right: 8px; font-size: 11px; color: var(--muted); }
#preview table { border-collapse: collapse; display: block; overflow-x: auto; margin: 1em 0; font-size: 14px; }
#preview th, #preview td { border: 1px solid var(--line); padding: 6px 10px; text-align: left; vertical-align: top; }
#preview th { background: var(--panel); }
#preview blockquote { margin: 1em 0; padding: 2px 14px; border-left: 3px solid var(--line); color: var(--muted); }
#preview hr { border: 0; border-top: 1px solid var(--line); margin: 1.6em 0; }
#preview img { max-width: 100%; }
#preview .adm { border-left: 4px solid var(--accent); background: var(--sel); border-radius: 6px; padding: 8px 14px; margin: 1em 0; }
#preview .adm.warning, #preview .adm.caution, #preview .adm.danger { border-color: var(--warn); background: var(--warn-bg); }
#preview .adm > .adm-title { font-weight: 700; text-transform: uppercase; font-size: 12px; letter-spacing: .04em; margin-bottom: 4px; }
#preview .jsx { border: 1px dashed var(--line); border-radius: 6px; padding: 8px 12px; color: var(--muted); font-size: 13px; margin: 1em 0; }
#preview .jsx code { background: none; border: 0; }
#preview .none { color: var(--muted); }
#gutter { padding: 12px 8px 12px 12px; text-align: right; color: var(--muted); font: 13px/1.55 ui-monospace, SFMono-Regular, Menlo, monospace; overflow: hidden; user-select: none; border-right: 1px solid var(--line); white-space: pre; }
#editor { border: 0; outline: 0; resize: none; padding: 12px 14px; background: transparent; font: 13px/1.55 ui-monospace, SFMono-Regular, Menlo, monospace; tab-size: 2; white-space: pre; overflow: auto; min-height: 0; }
#empty { flex: 1; display: grid; place-items: center; color: var(--muted); padding: 24px; text-align: center; }
#lintOut { display: none; max-height: 35vh; overflow: auto; margin: 0; padding: 10px 14px; border-top: 1px solid var(--line); background: var(--panel); font: 12px/1.5 ui-monospace, Menlo, monospace; white-space: pre-wrap; }
#lintOut.show { display: block; }
dialog { border: 1px solid var(--line); border-radius: 10px; background: var(--bg); color: var(--text); width: min(520px, calc(100vw - 32px)); }
dialog label { display: block; margin: 10px 0 4px; font-weight: 600; }
dialog .row { display: flex; gap: 8px; justify-content: flex-end; margin-top: 16px; }
.hint { color: var(--muted); font-size: 12px; margin-top: 4px; }
#menuBtn { display: none; }
@media (max-width: 800px) {
  body { grid-template-columns: 1fr; }
  aside { position: fixed; inset: 0 20% 0 0; z-index: 5; transform: translateX(-100%); transition: transform .2s; }
  body.nav aside { transform: none; }
  #menuBtn { display: inline-block; }
  #gutter { display: none; }
  .editor-wrap { grid-template-columns: 1fr; }
  .panes { grid-template-columns: 1fr; grid-template-rows: minmax(0, 1fr) minmax(0, 1fr); }
  .panes.nopreview { grid-template-rows: minmax(0, 1fr); }
  #preview { border-left: 0; border-top: 1px solid var(--line); padding: 16px; }
}
</style>
</head>
<body>
<aside>
  <header>
    <h1>NHCX Editor</h1>
    <input type="search" id="filter" placeholder="Filter files" autocomplete="off">
    <div style="margin-top:8px"><button class="btn" id="newBtn" type="button">New page or atom</button></div>
  </header>
  <nav id="tree"></nav>
</aside>
<main>
  <div class="bar">
    <button class="btn" id="menuBtn" type="button">Files</button>
    <span class="path" id="pathLabel">No file open</span>
    <span id="status"></span>
    <a class="btn" id="viewBtn" target="_blank" rel="noopener" hidden>View on site</a>
    <button class="btn" id="previewBtn" type="button" aria-pressed="true">Preview</button>
    <button class="btn" id="lintBtn" type="button" disabled>Run checks</button>
    <button class="btn primary" id="saveBtn" type="button" disabled>Save</button>
  </div>
  <div id="warnings"></div>
  <div id="empty">Pick a file on the left. Generated API pages are not listed: change the OpenAPI source or the generator instead.</div>
  <div class="panes" id="wrap" hidden>
    <div class="editor-wrap">
      <div id="gutter">1</div>
      <textarea id="editor" spellcheck="false" autocapitalize="off" autocomplete="off"></textarea>
    </div>
    <article id="preview" aria-label="Preview"></article>
  </div>
  <pre id="lintOut"></pre>
</main>

<dialog id="newDlg">
  <form method="dialog" id="newForm">
    <strong>New page or atom</strong>
    <label for="newDir">Folder</label>
    <select id="newDir"></select>
    <label for="newName">File name</label>
    <input type="text" id="newName" placeholder="my-new-page.md" pattern="[a-z0-9][a-z0-9-]*\.(md|mdx)" required>
    <div class="hint">Lowercase letters, digits and hyphens, ending in .md or .mdx.</div>
    <div class="row">
      <button class="btn" value="cancel" formnovalidate type="submit">Cancel</button>
      <button class="btn primary" id="createBtn" value="ok" type="submit">Create</button>
    </div>
  </form>
</dialog>

<script>
(() => {
  const SITE = <?= json_encode($siteUrl) ?> || (location.protocol + '//' + location.hostname + ':3000');
  const $ = id => document.getElementById(id);
  const editor = $('editor'), gutter = $('gutter');
  let current = null; // {path, hash, saved, area}
  let tree = null;

  const api = async (action, opts = {}) => {
    const url = 'index.php?action=' + action + (opts.query ? '&' + new URLSearchParams(opts.query) : '');
    const res = await fetch(url, opts.body ? {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(opts.body)} : {});
    const data = await res.json().catch(() => ({error: 'Bad response from server.'}));
    return {status: res.status, data};
  };

  const setStatus = (text, cls = '') => { const s = $('status'); s.textContent = text; s.className = cls; };
  const dirty = () => current && editor.value !== current.saved;

  // Which sections are unfolded is the reader's choice; rebuilding the tree must not undo it.
  let openAreas = new Set(['pages']);
  try { const s = JSON.parse(localStorage.getItem('nhcx-editor-open') || 'null'); if (Array.isArray(s)) openAreas = new Set(s); } catch (e) {}
  const saveOpen = () => { try { localStorage.setItem('nhcx-editor-open', JSON.stringify([...openAreas])); } catch (e) {} };

  function renderTree() {
    const q = $('filter').value.trim().toLowerCase();
    const nav = $('tree');
    const scroll = nav.scrollTop;
    nav.textContent = '';
    for (const area of tree.areas) {
      const files = area.files.filter(f => !q || f.toLowerCase().includes(q));
      const det = document.createElement('details');
      det.className = 'area';
      det.open = q ? true : openAreas.has(area.key);
      det.addEventListener('toggle', () => {
        if ($('filter').value.trim()) return; // a filter unfolds everything without changing the saved state
        if (det.open) openAreas.add(area.key); else openAreas.delete(area.key);
        saveOpen();
      });
      const sum = document.createElement('summary');
      sum.innerHTML = '';
      sum.append(area.label + ' ');
      const c = document.createElement('span'); c.className = 'count'; c.textContent = '(' + files.length + ')';
      sum.append(c);
      det.append(sum);
      let lastDir = null;
      for (const f of files) {
        const rel = f.slice(area.root.length + 1);
        const dir = rel.includes('/') ? rel.slice(0, rel.lastIndexOf('/')) : '';
        if (dir !== lastDir) {
          const d = document.createElement('div'); d.className = 'dir'; d.textContent = (dir || '.') + '/';
          det.append(d); lastDir = dir;
        }
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'file'; b.dataset.path = f;
        b.textContent = rel.slice(rel.lastIndexOf('/') + 1);
        if (current && current.path === f) { b.classList.add('active'); if (dirty()) b.classList.add('dirty'); }
        b.onclick = () => open(f);
        det.append(b);
      }
      nav.append(det);
    }
    nav.scrollTop = scroll;
  }

  async function loadTree() {
    const {data} = await api('tree');
    tree = data;
    renderTree();
    const sel = $('newDir'); sel.textContent = '';
    for (const d of data.dirs) { const o = document.createElement('option'); o.value = o.textContent = d; sel.append(o); }
  }

  async function open(path, skipConfirm = false) {
    if (!skipConfirm && dirty() && !confirm('Discard unsaved changes to ' + current.path + '?')) return;
    const {status, data} = await api('load', {query: {path}});
    if (status !== 200) { setStatus(data.error || 'Could not open.', 'err'); return; }
    current = {path: data.path, hash: data.hash, saved: data.content, area: data.area};
    editor.value = data.content;
    $('empty').hidden = true; $('wrap').hidden = false;
    $('pathLabel').textContent = data.path;
    $('saveBtn').disabled = false; $('lintBtn').disabled = false;
    setRoute(data.route);
    $('lintOut').classList.remove('show');
    setStatus('');
    $('preview').scrollTop = 0;
    updateGutter(); check(); renderPreview(); renderTree();
    history.replaceState(null, '', '#' + encodeURIComponent(path));
    document.body.classList.remove('nav');
    editor.focus(); editor.setSelectionRange(0, 0); editor.scrollTop = 0;
  }

  function setRoute(route) {
    const v = $('viewBtn');
    if (route) { v.href = SITE.replace(/\/$/, '') + route; v.hidden = false; } else v.hidden = true;
  }

  async function save(force = false) {
    if (!current) return;
    setStatus('Saving...');
    const {status, data} = await api('save', {body: {path: current.path, content: editor.value, hash: current.hash, force}});
    if (status === 409 && data.conflict) {
      if (confirm('This file changed on disk since you opened it (another editor, git, or a build).\n\nOK overwrites it with your version. Cancel keeps the disk version untouched so you can copy your changes out first.')) return save(true);
      setStatus('Not saved: file changed on disk.', 'err'); return;
    }
    if (status !== 200) { setStatus(data.error || 'Save failed.', 'err'); return; }
    current.hash = data.hash; current.saved = editor.value.replace(/\r\n/g, '\n');
    setRoute(data.route);
    setStatus('Saved ' + new Date().toLocaleTimeString(), 'ok');
    renderTree();
  }

  /* Checks that need no server: the repo rules a reviewer would otherwise catch. */
  function check() {
    if (!current) return;
    const text = editor.value, out = [];
    const lines = text.split('\n');
    const dash = []; lines.forEach((l, i) => { if (l.includes(String.fromCharCode(0x2014))) dash.push(i + 1); });
    if (dash.length) out.push('Em dash on line ' + dash.slice(0, 8).join(', ') + (dash.length > 8 ? ' and more' : '') + '. The writing guide bans it and CI fails on it.');
    if (/\.mdx?$/.test(current.path)) {
      const fm = text.match(/^---\n([\s\S]*?)\n---/);
      if (!fm) out.push('No frontmatter block at the top of the file.');
      else if (current.area === 'pages') {
        if (!/^title:\s*\S/m.test(fm[1])) out.push('Frontmatter has no title.');
        if (!/^description:\s*\S/m.test(fm[1])) out.push('Frontmatter has no description.');
      } else if (current.area === 'atoms') {
        for (const k of ['id', 'type', 'gateway', 'title']) if (!new RegExp('^' + k + ':\\s*\\S', 'm').test(fm[1])) out.push('Frontmatter has no ' + k + '.');
        if (/^verification:\s*verified/m.test(fm[1])) out.push('This atom says verified. Only set that after observing the sandbox response.');
      }
    }
    const w = $('warnings');
    w.innerHTML = '';
    if (out.length) { const ul = document.createElement('ul'); for (const m of out) { const li = document.createElement('li'); li.textContent = m; ul.append(li); } w.append(ul); }
    w.classList.toggle('show', out.length > 0);
  }

  async function lint() {
    if (!current) return;
    const which = current.area === 'atoms' ? 'atoms' : 'content';
    if (dirty()) await save();
    const pre = $('lintOut');
    pre.textContent = 'Running npm run lint:' + which + '...'; pre.classList.add('show');
    const {data} = await api('lint', {body: {which}});
    if (data.error) { pre.textContent = data.error; return; }
    const mine = data.output.split('\n').filter(l => l.includes(current.path));
    const summary = data.output.trim().split('\n').slice(-2).join('\n');
    pre.textContent = 'lint:' + which + ' exited ' + data.code + (data.code === 0 ? ' (passing)' : ' (failing)') + '\n\n' +
      (mine.length ? 'Lines about this file:\n' + mine.join('\n') : 'No lines name this file. The script caps its warning list, so run it in a terminal for the full output.') +
      '\n\n' + summary;
  }

  /* ---------- preview: a small Markdown and MDX renderer ----------
   * Covers what the NHCX pages use: frontmatter, headings, lists, tables,
   * fences, blockquotes, Docusaurus admonitions and inline marks. JSX
   * components render as a labelled placeholder; the site shows the real
   * thing through "View on site". Everything is escaped, nothing is run. */
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const siteHref = u => {
    u = u.trim().replace(/^<|>$/g, '');
    if (/^(https?:|mailto:|#)/i.test(u)) return u;
    if (u.startsWith('/')) return SITE.replace(/\/$/, '') + u;
    return u;
  };

  function inline(src) {
    // Code spans first, so their contents are never touched by other marks.
    return src.split(/(`+[^`]*?`+)/).map((part, i) => {
      if (i % 2) return '<code>' + esc(part.replace(/^`+|`+$/g, '')) + '</code>';
      let s = esc(part);
      s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+&quot;[^)]*&quot;)?\)/g, (m, alt, u) => '<img alt="' + alt + '" src="' + esc(siteHref(u.replace(/&amp;/g, '&'))) + '">');
      s = s.replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+&quot;[^)]*&quot;)?\)/g, (m, t, u) => '<a href="' + esc(siteHref(u.replace(/&amp;/g, '&'))) + '" target="_blank" rel="noopener">' + t + '</a>');
      s = s.replace(/&lt;(https?:\/\/[^\s&]+)&gt;/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
      s = s.replace(/\*\*([^*]+)\*\*|__([^_]+)__/g, (m, a, b) => '<strong>' + (a || b) + '</strong>');
      s = s.replace(/(^|[^*\w])\*([^*\s][^*]*?)\*(?!\w)/g, '$1<em>$2</em>');
      s = s.replace(/(^|[^_\w])_([^_\s][^_]*?)_(?!\w)/g, '$1<em>$2</em>');
      s = s.replace(/~~([^~]+)~~/g, '<del>$1</del>');
      return s;
    }).join('');
  }

  const splitRow = l => {
    let s = l.trim();
    if (s.startsWith('|')) s = s.slice(1);
    if (s.endsWith('|') && !s.endsWith('\\|')) s = s.slice(0, -1);
    return s.split(/(?<!\\)\|/).map(c => c.trim().replace(/\\\|/g, '|'));
  };
  const isTableSep = l => /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/.test(l) && l.includes('-');
  const listRe = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/;

  function blocks(lines) {
    let html = '', i = 0;
    const startsBlock = l => /^(#{1,6}\s|```|~~~|:::|>|\s*([-*+]|\d+[.)])\s|\s*<[A-Za-z/])/.test(l) || /^(-{3,}|\*{3,}|_{3,})\s*$/.test(l);
    while (i < lines.length) {
      const line = lines[i];
      if (!line.trim()) { i++; continue; }
      let m;
      if ((m = line.match(/^\s*(```+|~~~+)\s*([\w+-]*)/))) {
        const fence = m[1], lang = m[2], body = [];
        i++;
        while (i < lines.length && !lines[i].trim().startsWith(fence)) body.push(lines[i++]);
        i++;
        html += '<pre' + (lang ? ' data-lang="' + esc(lang) + '"' : '') + '><code>' + esc(body.join('\n')) + '</code></pre>';
        continue;
      }
      if ((m = line.match(/^:::(\w+)\s*(.*)$/))) {
        const body = [];
        let depth = 1;
        i++;
        while (i < lines.length) {
          if (/^:::\w/.test(lines[i])) depth++;
          else if (/^:::\s*$/.test(lines[i]) && --depth === 0) break;
          body.push(lines[i++]);
        }
        i++;
        const kind = m[1].toLowerCase();
        html += '<div class="adm ' + esc(kind) + '"><div class="adm-title">' + esc(m[2] || kind) + '</div>' + blocks(body) + '</div>';
        continue;
      }
      if ((m = line.match(/^(#{1,6})\s+(.*?)\s*#*\s*(\{#[^}]*\})?\s*$/))) {
        const n = m[1].length;
        html += '<h' + n + '>' + inline(m[2]) + '</h' + n + '>';
        i++; continue;
      }
      if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) { html += '<hr>'; i++; continue; }
      if (line.includes('|') && i + 1 < lines.length && isTableSep(lines[i + 1])) {
        const head = splitRow(line), aligns = splitRow(lines[i + 1]).map(c => c.startsWith(':') && c.endsWith(':') ? 'center' : c.endsWith(':') ? 'right' : '');
        const al = k => aligns[k] ? ' style="text-align:' + aligns[k] + '"' : '';
        html += '<table><thead><tr>' + head.map((c, k) => '<th' + al(k) + '>' + inline(c) + '</th>').join('') + '</tr></thead><tbody>';
        i += 2;
        while (i < lines.length && lines[i].includes('|') && lines[i].trim()) {
          html += '<tr>' + splitRow(lines[i]).map((c, k) => '<td' + al(k) + '>' + inline(c) + '</td>').join('') + '</tr>';
          i++;
        }
        html += '</tbody></table>';
        continue;
      }
      if (/^\s*>/.test(line)) {
        const body = [];
        while (i < lines.length && /^\s*>/.test(lines[i])) body.push(lines[i++].replace(/^\s*>\s?/, ''));
        html += '<blockquote>' + blocks(body) + '</blockquote>';
        continue;
      }
      if (listRe.test(line)) {
        const items = [];
        while (i < lines.length) {
          const l = lines[i];
          if ((m = l.match(listRe))) { items.push({indent: m[1].length, ordered: /\d/.test(m[2]), text: m[3]}); i++; continue; }
          if (l.trim() && /^\s+/.test(l) && items.length && !/^\s*(```|~~~)/.test(l)) { items[items.length - 1].text += ' ' + l.trim(); i++; continue; }
          if (!l.trim() && i + 1 < lines.length && (listRe.test(lines[i + 1]) || /^\s{2,}\S/.test(lines[i + 1]))) { i++; continue; }
          break;
        }
        const stack = [];
        for (const it of items) {
          while (stack.length && it.indent < stack[stack.length - 1].indent) html += '</li></' + stack.pop().tag + '>';
          if (!stack.length || it.indent > stack[stack.length - 1].indent) {
            const tag = it.ordered ? 'ol' : 'ul';
            stack.push({indent: it.indent, tag});
            html += '<' + tag + '>';
          } else html += '</li>';
          const task = it.text.match(/^\[( |x)\]\s+(.*)$/i);
          html += '<li>' + (task ? (task[1].trim() ? '&#9745; ' : '&#9744; ') + inline(task[2]) : inline(it.text));
        }
        while (stack.length) html += '</li></' + stack.pop().tag + '>';
        continue;
      }
      if (/^\s*<[A-Za-z/]/.test(line)) {
        // JSX or raw HTML: collect to the matching blank line and show what it is.
        const body = [];
        while (i < lines.length && lines[i].trim()) body.push(lines[i++]);
        const tag = (body[0].match(/<\/?([\w.]+)/) || [])[1] || 'element';
        if (/^[A-Z]/.test(tag)) html += '<div class="jsx">Component <code>&lt;' + esc(tag) + '&gt;</code> renders on the site.</div>';
        else if (/^(details|summary|br|div|span|p|sup|sub|b|i|em|strong)$/i.test(tag)) {
          html += '<div class="jsx">' + inline(body.join(' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()) + '</div>';
        } else html += '<pre><code>' + esc(body.join('\n')) + '</code></pre>';
        continue;
      }
      const para = [];
      while (i < lines.length && lines[i].trim() && !(para.length && startsBlock(lines[i]))) para.push(lines[i++]);
      html += '<p>' + para.map(inline).join(' ').replace(/ {2,}$/gm, '<br>') + '</p>';
    }
    return html;
  }

  function renderMarkdown(text) {
    let fmHtml = '';
    const fm = text.match(/^---\n([\s\S]*?)\n---\n?/);
    if (fm) {
      text = text.slice(fm[0].length);
      const keep = ['title', 'id', 'type', 'description', 'summary', 'verification', 'sidebar_label', 'slug'];
      const rows = [];
      for (const k of keep) {
        const m = fm[1].match(new RegExp('^' + k + ':\\s*(>-?|\\|-?)?\\s*(.*(?:\\n[ \\t]+.*)*)', 'm'));
        if (m && m[2].trim()) rows.push('<div><b>' + k + ':</b> ' + esc(m[2].replace(/\s+/g, ' ').replace(/^["']|["']$/g, '').trim()) + '</div>');
      }
      if (rows.length) fmHtml = '<div class="fm">' + rows.join('') + '</div>';
    }
    // MDX import and export lines are build plumbing, not content.
    const lines = text.split('\n').filter(l => !/^(import|export)\s/.test(l));
    return fmHtml + blocks(lines);
  }

  let previewOn = true;
  try { previewOn = localStorage.getItem('nhcx-editor-preview') !== 'off'; } catch (e) {}
  function renderPreview() {
    const pane = $('preview');
    if (!current || !previewOn) return;
    if (!/\.mdx?$/.test(current.path)) {
      pane.innerHTML = '<p class="none">Preview covers Markdown pages and atoms. This OpenAPI source renders on the API reference pages after the generator runs.</p>';
      return;
    }
    const ratio = pane.scrollTop / Math.max(1, pane.scrollHeight - pane.clientHeight);
    pane.innerHTML = renderMarkdown(editor.value.replace(/\r\n/g, '\n'));
    pane.scrollTop = ratio * (pane.scrollHeight - pane.clientHeight);
  }
  function applyPreview() {
    $('wrap').classList.toggle('nopreview', !previewOn);
    $('previewBtn').setAttribute('aria-pressed', String(previewOn));
    $('previewBtn').textContent = previewOn ? 'Hide preview' : 'Preview';
    renderPreview();
  }

  let gutterCount = 0;
  function updateGutter() {
    const n = editor.value.split('\n').length;
    if (n !== gutterCount) { gutterCount = n; gutter.textContent = Array.from({length: n}, (_, i) => i + 1).join('\n'); }
    gutter.scrollTop = editor.scrollTop;
  }

  let checkTimer, previewTimer;
  editor.addEventListener('input', () => {
    updateGutter();
    clearTimeout(checkTimer); checkTimer = setTimeout(check, 250);
    clearTimeout(previewTimer); previewTimer = setTimeout(renderPreview, 120);
    const btn = document.querySelector('.file.active');
    if (btn) btn.classList.toggle('dirty', dirty());
    if (dirty()) setStatus('Unsaved changes');
  });
  editor.addEventListener('scroll', () => {
    gutter.scrollTop = editor.scrollTop;
    // Keep the preview roughly level with the editor.
    const p = $('preview');
    if (previewOn) p.scrollTop = editor.scrollTop / Math.max(1, editor.scrollHeight - editor.clientHeight) * (p.scrollHeight - p.clientHeight);
  });
  editor.addEventListener('keydown', e => {
    if (e.key === 'Tab' && !e.metaKey && !e.ctrlKey) {
      e.preventDefault();
      const s = editor.selectionStart, en = editor.selectionEnd;
      editor.setRangeText('  ', s, en, 'end');
      editor.dispatchEvent(new Event('input'));
    }
  });
  document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') { e.preventDefault(); save(); }
  });
  window.addEventListener('beforeunload', e => { if (dirty()) { e.preventDefault(); e.returnValue = ''; } });

  $('saveBtn').onclick = () => save();
  $('lintBtn').onclick = lint;
  $('previewBtn').onclick = () => {
    previewOn = !previewOn;
    try { localStorage.setItem('nhcx-editor-preview', previewOn ? 'on' : 'off'); } catch (e) {}
    applyPreview();
  };
  applyPreview();
  $('filter').oninput = renderTree;
  $('menuBtn').onclick = () => document.body.classList.toggle('nav');
  $('newBtn').onclick = () => { $('newName').value = ''; $('newDlg').showModal(); };
  $('newForm').addEventListener('submit', async e => {
    if (e.submitter && e.submitter.value !== 'ok') return;
    e.preventDefault();
    const {status, data} = await api('create', {body: {dir: $('newDir').value, name: $('newName').value.trim()}});
    if (status !== 200) { alert(data.error || 'Could not create.'); return; }
    $('newDlg').close();
    await loadTree();
    open(data.path);
  });

  loadTree().then(() => {
    const h = decodeURIComponent(location.hash.slice(1));
    if (h) open(h, true);
  });
})();
</script>
</body>
</html>
