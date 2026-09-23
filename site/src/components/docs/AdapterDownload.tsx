import React, {useEffect, useMemo, useState} from 'react';

/**
 * Download box for the NHCX adapter: reads the latest release of
 * nha-in/nhcx-adapter from the GitHub API in the browser, then offers an
 * operating system and an architecture picked from the archives that release
 * actually carries. Archives are named nhcx-adapter_<version>_<os>_<arch>,
 * .tar.gz everywhere except Windows, which is .zip (scripts/build.sh in the
 * adapter repository). If the API cannot be reached, the box falls back to a
 * link to the releases page rather than guessing a file name.
 */

const REPO = 'nha-in/nhcx-adapter';
const RELEASES = `https://github.com/${REPO}/releases`;
const API = `https://api.github.com/repos/${REPO}/releases/latest`;

type Asset = {os: string; arch: string; name: string; url: string; size: number};
type Release = {tag: string; url: string; assets: Asset[]; sums?: string};

const OS_LABEL: Record<string, string> = {
  linux: 'Linux',
  darwin: 'macOS',
  windows: 'Windows',
  freebsd: 'FreeBSD',
};
const OS_ORDER = ['linux', 'darwin', 'windows', 'freebsd'];

const ARCH_LABEL: Record<string, string> = {
  amd64: 'x86-64 (amd64)',
  arm64: 'ARM 64-bit (arm64)',
  arm: 'ARM 32-bit (arm)',
  '386': 'x86 32-bit (386)',
  ppc64le: 'POWER (ppc64le)',
  s390x: 'IBM Z (s390x)',
  riscv64: 'RISC-V (riscv64)',
};
const ARCH_ORDER = ['amd64', 'arm64', 'arm', '386', 'ppc64le', 's390x', 'riscv64'];

const ASSET = /^nhcx-adapter_(.+)_([a-z0-9]+)_([a-z0-9]+)\.(tar\.gz|zip)$/;

/** The reader's own platform, as a best guess for the default. */
function guessPlatform(): {os: string; arch: string} {
  if (typeof navigator === 'undefined') return {os: 'linux', arch: 'amd64'};
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes('windows')) return {os: 'windows', arch: 'amd64'};
  // Browsers do not say whether a Mac is Apple silicon, and every Mac sold
  // since 2021 is, so arm64 is the likelier default.
  if (ua.includes('mac os') || ua.includes('macintosh')) return {os: 'darwin', arch: 'arm64'};
  if (ua.includes('aarch64') || ua.includes('arm64')) return {os: 'linux', arch: 'arm64'};
  return {os: 'linux', arch: 'amd64'};
}

function size(bytes: number): string {
  return bytes > 0 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : '';
}

export default function AdapterDownload(): React.JSX.Element {
  const [release, setRelease] = useState<Release | null>(null);
  const [failed, setFailed] = useState(false);
  const [os, setOs] = useState('');
  const [arch, setArch] = useState('');

  useEffect(() => {
    let cancelled = false;
    fetch(API, {headers: {Accept: 'application/vnd.github+json'}})
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data) => {
        if (cancelled) return;
        const assets: Asset[] = [];
        let sums: string | undefined;
        for (const a of data.assets ?? []) {
          if (a.name === 'SHA256SUMS') sums = a.browser_download_url;
          const m = ASSET.exec(a.name);
          if (m) {
            assets.push({os: m[2], arch: m[3], name: a.name, url: a.browser_download_url, size: a.size});
          }
        }
        if (assets.length === 0) throw new Error('no archives');
        const guess = guessPlatform();
        const hasGuess = assets.some((a) => a.os === guess.os && a.arch === guess.arch);
        const first = hasGuess ? guess : {os: assets[0].os, arch: assets[0].arch};
        setRelease({tag: data.tag_name, url: data.html_url, assets, sums});
        setOs(first.os);
        setArch(first.arch);
      })
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
    };
  }, []);

  const oses = useMemo(
    () =>
      release
        ? OS_ORDER.filter((o) => release.assets.some((a) => a.os === o)).concat(
            [...new Set(release.assets.map((a) => a.os))].filter((o) => !OS_ORDER.includes(o)),
          )
        : [],
    [release],
  );
  const arches = useMemo(() => {
    if (!release) return [];
    const have = release.assets.filter((a) => a.os === os).map((a) => a.arch);
    return ARCH_ORDER.filter((a) => have.includes(a)).concat(have.filter((a) => !ARCH_ORDER.includes(a)));
  }, [release, os]);

  // Keep the architecture valid when the OS changes.
  useEffect(() => {
    if (arches.length && !arches.includes(arch)) setArch(arches[0]);
  }, [arches, arch]);

  const asset = release?.assets.find((a) => a.os === os && a.arch === arch);

  if (failed) {
    return (
      <div className="adapter-dl">
        <p className="adapter-dl__note">
          The latest release could not be read from GitHub. Download it from the{' '}
          <a href={`${RELEASES}/latest`}>releases page</a>.
        </p>
      </div>
    );
  }
  if (!release) {
    return (
      <div className="adapter-dl">
        <p className="adapter-dl__note">Reading the latest release…</p>
      </div>
    );
  }

  const folder = asset ? asset.name.replace(/\.(tar\.gz|zip)$/, '') : '';
  const install =
    asset && os !== 'windows'
      ? `curl -fsSL ${asset.url} | tar -xz\ncd ${folder}\n./nhcx-adapter version`
      : asset
        ? `Invoke-WebRequest ${asset.url} -OutFile ${asset.name}\nExpand-Archive ${asset.name} -DestinationPath .\ncd ${folder}\n.\\nhcx-adapter.exe version`
        : '';

  return (
    <div className="adapter-dl">
      <div className="adapter-dl__head">
        <span className="adapter-dl__version">
          Latest release <a href={release.url}>{release.tag}</a>
        </span>
        <a className="adapter-dl__all" href={RELEASES}>
          All releases
        </a>
      </div>
      <div className="adapter-dl__pickers">
        <label>
          <span>Operating system</span>
          <select value={os} onChange={(e) => setOs(e.target.value)}>
            {oses.map((o) => (
              <option key={o} value={o}>
                {OS_LABEL[o] ?? o}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Architecture</span>
          <select value={arch} onChange={(e) => setArch(e.target.value)}>
            {arches.map((a) => (
              <option key={a} value={a}>
                {ARCH_LABEL[a] ?? a}
              </option>
            ))}
          </select>
        </label>
      </div>
      {asset && (
        <>
          <div className="adapter-dl__file">
            <a className="adapter-dl__button" href={asset.url}>
              Download {asset.name}
            </a>
            <span className="adapter-dl__size">{size(asset.size)}</span>
            {release.sums && (
              <a className="adapter-dl__sums" href={release.sums}>
                SHA256SUMS
              </a>
            )}
          </div>
          <p className="adapter-dl__label">Or from a terminal</p>
          <pre className="adapter-dl__cmd">
            <code>{install}</code>
          </pre>
        </>
      )}
    </div>
  );
}
