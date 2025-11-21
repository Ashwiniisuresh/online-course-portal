const router = require('express').Router();
const auth = require('../middleware/auth');
const cart = require('../models/cartItem');
const courses = require('../models/course');

router.use(auth);

router.get('/', async (req, res) => {
  try {
    const items = await cart.listByUser(req.user.id);
    res.json(items);
  } catch (error) {
    console.error('[cart:list]', error);
    res.status(500).json({ message: 'Unable to retrieve cart' });
  }
});

router.post('/add', async (req, res) => {
  const { courseId, quantity = 1 } = req.body;
  if (!courseId) {
    return res.status(400).json({ message: 'courseId is required' });
  }

  try {
    const course = await courses.getById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const parsedQuantity = Math.max(1, Number(quantity) || 1);
    const item = await cart.addOrIncrement({
      userId: req.user.id,
      courseId,
      quantity: parsedQuantity,
    });

    if (!item) {
      return res.status(500).json({ message: 'Unable to add course to cart' });
    }

    res.status(201).json(item);
  } catch (error) {
    console.error('[cart:add]', error);
    res.status(500).json({ message: 'Unable to add course to cart' });
  }
});

router.delete('/:cartItemId', async (req, res) => {
  try {
    const deleted = await cart.removeItem({
      cartItemId: Number(req.params.cartItemId),
      userId: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('[cart:remove]', error);
    res.status(500).json({ message: 'Unable to remove cart item' });
  }
});

router.delete('/', async (req, res) => {
  try {
    await cart.clear(req.user.id);
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    console.error('[cart:clear]', error);
    res.status(500).json({ message: 'Unable to clear cart' });
  }
});

module.exports = router;
