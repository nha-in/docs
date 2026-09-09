# Authentication

Generated from the specifications. Every scheme and header below is declared in one of them.

## NHCX biometric authentication

**Authorization**, `http` `bearer`. The ABDM session token. Note that these endpoints read `Authorization`, where the NHCX message endpoints read `bearer_auth`.

## NHCX session token

**bearer_auth**, `apiKey`. The session token, prefixed with `Bearer ` and a space. Note the header name: NHCX's own endpoints read `bearer_auth`, not `Authorization`. The biometric endpoints read `Authorization` instead, and the safe course is to send both with the same value.

## NHCX participant service

**bearer_auth**, `apiKey`. The ABDM session token, prefixed with `Bearer ` and a space.

## NHCX use case endpoints

**bearer_auth**, `apiKey`. The ABDM session token, prefixed with `Bearer ` and a space.
