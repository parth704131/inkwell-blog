const config = require('../config/env');

function notFound(request, response) {
  response.status(404).render('404', {
    title: 'Page not found',
    description: 'The page you were looking for could not be found.'
  });
}

function errorHandler(error, request, response, next) {
  if (response.headersSent) return next(error);
  console.error(error);
  response.status(500).render('500', {
    title: 'Something went wrong',
    description: 'An unexpected error occurred.',
    error: config.isProduction ? null : error
  });
}

module.exports = { notFound, errorHandler };
