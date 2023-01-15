// grab our client with destructuring from the export in index.js
const { client, getAllUsers, createUser } = require("./index");

async function testDB() {
  try {
    // connect the client to the database, finally
    console.log("Starting to test database...");

    const users = await getAllUsers();
    console.log("getAllUsers:", users);

    console.log("Finished database tests!");

    // queries are promises, so we can await them
    //const { rows } = await client.query(`SELECT * FROM users;`);
    console.log(users);
    // for now, logging is a fine way to see what's up
    // console.log(rows);
  } catch (error) {
    console.error("Error testing database!");
    throw error;

    // } finally {
    //   // it's important to close out the client connection
    //   client.end();
    // }
  }
}

// this function should call a query which drops all tables from our database
async function dropTables() {
  try {
    await client.query(`
      DROP TABLE IF EXISTS users;
    `);
  } catch (error) {
    throw error; // we pass the error up to the function that calls dropTables
  }
}

// this function should call a query which creates all tables for our database
async function createTables() {
  try {
    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username varchar(255) UNIQUE NOT NULL,
        password varchar(255) NOT NULL
      );
    `);
  } catch (error) {
    throw error; // we pass the error up to the function that calls createTables
  }
}

async function createInitialUsers() {
  try {
    console.log("Starting to create users...");

    const albert = await createUser({ username: 'albert', password: 'bertie99' });
    const sandra = await createUser({ username: 'sandra', password: '2sandy4me' });
    const glamgal = await createUser({username: 'glamgal', password: 'soglam' });

    console.log();

    console.log("Finished creating users!");
  } catch(error) {
    console.error("Error creating users!");
    throw error;
  }
}

async function rebuildDB() {
  try {
    client.connect();

    await dropTables();
    await createTables();
    await createInitialUsers();
  } catch (error) {
    throw error;
  }
}

rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());
