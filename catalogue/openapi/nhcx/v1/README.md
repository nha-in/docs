# NHCX V1 specifications

One OpenAPI 3.1 YAML per module. Dropping a file here generates its endpoint
pages under `site/docs/nhcx/v1/api/` and publishes an interactive reference
at `/reference/<filename-stem>`.

Name the module in the info block:

```yaml
info:
  x-portal:
    module: m1            # folder name under api/
    label: M1 ABHA identity
    position: 2           # order among this gateway's modules
```

See `../../CONVENTIONS.md` for how the specs are written.

Two rules the build enforces:

- The file name must be unique across the whole `openapi/` tree, because it is
  the served path and the Scalar route. Prefix it with the gateway.
- Generated pages carry `generated: true`. Never hand-write a page at a
  generated name; the build stops rather than overwrite one.
