const express = require('express');
const router = express.Router();
const supabase = require('../config/db');
const { protect, adminProtect } = require('../middleware/auth');
const { readData, writeData } = require('../utils/mockDb');

// Helper to log changes to the activity logs table/JSON file
const logActivity = async (action, details, performedBy) => {
  const timestamp = new Date().toISOString();
  if (!supabase.isConfigured) {
    const logs = readData('activity_logs.json');
    logs.unshift({
      id: 'log-' + Date.now(),
      action,
      details,
      performed_by: performedBy,
      created_at: timestamp
    });
    writeData('activity_logs.json', logs);
  } else {
    try {
      await supabase.from('activity_logs').insert({
        action,
        details,
        performed_by: performedBy
      });
    } catch (err) {
      console.error('Failed to write activity log to database:', err.message);
    }
  }
};

// @route   GET /api/admin/dashboard
// @desc    Get dashboard metrics, charts data, and recent logs
// @access  Private/Admin
router.get('/dashboard', protect, adminProtect, async (req, res) => {
  const performedBy = req.user.name || req.user.email;

  // --- MOCK FALLBACK MODE ---
  if (!supabase.isConfigured) {
    const orders = readData('orders.json');
    const contacts = readData('contacts.json');
    const logs = readData('activity_logs.json').slice(0, 10); // limit to 10
    const users = readData('users.json');
    const products = readData('products.json');
    const categories = readData('categories.json');

    // Stats calculations
    const totalSales = orders
      .filter(o => o.paymentStatus === 'Paid' || o.status === 'Delivered')
      .reduce((sum, o) => sum + (o.totalPayable || 0), 0);
    const totalOrders = orders.length;
    const totalCustomers = new Set(orders.map(o => o.shippingInfo?.email || o.shippingInfo?.phone)).size;
    const pendingContacts = contacts.length;
    const totalProducts = products.length;
    const totalCategories = categories.length;

    // Charts data: Group orders by date for the last 7 days
    const chartData = {};
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toLocaleDateString('en-IN');
      chartData[dateStr] = 0;
    }

    orders.forEach(o => {
      if (chartData[o.date] !== undefined) {
        chartData[o.date] += o.totalPayable || 0;
      }
    });

    const formattedChart = Object.keys(chartData).map(date => ({
      date,
      amount: parseFloat(chartData[date].toFixed(2))
    }));

    return res.json({
      stats: {
        totalSales: parseFloat(totalSales.toFixed(2)),
        totalOrders,
        totalCustomers: totalCustomers || users.length,
        pendingContacts,
        totalProducts,
        totalCategories
      },
      chartData: formattedChart,
      recentLogs: logs
    });
  }

  // --- SUPABASE MODE ---
  try {
    // Fetch orders, contacts, logs, users count, products count, categories count
    const { data: orders, error: ordersErr } = await supabase.from('orders').select('*');
    const { count: contactsCount, error: contactsErr } = await supabase.from('contacts').select('*', { count: 'exact', head: true });
    const { data: logs, error: logsErr } = await supabase.from('activity_logs').select('*').order('created_at', { ascending: false }).limit(10);
    const { count: usersCount, error: usersErr } = await supabase.from('users').select('*', { count: 'exact', head: true });
    const { count: productsCount, error: productsErr } = await supabase.from('products').select('*', { count: 'exact', head: true });
    // categories table may not exist yet — handle gracefully
    const { count: categoriesCount, error: categoriesErr } = await supabase.from('categories').select('*', { count: 'exact', head: true });

    if (ordersErr) throw ordersErr;
    if (contactsErr) throw contactsErr;
    if (logsErr) throw logsErr;
    if (usersErr) throw usersErr;

    // If categories table doesn't exist, derive count from products
    let totalCategoriesCount = 0;
    if (!categoriesErr) {
      totalCategoriesCount = categoriesCount || 0;
    } else if (categoriesErr.code === 'PGRST205') {
      const { data: prodCats } = await supabase.from('products').select('category');
      totalCategoriesCount = new Set((prodCats || []).map(p => p.category).filter(Boolean)).size;
    }

    const totalSales = orders
      .filter(o => o.payment_status === 'Paid' || o.status === 'Delivered')
      .reduce((sum, o) => sum + parseFloat(o.total_payable || 0), 0);

    const totalOrders = orders.length;

    // Unique customer contacts
    const totalCustomers = new Set(orders.map(o => o.shipping_email || o.shipping_phone)).size || usersCount;

    // Chart grouping
    const chartData = {};
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toLocaleDateString('en-IN');
      chartData[dateStr] = 0;
    }

    orders.forEach(o => {
      const dateStr = new Date(o.created_at).toLocaleDateString('en-IN');
      if (chartData[dateStr] !== undefined) {
        chartData[dateStr] += parseFloat(o.total_payable || 0);
      }
    });

    const formattedChart = Object.keys(chartData).map(date => ({
      date,
      amount: parseFloat(chartData[date].toFixed(2))
    }));

    res.json({
      stats: {
        totalSales: parseFloat(totalSales.toFixed(2)),
        totalOrders,
        totalCustomers,
        pendingContacts: contactsCount || 0,
        totalProducts: productsCount || 0,
        totalCategories: totalCategoriesCount
      },
      chartData: formattedChart,
      recentLogs: logs.map(l => ({
        id: l.id,
        action: l.action,
        details: l.details,
        performed_by: l.performed_by,
        created_at: l.created_at
      }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// @route   GET /api/admin/orders
// @desc    Get all orders with optional dates and search filtering
// @access  Private/Admin
router.get('/orders', protect, adminProtect, async (req, res) => {
  const { startDate, endDate, q } = req.query;

  // --- MOCK FALLBACK MODE ---
  if (!supabase.isConfigured) {
    let filtered = readData('orders.json');

    // Calendar filters
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      filtered = filtered.filter(o => {
        const orderDate = new Date(o.created_at || new Date().toISOString()); // fallback
        // Date strings in mock are typically DD/MM/YYYY, let's parse date properly
        const parts = o.date.split('/');
        const parsedDate = parts.length === 3 ? new Date(parts[2], parts[1] - 1, parts[0]) : new Date(o.created_at || Date.now());
        return parsedDate >= start;
      });
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter(o => {
        const parts = o.date.split('/');
        const parsedDate = parts.length === 3 ? new Date(parts[2], parts[1] - 1, parts[0]) : new Date(o.created_at || Date.now());
        return parsedDate <= end;
      });
    }

    // Search query
    if (q) {
      const queryStr = q.toLowerCase();
      filtered = filtered.filter(o =>
        o.orderId.toLowerCase().includes(queryStr) ||
        o.shippingInfo?.name.toLowerCase().includes(queryStr) ||
        o.shippingInfo?.phone.includes(queryStr) ||
        o.shippingInfo?.address.toLowerCase().includes(queryStr)
      );
    }

    return res.json(filtered);
  }

  // --- SUPABASE MODE ---
  try {
    let query = supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false });

    // Dates range
    if (startDate) {
      query = query.gte('created_at', new Date(startDate).toISOString());
    }
    if (endDate) {
      // Set end date to end of the day
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      query = query.lte('created_at', end.toISOString());
    }

    // Keyword search filters (we will filter client-side or apply or conditions)
    if (q) {
      query = query.or(`order_id.ilike.%${q}%,shipping_name.ilike.%${q}%,shipping_phone.ilike.%${q}%,shipping_address.ilike.%${q}%`);
    }

    const { data: orders, error } = await query;
    if (error) throw error;

    const transformed = orders.map(o => ({
      orderId: o.order_id,
      id: o.id,
      date: new Date(o.created_at).toLocaleDateString('en-IN'),
      created_at: o.created_at,
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
      paymentMethod: o.payment_method,
      paymentStatus: o.payment_status,
      paymentId: o.payment_id,
      deliveryPackageId: o.delivery_package_id || '',
      trackingLink: o.tracking_link || '',
      deliveryTrackerStatus: o.delivery_tracker_status || 'Pending'
    }));

    res.json(transformed);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// @route   PUT /api/admin/orders/:id/status
// @desc    Update order status
// @access  Private/Admin
router.put('/orders/:id/status', protect, adminProtect, async (req, res) => {
  const { id } = req.params; // orderId or internal UUID
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: 'Status is required.' });
  }

  const performedBy = req.user.name || req.user.email;

  // --- MOCK FALLBACK MODE ---
  if (!supabase.isConfigured) {
    const orders = readData('orders.json');
    const order = orders.find(o => o.orderId === id || o.id === id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    const oldStatus = order.status;
    order.status = status;
    
    // Automatically set payment status to Paid if Delivered
    if (status === 'Delivered' && order.paymentMethod === 'COD') {
      order.paymentStatus = 'Paid';
    }

    writeData('orders.json', orders);
    await logActivity('Order Status Updated', `Order ${order.orderId} changed from "${oldStatus}" to "${status}"`, performedBy);

    return res.json({ message: 'Order status updated successfully!', order });
  }

  // --- SUPABASE MODE ---
  try {
    // Find order
    const { data: order, error: findErr } = await supabase
      .from('orders')
      .select('*')
      .eq('order_id', id)
      .maybeSingle();

    if (findErr || !order) {
      // Try by internal UUID
      const { data: orderById, error: findByIdErr } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();
      if (findByIdErr || !orderById) {
        return res.status(404).json({ message: 'Order not found.' });
      }
      Object.assign(order, orderById);
    }

    const oldStatus = order.status;
    const updateData = { status };

    if (status === 'Delivered' && order.payment_method === 'COD') {
      updateData.payment_status = 'Paid';
    }

    const { data: updatedOrder, error: updateErr } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', order.id)
      .select()
      .single();

    if (updateErr) throw updateErr;

    await logActivity('Order Status Updated', `Order ${order.order_id} changed from "${oldStatus}" to "${status}"`, performedBy);

    res.json({ message: 'Order status updated successfully!', order: updatedOrder });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// @route   GET /api/admin/contacts
// @desc    Get all contact inquiries
// @access  Private/Admin
router.get('/contacts', protect, adminProtect, async (req, res) => {
  // --- MOCK FALLBACK MODE ---
  if (!supabase.isConfigured) {
    const contacts = readData('contacts.json');
    return res.json(contacts);
  }

  // --- SUPABASE MODE ---
  try {
    const { data: contacts, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// @route   DELETE /api/admin/contacts/:id
// @desc    Delete a contact inquiry
// @access  Private/Admin
router.delete('/contacts/:id', protect, adminProtect, async (req, res) => {
  const { id } = req.params;
  const performedBy = req.user.name || req.user.email;

  if (!supabase.isConfigured) {
    const contacts = readData('contacts.json');
    const index = contacts.findIndex(c => c.id === id);
    if (index === -1) {
      return res.status(404).json({ message: 'Contact inquiry not found.' });
    }
    const name = contacts[index].name;
    contacts.splice(index, 1);
    writeData('contacts.json', contacts);
    await logActivity('Contact Deleted', `Deleted inquiry from "${name}"`, performedBy);
    return res.json({ message: `Inquiry from "${name}" deleted successfully!` });
  }

  try {
    const { data: contact, error: getErr } = await supabase
      .from('contacts')
      .select('name')
      .eq('id', id)
      .single();

    if (getErr || !contact) {
      return res.status(404).json({ message: 'Contact inquiry not found.' });
    }

    const { error: delErr } = await supabase
      .from('contacts')
      .delete()
      .eq('id', id);

    if (delErr) throw delErr;

    await logActivity('Contact Deleted', `Deleted inquiry from "${contact.name}"`, performedBy);
    res.json({ message: `Inquiry from "${contact.name}" deleted successfully!` });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// @route   GET /api/admin/logs
// @desc    Get all change activity logs with optional date filtering
// @access  Private/Admin
router.get('/logs', protect, adminProtect, async (req, res) => {
  const { startDate, endDate } = req.query;

  // --- MOCK FALLBACK MODE ---
  if (!supabase.isConfigured) {
    let logs = readData('activity_logs.json');

    // Apply date filters if provided
    if (startDate || endDate) {
      logs = logs.filter(log => {
        const logDate = new Date(log.created_at || log.createdAt);
        if (startDate && logDate < new Date(startDate)) return false;
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          if (logDate > end) return false;
        }
        return true;
      });
    }

    return res.json(logs);
  }

  // --- SUPABASE MODE ---
  try {
    let query = supabase
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false });

    if (startDate) query = query.gte('created_at', new Date(startDate).toISOString());
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      query = query.lte('created_at', end.toISOString());
    }

    const { data: logs, error } = await query;
    if (error) throw error;
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// @route   DELETE /api/admin/logs/:id
// @desc    Delete a single activity log entry
// @access  Private/Admin
router.delete('/logs/:id', protect, adminProtect, async (req, res) => {
  const { id } = req.params;

  if (!supabase.isConfigured) {
    const logs = readData('activity_logs.json');
    const index = logs.findIndex(l => l.id === id);
    if (index === -1) {
      return res.status(404).json({ message: 'Log entry not found.' });
    }
    logs.splice(index, 1);
    writeData('activity_logs.json', logs);
    return res.json({ message: 'Log entry deleted successfully!' });
  }

  try {
    const { error } = await supabase.from('activity_logs').delete().eq('id', id);
    if (error) throw error;
    res.json({ message: 'Log entry deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// @route   DELETE /api/admin/logs
// @desc    Clear all activity logs
// @access  Private/Admin
router.delete('/logs', protect, adminProtect, async (req, res) => {
  if (!supabase.isConfigured) {
    writeData('activity_logs.json', []);
    return res.json({ message: 'All logs cleared successfully!' });
  }

  try {
    const { error } = await supabase.from('activity_logs').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (error) throw error;
    res.json({ message: 'All logs cleared successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// @route   GET /api/admin/customers
// @desc    Get all customer accounts & aggregate purchase details
// @access  Private/Admin
router.get('/customers', protect, adminProtect, async (req, res) => {
  // --- MOCK FALLBACK MODE ---
  if (!supabase.isConfigured) {
    const orders = readData('orders.json');
    const users = readData('users.json');

    // Aggregate orders by customer name/email
    const customerMap = {};

    // Seed customerMap from registered users
    users.forEach(u => {
      customerMap[u.email.toLowerCase()] = {
        name: u.name,
        email: u.email,
        phone: u.phone,
        totalOrders: 0,
        totalSpent: 0,
        orders: []
      };
    });

    // Populate from orders (handles guest customers too!)
    orders.forEach(o => {
      const email = (o.shippingInfo?.email || 'guest-' + o.shippingInfo?.phone || '').toLowerCase();
      
      if (!customerMap[email]) {
        customerMap[email] = {
          name: o.shippingInfo?.name || 'Guest User',
          email: o.shippingInfo?.email || 'N/A',
          phone: o.shippingInfo?.phone || 'N/A',
          totalOrders: 0,
          totalSpent: 0,
          orders: []
        };
      }

      customerMap[email].totalOrders += 1;
      customerMap[email].totalSpent += o.totalPayable || 0;
      customerMap[email].orders.push({
        orderId: o.orderId,
        date: o.date,
        total: o.totalPayable,
        status: o.status
      });
    });

    const customersList = Object.values(customerMap).map(c => ({
      ...c,
      totalSpent: parseFloat(c.totalSpent.toFixed(2))
    }));

    return res.json(customersList);
  }

  // --- SUPABASE MODE ---
  try {
    // Fetch users and orders
    const { data: users, error: usersErr } = await supabase.from('users').select('name, email, phone');
    const { data: orders, error: ordersErr } = await supabase.from('orders').select('*');

    if (usersErr) throw usersErr;
    if (ordersErr) throw ordersErr;

    const customerMap = {};

    // Seed from users
    users.forEach(u => {
      customerMap[u.email.toLowerCase()] = {
        name: u.name,
        email: u.email,
        phone: u.phone,
        totalOrders: 0,
        totalSpent: 0,
        orders: []
      };
    });

    // Parse orders
    orders.forEach(o => {
      const email = (o.shipping_email || 'guest-' + o.shipping_phone || '').toLowerCase();

      if (!customerMap[email]) {
        customerMap[email] = {
          name: o.shipping_name || 'Guest User',
          email: o.shipping_email || 'N/A',
          phone: o.shipping_phone || 'N/A',
          totalOrders: 0,
          totalSpent: 0,
          orders: []
        };
      }

      customerMap[email].totalOrders += 1;
      customerMap[email].totalSpent += parseFloat(o.total_payable || 0);
      customerMap[email].orders.push({
        orderId: o.order_id,
        date: new Date(o.created_at).toLocaleDateString('en-IN'),
        total: parseFloat(o.total_payable),
        status: o.status
      });
    });

    const customersList = Object.values(customerMap).map(c => ({
      ...c,
      totalSpent: parseFloat(c.totalSpent.toFixed(2))
    }));

    res.json(customersList);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// @route   DELETE /api/admin/customers/:email
// @desc    Delete a customer account record
// @access  Private/Admin
router.delete('/customers/:email', protect, adminProtect, async (req, res) => {
  const email = decodeURIComponent(req.params.email);
  const performedBy = req.user.name || req.user.email;

  if (!supabase.isConfigured) {
    const users = readData('users.json');
    const index = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    if (index === -1) {
      return res.status(404).json({ message: 'Customer not found.' });
    }
    const name = users[index].name;
    users.splice(index, 1);
    writeData('users.json', users);
    await logActivity('Customer Deleted', `Deleted customer account for "${name}" (${email})`, performedBy);
    return res.json({ message: `Customer account for "${name}" deleted successfully!` });
  }

  try {
    const { data: user, error: getErr } = await supabase
      .from('users')
      .select('name, email')
      .ilike('email', email)
      .single();

    if (getErr || !user) {
      return res.status(404).json({ message: 'Customer not found.' });
    }

    const { error: delErr } = await supabase
      .from('users')
      .delete()
      .ilike('email', email);

    if (delErr) throw delErr;

    await logActivity('Customer Deleted', `Deleted customer account for "${user.name}" (${email})`, performedBy);
    res.json({ message: `Customer account for "${user.name}" deleted successfully!` });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// @route   POST /api/admin/products
// @desc    Add a new product
// @access  Private/Admin
router.post('/products', protect, adminProtect, async (req, res) => {
  const { name, category, shortDesc, longDesc, ingredients, usage, image, images, badge, variations, deliveryCharges, customFields } = req.body;

  if (!name || !category || !shortDesc || !longDesc || !image) {
    return res.status(400).json({ message: 'Please provide all required product fields.' });
  }

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const performedBy = req.user.name || req.user.email;

  // --- MOCK FALLBACK MODE ---
  if (!supabase.isConfigured) {
    const products = readData('products.json');
    
    // Check if slug exists
    if (products.some(p => p.slug === slug)) {
      return res.status(400).json({ message: 'A product with this name/slug already exists.' });
    }

    const newProduct = {
      slug,
      name,
      category,
      short_desc: shortDesc,
      long_desc: longDesc,
      ingredients: ingredients || '',
      usage_info: usage || '',
      image,
      images: images || [image],
      rating: 5.0,
      reviews_count: 0,
      badge: badge || '',
      variations: variations || [],
      delivery_charges: parseFloat(deliveryCharges) || 0.00,
      custom_fields: customFields || {},
      reviews: []
    };

    products.push(newProduct);
    writeData('products.json', products);

    await logActivity('Product Created', `Added new product "${name}" under category "${category}"`, performedBy);

    return res.status(201).json({ message: 'Product added successfully!', product: newProduct });
  }

  // --- SUPABASE MODE ---
  try {
    // 1. Insert product
    const { data: product, error: prodErr } = await supabase
      .from('products')
      .insert({
        slug,
        name,
        category,
        short_desc: shortDesc,
        long_desc: longDesc,
        ingredients: ingredients || '',
        usage_info: usage || '',
        image,
        images: images || [image],
        badge: badge || '',
        delivery_charges: parseFloat(deliveryCharges) || 0.00,
        custom_fields: customFields || {}
      })
      .select()
      .single();

    if (prodErr) throw prodErr;

    // 2. Insert variations
    if (variations && variations.length > 0) {
      const variationRows = variations.map(v => ({
        product_id: product.id,
        weight: v.weight,
        price: parseFloat(v.price),
        discount_price: parseFloat(v.discountPrice || v.price)
      }));

      const { error: varErr } = await supabase
        .from('product_variations')
        .insert(variationRows);

      if (varErr) throw varErr;
    }

    await logActivity('Product Created', `Added new product "${name}" under category "${category}"`, performedBy);

    res.status(201).json({ message: 'Product added successfully!', product });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// @route   PUT /api/admin/products/:slug
// @desc    Edit a product
// @access  Private/Admin
router.put('/products/:slug', protect, adminProtect, async (req, res) => {
  const { slug } = req.params;
  const { name, category, shortDesc, longDesc, ingredients, usage, image, images, badge, variations, deliveryCharges, customFields } = req.body;

  const performedBy = req.user.name || req.user.email;

  // --- MOCK FALLBACK MODE ---
  if (!supabase.isConfigured) {
    const products = readData('products.json');
    const index = products.findIndex(p => p.slug === slug);

    if (index === -1) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    const existing = products[index];

    // Keep some original values like slug, rating, and reviews if name is unchanged
    const newSlug = name ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : slug;

    const updated = {
      ...existing,
      slug: newSlug,
      name: name || existing.name,
      category: category || existing.category,
      short_desc: shortDesc || existing.short_desc,
      long_desc: longDesc || existing.long_desc,
      ingredients: ingredients !== undefined ? ingredients : existing.ingredients,
      usage_info: usage !== undefined ? usage : existing.usage_info,
      image: image || existing.image,
      images: images || existing.images || [image],
      badge: badge !== undefined ? badge : existing.badge,
      variations: variations || existing.variations,
      delivery_charges: deliveryCharges !== undefined ? parseFloat(deliveryCharges) : existing.delivery_charges,
      custom_fields: customFields !== undefined ? customFields : existing.custom_fields
    };

    products[index] = updated;
    writeData('products.json', products);

    await logActivity('Product Edited', `Modified details of product "${updated.name}"`, performedBy);

    return res.json({ message: 'Product updated successfully!', product: updated });
  }

  // --- SUPABASE MODE ---
  try {
    // Find product
    const { data: product, error: findErr } = await supabase
      .from('products')
      .select('id')
      .eq('slug', slug)
      .single();

    if (findErr || !product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    const newSlug = name ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : slug;

    // 1. Update product main data
    const { error: prodErr } = await supabase
      .from('products')
      .update({
        slug: newSlug,
        name: name || undefined,
        category: category || undefined,
        short_desc: shortDesc || undefined,
        long_desc: longDesc || undefined,
        ingredients: ingredients !== undefined ? ingredients : undefined,
        usage_info: usage !== undefined ? usage : undefined,
        image: image || undefined,
        images: images || undefined,
        badge: badge !== undefined ? badge : undefined,
        delivery_charges: deliveryCharges !== undefined ? parseFloat(deliveryCharges) : undefined,
        custom_fields: customFields !== undefined ? customFields : undefined
      })
      .eq('id', product.id);

    if (prodErr) throw prodErr;

    // 2. Refresh variations (delete old ones and insert new ones)
    if (variations && variations.length > 0) {
      const { error: delErr } = await supabase
        .from('product_variations')
        .delete()
        .eq('product_id', product.id);

      if (delErr) throw delErr;

      const variationRows = variations.map(v => ({
        product_id: product.id,
        weight: v.weight,
        price: parseFloat(v.price),
        discount_price: parseFloat(v.discountPrice || v.price)
      }));

      const { error: varErr } = await supabase
        .from('product_variations')
        .insert(variationRows);

      if (varErr) throw varErr;
    }

    await logActivity('Product Edited', `Modified details of product "${name || slug}"`, performedBy);

    res.json({ message: 'Product updated successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// @route   DELETE /api/admin/products/:slug
// @desc    Delete a product
// @access  Private/Admin
router.delete('/products/:slug', protect, adminProtect, async (req, res) => {
  const { slug } = req.params;
  const performedBy = req.user.name || req.user.email;

  // --- MOCK FALLBACK MODE ---
  if (!supabase.isConfigured) {
    const products = readData('products.json');
    const index = products.findIndex(p => p.slug === slug);

    if (index === -1) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    const name = products[index].name;
    products.splice(index, 1);
    writeData('products.json', products);

    await logActivity('Product Deleted', `Removed product "${name}" from stock`, performedBy);

    return res.json({ message: `Product "${name}" deleted successfully!` });
  }

  // --- SUPABASE MODE ---
  try {
    // Delete will cascade to reviews and variations automatically because of REFERENCES cascade settings
    const { data: product, error: findErr } = await supabase
      .from('products')
      .select('id, name')
      .eq('slug', slug)
      .single();

    if (findErr || !product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    const { error: delErr } = await supabase
      .from('products')
      .delete()
      .eq('id', product.id);

    if (delErr) throw delErr;

    await logActivity('Product Deleted', `Removed product "${product.name}" from stock`, performedBy);

    res.json({ message: `Product "${product.name}" deleted successfully!` });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// @route   GET /api/admin/categories
// @desc    Get all categories
// @access  Private/Admin
router.get('/categories', protect, adminProtect, async (req, res) => {
  if (!supabase.isConfigured) {
    const categories = readData('categories.json');
    return res.json(categories);
  }

  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    // If the categories table doesn't exist yet, derive from products table
    if (error && error.code === 'PGRST205') {
      const { data: products, error: prodErr } = await supabase
        .from('products')
        .select('category');

      if (prodErr) throw prodErr;

      const uniqueNames = [...new Set(products.map(p => p.category).filter(Boolean))].sort();
      const derived = uniqueNames.map(name => ({
        id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        name,
        created_at: new Date().toISOString()
      }));
      return res.json(derived);
    }

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// @route   POST /api/admin/categories
// @desc    Create a new category
// @access  Private/Admin
router.post('/categories', protect, adminProtect, async (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ message: 'Category name is required.' });
  }

  const cleanName = name.trim();
  const performedBy = req.user.name || req.user.email;

  if (!supabase.isConfigured) {
    const categories = readData('categories.json');
    if (categories.some(c => c.name.toLowerCase() === cleanName.toLowerCase())) {
      return res.status(400).json({ message: 'Category already exists.' });
    }

    const newCategory = {
      id: cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      name: cleanName
    };

    categories.push(newCategory);
    writeData('categories.json', categories);

    await logActivity('Category Created', `Added new category "${cleanName}"`, performedBy);
    return res.status(201).json({ message: 'Category created successfully!', category: newCategory });
  }

  try {
    const { data, error } = await supabase
      .from('categories')
      .insert({ name: cleanName })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return res.status(400).json({ message: 'Category already exists.' });
      }
      throw error;
    }

    await logActivity('Category Created', `Added new category "${cleanName}"`, performedBy);
    res.status(201).json({ message: 'Category created successfully!', category: data });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// @route   PUT /api/admin/categories/:id
// @desc    Update/Rename category
// @access  Private/Admin
router.put('/categories/:id', protect, adminProtect, async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ message: 'Category name is required.' });
  }

  const cleanName = name.trim();
  const performedBy = req.user.name || req.user.email;

  if (!supabase.isConfigured) {
    const categories = readData('categories.json');
    const index = categories.findIndex(c => c.id === id);

    if (index === -1) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    const oldName = categories[index].name;
    categories[index].name = cleanName;
    writeData('categories.json', categories);

    const products = readData('products.json');
    let updatedCount = 0;
    products.forEach(p => {
      if (p.category === oldName) {
        p.category = cleanName;
        updatedCount++;
      }
    });

    if (updatedCount > 0) {
      writeData('products.json', products);
    }

    await logActivity('Category Edited', `Renamed category from "${oldName}" to "${cleanName}"`, performedBy);
    return res.json({ message: 'Category updated successfully!', category: categories[index] });
  }

  try {
    const { data: existing, error: getErr } = await supabase
      .from('categories')
      .select('name')
      .eq('id', id)
      .single();

    if (getErr || !existing) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    const oldName = existing.name;

    const { data: updatedCategory, error: updateErr } = await supabase
      .from('categories')
      .update({ name: cleanName })
      .eq('id', id)
      .select()
      .single();

    if (updateErr) throw updateErr;

    const { error: cascadeErr } = await supabase
      .from('products')
      .update({ category: cleanName })
      .eq('category', oldName);

    if (cascadeErr) {
      console.error('Failed to cascade category rename to products:', cascadeErr.message);
    }

    await logActivity('Category Edited', `Renamed category from "${oldName}" to "${cleanName}"`, performedBy);
    res.json({ message: 'Category updated successfully!', category: updatedCategory });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// @route   DELETE /api/admin/categories/:id
// @desc    Delete category
// @access  Private/Admin
router.delete('/categories/:id', protect, adminProtect, async (req, res) => {
  const { id } = req.params;
  const performedBy = req.user.name || req.user.email;

  if (!supabase.isConfigured) {
    const categories = readData('categories.json');
    const index = categories.findIndex(c => c.id === id);

    if (index === -1) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    const categoryName = categories[index].name;
    categories.splice(index, 1);
    writeData('categories.json', categories);

    await logActivity('Category Deleted', `Deleted category "${categoryName}"`, performedBy);
    return res.json({ message: `Category "${categoryName}" deleted successfully!` });
  }

  try {
    const { data: existing, error: getErr } = await supabase
      .from('categories')
      .select('name')
      .eq('id', id)
      .single();

    if (getErr || !existing) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    const categoryName = existing.name;

    const { error: delErr } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (delErr) throw delErr;

    await logActivity('Category Deleted', `Deleted category "${categoryName}"`, performedBy);
    res.json({ message: `Category "${categoryName}" deleted successfully!` });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// @route   PUT /api/admin/orders/:id/delivery
// @desc    Update order delivery details (package ID, tracking link, tracker status)
// @access  Private/Admin
router.put('/orders/:id/delivery', protect, adminProtect, async (req, res) => {
  const { id } = req.params;
  const { deliveryPackageId, trackingLink, deliveryTrackerStatus } = req.body;
  const performedBy = req.user.name || req.user.email;

  if (!supabase.isConfigured) {
    const orders = readData('orders.json');
    const order = orders.find(o => o.orderId === id || o.id === id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    order.deliveryPackageId = deliveryPackageId !== undefined ? deliveryPackageId : (order.deliveryPackageId || '');
    order.trackingLink = trackingLink !== undefined ? trackingLink : (order.trackingLink || '');
    order.deliveryTrackerStatus = deliveryTrackerStatus !== undefined ? deliveryTrackerStatus : (order.deliveryTrackerStatus || 'Pending');

    writeData('orders.json', orders);
    await logActivity('Order Delivery Updated', `Updated delivery details for Order ${order.orderId}`, performedBy);

    return res.json({ message: 'Order delivery details updated successfully!', order });
  }

  try {
    const { data: order, error: findErr } = await supabase
      .from('orders')
      .select('id, order_id')
      .eq('order_id', id)
      .maybeSingle();

    let targetId = id;
    let orderNum = id;

    if (order) {
      targetId = order.id;
      orderNum = order.order_id;
    }

    const { data: updatedOrder, error: updateErr } = await supabase
      .from('orders')
      .update({
        delivery_package_id: deliveryPackageId !== undefined ? deliveryPackageId : '',
        tracking_link: trackingLink !== undefined ? trackingLink : '',
        delivery_tracker_status: deliveryTrackerStatus !== undefined ? deliveryTrackerStatus : 'Pending'
      })
      .eq('id', targetId)
      .select()
      .single();

    if (updateErr) throw updateErr;

    await logActivity('Order Delivery Updated', `Updated delivery details for Order ${orderNum}`, performedBy);
    res.json({ message: 'Order delivery details updated successfully!', order: updatedOrder });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// @route   DELETE /api/admin/orders/:id
// @desc    Delete a customer order
// @access  Private/Admin
router.delete('/orders/:id', protect, adminProtect, async (req, res) => {
  const { id } = req.params;
  const performedBy = req.user.name || req.user.email;

  if (!supabase.isConfigured) {
    const orders = readData('orders.json');
    const index = orders.findIndex(o => o.orderId === id || o.id === id);

    if (index === -1) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    const orderIdVal = orders[index].orderId;
    orders.splice(index, 1);
    writeData('orders.json', orders);

    await logActivity('Order Deleted', `Permanently deleted order record ${orderIdVal}`, performedBy);
    return res.json({ message: `Order ${orderIdVal} deleted successfully!` });
  }

  try {
    // Check if parameter is a valid UUID format. If not, query by human-readable order_id
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    let query = supabase.from('orders').select('id, order_id');
    if (isUuid) {
      query = query.eq('id', id);
    } else {
      query = query.eq('order_id', id);
    }

    const { data: order, error: findErr } = await query.maybeSingle();

    if (findErr) throw findErr;
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    const targetId = order.id;
    const orderNum = order.order_id;

    // Delete child items first to prevent constraint violations
    const { error: itemsErr } = await supabase
      .from('order_items')
      .delete()
      .eq('order_id', targetId);

    if (itemsErr) throw itemsErr;

    // Delete parent order
    const { error: delErr } = await supabase
      .from('orders')
      .delete()
      .eq('id', targetId);

    if (delErr) throw delErr;

    await logActivity('Order Deleted', `Permanently deleted order record ${orderNum}`, performedBy);
    res.json({ message: `Order ${orderNum} deleted successfully!` });
  } catch (error) {
    console.error('❌ Delete Order Server Error:', error.message);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// @route   GET /api/admin/settings
// @desc    Get contact & footer settings (Public)
// @access  Public
router.get('/settings', async (req, res) => {
  const DEFAULT_SETTINGS = {
    contact_phone_1: "9014274293",
    contact_phone_2: "7075604700",
    whatsapp_phone_1: "9014274293",
    whatsapp_phone_2: "7075604700",
    email: "Navakiranamgroup@gmail.com",
    address: "Near bypass Anantapur Road, Bathalapalli, Sri Sathya Sai Dist, Andhra Pradesh 515661",
    footer_address: "NVKM GROUP Manufacturing, Andhra Pradesh, India",
    footer_phone_1: "+91 90142 74293",
    footer_phone_2: "+91 70756 04700"
  };

  // --- MOCK FALLBACK MODE ---
  if (!supabase.isConfigured) {
    const settingsList = readData('settings.json');
    const settings = Array.isArray(settingsList) ? settingsList[0] : settingsList;
    return res.json(settings || DEFAULT_SETTINGS);
  }

  // --- SUPABASE MODE ---
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'contact_settings')
      .maybeSingle();

    if (error) {
      if (error.code === 'PGRST205' || error.code === '42P01') {
        const settingsList = readData('settings.json');
        const settings = Array.isArray(settingsList) ? settingsList[0] : settingsList;
        return res.json(settings || DEFAULT_SETTINGS);
      }
      throw error;
    }

    if (data && data.value) {
      return res.json(data.value);
    }

    const settingsList = readData('settings.json');
    const settings = Array.isArray(settingsList) ? settingsList[0] : settingsList;
    res.json(settings || DEFAULT_SETTINGS);
  } catch (error) {
    console.error('Settings query error, falling back to JSON:', error.message);
    const settingsList = readData('settings.json');
    const settings = Array.isArray(settingsList) ? settingsList[0] : settingsList;
    res.json(settings || DEFAULT_SETTINGS);
  }
});

// @route   PUT /api/admin/settings
// @desc    Update contact & footer settings
// @access  Private/Admin
router.put('/settings', protect, adminProtect, async (req, res) => {
  const settingsData = req.body;
  const performedBy = req.user.name || req.user.email;

  // --- MOCK FALLBACK MODE ---
  if (!supabase.isConfigured) {
    writeData('settings.json', [settingsData]);
    await logActivity('Settings Updated', 'Updated contact and footer settings details', performedBy);
    return res.json({ message: 'Settings updated successfully!', settings: settingsData });
  }

  // --- SUPABASE MODE ---
  try {
    const { error } = await supabase
      .from('settings')
      .upsert({ key: 'contact_settings', value: settingsData });

    if (error) {
      if (error.code === 'PGRST205' || error.code === '42P01') {
        writeData('settings.json', [settingsData]);
        await logActivity('Settings Updated', 'Updated contact and footer settings details (Local Fallback)', performedBy);
        return res.json({ message: 'Settings updated successfully (Local Fallback)!', settings: settingsData });
      }
      throw error;
    }

    writeData('settings.json', [settingsData]);
    await logActivity('Settings Updated', 'Updated contact and footer settings details', performedBy);
    res.json({ message: 'Settings updated successfully!', settings: settingsData });
  } catch (error) {
    console.error('Settings update error, falling back to JSON:', error.message);
    writeData('settings.json', [settingsData]);
    await logActivity('Settings Updated', 'Updated contact and footer settings details (Local Fallback after DB error)', performedBy);
    res.json({ message: 'Settings updated successfully (Local Fallback after error)!', settings: settingsData });
  }
});

module.exports = router;

