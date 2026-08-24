const database = require('./client');

const authors = [
  ['Maya Chen', 'Design editor', 'https://i.pravatar.cc/160?img=47', 'Maya writes about thoughtful design, creative work, and the small details that shape everyday life.'],
  ['Noah Williams', 'Technology writer', 'https://i.pravatar.cc/160?img=12', 'Noah explores the human side of technology and builds useful things for the web.'],
  ['Sofia Rivers', 'Culture writer', 'https://i.pravatar.cc/160?img=32', 'Sofia covers books, travel, and the ideas that help us see familiar places differently.']
];

const categories = [
  ['Design', 'design', '#d5654f'],
  ['Technology', 'technology', '#426b69'],
  ['Culture', 'culture', '#8065a8'],
  ['Mindful Living', 'mindful-living', '#98713d']
];

const posts = [
  ['The quiet power of designing for less', 'quiet-power-designing-for-less', 'What happens when we stop adding and start paying closer attention to what truly belongs?', `<p>There is a particular kind of confidence in a room that does not ask to be noticed. Nothing is fighting for attention. Every object has a reason to be there, and the empty space feels intentional rather than unfinished.</p><h2>Subtraction is a form of care</h2><p>Good design is often described as problem solving. But the most thoughtful work begins one step earlier: deciding which problems deserve to exist at all. Removing a feature, a color, or an unnecessary choice can be an act of generosity toward the person on the other side.</p><blockquote>Clarity is not the absence of personality. It is personality without noise.</blockquote><p>This does not mean everything must be stark or minimal. It means each element earns its place. A hand-thrown cup, a beautifully set line of type, or a carefully chosen interaction can carry more feeling when it has room to breathe.</p><h2>A useful constraint</h2><p>Try beginning your next project with a smaller palette, fewer type sizes, and one clear purpose per page. Constraints do not diminish creativity; they give it edges to push against.</p><p>The goal is not less for its own sake. The goal is enough—and the wisdom to recognize when you have reached it.</p>`, 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1400&q=85', '2026-08-14', 7, 1, 1, 1],
  ['Building a calmer relationship with technology', 'calmer-relationship-with-technology', 'A practical approach to making our devices feel like tools again, instead of places we disappear into.', `<p>Technology works best when it extends our attention rather than scattering it. Yet many of our defaults were designed around urgency: red badges, endless feeds, and alerts that borrow importance from one another.</p><h2>Start with your environment</h2><p>Move distracting applications away from your home screen. Turn off notifications that do not come from another person. Choose a few specific moments during the day to check messages rather than carrying your inbox everywhere.</p><p>These changes are small, but together they make intention easier. The point is not to reject technology. It is to decide what role it should play before it decides for us.</p><h2>Make space for depth</h2><p>Keep one window open when you write. Put your phone in another room when you read. Let a walk be simply a walk. Attention becomes stronger through use, and fragile through constant switching.</p>`, 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85', '2026-08-10', 6, 0, 2, 2],
  ['A reader’s guide to keeping a commonplace book', 'guide-to-commonplace-book', 'Collect the sentences, questions, and ideas you want to carry with you.', `<p>A commonplace book is neither a journal nor a planner. It is a place to gather what you notice: a line from a novel, a question from a conversation, a recipe worth returning to, or an idea that has not found its final shape.</p><h2>There is no perfect system</h2><p>Choose a notebook you enjoy opening. Add a date and a small heading to each entry. Leave an index at the front if you like structure, or trust yourself to rediscover things by accident.</p><blockquote>The value is not in collecting more. It is in returning to what moved you.</blockquote><p>Over time, unlikely ideas begin to speak to one another. Your book becomes a map of your curiosity—and a quiet record of how your attention has changed.</p>`, 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=85', '2026-08-05', 5, 0, 3, 3],
  ['Why slow mornings still matter', 'why-slow-mornings-still-matter', 'Before the day begins asking things of us, there is a brief chance to choose its rhythm.', `<p>A slow morning does not require two free hours or a perfect routine. It can be ten unclaimed minutes before opening the first notification. It can be coffee by a window, a page of writing, or breakfast made without multitasking.</p><h2>Rhythm before routine</h2><p>Rigid routines often collapse under real life. Rhythm is more forgiving. It asks only that we create a recognizable transition between rest and responsibility.</p><p>Protect one small action that helps you arrive in the day. When everything else changes, that gesture becomes an anchor.</p>`, 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=85', '2026-07-29', 4, 0, 1, 4],
  ['The cities we understand by walking', 'cities-we-understand-by-walking', 'To know a place, trade the itinerary for a comfortable pair of shoes.', `<p>Walking reveals the scale at which a city is actually lived. The distance between a bakery and a bus stop. The bench that catches late afternoon sun. The street where conversations spill out from open windows.</p><h2>Leave room to be surprised</h2><p>Choose a direction, not a destination. Notice where the architecture changes and where people naturally gather. Stop when something interests you, even when it is not in the guidebook.</p><p>Maps tell us how to arrive. Walking teaches us where we are.</p>`, 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=85', '2026-07-22', 5, 0, 3, 3],
  ['Making software that feels considerate', 'making-software-feel-considerate', 'The best interfaces anticipate confusion, respect time, and make recovery easy.', `<p>Considerate software behaves like a thoughtful host. It explains what is happening, remembers useful context, and never makes a guest feel foolish for taking the wrong turn.</p><h2>Design the recovery, too</h2><p>Every happy path has an edge. Networks fail, forms are incomplete, and people change their minds. A clear error message and a reliable undo action often matter more than an elegant success animation.</p><p>Respect is visible in the details: sensible defaults, honest labels, accessible contrast, and the restraint to avoid demanding attention without a good reason.</p>`, 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=85', '2026-07-15', 6, 0, 2, 2]
];

async function seed() {
  const { rows } = await database.query('SELECT COUNT(*) AS count FROM posts');
  if (Number(rows[0].count) > 0) return;

  const client = await database.connect();
  try {
    await client.query('BEGIN');
    for (const author of authors) {
      await client.query('INSERT INTO authors (name, role, avatar_url, bio) VALUES ($1, $2, $3, $4)', author);
    }
    for (const category of categories) {
      await client.query('INSERT INTO categories (name, slug, color) VALUES ($1, $2, $3)', category);
    }
    for (const post of posts) {
      const values = [...post];
      values[7] = Boolean(values[7]);
      await client.query(`INSERT INTO posts
        (title, slug, excerpt, content, image_url, published_at, read_minutes, featured, author_id, category_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`, values);
    }
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

module.exports = seed;
