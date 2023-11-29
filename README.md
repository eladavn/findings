## Description


## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
## TBDs
tenantDBs --> registeredTenants
strictNullChecks
Add indices
Error handling

## Assumptions
* Finding.externalId is unique within tenant but not between tenants. So the unique key of a finding is a composite of tenantId + externalId

## Limitations
* Using sql.js instead of real DB to save some "devops" handling.
* Not always returning the correct HTTP error code (e.g. when trying to add duplicate finding an error is returned but not the correct code).
* Didn't pay much attention to required and optional fields

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
