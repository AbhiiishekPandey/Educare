// Import environment variables
const { OPENAI_API_KEY, GEMINI_API_KEY } = require('./index');

// AI Services for the Educare platform
const aiServices = {
  // OpenAI Service
  openai: {
    apiKey: OPENAI_API_KEY,
    
    // Generate content using OpenAI
    generateContent: async (prompt, model = 'gpt-3.5-turbo', maxTokens = 150) => {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${aiServices.openai.apiKey}`
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
        return data.choices[0].message.content;
      } catch (error) {
        console.error('Error generating content with OpenAI:', error);
        throw error;
      }
    },
    
    // Analyze text using OpenAI
    analyzeText: async (text) => {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${aiServices.openai.apiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content: 'You are an expert educational content analyzer. Analyze the following text and provide insights on its educational value, readability, and target audience.'
              },
              {
                role: 'user',
                content: text
              }
            ],
            max_tokens: 300,
            temperature: 0.3
          })
        });
        
        if (!response.ok) {
          throw new Error(`OpenAI API error: ${response.status}`);
        }
        
        const data = await response.json();
        return data.choices[0].message.content;
      } catch (error) {
        console.error('Error analyzing text with OpenAI:', error);
        throw error;
      }
    }
  },
  
  // Google Gemini Service
  gemini: {
    apiKey: GEMINI_API_KEY,
    
    // Generate content using Gemini
    generateContent: async (prompt, maxTokens = 150) => {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${aiServices.gemini.apiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt
                  }
                ]
              }
            ],
            generationConfig: {
              maxOutputTokens: maxTokens,
              temperature: 0.7
            }
          })
        });
        
        if (!response.ok) {
          throw new Error(`Gemini API error: ${response.status}`);
        }
        
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
      } catch (error) {
        console.error('Error generating content with Gemini:', error);
        throw error;
      }
    }
  }
};

// Export the AI services
module.exports = aiServices; 