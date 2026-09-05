# 2026-09-05: a security scheme nothing declared, and a filename shown to readers

Two problems in the security schemes, both reader facing on every endpoint
page, both found while fixing the generated curl samples.

## gateway_register_bridge_services asked for a scheme that did not exist

`hiecm-gateway.yaml` declares one scheme, `gatewaySession`, and
`POST /v4/int/v1/bridges/MutipleHRPAddUpdateServices` asks for `bearerAuth`.
Nothing declared it, so the operation resolved to no credential at all: the
page showed no Authorizations section and the generated curl sent no token.

`bearerAuth` is now declared in that file. The definition is copied from the
one `hiecm-m1.yaml`, `hiecm-m2.yaml`, `hiecm-m3.yaml` and `hiecm-m4.yaml`
already record under the same name, for the same token from the same session
endpoint. No operation's declared requirement changed, and the meaning was
taken from the catalogue rather than decided here.

The generator now warns when `security` names a scheme the document does not
declare, so the next one of these is visible at build time instead of
resolving silently to nothing.

## Eight scheme descriptions named a build file

Every module described its gateway token as coming from an endpoint "described
in hiecm-gateway.yaml". That filename means nothing to somebody reading a
documentation site, and it appeared on all 299 endpoint pages, in the
Authorizations block, at the top of the page.

The sentence already names the endpoint, so the filename clause was removed
from all eight, and the wrapped variant in `hiecm-p1`, `hiecm-p2`, `hiecm-p3`
and `hiecm-phr-services` was rewritten to name the path in the same form the
other modules use.

Not done here: `hiecm-m4.yaml` still names the file twice in `info` and in a
source note, which are not rendered on an endpoint page.
