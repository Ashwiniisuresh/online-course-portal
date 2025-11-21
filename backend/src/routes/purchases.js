const router = require('express').Router();
const auth = require('../middleware/auth');
const orders = require('../models/order');

router.use(auth);

const formatOrder = (order) => ({
  id: order.id,
  amount: order.amount,
  currency: order.currency,
  status: order.status,
  paidAt: order.paidAt,
  createdAt: order.createdAt,
  items: (order.items || []).map((item) => ({
    id: item.id,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    course: item.course,
  })),
});

router.get('/', async (req, res) => {
  try {
    const list = await orders.listPaidOrders(req.user.id);
    res.json(list.map(formatOrder));
  } catch (error) {
    console.error('[purchases]', error);
    res.status(500).json({ message: 'Unable to fetch purchased courses' });
  }
});

module.exports = router;
