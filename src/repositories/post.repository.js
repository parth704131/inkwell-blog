const database = require('../database/client');
const Post = require('../models/post.model');

const postSelect = `
  SELECT p.*, a.name AS author_name, a.role AS author_role, a.avatar_url,
    a.bio AS author_bio, c.name AS category_name, c.slug AS category_slug,
    c.color AS category_color
  FROM posts p
  JOIN authors a ON a.id = p.author_id
  JOIN categories c ON c.id = p.category_id`;

async function findAll({ category, query, limit, offset = 0 } = {}) {
  const conditions = [];
  const parameters = [];

  if (category) {
    parameters.push(category);
    conditions.push(`c.slug = $${parameters.length}`);
  }
  if (query) {
    parameters.push(`%${query}%`);
    conditions.push(`(p.title ILIKE $${parameters.length} OR p.excerpt ILIKE $${parameters.length} OR p.content ILIKE $${parameters.length})`);
  }

  const whereClause = conditions.length ? ` WHERE ${conditions.join(' AND ')}` : '';
  let sql = `${postSelect}${whereClause} ORDER BY p.published_at DESC`;
  if (limit) {
    parameters.push(limit, offset);
    sql += ` LIMIT $${parameters.length - 1} OFFSET $${parameters.length}`;
  }
  const { rows } = await database.query(sql, parameters);
  return rows.map(Post.fromRow);
}

async function findFeatured() {
  const { rows } = await database.query(`${postSelect} WHERE p.featured = TRUE ORDER BY p.published_at DESC LIMIT 1`);
  return Post.fromRow(rows[0]);
}

async function findBySlug(slug) {
  const { rows } = await database.query(`${postSelect} WHERE p.slug = $1`, [slug]);
  return Post.fromRow(rows[0]);
}

async function findRelated(categoryId, excludedPostId, limit = 3) {
  const { rows } = await database.query(
    `${postSelect} WHERE p.category_id = $1 AND p.id != $2 ORDER BY p.published_at DESC LIMIT $3`,
    [categoryId, excludedPostId, limit]
  );
  return rows.map(Post.fromRow);
}

exports.findAll = findAll;
exports.findFeatured = findFeatured;
exports.findBySlug = findBySlug;
exports.findRelated = findRelated;
