import { Router } from 'express';

const router = Router();

router.get('/products', (req, res) => {
  // Kod obsługujący zapytanie
  res.json({ message: 'Products endpoint' });
});

export default router;
