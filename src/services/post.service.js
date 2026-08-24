const postRepository = require('../repositories/post.repository');

async function getHomepage() {
  const [featured, allPosts] = await Promise.all([
    postRepository.findFeatured(),
    postRepository.findAll({ limit: 7 })
  ]);
  const posts = allPosts
    .filter((post) => post.id !== featured?.id)
    .slice(0, 6);
  return { featured, posts };
}

async function searchStories(filters) {
  return postRepository.findAll(filters);
}

async function getStory(slug) {
  const post = await postRepository.findBySlug(slug);
  if (!post) return null;
  return { post, related: await postRepository.findRelated(post.category.id, post.id) };
}

module.exports = { getHomepage, searchStories, getStory };
