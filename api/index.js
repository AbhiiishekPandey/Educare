// Vercel serverless function wrapper for Express app
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(express.json());

// Set up middleware to pass environment variables to the client
app.use((req, res, next) => {
  res.locals.envScript = `
    <script>
      window.ENV_CONFIG = {
        YOUTUBE_API_KEY: ${process.env.YOUTUBE_API_KEY ? `"${process.env.YOUTUBE_API_KEY}"` : 'null'},
        GOOGLE_API_KEY: ${process.env.GOOGLE_API_KEY ? `"${process.env.GOOGLE_API_KEY}"` : 'null'},
        GEMINI_API_KEY: ${process.env.GEMINI_API_KEY ? `"${process.env.GEMINI_API_KEY}"` : 'null'}
      };
    </script>
  `;
  next();
});

// Custom route for the homepage that injects environment variables
app.get('/api/', (req, res) => {
  const fs = require('fs');
  try {
    // Read the index.html file from website directory
    let indexHTML = fs.readFileSync(path.join(__dirname, '..', 'website', 'index.html'), 'utf8');
    
    // Insert the environment variables script right after the opening <head> tag
    indexHTML = indexHTML.replace('<head>', '<head>\n  ' + res.locals.envScript);
    
    // Send the modified HTML
    res.send(indexHTML);
  } catch (error) {
    console.error('Error reading index.html:', error);
    res.status(500).send('Error loading homepage');
  }
});

// YouTube search endpoint
app.get('/api/youtube/search', async (req, res) => {
  try {
    const query = req.query.q;
    const maxResults = req.query.maxResults || 10;
    
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    if (!process.env.YOUTUBE_API_KEY) {
      return res.status(500).json({ error: 'YouTube API key not configured' });
    }
    
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&maxResults=${maxResults}&type=video&key=${process.env.YOUTUBE_API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error in YouTube search API:', error);
    res.status(500).json({ error: error.message });
  }
});

// AI content generation endpoint (OpenAI)
app.post('/api/ai/generate', async (req, res) => {
  try {
    const { prompt, model = 'gpt-3.5-turbo', maxTokens = 150 } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: 'You are a helpful educational assistant.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: maxTokens,
        temperature: 0.7
      })
    });
    
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }
    
    const data = await response.json();
    res.json({ content: data.choices[0].message.content });
  } catch (error) {
    console.error('Error in AI generation API:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

// Export the Express app as a serverless function
module.exports = app;
