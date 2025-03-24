import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'API is healthy',
    timestamp: new Date().toISOString()
  });
});

export default router; 