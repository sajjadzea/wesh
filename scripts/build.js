const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const publicDir = path.join(root, 'public');

fs.rmSync(publicDir, { recursive: true, force: true });
fs.mkdirSync(publicDir, { recursive: true });

const items = ['index.html', 'favicon.ico', 'css', 'js', 'data', 'dash'];
for (const item of items) {
  const src = path.join(root, item);
  if (fs.existsSync(src)) {
    fs.cpSync(src, path.join(publicDir, item), { recursive: true });
  }
}

console.log('Static files copied to', publicDir);
