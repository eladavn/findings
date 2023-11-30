## Installation

```bash
$ npm install
```

## Running the app

```bash
$ npm start
```
Use Findings.postman_collection.json with postman to experiment

## Known Limitations
Since I wanted to bound my investment in the exercise, I've knowingly applied the following limitations (which should not be posed in production level code):
* Using sql.js instead of "real" DB to save some devops: "registered-tenants.sqlite" is the DB file which holds the mapping between tenant ID and the sequential index number which identifies the DB in which the tenant's data is populated. There is "findingsX.sqlite" file (X - the sequential db index) for each DB which holds data for 3 tenants at most.
* Not always returning the correct HTTP error code.
* Didn't pay much attention to required vs optional fields
* Automated testing

