#!/usr/bin/env bash
# Fetch the NHCX package and unpack it beside nhcx-build/ as nhcx-package/.
#
#   scripts/fetch-package.sh [url-or-path] [target-dir]
#
# With no [url-or-path] (or "latest"), the zip is the build attached to the latest
# release of https://github.com/nha-in/nhcx-package (the nhcx-package-v<version>.zip
# asset); its sha256 is checked against the digest GitHub records for the asset.
# Otherwise [url-or-path] is a link to the zip or a local path to it.
# [target-dir] defaults to the current directory. The zip unpacks to <target-dir>/nhcx-package/.
#
# Afterwards MANIFEST is checked: every file it lists must exist with the sha256
# it records. Nothing is deleted; an existing nhcx-package/ is replaced.
set -euo pipefail

repo="nha-in/nhcx-package"
src="${1:-latest}"
target="${2:-.}"
if [[ "$src" == "-h" || "$src" == "--help" ]]; then
  echo "usage: $0 [latest|url-or-path-to-package.zip] [target-dir]" >&2
  exit 2
fi

download() { # <url> <out>
  if command -v curl >/dev/null 2>&1; then
    curl -fsSL -o "$2" "$1"
  elif command -v wget >/dev/null 2>&1; then
    wget -qO "$2" "$1"
  else
    echo "neither curl nor wget is available" >&2
    exit 1
  fi
}

mkdir -p "$target"
tmp="$(mktemp -d)"
zip="$tmp/package.zip"
want_sha=""

if [[ "$src" == "latest" ]]; then
  # Ask the releases API for the latest release's zip asset and its digest.
  api="https://api.github.com/repos/$repo/releases/latest"
  if download "$api" "$tmp/release.json" 2>/dev/null; then
    read -r tag url want_sha < <(python3 - "$tmp/release.json" <<'PY'
import json, sys
rel = json.load(open(sys.argv[1], encoding="utf-8"))
assets = [a for a in rel.get("assets", [])
          if a["name"].startswith("nhcx-package") and a["name"].endswith(".zip")]
if not assets:
    sys.exit(f"release {rel.get('tag_name')} has no nhcx-package*.zip asset")
a = assets[0]
digest = a.get("digest") or ""
print(rel["tag_name"], a["browser_download_url"],
      digest.split(":", 1)[1] if digest.startswith("sha256:") else "")
PY
    )
  else
    # API unreachable or rate limited: read the tag off the releases/latest redirect
    # and build the asset name from it. No digest to check in this case.
    tag="$(curl -fsSIL -o /dev/null -w '%{url_effective}' "https://github.com/$repo/releases/latest")"
    tag="${tag##*/}"
    if [[ -z "$tag" || "$tag" == "latest" ]]; then
      echo "could not resolve the latest release of $repo" >&2
      exit 1
    fi
    url="https://github.com/$repo/releases/download/$tag/nhcx-package-v$tag.zip"
  fi
  echo "fetching $repo release $tag: $url"
  download "$url" "$zip"
  if [[ -n "$want_sha" ]]; then
    got_sha="$(python3 -c 'import hashlib,sys; print(hashlib.sha256(open(sys.argv[1],"rb").read()).hexdigest())' "$zip")"
    if [[ "$got_sha" != "$want_sha" ]]; then
      echo "sha256 mismatch for $url: got $got_sha, release says $want_sha" >&2
      exit 1
    fi
  fi
elif [[ -f "$src" ]]; then
  cp "$src" "$zip"
else
  download "$src" "$zip"
fi

rm -rf "$target/nhcx-package"
unzip -q "$zip" -d "$target"
if [[ ! -f "$target/nhcx-package/MANIFEST" ]]; then
  echo "unpacked, but $target/nhcx-package/MANIFEST is missing; is this the NHCX package?" >&2
  exit 1
fi

# Verify every file the MANIFEST lists. The MANIFEST is YAML; its file entries
# carry path, bytes and sha256 on separate lines.
python3 - "$target/nhcx-package" <<'PY'
import hashlib, os, re, sys
root = sys.argv[1]
text = open(os.path.join(root, "MANIFEST"), encoding="utf-8").read()
# Only the `files:` section lists a sha256 per path; the `contents:` summary above it
# lists directories. Parse entry by entry so a directory entry never borrows the next
# file's hash.
files_section = text.split("\nfiles:\n", 1)[1] if "\nfiles:\n" in text else ""
entries = []
for chunk in re.split(r"\n\s*-\s+path:\s*", "\n" + files_section)[1:]:
    path = chunk.split("\n", 1)[0].strip()
    m = re.search(r"^\s+sha256:\s*([0-9a-f]{64})", chunk, re.M)
    if path and m:
        entries.append((path, m.group(1)))
bad = []
for path, want in entries:
    p = os.path.join(root, path)
    if not os.path.isfile(p):
        bad.append(f"missing {path}")
        continue
    got = hashlib.sha256(open(p, "rb").read()).hexdigest()
    if got != want:
        bad.append(f"sha256 mismatch {path}")
print(f"nhcx-package: {len(entries)} file(s) listed, {len(bad)} problem(s)")
for b in bad[:20]:
    print("  " + b)
sys.exit(1 if bad else 0)
PY

rm -rf "$tmp"
echo "ready: $target/nhcx-package (see references/material.md for the path map)"
