const config = require('./config/env');
const createApp = require('./app');

const server = createApp().listen(config.port, () => {
  console.log(`Inkwell is running at http://localhost:${config.port}`);
});

function shutdown(signal) {
  console.log(`${signal} received. Closing HTTP server.`);
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
