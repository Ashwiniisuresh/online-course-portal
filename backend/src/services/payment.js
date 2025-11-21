const crypto = require('crypto');
const Stripe = require('stripe');

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
let stripeClient = null;

if (STRIPE_SECRET_KEY) {
  stripeClient = new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: '2024-06-20',
  });
} else {
  console.warn(
    '[payments] STRIPE_SECRET_KEY missing. Falling back to mock payments.'
  );
}

const hasStripe = Boolean(stripeClient);

const resolveCourse = (item) => item.Course || item.course;

const buildLineItems = (items) =>
  items.map((item) => {
    const course = resolveCourse(item);
    return {
      price_data: {
        currency: 'usd',
        product_data: { name: course?.title || 'Course' },
        unit_amount: Math.round(Number(course?.price || 0) * 100),
      },
      quantity: item.quantity,
    };
  });

const createCheckoutSession = async ({ items, successUrl, cancelUrl }) => {
  if (!items.length) {
    throw new Error('Cart is empty');
  }

  if (!hasStripe) {
    const fakeSessionId = `mock_${crypto.randomBytes(8).toString('hex')}`;
    return {
      id: fakeSessionId,
      url: `${successUrl}?session_id=${fakeSessionId}`,
      payment_status: 'paid',
    };
  }

  return stripeClient.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: buildLineItems(items),
    mode: 'payment',
    success_url: successUrl,
    cancel_url: cancelUrl,
  });
};

const retrieveCheckoutSession = async (sessionId) => {
  if (!hasStripe) {
    return { id: sessionId, payment_status: 'paid' };
  }
  return stripeClient.checkout.sessions.retrieve(sessionId);
};

module.exports = {
  hasStripe,
  createCheckoutSession,
  retrieveCheckoutSession,
};
