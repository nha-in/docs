# NHCX ingest, 14 and 15 September 2026

The sources behind the NHCX atoms and specifications, where each is stored,
and every change made to what the Catalogue recorded about them. Nothing was
fixed silently.

## The sandbox site snapshot

`catalogue/openapi/.raw/nhcx-site-2026-09-14/` holds what the NHCX sandbox
site, `https://hcxsbx.abdm.gov.in`, listed on 14 September 2026, stored
untouched.

The site is a JavaScript application, so its listing is not a file. What was
read is the site's own document sheet, `NHCX-Website_DocumentDetails.xlsx -
Sheet2.csv`. The bundle the site served that day, `main.js`, is recorded with
its sha256 (`f2ff7f475af0...`), so a later fetch can tell whether the listing
itself changed.

`manifest.json` has one entry per stored item: the file, its title and sheet
row, the page that lists it, the download URL, the byte count, the fetch date
and the sha256. Its 103 entries describe 81 files. The other 22 entries are
members of `hmisdocuments/Sample FHIR bundles.zip`, each recorded against the
archive.

| Folder | Files | What it holds |
| --- | --- | --- |
| `documents/` | 27 | The general documents: use cases, standards, authentication, the request and response workbooks, the error code sheets, the FAQs and the Postman collections |
| `hmisdocuments/` | 12 | The PMJAY HMIS documents: the integration guide, biometric authentication, the test cases and the sample FHIR bundles |
| `swagger/` | 11 | The live specification of each exchange service, as its `/api-docs` served it |
| `pages/` | 28 | The site's own pages, as text |
| `media/` | 2 | The provider guide and the brochure |
| `not-on-site/` | 1 | The payer service workflow guide, which the site does not list |

The snapshot was scanned for credentials before it was stored. The six
Postman collections carry no client secret or password value. `client_secret`
appears in two pages, as the name of a field.

542 of the 543 NHCX atoms cite at least one file here, with its hash. The
remaining one is `nhcx.error.err-pyr-clm-007`, below.

## C1: citations of the ported specifications removed

137 source entries, in 129 atoms, cited a file under
`catalogue/openapi/nhcx/v1/` with a hash. Those files are not a source. The
NHCX package writes them with `make ekadocs` and replaces them on every port,
so each hash matched the committed port and would stop matching at the next
one without anything upstream having changed.

Every one of the 129 atoms also cites, from the snapshot above, the file its
facts come from. The 137 entries were removed. Nothing else in any atom
changed.

## C2: the ERR-PYR-CLM-007 source stored

`nhcx.error.err-pyr-clm-007` records a code that the package's `nhcx-error.yaml`
files under `space: observed`, and that appears on none of the error sheets in
the snapshot. No response carrying the code is stored in this repository. The
atom's only source was `package/nhcx-error.yaml`, a path outside this
repository, so nothing could check it.

The file is now stored at
`catalogue/openapi/.raw/nhcx-package-2026-09-15/nhcx-error.yaml`, byte for
byte, with the sha256 the atom already recorded (`d24ac927ed4d...`). The atom
cites that path.

## The ported specifications

`catalogue/openapi/nhcx/v1/` is not ingested here. The NHCX package writes one
file per module from its Bruno collection, `baseurl.yaml` and
`nhcx-error.yaml` with `make ekadocs` (`system/build-ekadocs.mjs`), and
replaces the folder on every port. Change the package and port again rather
than editing a file.

Each file's `x-abdm-sources` names those package files with their hashes. They
are not stored under `.raw/`, so `npm run lint:sources` lists them as MISSING.
That is a warning, and expected.

From this port on, every operation and webhook whose method and path an NHCX
endpoint or callback atom names in its title carries `x-abdm-atom`, so its
generated page joins its atom. The port joined 71: all 50 endpoint atoms, and
21 of the 22 callback atoms. `nhcx.callback.notification-delivery` names no
path, so it joins nothing.

32 of the 103 operations and webhooks carry no `x-abdm-atom`, because no atom
documents them:

- 14 internal twins under `/internal/v1/`, which the NHCX adapter deployment uses.
- 5 of the services' own documentation routes (`/v2/api-docs`, `/v3/api-docs`, `/swagger-resources`).
- 13 calls with no atom yet: `/v2/participant/hementity/create`,
  `/v1/notification/on_subscribe`, `/v1/delete`, the `/v1/error` call itself,
  `/fetch/certs/path`, `/get/linked/registry/mst`, the v2 ABHA policy link
  `init` and `validate`, `/update/abhanumber`, the three `/product/` calls and
  `/participant/getProductIdName`.
