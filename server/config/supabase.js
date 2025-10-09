const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Debug logging
console.log('🔍 Environment check:');
console.log('SUPABASE_URL:', supabaseUrl ? 'Set' : 'Not set');
console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? 'Set' : 'Not set');
console.log('URL contains supabase.co:', supabaseUrl.includes('supabase.co'));
console.log('Key starts with eyJ:', supabaseServiceKey.startsWith('eyJ'));

// Create Supabase client with service role key for server-side operations
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Check if we have real credentials
const hasRealCredentials = supabaseUrl && 
                          supabaseServiceKey && 
                          supabaseUrl.includes('supabase.co') &&
                          supabaseServiceKey.length > 50; // JWT tokens are typically long

if (!hasRealCredentials) {
  console.warn('⚠️  WARNING: Using placeholder Supabase credentials. Please set up your Supabase project and update the environment variables.');
  console.warn('   See SUPABASE_SETUP.md for instructions.');
} else {
  console.log('✅ Supabase credentials loaded successfully!');
}

module.exports = { supabase, hasRealCredentials };
