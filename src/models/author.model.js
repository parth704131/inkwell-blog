class Author {
  constructor({ id, name, role, avatarUrl, bio }) {
    this.id = id;
    this.name = name;
    this.role = role;
    this.avatarUrl = avatarUrl;
    this.bio = bio;
  }

  static fromRow(row) {
    return new Author({
      id: row.author_id,
      name: row.author_name,
      role: row.author_role,
      avatarUrl: row.avatar_url,
      bio: row.author_bio
    });
  }
}

module.exports = Author;
