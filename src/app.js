const path = require('node:path');
const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const config = require('./config/env');
const pageRoutes = require('./routes/page.routes');
const viewLocals = require('./middleware/view-locals');
const asyncHandler = require('./utils/async-handler');
const { notFound, errorHandler } = require('./middleware/error-handler');

function createApp() {
  const app = express();

  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, '..', 'views'));
  app.disable('x-powered-by');

  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(compression());
  app.use(morgan(config.isProduction ? 'combined' : 'dev'));
  app.use(express.static(path.join(__dirname, '..', 'public'), {
    maxAge: config.isProduction ? '7d' : 0
  }));
  app.use(asyncHandler(viewLocals));
  app.use(pageRoutes);
  app.use(notFound);
  app.use(errorHandler);

  return app;
}

module.exports = createApp;
