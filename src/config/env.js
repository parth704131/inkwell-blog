const dotenv = require('dotenv');

const dotenvOptions = { quiet: true };
if (process.env.DOTENV_CONFIG_PATH) {
  dotenvOptions.path = process.env.DOTENV_CONFIG_PATH;
}
dotenv.config(dotenvOptions);

const environment = process.env.NODE_ENV || 'development';
const port = Number.parseInt(process.env.PORT || '3000', 10);
const databaseUrl = process.env.DATABASE_URL;

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT must be a valid number between 1 and 65535');
}

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required (for example: postgresql://postgres:postgres@localhost:5432/inkwell)');
}

module.exports = Object.freeze({
  environment,
  isProduction: environment === 'production',
  port,
  databaseUrl,
  databaseSsl: process.env.DATABASE_SSL === 'true'
});
