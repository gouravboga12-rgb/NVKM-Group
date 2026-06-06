const express = require('express');
const router = express.Router();
const supabase = require('../config/db');
const { protect } = require('../middleware/auth');
const { readData, writeData } = require('../utils/mockDb');

const getCategoryGroup = (category) => {
  if (!category) return 'All';
  const cat = category.toLowerCase();
  if (cat === 'pooja accessories') {
    return 'Pooja Accessories';
  }
  if (cat === 'all') {
    return 'All';
  }
  return 'Fruits and Vegetable powder';
};

// Helper to transform mock data to frontend expected schema
const transformProduct = (p) => ({
  id: p.slug,
  name: p.name,
  category: p.category,
  shortDesc: p.short_desc,
  longDesc: p.long_desc,
  benefits: p.benefits || [],
  ingredients: p.ingredients,
  usage: p.usage_info,
  image: p.image,
  images: p.images || [p.image],
  rating: parseFloat(p.rating) || 0,
  reviewsCount: (p.reviews || []).length,
  badge: p.badge || '',
  deliveryCharges: parseFloat(p.delivery_charges) || 0,
  customFields: p.custom_fields || {},
  variations: (p.variations || []).map(v => ({
    weight: v.weight,
    price: parseFloat(v.price),
    discountPrice: parseFloat(v.discount_price)
  })),
  reviews: (p.reviews || []).map((r, idx) => ({
    id: r.id || `seed-${idx}`,
    user_id: r.user_id || null,
    name: r.name,
    rating: r.rating,
    date: r.date,
    comment: r.comment
  }))
});

// @route   GET /api/products
// @desc    Get all products with variations and reviews (optional filtering)
// @access  Public
router.get('/', async (req, res) => {
  const { category, q } = req.query;

  try {
    if (!supabase.isConfigured) {
      let filtered = readData('products.json');
      if (category && category !== 'All') {
        filtered = filtered.filter(p => {
          if (category !== 'Fruits and Vegetable powder' && category !== 'Pooja Accessories') {
            return p.category.toLowerCase() === category.toLowerCase();
          }
          return getCategoryGroup(p.category) === category;
        });
      }
      if (q) {
        const queryStr = q.toLowerCase();
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(queryStr) || 
          p.short_desc.toLowerCase().includes(queryStr) || 
          p.ingredients.toLowerCase().includes(queryStr) || 
          p.category.toLowerCase().includes(queryStr)
        );
      }
      return res.json(filtered.map(transformProduct));
    }

    let query = supabase
      .from('products')
      .select('*, product_variations(*), product_reviews(*)');

    if (category && category !== 'All') {
      if (category === 'Fruits and Vegetable powder') {
        query = query.in('category', ['Tomato Powder', 'Banana Powder', 'Carrot Powder', 'Beetroot Powder', 'Moringa Powder']);
      } else {
        query = query.eq('category', category);
      }
    }

    if (q) {
      query = query.or(`name.ilike.%${q}%,short_desc.ilike.%${q}%,ingredients.ilike.%${q}%,category.ilike.%${q}%`);
    }

    const { data: products, error } = await query;

    if (error) throw error;

    // Transform to match frontend expected shape
    const transformed = products.map(p => ({
      id: p.slug,
      name: p.name,
      category: p.category,
      shortDesc: p.short_desc,
      longDesc: p.long_desc,
      benefits: p.benefits || [],
      ingredients: p.ingredients,
      usage: p.usage_info,
      image: p.image,
      images: p.images || [p.image],
      rating: parseFloat(p.rating) || 0,
      reviewsCount: (p.product_reviews || []).length,
      badge: p.badge || '',
      deliveryCharges: parseFloat(p.delivery_charges) || 0,
      customFields: p.custom_fields || {},
      variations: (p.product_variations || []).map(v => ({
        weight: v.weight,
        price: parseFloat(v.price),
        discountPrice: parseFloat(v.discount_price)
      })),
      reviews: (p.product_reviews || []).map((r, idx) => ({
        id: r.id || `seed-${idx}`,
        user_id: r.user_id,
        name: r.name,
        rating: r.rating,
        date: r.date,
        comment: r.comment
      }))
    }));

    res.json(transformed);
  } catch (error) {
    console.error('Products API error, returning fallback local products:', error.message);
    let filtered = readData('products.json');
    if (category && category !== 'All') {
      filtered = filtered.filter(p => {
        if (category !== 'Fruits and Vegetable powder' && category !== 'Pooja Accessories') {
          return p.category.toLowerCase() === category.toLowerCase();
        }
        return getCategoryGroup(p.category) === category;
      });
    }
    if (q) {
      const queryStr = q.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(queryStr) || 
        p.short_desc.toLowerCase().includes(queryStr) || 
        p.ingredients.toLowerCase().includes(queryStr) || 
        p.category.toLowerCase().includes(queryStr)
      );
    }
    res.json(filtered.map(transformProduct));
  }
});

// @route   GET /api/products/:slug
// @desc    Get a single product by slug
// @access  Public
router.get('/:slug', async (req, res) => {
  const { slug } = req.params;

  try {
    if (!supabase.isConfigured) {
      const product = readData('products.json').find(p => p.slug === slug);
      if (!product) {
        return res.status(404).json({ message: 'Product not found.' });
      }
      return res.json(transformProduct(product));
    }

    const { data: product, error } = await supabase
      .from('products')
      .select('*, product_variations(*), product_reviews(*)')
      .eq('slug', slug)
      .single();

    if (error || !product) {
      // Secondary fallback to mock data
      const localProduct = readData('products.json').find(p => p.slug === slug);
      if (localProduct) {
        return res.json(transformProduct(localProduct));
      }
      return res.status(404).json({ message: 'Product not found.' });
    }

    const transformed = {
      id: product.slug,
      name: product.name,
      category: product.category,
      shortDesc: product.short_desc,
      longDesc: product.long_desc,
      benefits: product.benefits || [],
      ingredients: product.ingredients,
      usage: product.usage_info,
      image: product.image,
      images: product.images || [product.image],
      rating: parseFloat(product.rating) || 0,
      reviewsCount: (product.product_reviews || []).length,
      badge: product.badge || '',
      deliveryCharges: parseFloat(product.delivery_charges) || 0,
      customFields: product.custom_fields || {},
      variations: (product.product_variations || []).map(v => ({
        weight: v.weight,
        price: parseFloat(v.price),
        discountPrice: parseFloat(v.discount_price)
      })),
      reviews: (product.product_reviews || []).map((r, idx) => ({
        id: r.id || `seed-${idx}`,
        user_id: r.user_id,
        name: r.name,
        rating: r.rating,
        date: r.date,
        comment: r.comment
      }))
    };

    res.json(transformed);
  } catch (error) {
    console.error(`Product slug API error for ${slug}, returning fallback:`, error.message);
    const localProduct = readData('products.json').find(p => p.slug === slug);
    if (localProduct) {
      return res.json(transformProduct(localProduct));
    }
    res.status(404).json({ message: 'Product not found.' });
  }
});

router.post('/:slug/reviews', protect, async (req, res) => {
  const { name, rating, comment } = req.body;

  if (!name || !rating || !comment) {
    return res.status(400).json({ message: 'Please fill all review fields.' });
  }

  try {
    // Check if the user has purchased the product
    let hasPurchased = false;

    if (!supabase.isConfigured) {
      const orders = readData('orders.json');
      hasPurchased = orders.some(o => 
        o.user_id === req.user.id && 
        o.status !== 'Cancelled' && 
        o.items.some(item => item.productId === req.params.slug)
      );
    } else {
      const { data: userOrders, error: boughtErr } = await supabase
        .from('orders')
        .select('id, status, order_items!inner(product_slug)')
        .eq('user_id', req.user.id)
        .neq('status', 'Cancelled')
        .eq('order_items.product_slug', req.params.slug);

      if (!boughtErr && userOrders && userOrders.length > 0) {
        hasPurchased = true;
      }
    }

    if (!hasPurchased) {
      return res.status(403).json({ 
        message: 'Only customers who have purchased this product can leave a review.' 
      });
    }

    if (!supabase.isConfigured) {
      const products = readData('products.json');
      const product = products.find(p => p.slug === req.params.slug);
      if (!product) {
        return res.status(404).json({ message: 'Product not found.' });
      }

      product.reviews = product.reviews || [];
      product.reviews.unshift({
        id: 'rev-' + Date.now(),
        user_id: req.user.id,
        name,
        rating: Number(rating),
        date: new Date().toLocaleDateString('en-IN'),
        comment
      });

      const totalRating = product.reviews.reduce((sum, r) => sum + r.rating, 0);
      product.rating = Math.round((totalRating / product.reviews.length) * 10) / 10;
      product.reviews_count = product.reviews.length;

      writeData('products.json', products);
      return res.status(201).json({ message: 'Review submitted successfully!' });
    }

    // Find product by slug
    const { data: product, error: findErr } = await supabase
      .from('products')
      .select('id, reviews_count, rating')
      .eq('slug', req.params.slug)
      .single();

    if (findErr || !product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    // Insert review
    const { error: insertErr } = await supabase
      .from('product_reviews')
      .insert({
        product_id: product.id,
        name,
        rating: Number(rating),
        comment,
        date: new Date().toLocaleDateString('en-IN'),
        user_id: req.user.id
      });

    if (insertErr) throw insertErr;

    // Recalculate rating
    const { data: allReviews } = await supabase
      .from('product_reviews')
      .select('rating')
      .eq('product_id', product.id);

    const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = Math.round((totalRating / allReviews.length) * 10) / 10;

    // Update product
    await supabase
      .from('products')
      .update({
        rating: avgRating,
        reviews_count: allReviews.length
      })
      .eq('id', product.id);

    res.status(201).json({ message: 'Review submitted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// @route   PUT /api/products/:slug/reviews/:reviewId
// @desc    Update/Edit a product review
// @access  Private
router.put('/:slug/reviews/:reviewId', protect, async (req, res) => {
  const { rating, comment } = req.body;
  const { reviewId } = req.params;

  if (!rating || !comment) {
    return res.status(400).json({ message: 'Please provide rating and comment.' });
  }

  try {
    const isAdmin = req.user.email === 'janagondanaveen@gmail.com';

    // --- MOCK MODE ---
    if (!supabase.isConfigured) {
      const products = readData('products.json');
      const product = products.find(p => p.slug === req.params.slug);
      if (!product) {
        return res.status(404).json({ message: 'Product not found.' });
      }

      product.reviews = product.reviews || [];
      const reviewIndex = product.reviews.findIndex((r, idx) => (r.id || `seed-${idx}`) === reviewId);
      if (reviewIndex === -1) {
        return res.status(404).json({ message: 'Review not found.' });
      }

      const review = product.reviews[reviewIndex];
      // Check permission
      if (!isAdmin && review.user_id !== req.user.id) {
        return res.status(403).json({ message: 'You are not authorized to edit this review.' });
      }

      review.rating = Number(rating);
      review.comment = comment;
      review.date = new Date().toLocaleDateString('en-IN');

      const totalRating = product.reviews.reduce((sum, r) => sum + r.rating, 0);
      product.rating = Math.round((totalRating / product.reviews.length) * 10) / 10;

      writeData('products.json', products);
      return res.json({ message: 'Review updated successfully!' });
    }

    // --- SUPABASE MODE ---
    const { data: product, error: findErr } = await supabase
      .from('products')
      .select('id, reviews_count, rating')
      .eq('slug', req.params.slug)
      .single();

    if (findErr || !product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    const { data: review, error: revErr } = await supabase
      .from('product_reviews')
      .select('*')
      .eq('id', reviewId)
      .single();

    if (revErr || !review) {
      return res.status(404).json({ message: 'Review not found.' });
    }

    // Check permission
    if (!isAdmin && review.user_id !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to edit this review.' });
    }

    const { error: updateErr } = await supabase
      .from('product_reviews')
      .update({
        rating: Number(rating),
        comment,
        date: new Date().toLocaleDateString('en-IN')
      })
      .eq('id', reviewId);

    if (updateErr) throw updateErr;

    const { data: allReviews } = await supabase
      .from('product_reviews')
      .select('rating')
      .eq('product_id', product.id);

    const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = allReviews.length > 0 ? Math.round((totalRating / allReviews.length) * 10) / 10 : 0;

    await supabase
      .from('products')
      .update({
        rating: avgRating
      })
      .eq('id', product.id);

    res.json({ message: 'Review updated successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// @route   DELETE /api/products/:slug/reviews/:reviewId
// @desc    Delete a product review
// @access  Private
router.delete('/:slug/reviews/:reviewId', protect, async (req, res) => {
  const { reviewId } = req.params;

  try {
    const isAdmin = req.user.email === 'janagondanaveen@gmail.com';

    // --- MOCK MODE ---
    if (!supabase.isConfigured) {
      const products = readData('products.json');
      const product = products.find(p => p.slug === req.params.slug);
      if (!product) {
        return res.status(404).json({ message: 'Product not found.' });
      }

      product.reviews = product.reviews || [];
      const reviewIndex = product.reviews.findIndex((r, idx) => (r.id || `seed-${idx}`) === reviewId);
      if (reviewIndex === -1) {
        return res.status(404).json({ message: 'Review not found.' });
      }

      const review = product.reviews[reviewIndex];
      // Check permission
      if (!isAdmin && review.user_id !== req.user.id) {
        return res.status(403).json({ message: 'You are not authorized to delete this review.' });
      }

      product.reviews.splice(reviewIndex, 1);
      product.reviews_count = product.reviews.length;

      const totalRating = product.reviews.reduce((sum, r) => sum + r.rating, 0);
      product.rating = product.reviews.length > 0 ? Math.round((totalRating / product.reviews.length) * 10) / 10 : 0;

      writeData('products.json', products);
      return res.json({ message: 'Review deleted successfully!' });
    }

    // --- SUPABASE MODE ---
    const { data: product, error: findErr } = await supabase
      .from('products')
      .select('id, reviews_count, rating')
      .eq('slug', req.params.slug)
      .single();

    if (findErr || !product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    const { data: review, error: revErr } = await supabase
      .from('product_reviews')
      .select('*')
      .eq('id', reviewId)
      .single();

    if (revErr || !review) {
      return res.status(404).json({ message: 'Review not found.' });
    }

    // Check permission
    if (!isAdmin && review.user_id !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to delete this review.' });
    }

    const { error: delErr } = await supabase
      .from('product_reviews')
      .delete()
      .eq('id', reviewId);

    if (delErr) throw delErr;

    const { data: allReviews } = await supabase
      .from('product_reviews')
      .select('rating')
      .eq('product_id', product.id);

    const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = allReviews.length > 0 ? Math.round((totalRating / allReviews.length) * 10) / 10 : 0;

    await supabase
      .from('products')
      .update({
        rating: avgRating,
        reviews_count: allReviews.length
      })
      .eq('id', product.id);

    res.json({ message: 'Review deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

module.exports = router;

