const jwt = require('jsonwebtoken');
const users = require('../models/user');

module.exports = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'No token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await users.getById(decoded.id);
    if (!user) {
      return res.status(401).json({ msg: 'Invalid token' });
    }
    req.user = user;
    next();
  } catch (e) {
    res.status(401).json({ msg: 'Invalid token' });
  }
};
