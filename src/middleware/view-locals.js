const categoryRepository = require('../repositories/category.repository');

const dateFormatter = new Intl.DateTimeFormat('en', {
  month: 'long',
  day: 'numeric',
  year: 'numeric'
});

module.exports = async (request, response, next) => {
  response.locals.currentPath = request.path;
  response.locals.categories = await categoryRepository.findAll();
  response.locals.formatDate = (value) => {
    const date = value instanceof Date ? value : new Date(`${value}T00:00:00`);
    return dateFormatter.format(date);
  };
  next();
};
