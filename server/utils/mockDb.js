const fs = require('fs');
const path = require('path');
const { PRODUCTS_DATA } = require('../config/fallbackData');

const DATA_DIR = path.join(__dirname, '..', 'data');

// Helper to ensure directory and files exist
const initDb = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  // Derive unique categories from PRODUCTS_DATA
  const initialCategories = [...new Set(PRODUCTS_DATA.map(p => p.category).filter(Boolean))].map(c => ({
    id: c.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    name: c
  }));

  // Only create these files if they don't already exist
  const files = {
    'orders.json': [],
    'contacts.json': [],
    'products.json': PRODUCTS_DATA,
    'activity_logs.json': [],
    'users.json': [],
  };

  for (const [file, defaultVal] of Object.entries(files)) {
    const filePath = path.join(DATA_DIR, file);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultVal, null, 2), 'utf8');
    }
  }

  // Categories: always ensure the file exists and is seeded from products
  // If it exists but is empty, re-seed it
  const categoriesPath = path.join(DATA_DIR, 'categories.json');
  if (!fs.existsSync(categoriesPath)) {
    fs.writeFileSync(categoriesPath, JSON.stringify(initialCategories, null, 2), 'utf8');
  } else {
    try {
      const existing = JSON.parse(fs.readFileSync(categoriesPath, 'utf8'));
      if (!Array.isArray(existing) || existing.length === 0) {
        // Re-seed if empty
        fs.writeFileSync(categoriesPath, JSON.stringify(initialCategories, null, 2), 'utf8');
      } else {
        // Merge: add any categories from products that are missing
        const existingNames = new Set(existing.map(c => c.name.toLowerCase()));
        let changed = false;
        for (const cat of initialCategories) {
          if (!existingNames.has(cat.name.toLowerCase())) {
            existing.push(cat);
            changed = true;
          }
        }
        if (changed) {
          fs.writeFileSync(categoriesPath, JSON.stringify(existing, null, 2), 'utf8');
        }
      }
    } catch (e) {
      // If corrupt, re-seed
      fs.writeFileSync(categoriesPath, JSON.stringify(initialCategories, null, 2), 'utf8');
    }
  }
};

const readData = (fileName) => {
  initDb();
  const filePath = path.join(DATA_DIR, fileName);
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    console.error(`Error reading mock db file ${fileName}:`, err);
    return [];
  }
};

const writeData = (fileName, data) => {
  initDb();
  const filePath = path.join(DATA_DIR, fileName);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error(`Error writing mock db file ${fileName}:`, err);
    return false;
  }
};

module.exports = {
  readData,
  writeData
};
