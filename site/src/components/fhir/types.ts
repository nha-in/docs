/** One node's annotation, read from its NRCeS profile at site build time. */
export type Annotation = {
  /** Snapshot element id, such as `Condition.code.coding:SNOMEDCT.code`. */
  element: string;
  /** StructureDefinition name, such as `Condition`. */
  profile: string;
  min: number;
  max: string;
  /** The profile's fixed or pattern value at this element, if any. */
  fixed?: unknown;
  binding?: {strength: string; valueSet: string};
  /** The element on nrces.in. */
  anchor: string;
};

export type Annotations = Record<string, Annotation>;

/** One record type's file under /fhir-builder/. */
export type RecordFile = {
  key: string;
  label: string;
  example: string;
  exampleUrl: string;
  bundle: unknown;
  annotations: Annotations;
};
