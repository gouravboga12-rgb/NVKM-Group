const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

const isConfigured = 
  supabaseUrl && 
  supabaseKey && 
  !supabaseUrl.includes('your-project-id') && 
  !supabaseKey.includes('your-service-role-key-here') &&
  !supabaseKey.includes('your-anon-key-here');

let supabase;

if (!isConfigured) {
  console.warn('⚠️ Supabase credentials are not configured or are placeholders. The server will run in high-quality Mock / Local Fallback mode.');
  // Create a placeholder client so any import code won't throw on creation
  supabase = createClient('https://placeholder-project.supabase.co', 'placeholder-key-role-key-etc');
} else {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('✅ Supabase client initialized');
  } catch (err) {
    console.error('❌ Failed to initialize Supabase client:', err.message);
  }
}

// Attach configuration status to the exported client
supabase.isConfigured = isConfigured;

module.exports = supabase;

