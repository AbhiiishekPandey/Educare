// Import environment variables
const { YOUTUBE_API_KEY } = require('./index');

// YouTube API functions
const youtubeServices = {
  // Initialize the YouTube API with the key from environment variables
  apiKey: YOUTUBE_API_KEY,
  
  // Search videos function
  searchVideos: async (query, maxResults = 10) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&maxResults=${maxResults}&key=${youtubeServices.apiKey}`
      );
      
      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.items;
    } catch (error) {
      console.error('Error searching YouTube videos:', error);
      throw error;
    }
  },
  
  // Get video details function
  getVideoDetails: async (videoId) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${youtubeServices.apiKey}`
      );
      
      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.items[0];
    } catch (error) {
      console.error('Error getting video details:', error);
      throw error;
    }
  },
  
  // Format duration function (converts PT1H2M3S format to 1:02:03)
  formatDuration: (duration) => {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    
    const hours = (match[1] && match[1].replace('H', '')) || 0;
    const minutes = (match[2] && match[2].replace('M', '')) || 0;
    const seconds = (match[3] && match[3].replace('S', '')) || 0;
    
    let formattedDuration = '';
    
    if (hours > 0) {
      formattedDuration += `${hours}:`;
      formattedDuration += `${minutes.toString().padStart(2, '0')}:`;
    } else {
      formattedDuration += `${minutes}:`;
    }
    
    formattedDuration += seconds.toString().padStart(2, '0');
    
    return formattedDuration;
  }
};

// Export the YouTube services
module.exports = youtubeServices; 