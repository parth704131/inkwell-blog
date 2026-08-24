const { spawn } = require('node:child_process');
const path = require('node:path');

const testPort = 43127;
const baseUrl = `http://127.0.0.1:${testPort}`;

const server = spawn(process.execPath, ['src/server.js'], {
  cwd: path.join(__dirname, '..'),
  env: { ...process.env, PORT: String(testPort) },
  stdio: ['ignore', 'pipe', 'pipe']
});

const routes = [
  ['/', 200],
  ['/stories?category=design', 200],
  ['/stories?q=technology', 200],
  ['/stories/quiet-power-designing-for-less', 200],
  ['/css/styles.css', 200],
  ['/not-a-real-page', 404]
];

async function waitForServer(attempts = 20) {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(`${baseUrl}/`);
      if (response.ok) return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
  throw new Error('Server did not become ready');
}

async function run() {
  try {
    await waitForServer();
    for (const [route, expectedStatus] of routes) {
      const response = await fetch(`${baseUrl}${route}`);
      if (response.status !== expectedStatus) {
        throw new Error(`${route}: expected ${expectedStatus}, received ${response.status}`);
      }
      console.log(`✓ ${response.status} ${route}`);
    }
  } finally {
    server.kill('SIGTERM');
  }
}

server.stderr.on('data', (chunk) => process.stderr.write(chunk));
run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
