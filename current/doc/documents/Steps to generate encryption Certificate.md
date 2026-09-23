# Steps to generate encryption Certificate

*Source: `documents/Steps to generate encryption Certificate.pdf` — extracted full text*

**Pages: 3**


---

## Page 1

Encrypted certificate generation for NHCX participants
( X.509 RSA Certificate )
Step 1 - Generate a 2048-bit RSA Private Key
openssl genpkey -algorithm RSA -out private.key -pkeyopt rsa_keygen_bits:2048
This will output a private.key (RSA Private Key).
Step 2 - Create a certificate signing request
openssl req -new -key private.key -out request.csr
This will prompt for country, state, organisation etc and output a request.csr.
Step 3 - Generate a Self-Signed X.509 Certificate
openssl x509 -req -in request.csr -signkey private.key -out certificate.crt
-days 365
This will output X.509 format a self signed RSA certificate certificate.crt

**Table 1.1**

|  |  |  |  |
|---|---|---|---|
|  |  |  |  |
|  | openssl genpkey -algorithm RSA -out private.key -pkeyopt rsa_keygen_bits:2048 |  |  |
|  |  |  |  |
|  |  |  |  |


**Table 1.2**

|  |  |  |  |
|---|---|---|---|
|  |  |  |  |
|  | openssl req -new -key private.key -out request.csr |  |  |
|  |  |  |  |
|  |  |  |  |


**Table 1.3**

|  |  |  |  |  |
|---|---|---|---|---|
|  |  |  |  |  |
|  | openssl x509 -req -in request.csr -signkey private.key -out certificate.crt |  |  |  |
|  | -days 365 |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |


---

## Page 2

Sample X.509 format self signed RSA certificate
-----BEGIN CERTIFICATE-----
MIID0zCCArugAwIBAgIUaxmygMvtb6JvQyB19mvjr2cd7fowDQYJKoZIhvcNAQEL
BQAweTELMAkGA1UEBhMCSU4xEjAQBgNVBAgMCUpoYXJraGFuZDEQMA4GA1UEBwwH
RGhhbmJhZDELMAkGA1UECgwCTkExCzAJBgNVBAsMAk5BMQswCQYDVQQDDAJOQTEd
MBsGCSqGSIb3DQEJARYOdGVzdEBlbWFpbC5jb20wHhcNMjUwNzEzMTkyMDA4WhcN
MjYwNzEzMTkyMDA4WjB5MQswCQYDVQQGEwJJTjESMBAGA1UECAwJSmhhcmtoYW5k
MRAwDgYDVQQHDAdEaGFuYmFkMQswCQYDVQQKDAJOQTELMAkGA1UECwwCTkExCzAJ
BgNVBAMMAk5BMR0wGwYJKoZIhvcNAQkBFg50ZXN0QGVtYWlsLmNvbTCCASIwDQYJ
KoZIhvcNAQEBBQADggEPADCCAQoCggEBAKOdFMDNqlAmLICcy2CKcA27Da+dEUj2
VhTv5eSRfS5vq+2IJ3OhRyMvGHL3ReqdH0SPiOLzbPH9pe2AdUBdWMv+uoaGumZo
c3+G1+3f1Mu/i2GYJpLSG2p781egxXbqSTaHHlqT46KIz3b+E0+dWtkC6T6PWIdQ
S4eNTZzVW+xErWcVy/+/MhnNkGzpr7HlTuj8lyRm9ZofvVioVQEo0lcbdthRHHw1
fgUu6WubGypIcvZi2LjbJ6D+bdwttu/o661zmndyo+T6FSIa+AHEgUSWIlxO+QJB
iY0b59UNBKvQe7Sr5E+8bNE2nQ8n9GAkmDFQhUoTfBiA25hFka8Q7V0CAwEAAaNT
MFEwHQYDVR0OBBYEFLKMAjFPnbVSbRW5UuNO1AZnsypgMB8GA1UdIwQYMBaAFLKM
AjFPnbVSbRW5UuNO1AZnsypgMA8GA1UdEwEB/wQFMAMBAf8wDQYJKoZIhvcNAQEL
BQADggEBAAdzgVXWU1zlSQqv0Fi8KWs9dtT+mMA0nwz5Y68Z95kbHqB3UC9VLGsu
wJIXPMQ/ViojN7IjLOK3uTr6BjbNdI0fVIzJHFPHYuWmQGIa7keHh7egBbAkp1EG
oYXXkmlwlif+gyLxnwQxRdgXJvz2bQb0I5zLDSCIuYM5KcpL6Pu9+NDlcoxrafuV
3T289PUZexmJE1zqksy5gYlyiujdxaJGLPkQ/FV9vynZyc9S7jBBmHmttDw8BaVX
MBpSm1AWyg1iiCqwPZsK7WypWEXO/lFY/FdwIUHFyC5QPe2usPyAqO0vMJxCjqy1
5KO9n3b+37/gDJA/EzJLyuNLSypykPU=
-----END CERTIFICATE-----

**Table 2.1**

|  |  |  |  |  |  |  |
|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |
|  | -----BEGIN CERTIFICATE----- |  |  |  |  |  |
|  | MIID0zCCArugAwIBAgIUaxmygMvtb6JvQyB19mvjr2cd7fowDQYJKoZIhvcNAQEL |  |  |  |  |  |
|  | BQAweTELMAkGA1UEBhMCSU4xEjAQBgNVBAgMCUpoYXJraGFuZDEQMA4GA1UEBwwH |  |  |  |  |  |
|  | RGhhbmJhZDELMAkGA1UECgwCTkExCzAJBgNVBAsMAk5BMQswCQYDVQQDDAJOQTEd |  |  |  |  |  |
|  | MBsGCSqGSIb3DQEJARYOdGVzdEBlbWFpbC5jb20wHhcNMjUwNzEzMTkyMDA4WhcN |  |  |  |  |  |
|  | MjYwNzEzMTkyMDA4WjB5MQswCQYDVQQGEwJJTjESMBAGA1UECAwJSmhhcmtoYW5k |  |  |  |  |  |
|  | MRAwDgYDVQQHDAdEaGFuYmFkMQswCQYDVQQKDAJOQTELMAkGA1UECwwCTkExCzAJ |  |  |  |  |  |
|  | BgNVBAMMAk5BMR0wGwYJKoZIhvcNAQkBFg50ZXN0QGVtYWlsLmNvbTCCASIwDQYJ |  |  |  |  |  |
|  | KoZIhvcNAQEBBQADggEPADCCAQoCggEBAKOdFMDNqlAmLICcy2CKcA27Da+dEUj2 |  |  |  |  |  |
|  | VhTv5eSRfS5vq+2IJ3OhRyMvGHL3ReqdH0SPiOLzbPH9pe2AdUBdWMv+uoaGumZo |  |  |  |  |  |
|  | c3+G1+3f1Mu/i2GYJpLSG2p781egxXbqSTaHHlqT46KIz3b+E0+dWtkC6T6PWIdQ |  |  |  |  |  |
|  | S4eNTZzVW+xErWcVy/+/MhnNkGzpr7HlTuj8lyRm9ZofvVioVQEo0lcbdthRHHw1 |  |  |  |  |  |
|  | fgUu6WubGypIcvZi2LjbJ6D+bdwttu/o661zmndyo+T6FSIa+AHEgUSWIlxO+QJB |  |  |  |  |  |
|  | iY0b59UNBKvQe7Sr5E+8bNE2nQ8n9GAkmDFQhUoTfBiA25hFka8Q7V0CAwEAAaNT |  |  |  |  |  |
|  | MFEwHQYDVR0OBBYEFLKMAjFPnbVSbRW5UuNO1AZnsypgMB8GA1UdIwQYMBaAFLKM |  |  |  |  |  |
|  | AjFPnbVSbRW5UuNO1AZnsypgMA8GA1UdEwEB/wQFMAMBAf8wDQYJKoZIhvcNAQEL |  |  |  |  |  |
|  | BQADggEBAAdzgVXWU1zlSQqv0Fi8KWs9dtT+mMA0nwz5Y68Z95kbHqB3UC9VLGsu |  |  |  |  |  |
|  | wJIXPMQ/ViojN7IjLOK3uTr6BjbNdI0fVIzJHFPHYuWmQGIa7keHh7egBbAkp1EG |  |  |  |  |  |
|  | oYXXkmlwlif+gyLxnwQxRdgXJvz2bQb0I5zLDSCIuYM5KcpL6Pu9+NDlcoxrafuV |  |  |  |  |  |
|  | 3T289PUZexmJE1zqksy5gYlyiujdxaJGLPkQ/FV9vynZyc9S7jBBmHmttDw8BaVX |  |  |  |  |  |
|  | MBpSm1AWyg1iiCqwPZsK7WypWEXO/lFY/FdwIUHFyC5QPe2usPyAqO0vMJxCjqy1 |  |  |  |  |  |
|  | 5KO9n3b+37/gDJA/EzJLyuNLSypykPU= |  |  |  |  |  |
|  | -----END CERTIFICATE----- |  |  |  |  |  |
|  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |


---

## Page 3

Step 4 - Base64 Encoding of generated RSA certificate
Using any base64 encoder, for example Base64 Encoder, generates a base64
encoded encrypted certificate.
LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUQwekNDQXJ1Z0F3SUJBZ0lVYXhteWdNdnRiNkp2
UXlCMTltdmpyMmNkN2Zvd0RRWUpLb1pJaHZjTkFRRUwKQlFBd2VURUxNQWtHQTFVRUJoTUNTVTR4RWpB
UUJnTlZCQWdNQ1Vwb1lYSnJhR0Z1WkRFUU1BNEdBMVVFQnd3SApSR2hoYm1KaFpERUxNQWtHQTFVRUNn
d0NUa0V4Q3pBSkJnTlZCQXNNQWs1Qk1Rc3dDUVlEVlFRRERBSk9RVEVkCk1Cc0dDU3FHU0liM0RRRUpB
UllPZEdWemRFQmxiV0ZwYkM1amIyMHdIaGNOTWpVd056RXpNVGt5TURBNFdoY04KTWpZd056RXpNVGt5
TURBNFdqQjVNUXN3Q1FZRFZRUUdFd0pKVGpFU01CQUdBMVVFQ0F3SlNtaGhjbXRvWVc1awpNUkF3RGdZ
RFZRUUhEQWRFYUdGdVltRmtNUXN3Q1FZRFZRUUtEQUpPUVRFTE1Ba0dBMVVFQ3d3Q1RrRXhDekFKCkJn
TlZCQU1NQWs1Qk1SMHdHd1lKS29aSWh2Y05BUWtCRmc1MFpYTjBRR1Z0WVdsc0xtTnZiVENDQVNJd0RR
WUoKS29aSWh2Y05BUUVCQlFBRGdnRVBBRENDQVFvQ2dnRUJBS09kRk1ETnFsQW1MSUNjeTJDS2NBMjdE
YStkRVVqMgpWaFR2NWVTUmZTNXZxKzJJSjNPaFJ5TXZHSEwzUmVxZEgwU1BpT0x6YlBIOXBlMkFkVUJk
V012K3VvYUd1bVpvCmMzK0cxKzNmMU11L2kyR1lKcExTRzJwNzgxZWd4WGJxU1RhSEhscVQ0NktJejNi
K0UwK2RXdGtDNlQ2UFdJZFEKUzRlTlRaelZXK3hFcldjVnkvKy9NaG5Oa0d6cHI3SGxUdWo4bHlSbTla
b2Z2VmlvVlFFbzBsY2JkdGhSSEh3MQpmZ1V1Nld1Ykd5cEljdlppMkxqYko2RCtiZHd0dHUvbzY2MXpt
bmR5bytUNkZTSWErQUhFZ1VTV0lseE8rUUpCCmlZMGI1OVVOQkt2UWU3U3I1RSs4Yk5FMm5ROG45R0Fr
bURGUWhVb1RmQmlBMjVoRmthOFE3VjBDQXdFQUFhTlQKTUZFd0hRWURWUjBPQkJZRUZMS01BakZQbmJW
U2JSVzVVdU5PMUFabnN5cGdNQjhHQTFVZEl3UVlNQmFBRkxLTQpBakZQbmJWU2JSVzVVdU5PMUFabnN5
cGdNQThHQTFVZEV3RUIvd1FGTUFNQkFmOHdEUVlKS29aSWh2Y05BUUVMCkJRQURnZ0VCQUFkemdWWFdV
MXpsU1FxdjBGaThLV3M5ZHRUK21NQTBud3o1WTY4Wjk1a2JIcUIzVUM5VkxHc3UKd0pJWFBNUS9WaW9q
TjdJakxPSzN1VHI2QmpiTmRJMGZWSXpKSEZQSFl1V21RR0lhN2tlSGg3ZWdCYkFrcDFFRwpvWVhYa21s
d2xpZitneUx4bndReFJkZ1hKdnoyYlFiMEk1ekxEU0NJdVlNNUtjcEw2UHU5K05EbGNveHJhZnVWCjNU
Mjg5UFVaZXhtSkUxenFrc3k1Z1lseWl1amR4YUpHTFBrUS9GVjl2eW5aeWM5UzdqQkJtSG10dER3OEJh
VlgKTUJwU20xQVd5ZzFpaUNxd1Bac0s3V3lwV0VYTy9sRlkvRmR3SVVIRnlDNVFQZTJ1c1B5QXFPMHZN
SnhDanF5MQo1S085bjNiKzM3L2dESkEvRXpKTHl1TkxTeXB5a1BVPQotLS0tLUVORCBDRVJUSUZJQ0FU
RS0tLS0tCg==

**Table 3.1**

|  |  |  |  |  |
|---|---|---|---|---|
|  |  |  |  |  |
|  | LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUQwekNDQXJ1Z0F3SUJBZ0lVYXhteWdNdnRiNkp2 |  |  |  |
|  | UXlCMTltdmpyMmNkN2Zvd0RRWUpLb1pJaHZjTkFRRUwKQlFBd2VURUxNQWtHQTFVRUJoTUNTVTR4RWpB |  |  |  |
|  | UUJnTlZCQWdNQ1Vwb1lYSnJhR0Z1WkRFUU1BNEdBMVVFQnd3SApSR2hoYm1KaFpERUxNQWtHQTFVRUNn |  |  |  |
|  | d0NUa0V4Q3pBSkJnTlZCQXNNQWs1Qk1Rc3dDUVlEVlFRRERBSk9RVEVkCk1Cc0dDU3FHU0liM0RRRUpB |  |  |  |
|  | UllPZEdWemRFQmxiV0ZwYkM1amIyMHdIaGNOTWpVd056RXpNVGt5TURBNFdoY04KTWpZd056RXpNVGt5 |  |  |  |
|  | TURBNFdqQjVNUXN3Q1FZRFZRUUdFd0pKVGpFU01CQUdBMVVFQ0F3SlNtaGhjbXRvWVc1awpNUkF3RGdZ |  |  |  |
|  | RFZRUUhEQWRFYUdGdVltRmtNUXN3Q1FZRFZRUUtEQUpPUVRFTE1Ba0dBMVVFQ3d3Q1RrRXhDekFKCkJn |  |  |  |
|  | TlZCQU1NQWs1Qk1SMHdHd1lKS29aSWh2Y05BUWtCRmc1MFpYTjBRR1Z0WVdsc0xtTnZiVENDQVNJd0RR |  |  |  |
|  | WUoKS29aSWh2Y05BUUVCQlFBRGdnRVBBRENDQVFvQ2dnRUJBS09kRk1ETnFsQW1MSUNjeTJDS2NBMjdE |  |  |  |
|  | YStkRVVqMgpWaFR2NWVTUmZTNXZxKzJJSjNPaFJ5TXZHSEwzUmVxZEgwU1BpT0x6YlBIOXBlMkFkVUJk |  |  |  |
|  | V012K3VvYUd1bVpvCmMzK0cxKzNmMU11L2kyR1lKcExTRzJwNzgxZWd4WGJxU1RhSEhscVQ0NktJejNi |  |  |  |
|  | K0UwK2RXdGtDNlQ2UFdJZFEKUzRlTlRaelZXK3hFcldjVnkvKy9NaG5Oa0d6cHI3SGxUdWo4bHlSbTla |  |  |  |
|  | b2Z2VmlvVlFFbzBsY2JkdGhSSEh3MQpmZ1V1Nld1Ykd5cEljdlppMkxqYko2RCtiZHd0dHUvbzY2MXpt |  |  |  |
|  | bmR5bytUNkZTSWErQUhFZ1VTV0lseE8rUUpCCmlZMGI1OVVOQkt2UWU3U3I1RSs4Yk5FMm5ROG45R0Fr |  |  |  |
|  | bURGUWhVb1RmQmlBMjVoRmthOFE3VjBDQXdFQUFhTlQKTUZFd0hRWURWUjBPQkJZRUZMS01BakZQbmJW |  |  |  |
|  | U2JSVzVVdU5PMUFabnN5cGdNQjhHQTFVZEl3UVlNQmFBRkxLTQpBakZQbmJWU2JSVzVVdU5PMUFabnN5 |  |  |  |
|  | cGdNQThHQTFVZEV3RUIvd1FGTUFNQkFmOHdEUVlKS29aSWh2Y05BUUVMCkJRQURnZ0VCQUFkemdWWFdV |  |  |  |
|  | MXpsU1FxdjBGaThLV3M5ZHRUK21NQTBud3o1WTY4Wjk1a2JIcUIzVUM5VkxHc3UKd0pJWFBNUS9WaW9q |  |  |  |
|  | TjdJakxPSzN1VHI2QmpiTmRJMGZWSXpKSEZQSFl1V21RR0lhN2tlSGg3ZWdCYkFrcDFFRwpvWVhYa21s |  |  |  |
|  | d2xpZitneUx4bndReFJkZ1hKdnoyYlFiMEk1ekxEU0NJdVlNNUtjcEw2UHU5K05EbGNveHJhZnVWCjNU |  |  |  |
|  | Mjg5UFVaZXhtSkUxenFrc3k1Z1lseWl1amR4YUpHTFBrUS9GVjl2eW5aeWM5UzdqQkJtSG10dER3OEJh |  |  |  |
|  | VlgKTUJwU20xQVd5ZzFpaUNxd1Bac0s3V3lwV0VYTy9sRlkvRmR3SVVIRnlDNVFQZTJ1c1B5QXFPMHZN |  |  |  |
|  | SnhDanF5MQo1S085bjNiKzM3L2dESkEvRXpKTHl1TkxTeXB5a1BVPQotLS0tLUVORCBDRVJUSUZJQ0FU |  |  |  |
|  | RS0tLS0tCg== |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |
