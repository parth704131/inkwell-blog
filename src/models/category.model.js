class Category {
  constructor({ id, name, slug, color, postCount = 0 }) {
    this.id = id;
    this.name = name;
    this.slug = slug;
    this.color = color;
    this.postCount = postCount;
  }

  static fromRow(row) {
    return new Category({
      id: row.id,
      name: row.name,
      slug: row.slug,
      color: row.color,
      postCount: Number(row.post_count || 0)
    });
  }

  static fromPostRow(row) {
    return new Category({
      id: row.category_id,
      name: row.category_name,
      slug: row.category_slug,
      color: row.category_color
    });
  }
}

module.exports = Category;
