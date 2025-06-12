import express from 'express';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import apiRoutes from './routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

console.debug('Initializing Express server');

app.use(compression());
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'", 'https://jsonplaceholder.typicode.com'],
      },
    },
  })
);
// Troubleshoot: if compression errors, check middleware order

const publicDir = path.join(__dirname, '..', 'public');
app.use(
  express.static(publicDir, {
    maxAge: '30d',
    etag: false,
  })
);
console.debug('Serving static files from public/');
// Troubleshoot: if static assets 404, check public path and deployment pipeline

app.use('/api', apiRoutes);

app.get('*', (req, res) => {
  console.debug('Fallback to index.html for', req.originalUrl);
  res.sendFile(path.join(publicDir, 'index.html'));
});
// Troubleshoot: if index.html not found, ensure public/index.html exists

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
  console.error('Server error:', err);
  res.status(500).send('Internal Server Error');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
