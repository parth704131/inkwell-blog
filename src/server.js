const config = require('./config/env');
const migrate = require('./database/migrate');
const seed = require('./database/seed');
const createApp = require('./app');

let server;

async function start() {
  await migrate();
  await seed();
  server = createApp().listen(config.port, () => {
    console.log(`Inkwell is running at http://localhost:${config.port}`);
  });
}

function shutdown(signal) {
  console.log(`${signal} received. Closing HTTP server.`);
  if (!server) return;
  server.close((error) => {
    if (error) {
      console.error(error);
      process.exitCode = 1;
    }
    require('./database/client').end().catch(console.error);
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

start().catch((error) => {
  console.error('Failed to start Inkwell:', error.message);
  process.exitCode = 1;
});
