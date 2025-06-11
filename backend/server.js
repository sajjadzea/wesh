import express from 'express';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRoutes from './routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

console.debug('Initializing Express server');

app.use(compression());
// Troubleshoot: if compression errors, check middleware order

const buildDir = path.join(__dirname, 'build');
app.use(
  express.static(buildDir, {
    maxAge: '30d',
    etag: false,
  })
);
console.debug('Serving static files from build/');
// Troubleshoot: if static assets 404, check build path and deployment pipeline

app.use('/api', apiRoutes);

app.get('*', (req, res) => {
  console.debug('Fallback to index.html for', req.originalUrl);
  res.sendFile(path.join(buildDir, 'index.html'));
});
// Troubleshoot: if index.html not found, ensure build/index.html exists

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
  console.error('Server error:', err);
  res.status(500).send('Internal Server Error');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
