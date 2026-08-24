const database = require('../database/client');

function live(request, response) {
  response.status(200).json({ status: 'ok' });
}

async function ready(request, response) {
  await database.query('SELECT 1');
  response.status(200).json({ status: 'ready', database: 'connected' });
}

module.exports = { live, ready };
