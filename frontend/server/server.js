const express = require('express');
const Razorpay = require('razorpay');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.RAZORPAY_PORT || 8000;
const corsOrigin = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
  : '*';

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.error('Missing Razorpay credentials. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.');
  process.exit(1);
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/createOrder', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body || {};
    const normalizedCurrency = typeof currency === 'string' ? currency.toUpperCase() : 'INR';
    const parsedAmount = Number(amount);

    if (!parsedAmount || parsedAmount <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number' });
    }

    const orderPayload = {
      amount: Math.round(parsedAmount * 100), // convert to smallest currency unit
      currency: normalizedCurrency,
      receipt: receipt || `rcp_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(orderPayload);

    res.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      status: order.status,
    });
  } catch (error) {
    console.error('Error creating Razorpay order', error);
    res.status(500).json({ message: 'Unable to create Razorpay order' });
  }
});

app.listen(port, () => {
  console.log(`Razorpay server listening on port ${port}`);
});
