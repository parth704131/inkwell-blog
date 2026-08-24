const database = require('./client');
const seed = require('./seed');

async function run() {
  try {
    await seed();
    console.log('Database seed completed');
  } finally {
    await database.end();
  }
}

run().catch((error) => {
  console.error('Database seed failed:', error.message);
  process.exitCode = 1;
});
