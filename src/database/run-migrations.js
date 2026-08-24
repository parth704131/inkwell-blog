const database = require('./client');
const migrate = require('./migrate');

async function run() {
  try {
    await migrate();
    console.log('Database migrations completed');
  } finally {
    await database.end();
  }
}

run().catch((error) => {
  console.error('Database migration failed:', error.message);
  process.exitCode = 1;
});
