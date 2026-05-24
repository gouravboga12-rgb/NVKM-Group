const express = require('express');
const router = express.Router();
const crypto = require('crypto');

const isRazorpayConfigured = 
  process.env.RAZORPAY_KEY_ID && 
  process.env.RAZORPAY_KEY_SECRET &&
  !process.env.RAZORPAY_KEY_ID.includes('placeholder') &&
  !process.env.RAZORPAY_KEY_SECRET.includes('placeholder');

// @route   POST /api/payment/create-order
// @desc    Create a Razorpay order
// @access  Public
router.post('/create-order', async (req, res) => {
  const { amount } = req.body;
  if (!amount) {
    return res.status(400).json({ message: 'Amount is required' });
  }

  // Mock / Test mode fallback
  if (!isRazorpayConfigured) {
    const mockOrderId = 'order_mock_' + Math.floor(100000 + Math.random() * 900000);
    console.log(`ℹ️ Razorpay not configured. Returning mock order: ${mockOrderId}`);
    return res.json({
      id: mockOrderId,
      amount: Math.round(amount * 100),
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder_key_id',
      isMock: true
    });
  }

  try {
    const authHeader = 'Basic ' + Buffer.from(process.env.RAZORPAY_KEY_ID + ':' + process.env.RAZORPAY_KEY_SECRET).toString('base64');
    
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // amount in paise
        currency: 'INR',
        receipt: 'receipt_nvkm_' + Math.floor(100000 + Math.random() * 900000)
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.description || 'Failed to create order on Razorpay');
    }

    res.json({
      id: data.id,
      amount: data.amount,
      currency: data.currency,
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('❌ Razorpay Order Creation Error:', error.message);
    res.status(500).json({ message: 'Razorpay order creation failed: ' + error.message });
  }
});

module.exports = router;
