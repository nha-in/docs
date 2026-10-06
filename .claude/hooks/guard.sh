#!/bin/sh
# PreToolUse guard for this repo. Refuses hand edits to build outputs, and asks
# before a shell command deletes anything under catalogue/. This list is the
# source for which files are generated; CLAUDE.md points here.
input=$(cat)
tool=$(printf '%s' "$input" | jq -r '.tool_name')

reply() {
  jq -n --arg d "$1" --arg r "$2" \
    '{hookSpecificOutput: {hookEventName: "PreToolUse", permissionDecision: $d, permissionDecisionReason: $r}}'
  exit 0
}

if [ "$tool" = Bash ]; then
  cmd=$(printf '%s' "$input" | jq -r '.tool_input.command // ""')
  # ponytail: lexical match, so `cd catalogue && rm x.md` slips past; widen if that happens.
  if printf '%s' "$cmd" | grep -Eq '(^|[;&|[:space:]])(rm|unlink|git[[:space:]]+rm)[[:space:]][^;&|]*catalogue/|find[^;&|]*catalogue[^;&|]*-delete'; then
    reply ask "This deletes files under catalogue/. When a source changes, derived knowledge is corrected against the new source, not deleted. Confirm with the user first."
  fi
  exit 0
fi

file=$(printf '%s' "$input" | jq -r '.tool_input.file_path // .tool_input.notebook_path // ""')
rel=${file#"${CLAUDE_PROJECT_DIR:-$PWD}"/}
fix="Fix the catalogue, the journey or the generator, then rebuild."

case $rel in
  site/docs/*/*/api/index.mdx | site/docs/*/*/api/*/index.mdx) ;;
  site/docs/*/*/api/* | site/static/specs/* | site/static/llms.txt | catalogue/registry.json | \
  plugins/*-integrators-assistant/skills/* | plugins/*/commands/*-start.md)
    reply deny "$rel is a build output. $fix" ;;
  catalogue/*.md)
    # ponytail: assumes frontmatter fits in 60 lines; every atom today does.
    if [ -f "$file" ] && head -60 "$file" | grep -q '^generated: true'; then
      reply deny "$rel is marked generated: true. $fix"
    fi ;;
esac
exit 0
