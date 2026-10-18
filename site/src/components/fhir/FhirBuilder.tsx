import React, { useEffect, useMemo, useRef, useState } from "react";
import useBaseUrl from "@docusaurus/useBaseUrl";
import CodeBlock from "@theme/CodeBlock";
import { Info } from "lucide-react";
import { Button } from "@site/src/components/ui/button";
import {
  StepCard,
  Stepper,
  type StepDef,
} from "@site/src/components/docs/QuickstartStepper";
import type { Path } from "./paths";
import { emptyRequired, setAt } from "./edit";
import { createLatest } from "./latest";
import {
  groupFields,
  type Field as FieldDef,
  type FieldStep,
  type Group,
} from "./steps";
import type { RecordFile } from "./types";

/**
 * Build a record, in five steps like the Quickstart runner: pick a record
 * type, then fill in the patient, the author and the clinical details, then
 * review and copy. The bundle is NRCeS's own example for the type, written at
 * site build by scripts/build-fhir-builder.mjs; only fields the reader may
 * change are shown, and the rest stays in the JSON untouched. Nothing typed
 * here is stored or sent anywhere.
 */

type Step = "type" | FieldStep | "review";
type Entry = {
  key: string;
  label: string;
  holds: string;
  file: string;
  exampleUrl: string;
};
type OnEdit = (path: Path, raw: string) => string | null;

const STEPS: StepDef<Step>[] = [
  { key: "type", n: 1, title: "Record type" },
  { key: "patient", n: 2, title: "Patient" },
  { key: "author", n: 3, title: "Author" },
  { key: "clinical", n: 4, title: "Clinical details" },
  { key: "review", n: 5, title: "Review and copy" },
];
const ORDER = STEPS.map((s) => s.key);
const LEDES: Record<FieldStep, string> = {
  patient: "Who the record is about.",
  author: "Who wrote the record, and where.",
  clinical: "What the record says. Each item opens on its own.",
};
const VALIDATOR = "java -jar validator_cli.jar <file_name> -ig ndhm.in#6.5.0";

function CopyButton({ text, label }: { text: string; label: string }) {
  const [state, setState] = useState<"idle" | "done" | "failed">("idle");
  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => {
        const copy =
          navigator.clipboard?.writeText(text) ??
          Promise.reject(new Error("no clipboard"));
        copy.then(
          () => setState("done"),
          () => setState("failed"),
        );
        setTimeout(() => setState("idle"), 2000);
      }}
    >
      {state === "done"
        ? "Copied"
        : state === "failed"
          ? "Copy failed, select the text"
          : label}
    </Button>
  );
}

function Field({
  field,
  value,
  onEdit,
}: {
  field: FieldDef;
  value: unknown;
  onEdit: OnEdit;
}) {
  const [draft, setDraft] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const empty = value === "" && field.required;
  const id = `fhir-${field.key.replace(/[^A-Za-z0-9]/g, "-")}`;
  return (
    <div className="quickstart__field">
      <span className="quickstart__label fhir-builder__label">
        <label htmlFor={id}>{field.label}</label>
        {field.required && (
          <span className="fhir-builder__required">required</span>
        )}
        {field.anchor && (
          <a
            className="fhir-builder__info"
            href={field.anchor}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${field.label} on the NRCeS profile`}
            title="See this element on the NRCeS profile"
          >
            <Info className="size-3.5" />
          </a>
        )}
      </span>
      <input
        id={id}
        className="quickstart__input"
        type="text"
        autoComplete="off"
        spellCheck={false}
        aria-invalid={Boolean(error || empty)}
        aria-describedby={error || empty ? `${id}-note` : undefined}
        value={draft ?? String(value)}
        onChange={(event) => {
          setDraft(event.target.value);
          setError(onEdit(field.path, event.target.value));
        }}
        onBlur={() => {
          if (!error) setDraft(null);
        }}
      />
      {(error || empty) && (
        <span
          className="quickstart__hint fhir-builder__error"
          id={`${id}-note`}
        >
          {error ?? "The profile requires this."}
        </span>
      )}
    </div>
  );
}

function Fields({
  fields,
  bundle,
  onEdit,
}: {
  fields: FieldDef[];
  bundle: unknown;
  onEdit: OnEdit;
}) {
  const at = (path: Path) => path.reduce<any>((v, step) => v?.[step], bundle);
  return (
    <div className="quickstart__fields">
      {fields.map((f) => (
        <Field key={f.key} field={f} value={at(f.path)} onEdit={onEdit} />
      ))}
    </div>
  );
}

function GroupForm({
  group,
  open,
  bundle,
  onEdit,
}: {
  group: Group;
  open: boolean;
  bundle: unknown;
  onEdit: OnEdit;
}) {
  const main = group.fields.filter((f) => f.main);
  const more = group.fields.filter((f) => !f.main);
  return (
    <details className="fhir-builder__group" open={open}>
      <summary>{group.title}</summary>
      <div className="fhir-builder__group-body">
        {main.length > 0 && (
          <Fields fields={main} bundle={bundle} onEdit={onEdit} />
        )}
        {more.length > 0 && (
          <details className="fhir-builder__more">
            <summary>More fields ({more.length})</summary>
            <Fields fields={more} bundle={bundle} onEdit={onEdit} />
          </details>
        )}
      </div>
    </details>
  );
}

export default function FhirBuilder() {
  const base = useBaseUrl("/fhir-builder/");
  const [active, setActive] = useState<Step>("type");
  const [visited, setVisited] = useState<Set<Step>>(new Set());
  const [index, setIndex] = useState<Entry[] | null>(null);
  const [indexFailed, setIndexFailed] = useState(false);
  const [picked, setPicked] = useState<Entry | null>(null);
  const [record, setRecord] = useState<RecordFile | null>(null);
  const [bundle, setBundle] = useState<unknown>(null);
  const [edited, setEdited] = useState(false);
  const [failed, setFailed] = useState(false);
  // Bumped on Reset and on a new pick, so every field remounts without a stale draft.
  const [generation, setGeneration] = useState(0);
  const latest = useRef(createLatest()).current;

  useEffect(() => {
    fetch(`${base}index.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(setIndex)
      .catch(() => setIndexFailed(true));
  }, [base]);

  const go = (step: Step) => {
    setVisited((v) => new Set(v).add(active));
    setActive(step);
  };
  const next = () =>
    go(ORDER[Math.min(ORDER.indexOf(active) + 1, ORDER.length - 1)]);
  const back = () => go(ORDER[Math.max(ORDER.indexOf(active) - 1, 0)]);

  const pick = (entry: Entry) => {
    setPicked(entry);
    setRecord(null);
    setBundle(null);
    setEdited(false);
    setFailed(false);
    setVisited(new Set());
    setGeneration((g) => g + 1);
    // A slower, earlier pick that finishes late is dropped, so the page never
    // shows one record while another is selected.
    const token = latest.next();
    fetch(`${base}${entry.file}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data: RecordFile) => {
        if (!latest.isCurrent(token)) return;
        setRecord(data);
        setBundle(data.bundle);
      })
      .catch(() => {
        if (latest.isCurrent(token)) setFailed(true);
      });
  };

  const groups = useMemo(
    () => (record ? groupFields(record.bundle, record.annotations) : []),
    [record],
  );
  const fieldOfKey = useMemo(() => {
    const map = new Map<string, { step: FieldStep; name: string }>();
    for (const g of groups)
      for (const f of g.fields)
        map.set(f.key, { step: g.step, name: `${g.title}, ${f.label}` });
    return map;
  }, [groups]);
  const json = useMemo(
    () => (bundle === null ? "" : JSON.stringify(bundle, null, 2)),
    [bundle],
  );
  const missing = useMemo(
    () =>
      record && bundle !== null
        ? emptyRequired(bundle, record.annotations)
        : [],
    [bundle, record],
  );

  const onEdit: OnEdit = (path, raw) => {
    const result = setAt(bundle, path, raw);
    if (!result.ok)
      return result.reason === "not-a-number"
        ? "Enter a number."
        : "Enter true or false.";
    setBundle(result.value);
    setEdited(true);
    return null;
  };

  const done: Record<Step, boolean> = {
    type: Boolean(record),
    patient: Boolean(record) && visited.has("patient"),
    author: Boolean(record) && visited.has("author"),
    clinical: Boolean(record) && visited.has("clinical"),
    review: false,
  };

  const held = (
    <p className="quickstart__held">Pick a record type in step 1 first.</p>
  );
  const nav = (last = false) => (
    <div className="quickstart__go">
      <Button type="button" variant="outline" onClick={back}>
        Back
      </Button>
      {!last && (
        <Button type="button" onClick={next}>
          Next
        </Button>
      )}
    </div>
  );

  const fieldStep = (step: FieldStep) => {
    if (!record) return held;
    const own = groups.filter((g) => g.step === step);
    return (
      <div className="quickstart__form">
        {own.length === 0 ? (
          <p className="quickstart__held">
            This record has nothing to fill in here.
          </p>
        ) : (
          <div className="fhir-builder__groups" key={generation}>
            {own.map((g, i) => (
              <GroupForm
                key={`${g.title}-${i}`}
                group={g}
                open={i === 0}
                bundle={bundle}
                onEdit={onEdit}
              />
            ))}
          </div>
        )}
        {nav()}
      </div>
    );
  };

  return (
    <div className="quickstart quickstart--fit fhir-builder">
      <div className="quickstart__card">
        <Stepper
          steps={STEPS}
          label="The five steps of building a record"
          active={active}
          done={done}
          onSelect={go}
        />
        <p className="fhir-builder__status" aria-live="polite">
          {!record ? (
            picked && !failed ? (
              `Loading ${picked.label}.`
            ) : (
              "Pick a record type to start."
            )
          ) : edited ? (
            "This is your record now. Run the validator before you send it."
          ) : (
            <>
              This is the NRCeS example for {record.label}.{" "}
              <a
                href={record.exampleUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                See it on NRCeS
              </a>
              .
            </>
          )}
        </p>
        <div className="quickstart__panes">
          <StepCard
            step="type"
            active={active}
            title="Pick a record type"
            lede="Use test data. Nothing you type leaves this page."
          >
            {indexFailed ? (
              <p className="quickstart__held">
                The record types did not load.{" "}
                <a
                  href="https://nrces.in/ndhm/fhir/r4/all-examples.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  See every example on NRCeS
                </a>
                .
              </p>
            ) : (
              <div
                className="fhir-builder__types"
                role="radiogroup"
                aria-label="Record type"
              >
                {(index ?? []).map((entry) => (
                  <button
                    key={entry.key}
                    type="button"
                    role="radio"
                    aria-checked={picked?.key === entry.key}
                    className={`fhir-builder__type${picked?.key === entry.key ? " fhir-builder__type--active" : ""}`}
                    onClick={() => pick(entry)}
                  >
                    <span className="fhir-builder__type-name">
                      {entry.label}
                    </span>
                    <span className="fhir-builder__type-holds">
                      {entry.holds}
                    </span>
                  </button>
                ))}
              </div>
            )}
            {failed && picked && (
              <p className="quickstart__held">
                This example did not load.{" "}
                <a
                  href={picked.exampleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open it on NRCeS
                </a>
                .
              </p>
            )}
            <div className="quickstart__go">
              <Button type="button" disabled={!record} onClick={next}>
                {picked && !record && !failed ? "Loading" : "Next"}
              </Button>
            </div>
          </StepCard>

          {(["patient", "author", "clinical"] as FieldStep[]).map((step) => (
            <StepCard
              key={step}
              step={step}
              active={active}
              title={STEPS[ORDER.indexOf(step)].title}
              lede={LEDES[step]}
            >
              {fieldStep(step)}
            </StepCard>
          ))}

          <StepCard
            step="review"
            active={active}
            title="Review and copy"
            lede="Copy the bundle, then run the validator on it before you send it."
          >
            {!record ? (
              held
            ) : (
              <div className="quickstart__form">
                {missing.length > 0 && (
                  <div className="fhir-builder__missing" role="status">
                    <p>Required by the profile and now empty:</p>
                    <ul>
                      {missing.map((k) => (
                        <li key={k}>
                          <button
                            type="button"
                            className="fhir-builder__jump"
                            onClick={() =>
                              go(fieldOfKey.get(k)?.step ?? "clinical")
                            }
                          >
                            {fieldOfKey.get(k)?.name ?? k}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="quickstart__go">
                  <CopyButton text={json} label="Copy JSON" />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setBundle(record.bundle);
                      setEdited(false);
                      setGeneration((g) => g + 1);
                    }}
                  >
                    Reset to example
                  </Button>
                </div>
                <pre className="fhir-builder__json">
                  <code>{json}</code>
                </pre>
                <div className="quickstart__panel fhir-builder__wide">
                  <p className="quickstart__panel-label">Validate it</p>
                  <CodeBlock language="bash">{VALIDATOR}</CodeBlock>
                </div>
                {nav(true)}
              </div>
            )}
          </StepCard>
        </div>
      </div>
    </div>
  );
}
