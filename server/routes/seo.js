const express = require('express');
const router = express.Router();
const supabase = require('../config/db');
const { readData } = require('../utils/mockDb');

// Helper to fetch settings
async function getSettings() {
  const DEFAULT_SETTINGS = {
    google_site_verification: "",
    robots_txt: "User-agent: *\nAllow: /\n\nSitemap: {site_url}/sitemap.xml"
  };

  const mergeEnv = (s) => {
    const merged = { ...DEFAULT_SETTINGS, ...s };
    if (!merged.google_site_verification) {
      merged.google_site_verification = process.env.GOOGLE_SITE_VERIFICATION || "";
    }
    return merged;
  };

  if (!supabase.isConfigured) {
    try {
      const settingsList = readData('settings.json');
      const settings = Array.isArray(settingsList) ? settingsList[0] : settingsList;
      return mergeEnv(settings);
    } catch (err) {
      return mergeEnv({});
    }
  }

  try {
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'contact_settings')
      .maybeSingle();

    if (!error && data && data.value) {
      return mergeEnv(data.value);
    }
  } catch (err) {
    console.error('Error fetching settings for SEO:', err.message);
  }

  try {
    const settingsList = readData('settings.json');
    const settings = Array.isArray(settingsList) ? settingsList[0] : settingsList;
    return mergeEnv(settings);
  } catch (err) {
    return mergeEnv({});
  }
}

// Helper to fetch product slugs
async function getProductSlugs() {
  if (!supabase.isConfigured) {
    try {
      const products = readData('products.json');
      return products.map(p => p.slug);
    } catch (err) {
      return [];
    }
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('slug');

    if (!error && data) {
      return data.map(p => p.slug);
    }
  } catch (err) {
    console.error('Error fetching product slugs for sitemap:', err.message);
  }

  try {
    const products = readData('products.json');
    return products.map(p => p.slug);
  } catch (err) {
    return [];
  }
}

// Helper to fetch categories
async function getCategories() {
  if (!supabase.isConfigured) {
    try {
      const categories = readData('categories.json');
      return categories.map(c => c.name);
    } catch (err) {
      return [];
    }
  }

  try {
    const { data, error } = await supabase
      .from('categories')
      .select('name');

    if (!error && data) {
      return data.map(c => c.name);
    }
  } catch (err) {
    console.error('Error fetching categories for sitemap:', err.message);
  }

  try {
    const categories = readData('categories.json');
    return categories.map(c => c.name);
  } catch (err) {
    return [];
  }
}

// GET /sitemap.xml & /api/sitemap.xml
const serveSitemap = async (req, res) => {
  try {
    const host = req.headers['x-forwarded-host'] || req.get('host');
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const siteUrl = `${protocol}://${host}`;

    const staticPages = [
      { path: '', priority: '1.0', changefreq: 'daily' },
      { path: '/shop', priority: '0.8', changefreq: 'daily' },
      { path: '/about', priority: '0.7', changefreq: 'weekly' },
      { path: '/contact', priority: '0.7', changefreq: 'weekly' },
      { path: '/login', priority: '0.5', changefreq: 'monthly' },
      { path: '/privacy-policy', priority: '0.3', changefreq: 'monthly' },
      { path: '/terms-conditions', priority: '0.3', changefreq: 'monthly' },
      { path: '/refund-policy', priority: '0.3', changefreq: 'monthly' }
    ];

    const slugs = await getProductSlugs();
    const categories = await getCategories();
    const currentDate = new Date().toISOString().split('T')[0];

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Static pages
    staticPages.forEach(p => {
      xml += `  <url>\n`;
      xml += `    <loc>${siteUrl}${p.path}</loc>\n`;
      xml += `    <lastmod>${currentDate}</lastmod>\n`;
      xml += `    <changefreq>${p.changefreq}</changefreq>\n`;
      xml += `    <priority>${p.priority}</priority>\n`;
      xml += `  </url>\n`;
    });

    // Dynamic categories
    categories.forEach(cat => {
      xml += `  <url>\n`;
      xml += `    <loc>${siteUrl}/shop?category=${encodeURIComponent(cat)}</loc>\n`;
      xml += `    <lastmod>${currentDate}</lastmod>\n`;
      xml += `    <changefreq>daily</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
    });

    // Dynamic products
    slugs.forEach(slug => {
      xml += `  <url>\n`;
      xml += `    <loc>${siteUrl}/products/${slug}</loc>\n`;
      xml += `    <lastmod>${currentDate}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.7</priority>\n`;
      xml += `  </url>\n`;
    });

    xml += '</urlset>';

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).send('Error generating sitemap');
  }
};

router.get('/sitemap.xml', serveSitemap);
router.get('/api/sitemap.xml', serveSitemap);

// GET /robots.txt & /api/robots.txt
const serveRobots = async (req, res) => {
  try {
    const settings = await getSettings();
    const host = req.headers['x-forwarded-host'] || req.get('host');
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const siteUrl = `${protocol}://${host}`;

    const defaultRobots = "User-agent: *\nAllow: /\n\nSitemap: {site_url}/sitemap.xml";
    let robotsContent = settings.robots_txt || defaultRobots;
    
    // Replace {site_url} placeholders dynamically
    robotsContent = robotsContent.replace(/{site_url}/g, siteUrl);

    res.header('Content-Type', 'text/plain');
    res.send(robotsContent);
  } catch (error) {
    console.error('Error serving robots.txt:', error);
    res.status(500).send('Error serving robots.txt');
  }
};

router.get('/robots.txt', serveRobots);
router.get('/api/robots.txt', serveRobots);

// GET /google*.html & /api/google-verification
const serveGoogleVerification = async (req, res) => {
  try {
    const settings = await getSettings();
    const configuredVerification = settings.google_site_verification;

    // Check query param (for Vercel URL rewrite: /api/google-verification?file=google123.html)
    // Or check request path (for direct access: /google123.html)
    const requestFile = req.query.file || req.path.split('/').pop();

    if (!configuredVerification) {
      return res.status(404).send('Google verification code not configured in admin panel.');
    }

    // Match checking. Google site verification files usually look like "google<verification-code>.html"
    const expectedFile = `google${configuredVerification}.html`;

    if (requestFile === expectedFile) {
      res.header('Content-Type', 'text/html');
      return res.send(`google-site-verification: ${expectedFile}`);
    }

    res.status(404).send('Verification file name does not match configuration settings.');
  } catch (error) {
    console.error('Error verifying Google Search Console:', error);
    res.status(500).send('Verification server error');
  }
};

// Route matching google verification files
router.get('/google:code.html', serveGoogleVerification);
router.get('/api/google-verification', serveGoogleVerification);

module.exports = router;
