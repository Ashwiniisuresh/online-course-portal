require('dotenv').config();
const express = require('express');
const cors = require('cors');
const body = require('body-parser');
const { pool } = require('./src/config/db');
const courses = require('./src/models/course');

const authRoutes = require('./src/routes/auth');
const courseRoutes = require('./src/routes/courses');
const cartRoutes = require('./src/routes/cart');
const purchaseRoutes = require('./src/routes/purchase');
const purchasesRoutes = require('./src/routes/purchases');
const razorpayRoutes = require('./src/routes/razorpay');

const app = express();

app.use(cors());
app.use(body.json());

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/purchase', purchaseRoutes);
app.use('/api/purchases', purchasesRoutes);
app.use('/api/razorpay', razorpayRoutes);

const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await pool.query('SELECT 1');
    await courses.seedDefaults();

    app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
})();
