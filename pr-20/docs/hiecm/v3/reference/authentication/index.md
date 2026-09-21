# Authentication

Generated from the specifications. Every scheme and header below is declared in one of them.

## Gateway session

**bearerAuth**, `http` `bearer`. The access token from POST /api/hiecm/gateway/v3/sessions.

## M1 ABHA creation and verification

**bearerAuth**, `http` `bearer`.

## M2 Health information provider services

**bearerAuth**, `http` `bearer`.

## M3 Health information user services

**bearerAuth**, `http` `bearer`.

## M4 HPR and HFR

**bearerAuth**, `http` `bearer`. M4 declares bearer authentication. The HPID calls publish POST /getManagementToken.

## P1 Registration and login

**bearerAuth**, `http` `bearer`. The access token from POST /api/hiecm/gateway/v3/sessions.

## P2 Management

**bearerAuth**, `http` `bearer`. The access token from POST /api/hiecm/gateway/v3/sessions.

## P3 Subscription

**bearerAuth**, `http` `bearer`.

## P4 Locker

**bearerAuth**, `http` `bearer`.

## Subscriptions

**bearerAuth**, `http` `bearer`.

## Scan and Pay

**bearerAuth**, `http` `bearer`.

## Patient scan and record share

**bearerAuth**, `http` `bearer`. JWT access token issued by the ABDM session API after successful validation of client id and secret.

| Header         | Required | What it is                                                                                                                                |
| -------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `REQUEST-ID`   | yes      | Random UUID, a v4 style guid, unique per request.                                                                                         |
| `TIMESTAMP`    | yes      | ISO 8601 timestamp of when the request was initiated.                                                                                     |
| `X-HIU-ID`     | yes      | Identifier of the health information user to which the request was intended.                                                              |
| `X-CM-ID`      | yes      | Suffix of the consent manager to which the request was intended. sbx in the sandbox, abdm in production.                                  |
| `X-AUTH-TOKEN` | yes      | JWT access token issued by the PHR service after successful user authentication. If the HIP does not have any role, then it is mandatory. |
| `request-id`   | yes      | Random UUID, a v4 style guid, unique per callback.                                                                                        |
| `timestamp`    | yes      | ISO 8601 timestamp of when the callback was sent.                                                                                         |
| `x-hiu-id`     | yes      | Identifier of the health information user to which the request was intended.                                                              |
