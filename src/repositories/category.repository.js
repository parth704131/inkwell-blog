const database = require('../database/client');
const Category = require('../models/category.model');

async function findAll() {
  const { rows } = await database.query(`
    SELECT c.*, COUNT(p.id) AS post_count
    FROM categories c
    LEFT JOIN posts p ON p.category_id = c.id
    GROUP BY c.id
    ORDER BY c.name
  `);
  return rows.map(Category.fromRow);
}

exports.findAll = findAll;
