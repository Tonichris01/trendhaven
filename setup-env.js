#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setupEnvironment() {
  console.log('🚀 TrendHaven Environment Setup\n');
  console.log('This script will help you set up your environment variables for TrendHaven.\n');

  const supabaseUrl = await question('Enter your Supabase Project URL (e.g., https://your-project.supabase.co): ');
  const supabaseKey = await question('Enter your Supabase Service Role Key: ');
  const jwtSecret = await question('Enter a JWT secret (or press Enter for default): ') || 'trendhaven-super-secret-jwt-key-change-in-production';

  const envContent = `# OpenAI Configuration (for backend)
OPENAI_API_KEY=your-openai-api-key-here

# Supabase Configuration (for backend)
SUPABASE_URL=${supabaseUrl}
SUPABASE_SERVICE_ROLE_KEY=${supabaseKey}

# JWT Secret (change this in production)
JWT_SECRET=${jwtSecret}

# Server Configuration
PORT=3001
NODE_ENV=development
`;

  try {
    fs.writeFileSync('.env.local', envContent);
    console.log('\n✅ Environment file created successfully!');
    console.log('📁 File: .env.local');
    console.log('\n🔄 Please restart your development server for changes to take effect.');
    console.log('\n📖 Next steps:');
    console.log('1. Run the database migration in your Supabase SQL Editor');
    console.log('2. Restart the development server: npm run dev');
    console.log('3. Try signing up or signing in!');
  } catch (error) {
    console.error('❌ Error creating environment file:', error.message);
  }

  rl.close();
}

setupEnvironment().catch(console.error);
