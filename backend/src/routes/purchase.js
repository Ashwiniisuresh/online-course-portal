const router = require('express').Router();
const auth = require('../middleware/auth');
const cart = require('../models/cartItem');
const orders = require('../models/order');
const {
  hasStripe,
  createCheckoutSession,
  retrieveCheckoutSession,
} = require('../services/payment');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:4200';

router.use(auth);

const formatOrder = (order) => ({
  id: order.id,
  amount: order.amount,
  currency: order.currency,
  status: order.status,
  paidAt: order.paidAt,
  sessionId: order.stripeSessionId,
  items: (order.items || []).map((item) => ({
    id: item.id,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    course: item.course,
  })),
});

const loadOrderWithItems = (orderId) => orders.getOrderWithItems(orderId);

const finalizeOrder = async ({ orderId, userId }) => {
  const updated = await orders.finalizeOrder({ orderId, userId });
  if (!updated) {
    throw new Error('Order not found');
  }
  return loadOrderWithItems(orderId);
};

router.post('/checkout', async (req, res) => {
  try {
    const cartItems = await cart.listByUser(req.user.id);

    if (!cartItems.length) {
      return res.status(400).json({ message: 'Your cart is empty' });
    }

    const total = cartItems.reduce(
      (acc, item) => acc + Number(item.course?.price || 0) * item.quantity,
      0
    );

    const session = await createCheckoutSession({
      items: cartItems,
      successUrl: `${FRONTEND_URL}/checkout/success`,
      cancelUrl: `${FRONTEND_URL}/checkout/cancel`,
    });

    const order = await orders.createOrder({
      userId: req.user.id,
      stripeSessionId: session.id,
      amount: Number(total.toFixed(2)),
      currency: 'usd',
      status: hasStripe ? 'pending' : 'paid',
    });

    for (const item of cartItems) {
      await orders.addOrderItem({
        orderId: order.id,
        courseId: item.courseId,
        quantity: item.quantity,
        unitPrice: item.course?.price || 0,
      });
    }

    let responseOrder = await loadOrderWithItems(order.id);

    if (!hasStripe) {
      responseOrder = await finalizeOrder({
        orderId: order.id,
        userId: req.user.id,
      });
    }

    return res.json({
      order: formatOrder(responseOrder),
      checkoutUrl: session.url,
      requiresPayment: hasStripe,
    });
  } catch (error) {
    console.error('[checkout]', error);
    return res.status(500).json({
      message: error.message || 'Unable to start the checkout session',
    });
  }
});

router.post('/confirm', async (req, res) => {
  const { sessionId } = req.body;

  if (!sessionId) {
    return res.status(400).json({ message: 'sessionId is required' });
  }

  try {
    const order = await orders.getOrderBySession({
      userId: req.user.id,
      sessionId,
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (!hasStripe) {
      const finalizedOrder = await finalizeOrder({
        orderId: order.id,
        userId: req.user.id,
      });
      return res.json({ order: formatOrder(finalizedOrder) });
    }

    const session = await retrieveCheckoutSession(sessionId);
    if (session.payment_status !== 'paid') {
      return res
        .status(400)
        .json({ message: 'Payment is not completed yet', payment: session });
    }

    const finalizedOrder = await finalizeOrder({
      orderId: order.id,
      userId: req.user.id,
    });
    return res.json({ order: formatOrder(finalizedOrder) });
  } catch (error) {
    console.error('[confirm]', error);
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
