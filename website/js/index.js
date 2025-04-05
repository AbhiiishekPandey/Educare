// Load environment variables
require('dotenv').config();

// Export environment variables for use in other files
module.exports = {
  // Educare API keys
  EDUCARE_API_KEY: process.env.EDUCARE_API_KEY,
  EDUCARE_API_SECRET: process.env.EDUCARE_API_SECRET,
  EDUCARE_ACCESS_TOKEN: process.env.EDUCARE_ACCESS_TOKEN,
  
  // YouTube API keys
  YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,
  
  // OpenAI API keys
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OPENAI_ORG_ID: process.env.OPENAI_ORG_ID,
  
  // Google API keys
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY
};

console.log('Environment variables loaded successfully'); 