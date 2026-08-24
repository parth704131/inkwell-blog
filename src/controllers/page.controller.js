const postService = require('../services/post.service');

async function home(request, response) {
  const { featured, posts } = await postService.getHomepage();
  response.render('home', {
    title: 'Stories for curious minds',
    description: 'Independent writing on design, technology, culture, and living well.',
    featured,
    posts
  });
}

async function stories(request, response) {
  const category = typeof request.query.category === 'string' ? request.query.category.trim().slice(0, 50) : '';
  const query = typeof request.query.q === 'string' ? request.query.q.trim().slice(0, 100) : '';
  const posts = await postService.searchStories({ category, query });
  response.render('stories', {
    title: query ? `Search: ${query}` : 'All stories',
    description: 'Explore every story from Inkwell.',
    posts,
    category,
    query
  });
}

async function story(request, response, next) {
  const result = await postService.getStory(request.params.slug);
  if (!result) return next();
  response.render('post', {
    title: result.post.title,
    description: result.post.excerpt,
    ...result
  });
}

function about(request, response) {
  response.render('about', {
    title: 'About Inkwell',
    description: 'Why we make Inkwell and what we believe good publishing can be.'
  });
}

module.exports = { home, stories, story, about };
