/**
 * YouTube Search Module - Safely uses API keys via the config module
 */

(function() {
    // Create the YouTube Search module
    const youtubeSearch = {
        // Initialize the module
        init: function() {
            // Get elements
            this.searchForm = document.getElementById('youtube-search-form');
            this.searchInput = document.getElementById('youtube-search-input');
            this.searchButton = document.getElementById('youtube-search-button');
            this.resultsContainer = document.getElementById('youtube-results');
            this.loadMoreButton = document.getElementById('load-more-youtube');
            
            // Initialize state
            this.nextPageToken = '';
            this.currentQuery = '';
            this.maxResults = 8;
            
            // Bind events if elements exist
            if (this.searchForm && this.searchInput && this.searchButton) {
                this.bindEvents();
            }
            
            return this;
        },
        
        // Bind event listeners
        bindEvents: function() {
            // Search form submission
            this.searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.performSearch();
            });
            
            // Search button click
            this.searchButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.performSearch();
            });
            
            // Load more button click
            if (this.loadMoreButton) {
                this.loadMoreButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.loadMoreResults();
                });
            }
        },
        
        // Perform YouTube search
        performSearch: function() {
            const query = this.searchInput.value.trim();
            if (query === '') return;
            
            // Reset results for new search
            this.currentQuery = query;
            this.nextPageToken = '';
            
            // Show loading state
            if (this.resultsContainer) {
                this.resultsContainer.innerHTML = `
                    <div class="loader">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                        <p>Searching YouTube for "${query}"...</p>
                    </div>
                `;
            }
            
            // Perform the search
            this.searchYouTube(query);
        },
        
        // Load more results
        loadMoreResults: function() {
            if (this.currentQuery && this.nextPageToken) {
                // Show loading state on button
                if (this.loadMoreButton) {
                    this.loadMoreButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...';
                    this.loadMoreButton.disabled = true;
                }
                
                // Perform search with next page token
                this.searchYouTube(this.currentQuery, this.nextPageToken);
            }
        },
        
        // Search YouTube using API
        searchYouTube: function(query, pageToken = '') {
            // Check if we have API key
            const apiKey = window.config ? window.config.getApiKey('youtube') : '';
            
            if (!apiKey) {
                this.handleError('YouTube API key not available. Please check your configuration.');
                return;
            }
            
            // Build URL with API key from config
            const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&maxResults=${this.maxResults}&type=video&key=${apiKey}${pageToken ? '&pageToken=' + pageToken : ''}`;
            
            // Fetch from YouTube API
            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`YouTube API error: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    this.displayResults(data, pageToken !== '');
                })
                .catch(error => {
                    console.error('Error searching YouTube:', error);
                    this.handleError('Error fetching YouTube results. Please try again later.');
                });
        },
        
        // Display search results
        displayResults: function(data, isLoadMore) {
            // Store next page token for pagination
            this.nextPageToken = data.nextPageToken || '';
            
            // Show/hide load more button based on next page token
            if (this.loadMoreButton) {
                if (this.nextPageToken) {
                    this.loadMoreButton.style.display = 'block';
                    this.loadMoreButton.innerHTML = 'Load More';
                    this.loadMoreButton.disabled = false;
                } else {
                    this.loadMoreButton.style.display = 'none';
                }
            }
            
            // Generate HTML for results
            if (!isLoadMore) {
                // Clear and add new results for new search
                this.resultsContainer.innerHTML = '';
            }
            
            // Check if we have results
            if (!data.items || data.items.length === 0) {
                if (!isLoadMore) {
                    this.resultsContainer.innerHTML = `<div class="no-results">No videos found for "${this.currentQuery}"</div>`;
                }
                return;
            }
            
            // Create results container if it doesn't exist yet
            let resultsGrid = this.resultsContainer.querySelector('.youtube-results-grid');
            if (!resultsGrid) {
                resultsGrid = document.createElement('div');
                resultsGrid.className = 'youtube-results-grid';
                this.resultsContainer.appendChild(resultsGrid);
            }
            
            // Add each video to the results grid
            data.items.forEach(item => {
                const videoId = item.id.videoId;
                const title = item.snippet.title;
                const thumbnail = item.snippet.thumbnails.medium.url;
                const channelTitle = item.snippet.channelTitle;
                const publishedAt = new Date(item.snippet.publishedAt).toLocaleDateString();
                
                const videoCard = document.createElement('div');
                videoCard.className = 'video-card';
                videoCard.innerHTML = `
                    <div class="thumbnail">
                        <img src="${thumbnail}" alt="${title}" loading="lazy">
                        <div class="play-button">
                            <i class="fas fa-play"></i>
                        </div>
                    </div>
                    <div class="video-info">
                        <h3 class="video-title">${title}</h3>
                        <div class="video-meta">
                            <span class="channel">${channelTitle}</span>
                            <span class="publish-date">${publishedAt}</span>
                        </div>
                    </div>
                `;
                
                // Add click handler to play video
                videoCard.addEventListener('click', () => {
                    this.playVideo(videoId, title);
                });
                
                resultsGrid.appendChild(videoCard);
            });
        },
        
        // Play video in modal
        playVideo: function(videoId, title) {
            // Create or get modal
            let modal = document.getElementById('youtube-modal');
            
            if (!modal) {
                // Create modal if it doesn't exist
                modal = document.createElement('div');
                modal.id = 'youtube-modal';
                modal.className = 'youtube-modal';
                modal.innerHTML = `
                    <div class="youtube-modal-content">
                        <div class="youtube-modal-header">
                            <h3 id="youtube-modal-title"></h3>
                            <button id="youtube-modal-close">&times;</button>
                        </div>
                        <div class="youtube-modal-body">
                            <div id="youtube-player-container"></div>
                        </div>
                    </div>
                `;
                document.body.appendChild(modal);
                
                // Add close handler
                const closeButton = document.getElementById('youtube-modal-close');
                closeButton.addEventListener('click', () => {
                    this.closeVideo();
                });
                
                // Add click outside to close
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        this.closeVideo();
                    }
                });
            }
            
            // Set modal title and content
            document.getElementById('youtube-modal-title').textContent = title;
            document.getElementById('youtube-player-container').innerHTML = `
                <iframe 
                    width="100%" 
                    height="315" 
                    src="https://www.youtube.com/embed/${videoId}?autoplay=1" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
                </iframe>
            `;
            
            // Show modal
            modal.style.display = 'block';
            document.body.classList.add('modal-open');
        },
        
        // Close video modal
        closeVideo: function() {
            const modal = document.getElementById('youtube-modal');
            if (modal) {
                modal.style.display = 'none';
                document.getElementById('youtube-player-container').innerHTML = '';
                document.body.classList.remove('modal-open');
            }
        },
        
        // Handle errors
        handleError: function(message) {
            if (this.resultsContainer) {
                this.resultsContainer.innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-exclamation-circle"></i>
                        <p>${message}</p>
                    </div>
                `;
            }
            
            if (this.loadMoreButton) {
                this.loadMoreButton.style.display = 'none';
            }
            
            console.error(message);
        }
    };
    
    // Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        youtubeSearch.init();
    });
    
    // Make available globally
    window.youtubeSearch = youtubeSearch;
})();