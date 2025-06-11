import { Router } from 'express';

const router = Router();

// Example API route
router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default router;
