#!/bin/sh
# Fails when the plan has changed but the manifest, the compiled skills, or a
# cited section id has not kept up. Run in CI and before any plugin release.
# No deps beyond shasum, sed, awk and grep.
set -e
cd "$(dirname "$0")/.."

manifest=plan/manifest.json
plugin=plugins/abdm-contributors-assistant

plan=$(sed -n 's/.*"plan_path": "\([^"]*\)".*/\1/p' "$manifest")
want=$(sed -n 's/.*"plan_hash": "sha256:\([^"]*\)".*/\1/p' "$manifest")
ver=$(sed -n 's/.*"plan_version": "\([^"]*\)".*/\1/p' "$manifest")
have=$(shasum -a 256 "$plan" | cut -d' ' -f1)
fail=0

# Reads one key out of a SKILL.md's frontmatter block only. A plain
# grep would also match the key where a skill *documents* the stamp
# inside a fenced example, which is how skill-compiler used to read as
# stamped when it is hand-authored.
stamp() {
  awk -v k="$2" '
    NR == 1 && $0 == "---" { inf = 1; next }
    inf && $0 == "---" { exit }
    inf && index($0, k ": ") == 1 { print substr($0, length(k) + 3); exit }
  ' "$1"
}

# 1. the plan matches what the manifest declares
if [ "$have" != "$want" ]; then
  echo "FAIL plan changed but $manifest was not bumped"
  echo "  plan:     $plan"
  echo "  manifest: sha256:$want (plan_version $ver)"
  echo "  actual:   sha256:$have"
  echo "  fix: copy the old plan into plan/plan-history/, bump plan_version and plan_hash,"
  echo "       recompile the plan-derived skills, set breaking if a principle,"
  echo "       a date, an owner or a done criterion changed."
  fail=1
else
  echo "ok   plan matches manifest, plan_version $ver"
fi

compiled=$(sed -n 's/^    "\([a-z-]*\)".*/\1/p' "$manifest")

# 2. every compiled skill is stamped with that version and hash
for s in $compiled; do
  f="$plugin/skills/$s/SKILL.md"
  [ -f "$f" ] || { echo "FAIL $s named in compiled_skills but $f is missing"; fail=1; continue; }
  got=$(stamp "$f" plan_version)
  goth=$(stamp "$f" plan_hash | sed 's/^sha256://')
  if [ "$got" != "$ver" ]; then
    echo "FAIL $s stamped plan_version '$got', manifest says '$ver'"
    fail=1
  elif [ "$goth" != "$want" ]; then
    echo "FAIL $s stamped a plan_hash that is not the manifest's"
    fail=1
  else
    echo "ok   $s built from plan_version $got"
  fi
done

# 3. and nothing else claims to be compiled from the plan. Without this a
#    skill can carry a stamp, sit outside compiled_skills, and drift for
#    releases with step 2 never looking at it.
for f in "$plugin"/skills/*/SKILL.md; do
  s=$(basename "$(dirname "$f")")
  [ -n "$(stamp "$f" plan_version)$(stamp "$f" compiled_from_plan)" ] || continue
  case " $(echo $compiled) " in
    *" $s "*) ;;
    *)
      echo "FAIL $s carries a plan stamp but is not in compiled_skills, so nothing checks it"
      echo "  fix: add it to compiled_skills in $manifest and restamp it, or, if it is"
      echo "       hand-authored, drop plan_version, plan_hash and compiled_from_plan"
      echo "       from its frontmatter."
      fail=1 ;;
  esac
done

# 4. the gantt generator is built from that version too. Its TASKS table is
#    compiled from plan#p8-schedule, so a schedule change that misses it ships a
#    gantt partners read as current.
g=plan/gantt/build_gantt.py
if [ ! -f "$g" ]; then
  echo "warn $g missing, no gantt to check"
else
  gver=$(sed -n 's/^PLAN_VERSION = "\(.*\)"$/\1/p' "$g")
  if [ "$gver" != "$ver" ]; then
    echo "FAIL $g stamped PLAN_VERSION '$gver', manifest says '$ver'"
    echo "  fix: update the TASKS table to match plan#p8-schedule, restamp,"
    echo "       rebuild with --status and re-import into the shared Sheet."
    fail=1
  else
    echo "ok   gantt built from plan_version $gver"
  fi
fi

# 5. every plan#id cited anywhere in the plugin exists in the plan
#    ponytail: grep, not a markdown parser. Fine while ids are plain anchor tags.
for id in $(grep -rho 'plan#[a-z0-9.-]*' "$plugin/" plan/gantt/ | sed -e 's/^plan#//' -e 's/\.$//' | sort -u); do
  if grep -q "<a id=\"$id\"></a>" "$plan"; then
    echo "ok   plan#$id resolves"
  else
    echo "FAIL plan#$id cited in the plugin but no such section id in $plan"
    fail=1
  fi
done

# 6. the version being replaced was archived, not overwritten
if [ ! -d plan/plan-history ]; then
  echo "warn plan/plan-history/ missing, nothing archived yet"
elif [ -z "$(ls -A plan/plan-history 2>/dev/null)" ]; then
  echo "warn plan/plan-history/ is empty, nothing archived yet"
else
  echo "ok   plan/plan-history/ holds $(ls plan/plan-history | wc -l | tr -d ' ') superseded version(s)"
fi

exit $fail
