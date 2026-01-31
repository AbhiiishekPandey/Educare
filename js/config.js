/**
 * Configuration file to handle environment variables in both Node.js and browser environments
 */

(function(global) {
    // Create a config object
    const config = {
        // Default values (can be overridden by environment variables)
        apiKeys: {
            google: '',
            youtube: '',
            openai: '',
            gemini: '',
            educare: ''
        },
        
        // Function to initialize config
        init: function() {
            // Check if we're in Node.js environment
            if (typeof process !== 'undefined' && process.env) {
                try {
                    // If dotenv is available, use it
                    if (typeof require !== 'undefined') {
                        try {
                            require('dotenv').config();
                        } catch (e) {
                            console.warn('dotenv not available');
                        }
                    }
                    
                    // Load API keys from environment variables
                    this.apiKeys = {
                        google: process.env.GOOGLE_API_KEY || '',
                        youtube: process.env.YOUTUBE_API_KEY || '',
                        openai: process.env.OPENAI_API_KEY || '',
                        gemini: process.env.GEMINI_API_KEY || '',
                        educare: process.env.EDUCARE_API_KEY || ''
                    };
                    
                    console.log('Configuration loaded from environment variables');
                } catch (error) {
                    console.error('Error loading configuration:', error);
                }
            } else {
                // In browser environment, we'll use default values or values set by the server
                console.log('Running in browser environment, using default configuration');
                
                // Check if the server populated window.ENV_CONFIG
                if (global.ENV_CONFIG) {
                    this.apiKeys = {
                        google: global.ENV_CONFIG.GOOGLE_API_KEY || this.apiKeys.google,
                        youtube: global.ENV_CONFIG.YOUTUBE_API_KEY || this.apiKeys.youtube,
                        openai: global.ENV_CONFIG.OPENAI_API_KEY || this.apiKeys.openai,
                        gemini: global.ENV_CONFIG.GEMINI_API_KEY || this.apiKeys.gemini,
                        educare: global.ENV_CONFIG.EDUCARE_API_KEY || this.apiKeys.educare
                    };
                }
            }
            
            return this;
        },
        
        // Get an API key
        getApiKey: function(service) {
            return this.apiKeys[service.toLowerCase()] || '';
        },
        
        // Check if API keys are available
        hasApiKey: function(service) {
            const key = this.getApiKey(service);
            return key !== null && key !== undefined && key !== '';
        }
    };
    
    // Initialize config
    config.init();
    
    // Export for different environments
    if (typeof module !== 'undefined' && module.exports) {
        // Node.js
        module.exports = config;
    } else {
        // Browser
        global.config = config;
    }
})(typeof window !== 'undefined' ? window : this); 