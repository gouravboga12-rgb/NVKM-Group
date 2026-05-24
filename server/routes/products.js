const express = require('express');
const router = express.Router();
const supabase = require('../config/db');
const { PRODUCTS_DATA } = require('../config/fallbackData');

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
  reviewsCount: p.reviews_count || 0,
  badge: p.badge || '',
  variations: (p.variations || []).map(v => ({
    weight: v.weight,
    price: parseFloat(v.price),
    discountPrice: parseFloat(v.discount_price)
  })),
  reviews: (p.reviews || []).map(r => ({
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
      let filtered = [...PRODUCTS_DATA];
      if (category && category !== 'All') {
        filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
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
      query = query.eq('category', category);
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
      reviewsCount: p.reviews_count || 0,
      badge: p.badge || '',
      variations: (p.product_variations || []).map(v => ({
        weight: v.weight,
        price: parseFloat(v.price),
        discountPrice: parseFloat(v.discount_price)
      })),
      reviews: (p.product_reviews || []).map(r => ({
        name: r.name,
        rating: r.rating,
        date: r.date,
        comment: r.comment
      }))
    }));

    res.json(transformed);
  } catch (error) {
    console.error('Products API error, returning fallback local products:', error.message);
    let filtered = [...PRODUCTS_DATA];
    if (category && category !== 'All') {
      filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
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
      const product = PRODUCTS_DATA.find(p => p.slug === slug);
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
      const localProduct = PRODUCTS_DATA.find(p => p.slug === slug);
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
      reviewsCount: product.reviews_count || 0,
      badge: product.badge || '',
      variations: (product.product_variations || []).map(v => ({
        weight: v.weight,
        price: parseFloat(v.price),
        discountPrice: parseFloat(v.discount_price)
      })),
      reviews: (product.product_reviews || []).map(r => ({
        name: r.name,
        rating: r.rating,
        date: r.date,
        comment: r.comment
      }))
    };

    res.json(transformed);
  } catch (error) {
    console.error(`Product slug API error for ${slug}, returning fallback:`, error.message);
    const localProduct = PRODUCTS_DATA.find(p => p.slug === slug);
    if (localProduct) {
      return res.json(transformProduct(localProduct));
    }
    res.status(404).json({ message: 'Product not found.' });
  }
});

// @route   POST /api/products/:slug/reviews
// @desc    Submit a review for a product
// @access  Public
router.post('/:slug/reviews', async (req, res) => {
  const { name, rating, comment } = req.body;

  if (!name || !rating || !comment) {
    return res.status(400).json({ message: 'Please fill all review fields.' });
  }

  try {
    if (!supabase.isConfigured) {
      const product = PRODUCTS_DATA.find(p => p.slug === req.params.slug);
      if (!product) {
        return res.status(404).json({ message: 'Product not found.' });
      }

      product.reviews = product.reviews || [];
      product.reviews.unshift({
        name,
        rating: Number(rating),
        date: new Date().toLocaleDateString('en-IN'),
        comment
      });

      const totalRating = product.reviews.reduce((sum, r) => sum + r.rating, 0);
      product.rating = Math.round((totalRating / product.reviews.length) * 10) / 10;
      product.reviews_count = product.reviews.length;

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
        date: new Date().toLocaleDateString('en-IN')
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

module.exports = router;

