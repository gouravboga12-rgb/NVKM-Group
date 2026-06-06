require('dotenv').config();
const fs = require('fs');
const path = require('path');

process.on('uncaughtException', (err) => {
  try {
    fs.writeFileSync(
      path.join(__dirname, 'uncaught_error.log'),
      err.stack || err.toString()
    );
  } catch (e) {}
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  try {
    fs.writeFileSync(
      path.join(__dirname, 'unhandled_rejection.log'),
      reason.stack || reason.toString()
    );
  } catch (e) {}
  process.exit(1);
});

const express = require('express');
const cors = require('cors');

// Import Supabase client (initializes on require)
require('./config/db');

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const paymentRoutes = require('./routes/payment');
const adminRoutes = require('./routes/admin');
const contactRoutes = require('./routes/contacts');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contacts', contactRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'NVKM GROUP API is running' });
});



// Serve React frontend in production (only when not running on Vercel)
if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
  app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'));
  });
}

if (require.main === module || !process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 NVKM Server running on port ${PORT}`);
    console.log(`📡 API available at http://localhost:${PORT}/api`);
  });
}

module.exports = app;
// Trigger nodemon restart 5
