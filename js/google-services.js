// Import environment variables
const { GOOGLE_API_KEY } = require('./index');

// Google Services for the Educare platform
const googleServices = {
  // Google Search API
  search: {
    apiKey: GOOGLE_API_KEY,
    
    // Perform a Google search
    performSearch: async (query, numResults = 10) => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/customsearch/v1?key=${googleServices.search.apiKey}&cx=CUSTOM_SEARCH_ENGINE_ID&q=${encodeURIComponent(query)}&num=${numResults}`
        );
        
        if (!response.ok) {
          throw new Error(`Google Search API error: ${response.status}`);
        }
        
        const data = await response.json();
        return data.items;
      } catch (error) {
        console.error('Error performing Google search:', error);
        throw error;
      }
    },
    
    // Format search results for display
    formatSearchResults: (results) => {
      if (!results || results.length === 0) {
        return '<div class="search-error">No results found</div>';
      }
      
      let formattedResults = '<div class="search-results-list">';
      
      results.forEach(result => {
        formattedResults += `
          <div class="search-result-item">
            <a href="${result.link}" target="_blank" class="search-result-title">${result.title}</a>
            <div class="search-result-url">${result.displayLink}</div>
            <div class="search-result-snippet">${result.snippet}</div>
          </div>
        `;
      });
      
      formattedResults += '</div>';
      return formattedResults;
    },
    
    // Create a fallback iframe search
    createIframeSearch: (query) => {
      const encodedQuery = encodeURIComponent(query);
      
      return `
        <div class="search-results-header">
          <h3>Search results for "${query}"</h3>
        </div>
        <div class="embedded-search">
          <iframe 
            src="https://www.google.com/search?igu=1&q=${encodedQuery}" 
            width="100%" 
            height="500" 
            frameborder="0"
            style="border-radius: 8px; margin-top: 10px;"
            sandbox="allow-scripts allow-same-origin allow-forms"
          ></iframe>
        </div>
      `;
    }
  },
  
  // Google Translate API
  translate: {
    // Initialize Google Translate Widget
    initTranslateWidget: () => {
      // This function would typically call the Google Translate API widget
      // Since this requires script injection, we're providing a placeholder
      console.log('Google Translate Widget initialized');
    },
    
    // Toggle the translate widget
    toggleTranslateWidget: () => {
      const translateElement = document.getElementById('google_translate_element');
      if (translateElement) {
        translateElement.classList.toggle('show');
      }
    }
  }
};

// Export the Google services
module.exports = googleServices; 