const https = require('https');

const SUPABASE_REF = 'kuplsvigyambdqmborhi';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1cGxzdmlneWFtYmRxbWJvcmhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzMTI2MjQsImV4cCI6MjA5NTg4ODYyNH0.mn9ZcpWocUfBpS9f-C0J8gJNSseVRqIDI0rbhJKhZq4';

function supabaseRequest(path, method, body) {
  return new Promise((resolve, reject) => {
    const bodyStr = body ? JSON.stringify(body) : null;
    const options = {
      hostname: SUPABASE_REF + '.supabase.co',
      path,
      method,
      headers: {
        'apikey': ANON_KEY,
        'Authorization': 'Bearer ' + ANON_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      }
    };
    if (bodyStr) options.headers['Content-Length'] = Buffer.byteLength(bodyStr);

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    if (bodyStr) req.write(bodyStr);
    req.end();
  });
}

async function seedCategories() {
  const categories = [
    'Banana Powder',
    'Beetroot Powder', 
    'Carrot Powder',
    'Moringa Powder',
    'Pooja Accessories',
    'Tomato Powder'
  ];

  console.log('Checking categories table...');
  
  // Try inserting categories using Supabase REST API
  for (const name of categories) {
    const res = await supabaseRequest('/rest/v1/categories', 'POST', { name });
    console.log(`${name}: ${res.status} - ${res.body.substring(0, 100)}`);
  }
  
  // Verify
  const verify = await supabaseRequest('/rest/v1/categories?select=*', 'GET', null);
  console.log('\nVerification - Status:', verify.status);
  console.log('Categories:', verify.body.substring(0, 500));
}

seedCategories().catch(console.error);
