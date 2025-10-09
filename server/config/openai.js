const OpenAI = require('openai');

const openaiApiKey = process.env.OPENAI_API_KEY;

if (!openaiApiKey) {
  console.warn('⚠️  WARNING: OpenAI API key not found. AI features will not work.');
  console.warn('   Please set OPENAI_API_KEY in your environment variables.');
}

const openai = openaiApiKey ? new OpenAI({
  apiKey: openaiApiKey
}) : null;

module.exports = openai;
