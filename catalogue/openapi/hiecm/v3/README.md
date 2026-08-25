# HIE-CM V3 specifications

One OpenAPI 3.1 YAML per module. Dropping a file here generates its endpoint
pages under `site/docs/hiecm/v3/api/` and publishes an interactive reference
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

