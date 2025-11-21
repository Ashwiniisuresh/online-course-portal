const router = require('express').Router();
const courses = require('../models/course');

router.get('/', async (req, res) => {
  try {
    const list = await courses.list();
    res.json(list);
  } catch (error) {
    console.error('[courses:list]', error);
    res.status(500).json({ message: 'Unable to load courses' });
  }
});

module.exports = router;
