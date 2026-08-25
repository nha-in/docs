#!/usr/bin/env bash
# Copies a compiled skill folder into a coding agent's skill directory.
#
# SKILL.md is a cross-agent standard: Claude Code, Cursor and Codex CLI read
# the identical file with no changes, and GitHub Copilot (VS Code, Visual
# Studio, JetBrains, github.com, the CLI) added support for the same format
# in 2026. So installing is the same operation for every target: copy the
# folder to the right directory. This script is that operation.
#
# Usage:
#   scripts/install-skill.sh <skill-name> <target> [--user]
#
#   <skill-name>  a directory under plugins/abdm/skills/, e.g. hiecm-m1-build
#   <target>      claude | cursor | codex | copilot | all
#   --user        install to the personal/global directory instead of this
#                 project's. Not supported for copilot: GitHub does not
#                 publish one fixed path for it, so this script only does
#                 the project-local install there.
set -euo pipefail

usage() { echo "Usage: $0 <skill-name> <claude|cursor|codex|copilot|all> [--user]" >&2; exit 1; }

skill="${1:-}"; target="${2:-}"; scope="${3:-}"
[ -n "$skill" ] && [ -n "$target" ] || usage

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
src="$root/plugins/abdm/skills/$skill"
[ -d "$src" ] || { echo "No compiled skill at $src. Run: node scripts/compile-skills.mjs" >&2; exit 1; }

user=false
if [ "$scope" = "--user" ]; then user=true; elif [ -n "$scope" ]; then usage; fi

install_to() {
  local dest="$1"
  mkdir -p "$(dirname "$dest")"
  rm -rf "$dest"
  cp -R "$src" "$dest"
  echo "installed $skill -> $dest"
}

do_claude()  { $user && install_to "$HOME/.claude/skills/$skill"  || install_to "./.claude/skills/$skill"; }
do_cursor()  { $user && install_to "$HOME/.cursor/skills/$skill"  || install_to "./.cursor/skills/$skill"; }
do_codex()   { $user && install_to "$HOME/.codex/skills/$skill"   || install_to "./.codex/skills/$skill"; }
do_copilot() {
  $user && { echo "copilot has no single documented global skills path; installing to this project instead" >&2; }
  install_to "./.github/skills/$skill"
}

case "$target" in
  claude)  do_claude ;;
  cursor)  do_cursor ;;
  codex)   do_codex ;;
  copilot) do_copilot ;;
  all)     do_claude; do_cursor; do_codex; do_copilot ;;
  *) usage ;;
esac
