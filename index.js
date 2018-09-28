const MongoClient = require('mongodb').MongoClient;
const faker = require('faker'); 
const url = 'mongodb://localhost:27017';
const dbName = 'test';

async function go() {

  let client = await MongoClient.connect(url,
    { useNewUrlParser: true });
  let db = client.db('test');
  try {
    for (let i = 0; i < 1000000; ++i) {
      await db.collection('people').insertOne({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        jobTitle: faker.name.jobTitle(),
        jobDescriptor: faker.name.jobDescriptor(),
        jobType: faker.name.jobType(),
        tags: faker.random.arrayElement([
          [ "G", "STLW" ],
          [ "SI", "G" ],
          [ "STLW" ],
          [ "TK" ],
          [ "HCS" ],
          [ "HCS", "G"]
        ])
      });
    }

    await db.collection('people').insertOne({
      firstName: 'Tiger',
      lastName: 'Woods',
      jobTitle: faker.name.jobTitle(),
      jobDescriptor: faker.name.jobDescriptor(),
      jobType: faker.name.jobType(),
      tags: faker.random.arrayElement([
        [ "ABC" ]
      ])
    });
  }
  finally {
    client.close();
  }
  
}

go().catch(err => console.error(err));