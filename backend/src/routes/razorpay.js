const express = require('express');
const router = express.Router();
const razorpayService = require('../services/razorpay');

router.post('/createOrder', async (req, res) => {
  try {
    const { amount, currency } = req.body || {};

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    }

    const order = await razorpayService.createOrder({
      amount: Number(amount),
      currency: currency || 'INR',
    });

    res.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      status: order.status,
    });
  } catch (error) {
    console.error('[razorpay] Failed to create order', error);
    res.status(500).json({ message: 'Unable to create Razorpay order' });
  }
});

router.get('/status', (_req, res) => {
  res.json({
    enabled: razorpayService.hasLiveClient,
  });
});

module.exports = router;
