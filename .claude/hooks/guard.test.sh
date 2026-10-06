#!/bin/sh
# Checks guard.sh against real repo paths. Run from the repo root: .claude/hooks/guard.test.sh
root=$(pwd)
fail=0

check() { # expected decision, tool, field, value
  out=$(jq -n --arg t "$2" --arg k "$3" --arg v "$4" '{tool_name: $t, tool_input: {($k): $v}}' |
    CLAUDE_PROJECT_DIR="$root" .claude/hooks/guard.sh | jq -r '.hookSpecificOutput.permissionDecision')
  out=${out:-allow} # an allowed call prints nothing
  [ "$out" = "$1" ] || { echo "FAIL: $2 $4 gave $out, wanted $1"; fail=1; }
}

check deny  Edit file_path "$root/site/docs/hiecm/v3/api/m1/anything.mdx"
check deny  Write file_path "$root/site/static/specs/hiecm-m1.yaml"
check deny  Edit file_path "$root/site/static/llms.txt"
check deny  Edit file_path "$root/catalogue/registry.json"
check deny  Edit file_path "$root/plugins/uhi-integrators-assistant/skills/x/SKILL.md"
check deny  Edit file_path "$root/plugins/nhcx/commands/nhcx-start.md"
check deny  Edit file_path "$root/catalogue/hiecm/endpoints/p1-switch-profile-request.md"
check allow Edit file_path "$root/site/docs/hiecm/v3/api/p3/index.mdx"
check allow Edit file_path "$root/catalogue/hiecm/concepts/m2-integrator-call-panel.md"
check allow Edit file_path "$root/CLAUDE.md"

check ask   Bash command "rm -rf catalogue/hiecm"
check ask   Bash command "git rm -r catalogue/hiecm/endpoints/x.md"
check ask   Bash command "find catalogue -name '*.md' -delete"
check allow Bash command "ls catalogue/hiecm"
check allow Bash command "rm -rf build && ls catalogue/"

[ $fail = 0 ] && echo "guard: all checks pass"
exit $fail
