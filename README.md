# Instructions

```sh
# install mongo
# https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/

# start mongo
mongod

# connect to mongo shell
mongo --host 127.0.0.1:27017

# display db you are using
db

# connect to new collection (even if non existent)
use <database>

use myNewDatabase
db.myCollection.insertOne( { x: 1 } );
# db refers to the current database.
# myCollection is the name of the collection.

db.myCollection.find()

# other commands
show dbs
show collections
db.dropDatabase()


# redact example
db.forecasts.insertOne({
  _id: 1,
  title: "123 Department Report",
  tags: [ "G", "STLW" ],
  year: 2014,
  subsections: [
    {
      subtitle: "Section 1: Overview",
      tags: [ "SI", "G" ],
      content:  "Section 1: This is the content of section 1. foo1"
    },
    {
      subtitle: "Section 2: Analysis",
      tags: [ "STLW" ],
      content: "Section 2: This is the content of section 2. foo2"
    },
    {
      subtitle: "Section 3: Budgeting",
      tags: [ "TK" ],
      content: {
        text: "Section 3: This is the content of section3. foo3",
        tags: [ "HCS" ]
      }
    }
  ]
});

db.forecasts.findOne({_id:1});

# A user has access to view information with either the tag "STLW" or "G". To run a query on all documents with year 2014 for this user, include a $redact stage as in the following:
var userAccess = [ "STLW", "G" ];
db.forecasts.aggregate(
  [
    { $match: { year: 2014 } },
    { $redact: {
      $cond: {
          if: { $gt: [ { $size: { $setIntersection: [ "$tags", userAccess ] } }, 0 ] },
          then: "$$DESCEND",
          else: "$$PRUNE"
        }
      }
    }
  ]
).pretty();


# now lets try a full text search
db.forecasts.createIndex(
  {
    title: "text",
    subtitle: "text"
  }
);

db.forecasts.find( { $text: { $search: "123" } } );

# clean up
db.forecasts.deleteMany({});


```


# Large Test with faker data
```sh

# generate a million documents of people names
node index.js

# note there is one entry that contains ABC
# at mongo prompt
db.people.count();

var userAccess = [ "ABC" ];
db.people.aggregate(
  [
    { $redact: {
      $cond: {
          if: { $gt: [ { $size: { $setIntersection: [ "$tags", userAccess ] } }, 0 ] },
          then: "$$DESCEND",
          else: "$$PRUNE"
        }
      }
    }
  ]
);


# it looks like it does a full table scan but still only takes a couple seconds to return on my laptop

# now lets create a full text index
db.people.createIndex(
  {
    firstName: "text",
    lastName: "text",
    jobTitle: "text",
    jobDescription: "text",
    jobType: "text"
  }
);

db.people.find( { $text: { $search: "Tiger" } } );


var userAccess = [ "ABC" ];
db.people.aggregate(
  [
    { $match: { $text: { $search: "Tiger" } } },
    { $redact: {
      $cond: {
          if: { $gt: [ { $size: { $setIntersection: [ "$tags", userAccess ] } }, 0 ] },
          then: "$$DESCEND",
          else: "$$PRUNE"
        }
      }
    }
  ]
).pretty();

```