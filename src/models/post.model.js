const Author = require('./author.model');
const Category = require('./category.model');

class Post {
  constructor({
    id,
    title,
    slug,
    excerpt,
    content,
    imageUrl,
    publishedAt,
    readMinutes,
    featured,
    author,
    category
  }) {
    this.id = id;
    this.title = title;
    this.slug = slug;
    this.excerpt = excerpt;
    this.content = content;
    this.imageUrl = imageUrl;
    this.publishedAt = publishedAt;
    this.readMinutes = readMinutes;
    this.featured = featured;
    this.author = author;
    this.category = category;
  }

  get readingTimeLabel() {
    return `${this.readMinutes} min read`;
  }

  static fromRow(row) {
    if (!row) return null;

    return new Post({
      id: row.id,
      title: row.title,
      slug: row.slug,
      excerpt: row.excerpt,
      content: row.content,
      imageUrl: row.image_url,
      publishedAt: row.published_at,
      readMinutes: row.read_minutes,
      featured: Boolean(row.featured),
      author: Author.fromRow(row),
      category: Category.fromPostRow(row)
    });
  }
}

module.exports = Post;
