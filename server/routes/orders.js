const express = require('express');
const router = express.Router();
const supabase = require('../config/db');
const jwt = require('jsonwebtoken');
const { protect } = require('../middleware/auth');

// In-memory store for mock orders (fallback mode only)
const mockOrders = [];

// Generate a random order ID
const generateOrderId = () => {
  return 'NVKM-' + Math.floor(100000 + Math.random() * 900000);
};

// @route   POST /api/orders
// @desc    Place a new order (works for both guests and logged-in users)
// @access  Public (optional auth)
router.post('/', async (req, res) => {
  const { items, shippingInfo, totalPayable, savings, paymentMethod = 'COD', paymentDetails } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'No order items provided.' });
  }

  if (!shippingInfo || !shippingInfo.name || !shippingInfo.phone || !shippingInfo.address) {
    return res.status(400).json({ message: 'Shipping information is incomplete.' });
  }

  // Verify Razorpay signature if applicable
  if (paymentMethod === 'Razorpay') {
    if (!paymentDetails || !paymentDetails.paymentId || !paymentDetails.orderId || !paymentDetails.signature) {
      return res.status(400).json({ message: 'Razorpay payment details are missing.' });
    }

    const isRazorpayConfigured = 
      process.env.RAZORPAY_KEY_ID && 
      process.env.RAZORPAY_KEY_SECRET &&
      !process.env.RAZORPAY_KEY_ID.includes('placeholder') &&
      !process.env.RAZORPAY_KEY_SECRET.includes('placeholder');

    if (isRazorpayConfigured) {
      const crypto = require('crypto');
      const generated_signature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(paymentDetails.orderId + "|" + paymentDetails.paymentId)
        .digest('hex');
      if (generated_signature !== paymentDetails.signature) {
        return res.status(400).json({ message: 'Payment verification failed: Signature mismatch.' });
      }
    } else {
      console.warn('⚠️ Razorpay is not configured. Skipping signature verification in mock mode.');
    }
  }

  // --- MOCK FALLBACK MODE ---
  if (!supabase.isConfigured) {
    let userId = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        const decoded = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET);
        userId = decoded.id;
      } catch (e) { /* guest */ }
    }

    const orderId = generateOrderId();
    const orderRecord = {
      orderId,
      user_id: userId,
      date: new Date().toLocaleDateString('en-IN'),
      items: items.map(item => ({
        productId: item.productId,
        name: item.name,
        weight: item.weight,
        price: item.price,
        originalPrice: item.originalPrice,
        image: item.image || '',
        quantity: item.quantity
      })),
      totalPayable,
      savings: savings || 0,
      shippingInfo,
      status: 'Confirmed',
      paymentMethod,
      paymentStatus: paymentMethod === 'Razorpay' ? 'Paid' : 'Pending',
      paymentId: paymentDetails?.paymentId || null
    };

    mockOrders.push(orderRecord);

    return res.status(201).json({
      orderId,
      status: 'Confirmed',
      totalPayable,
      createdAt: new Date().toISOString(),
      paymentMethod,
      paymentStatus: paymentMethod === 'Razorpay' ? 'Paid' : 'Pending'
    });
  }

  try {
    // Optionally resolve user from token
    let userId = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        const decoded = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET);
        userId = decoded.id;
      } catch (e) {
        // Token invalid — treat as guest
      }
    }

    const orderId = generateOrderId();

    // Insert order
    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .insert({
        order_id: orderId,
        user_id: userId,
        shipping_name: shippingInfo.name,
        shipping_phone: shippingInfo.phone,
        shipping_email: shippingInfo.email || '',
        shipping_address: shippingInfo.address,
        total_payable: totalPayable,
        savings: savings || 0,
        payment_method: paymentMethod,
        payment_status: paymentMethod === 'Razorpay' ? 'Paid' : 'Pending',
        payment_id: paymentDetails?.paymentId || ''
      })
      .select()
      .single();

    if (orderErr) throw orderErr;

    // Insert order items
    const orderItems = items.map(item => ({
      order_id: order.id,
      product_slug: item.productId,
      name: item.name,
      weight: item.weight,
      price: item.price,
      original_price: item.originalPrice,
      image: item.image || '',
      quantity: item.quantity
    }));

    const { error: itemsErr } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsErr) throw itemsErr;

    res.status(201).json({
      orderId: order.order_id,
      status: order.status,
      totalPayable: parseFloat(order.total_payable),
      createdAt: order.created_at
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// @route   GET /api/orders/my
// @desc    Get all orders for logged-in user
// @access  Private
router.get('/my', protect, async (req, res) => {
  // --- MOCK FALLBACK MODE ---
  if (!supabase.isConfigured) {
    const userOrders = mockOrders.filter(o => o.user_id === req.user.id);
    return res.json(userOrders);
  }

  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const transformed = orders.map(o => ({
      orderId: o.order_id,
      date: new Date(o.created_at).toLocaleDateString('en-IN'),
      items: (o.order_items || []).map(i => ({
        productId: i.product_slug,
        name: i.name,
        weight: i.weight,
        price: parseFloat(i.price),
        originalPrice: parseFloat(i.original_price),
        image: i.image,
        quantity: i.quantity
      })),
      totalPayable: parseFloat(o.total_payable),
      savings: parseFloat(o.savings),
      shippingInfo: {
        name: o.shipping_name,
        phone: o.shipping_phone,
        email: o.shipping_email,
        address: o.shipping_address
      },
      status: o.status,
      paymentMethod: o.payment_method || 'COD',
      paymentStatus: o.payment_status || 'Pending',
      paymentId: o.payment_id || ''
    }));

    res.json(transformed);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

module.exports = router;
