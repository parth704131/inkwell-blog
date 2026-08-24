const { Pool } = require('pg');
const config = require('../config/env');

const database = new Pool({
  connectionString: config.databaseUrl,
  ssl: config.databaseSsl ? { rejectUnauthorized: false } : false
});

module.exports = database;
