---
id: uhi.concept.error-object
type: concept
gateway: uhi
milestone: n/a
version: uhi-v1
title: The UHI error object
summary: A UHI error is one object with type, code, path and message, carried
  beside the ACK or in the body of an error response.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/uhi/v1/concepts/errors.mdx
    status: page
    note: Generated from site/docs/uhi/v1/concepts/errors.mdx#the-error-object. Edit
      the page, never this file.
related:
  concepts:
    - uhi.concept.error-send-and-log
    - uhi.concept.ack-then-answer
  troubleshooting:
    - uhi.troubleshooting.http-statuses
---

# The UHI error object

## In plain words

```json
{
  "type": "<ERROR_TYPE>",
  "code": "<ERROR_CODE>",
  "path": "<JSON_PATH_THAT_FAILED_VALIDATION>",
  "message": "<HUMAN_READABLE_MESSAGE>"
}
```

| Field | Required | What it holds |
| --- | --- | --- |
| `type` | Yes | The kind of error |
| `code` | Yes | The error code |
| `path` | No | The path in the JSON schema that caused the error. Used only for schema validation errors |
| `message` | No | A human readable description |
