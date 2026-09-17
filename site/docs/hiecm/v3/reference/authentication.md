---
title: Authentication
sidebar_label: Authentication
sidebar_position: 1
description: The credentials every ABDM call carries, and the headers that go with them.
verification: unverified
source: the published OpenAPI specifications
generated: true
sidebar_class_name: sidebar-icon sidebar-icon--lock-keyhole
---

# Authentication

Generated from the specifications. Every scheme and header below is declared in one of them.

## Gateway session

**bearerAuth**, `http` `bearer`. The access token from POST /api/hiecm/gateway/v3/sessions.

## M1 ABHA identity

**bearerAuth**, `http` `bearer`.

## M2 Linking and sharing

**bearerAuth**, `http` `bearer`.

## M3 Consent and fetching

**bearerAuth**, `http` `bearer`.

## M4 HPR and HFR

**bearerAuth**, `http` `bearer`. The token from POST /getManagementToken.

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

