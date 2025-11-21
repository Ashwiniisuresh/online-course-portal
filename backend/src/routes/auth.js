const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const users = require('../models/user');
const auth = require('../middleware/auth');

const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const createToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }

  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: 'Name, email and password are required' });
  }

  try {
    const existing = await users.getByEmail(email);
    if (existing) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await users.create({ name, email, password: hashed });
    const token = createToken(user.id);

    res.status(201).json({ token, user: sanitizeUser(user) });
  } catch (error) {
    console.error('[auth:register]', error);
    res.status(500).json({ message: 'Unable to register user' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await users.getByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = createToken(user.id);
    res.json({ token, user: sanitizeUser(user) });
  } catch (error) {
    console.error('[auth:login]', error);
    res.status(500).json({ message: 'Unable to login' });
  }
});

router.get('/me', auth, (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
});

module.exports = router;
