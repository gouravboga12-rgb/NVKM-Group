const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

const isConfigured = 
  supabaseUrl && 
  supabaseKey && 
  !supabaseUrl.includes('your-project-id') && 
  !supabaseKey.includes('your-service-role-key-here') &&
  !supabaseKey.includes('your-anon-key-here');

// Robust custom fetch wrapper with timeout and retries for database resilience
const customFetch = async (url, options = {}) => {
  const maxRetries = 3;
  let delay = 1000; // start with 1 second delay
  
  for (let i = 0; i < maxRetries; i++) {
    const controller = new AbortController();
    // Increase timeout to 45 seconds (standard is 30s)
    const timeoutId = setTimeout(() => controller.abort(), 45000);
    
    try {
      const response = await globalThis.fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      return response;
    } catch (err) {
      clearTimeout(timeoutId);
      
      const isLastAttempt = i === maxRetries - 1;
      const isTimeout = err.name === 'AbortError';
      
      console.warn(`⚠️ Supabase fetch attempt ${i + 1} failed (Timeout: ${isTimeout}). ${isLastAttempt ? 'Giving up.' : `Retrying in ${delay}ms...`}`);
      
      if (isLastAttempt) {
        throw err;
      }
      
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2;
    }
  }
};

let supabase;

if (!isConfigured) {
  console.warn('⚠️ Supabase credentials are not configured or are placeholders. The server will run in high-quality Mock / Local Fallback mode.');
  // Create a placeholder client so any import code won't throw on creation
  supabase = createClient('https://placeholder-project.supabase.co', 'placeholder-key-role-key-etc');
} else {
  try {
    supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        fetch: customFetch
      }
    });
    console.log('✅ Supabase client initialized with robust fetch (retries + timeout)');
  } catch (err) {
    console.error('❌ Failed to initialize Supabase client:', err.message);
  }
}

// Attach configuration status to the exported client
supabase.isConfigured = isConfigured;

module.exports = supabase;

