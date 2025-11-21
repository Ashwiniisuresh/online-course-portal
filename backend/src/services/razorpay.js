const Razorpay = require('razorpay');
const crypto = require('crypto');

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

let razorpayClient = null;

if (keyId && keySecret) {
  razorpayClient = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
} else {
  console.warn('[razorpay] Missing credentials. Falling back to mock orders.');
}

const hasLiveClient = Boolean(razorpayClient);

const createOrder = async ({ amount, currency = 'INR', receipt }) => {
  const normalizedCurrency = (currency || 'INR').toUpperCase();
  const amountNumber = Number(amount);

  if (!amountNumber || amountNumber <= 0) {
    throw new Error('Amount must be a positive number');
  }

  if (!hasLiveClient) {
    const mockId = `order_${crypto.randomBytes(8).toString('hex')}`;
    return {
      id: mockId,
      amount: Math.round(amountNumber * 100),
      currency: normalizedCurrency,
      status: 'created',
      mock: true,
      receipt: receipt || `rcp_${Date.now()}`,
    };
  }

  return razorpayClient.orders.create({
    amount: Math.round(amountNumber * 100),
    currency: normalizedCurrency,
    receipt: receipt || `rcp_${Date.now()}`,
    payment_capture: 1,
  });
};

module.exports = {
  hasLiveClient,
  createOrder,
};
