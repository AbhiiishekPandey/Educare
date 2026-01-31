// YouTube API Key - Replace with your own API key
const API_KEY = 'AIzaSyBnCa4S2icepyf7pJKhAiMpFQHu8LQemAU';

// Predefined search queries for categories
const CATEGORY_QUERIES = {
    motivational: [
        'motivational songs 2024',
        'inspirational music playlist',
        'best motivational songs',
        'success motivation music'
    ],
    interview: [
        'famous person interviews',
        'celebrity interviews 2024',
        'successful people interviews',
        'inspirational interviews'
    ],
    podcast: [
        'best educational podcasts',
        'student success podcasts',
        'learning podcasts 2024',
        'educational podcasts'
    ]
};

// Keywords to filter out vulgar content
const FILTERED_KEYWORDS = [
    'explicit', 'explicit lyrics', 'explicit version', 
    'uncensored', 'censored', 'clean version',
    'adult', 'mature', 'parental advisory'
];

// Timer variables
let timerInterval;
let timeLeft = 0;
let timerActive = false;

// Function to stop all music playback
function stopAllMusic() {
    try {
        // Stop any playing YouTube videos
        const iframes = document.querySelectorAll('iframe');
        iframes.forEach(iframe => {
            if (iframe.src.includes('youtube.com/embed')) {
                try {
                    // Use a safer approach to stop the video
                    iframe.src = iframe.src.replace('autoplay=1', 'autoplay=0');
                } catch (e) {
                    console.error('Error stopping iframe:', e);
                }
            }
        });

        // Stop any audio elements
        const audioElements = document.querySelectorAll('audio');
        audioElements.forEach(audio => {
            try {
                audio.pause();
                audio.currentTime = 0;
            } catch (e) {
                console.error('Error stopping audio:', e);
            }
        });

        // Clear any active media sessions
        if ('mediaSession' in navigator) {
            try {
                navigator.mediaSession.playbackState = 'none';
            } catch (e) {
                console.error('Error clearing media session:', e);
            }
        }
    } catch (e) {
        console.error('Error in stopAllMusic:', e);
    }
}

// Function to set timer
function setTimer(minutes) {
    if (timerActive) {
        stopTimer();
    }
    timeLeft = minutes * 60;
    updateTimerDisplay();
    document.getElementById('startTimerBtn').disabled = false;
    document.getElementById('stopTimerBtn').disabled = true;
    
    // Start timer automatically
    startTimer();
    
    // Collapse timer controls after a short delay
    setTimeout(() => {
        const timerSection = document.querySelector('.timer-section');
        if (timerSection.classList.contains('expanded')) {
            timerSection.classList.remove('expanded');
        }
    }, 500);
}

// Function to start timer
function startTimer() {
    if (!timerActive && timeLeft > 0) {
        timerActive = true;
        document.getElementById('startTimerBtn').disabled = true;
        document.getElementById('stopTimerBtn').disabled = false;
        
        // Add active state to timer logo
        const timerLogo = document.querySelector('.timer-logo');
        timerLogo.classList.add('active');
        
        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            
            if (timeLeft <= 0) {
                stopTimer();
                showNotification();
                // Remove active state from timer logo
                timerLogo.classList.remove('active');
            }
        }, 1000);
    }
}

// Function to stop timer
function stopTimer() {
    if (timerActive) {
        clearInterval(timerInterval);
        timerActive = false;
        document.getElementById('startTimerBtn').disabled = false;
        document.getElementById('stopTimerBtn').disabled = true;
        
        // Remove active state from timer logo
        const timerLogo = document.querySelector('.timer-logo');
        timerLogo.classList.remove('active');
    }
}

// Function to update timer display
function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    const minutesDisplay = minutes.toString().padStart(2, '0');
    const secondsDisplay = seconds.toString().padStart(2, '0');
    
    const display = `${minutesDisplay}:${secondsDisplay}`;
    document.getElementById('timerDisplay').textContent = display;
}

// Function to show notification
function showNotification() {
    // Stop all music when timer expires
    stopAllMusic();

    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-bell"></i>
            <p>Time's up! Music playback has been stopped. Take a break from the screen.</p>
            <button onclick="dismissNotification(this)">Dismiss</button>
        </div>
    `;
    document.body.appendChild(notification);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            dismissNotification(notification.querySelector('button'));
        }
        
        // Redirect to home page after notification is dismissed
        redirectToHome();
    }, 5000);
}

// Function to redirect to home page
function redirectToHome() {
    // Clear search results
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';
    
    // Reset search input
    const searchInput = document.getElementById('searchInput');
    searchInput.value = '';
    
    // Update results count
    const resultsCount = document.getElementById('resultsCount');
    resultsCount.textContent = '';
    
    // Scroll to top of page
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    
    // Add a visual effect to indicate redirection
    document.body.classList.add('redirecting');
    setTimeout(() => {
        document.body.classList.remove('redirecting');
    }, 1000);
}

// Function to dismiss notification
function dismissNotification(button) {
    const notification = button.closest('.notification');
    if (notification) {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }
}

// Function to search by category
async function searchCategory(category) {
    const queries = CATEGORY_QUERIES[category];
    const randomQuery = queries[Math.floor(Math.random() * queries.length)];
    
    const searchInput = document.getElementById('searchInput');
    searchInput.value = randomQuery;
    
    await searchYouTube();
}

// Function to search YouTube
async function searchYouTube() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();
    
    if (!query) {
        alert('Please enter a search term');
        return;
    }

    const resultsContainer = document.getElementById('results');
    const resultsCount = document.getElementById('resultsCount');
    
    // Show loading state
    resultsContainer.innerHTML = `
        <div class="loading">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Searching for results...</p>
        </div>
    `;
    resultsCount.textContent = '';

    try {
        // Check if API key is valid
        if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
            throw new Error('Invalid YouTube API key. Please check your configuration.');
        }

        // Construct the API URL with proper parameters
        const apiUrl = new URL('https://www.googleapis.com/youtube/v3/search');
        apiUrl.searchParams.append('part', 'snippet');
        apiUrl.searchParams.append('q', query);
        apiUrl.searchParams.append('type', 'video');
        apiUrl.searchParams.append('key', API_KEY);
        apiUrl.searchParams.append('maxResults', '20');
        apiUrl.searchParams.append('safeSearch', 'strict');
        apiUrl.searchParams.append('videoCategoryId', '10');
        apiUrl.searchParams.append('regionCode', 'US');

        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message || 'Error fetching results from YouTube');
        }

        if (!data.items || !Array.isArray(data.items)) {
            throw new Error('Invalid response format from YouTube API');
        }

        // Filter out results with vulgar content
        const filteredItems = filterVulgarContent(data.items);
        
        if (filteredItems.length === 0) {
            resultsContainer.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <p>No family-friendly results found. Try a different search term.</p>
                </div>
            `;
            resultsCount.textContent = '0 results found';
            return;
        }

        displayResults(filteredItems);
        resultsCount.textContent = `${filteredItems.length} results found`;
    } catch (error) {
        console.error('Search error:', error);
        resultsContainer.innerHTML = `
            <div class="error">
                <i class="fas fa-exclamation-circle"></i>
                <p>Error: ${error.message}</p>
                <p>Please try again later or check your API key configuration.</p>
            </div>
        `;
        resultsCount.textContent = '';
    }
}

// Function to filter out vulgar content
function filterVulgarContent(items) {
    return items.filter(item => {
        const title = item.snippet.title.toLowerCase();
        const description = item.snippet.description.toLowerCase();
        
        // Check if title or description contains filtered keywords
        for (const keyword of FILTERED_KEYWORDS) {
            if (title.includes(keyword) || description.includes(keyword)) {
                return false;
            }
        }
        
        return true;
    });
}

// Function to display search results
function displayResults(items) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    if (items.length === 0) {
        resultsContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <p>No family-friendly results found. Try a different search term.</p>
            </div>
        `;
        return;
    }

    // Automatically play the first video
    if (items[0] && items[0].id && items[0].id.videoId) {
        playVideo(new Event('click'), items[0].id.videoId);
    }

    items.forEach(item => {
        try {
            const videoId = item.id.videoId;
            const title = item.snippet.title;
            const thumbnail = item.snippet.thumbnails.medium.url;
            const channelTitle = item.snippet.channelTitle;
            const publishedAt = new Date(item.snippet.publishedAt).toLocaleDateString();

            const resultElement = document.createElement('div');
            resultElement.className = 'result-item';
            resultElement.innerHTML = `
                <img src="${thumbnail}" alt="${title}" onerror="this.src='https://via.placeholder.com/320x180?text=No+Thumbnail'">
                <div class="result-info">
                    <h3>${title}</h3>
                    <p><i class="fas fa-user"></i> ${channelTitle}</p>
                    <p><i class="fas fa-calendar"></i> ${publishedAt}</p>
                    <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank" onclick="playVideo(event, '${videoId}')">
                        <i class="fas fa-play"></i> Watch Video
                    </a>
                </div>
            `;
            resultsContainer.appendChild(resultElement);
        } catch (e) {
            console.error('Error displaying result item:', e);
        }
    });
}

// Function to play video
function playVideo(event, videoId) {
    event.preventDefault();
    
    try {
        // First stop any currently playing music/videos
        stopAllMusic();
        
        // Remove any existing video containers first
        const existingContainers = document.querySelectorAll('.video-container');
        existingContainers.forEach(container => {
            // Add a fade-out effect before removing
            container.style.opacity = '0';
            container.style.transform = 'translateY(-20px)';
            setTimeout(() => container.remove(), 300);
        });
        
        // Wait a brief moment for the fade-out to complete
        setTimeout(() => {
            // Create a new iframe for the video
            const iframe = document.createElement('iframe');
            iframe.width = '100%';
            iframe.height = '315';
            iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
            iframe.frameBorder = '0';
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            iframe.allowFullscreen = true;
            
            // Add error handling for the iframe
            iframe.onerror = function() {
                console.error('Error loading video iframe');
                this.parentNode.removeChild(this);
            };
            
            // Create a container for the video
            const videoContainer = document.createElement('div');
            videoContainer.className = 'video-container';
            videoContainer.style.opacity = '0'; // Start invisible for fade-in
            videoContainer.appendChild(iframe);
            
            // Add a close button
            const closeButton = document.createElement('button');
            closeButton.className = 'close-video';
            closeButton.innerHTML = '<i class="fas fa-times"></i>';
            closeButton.onclick = function() {
                videoContainer.style.opacity = '0';
                videoContainer.style.transform = 'translateY(-20px)';
                setTimeout(() => videoContainer.remove(), 300);
            };
            videoContainer.appendChild(closeButton);
            
            // Find the main content area
            const mainContent = document.querySelector('main');
            
            // Insert the video container at the top of the main content
            if (mainContent) {
                mainContent.insertBefore(videoContainer, mainContent.firstChild);
            } else {
                // Fallback if main content is not found
                document.body.appendChild(videoContainer);
            }
            
            // Trigger fade-in effect
            setTimeout(() => {
                videoContainer.style.opacity = '1';
                videoContainer.style.transform = 'translateY(0)';
                // Scroll to the video with a smooth animation
                videoContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 50);
            
        }, 300); // Wait for previous video fade-out
        
    } catch (e) {
        console.error('Error playing video:', e);
        alert('There was an error playing the video. Please try again.');
    }
}

// Add event listener for Enter key
document.getElementById('searchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchYouTube();
    }
});

// Add event listener for search button
document.addEventListener('DOMContentLoaded', function() {
    // Get the search button
    const searchButton = document.querySelector('.search-container button');
    
    // Add click event listener to the search button
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            searchYouTube();
        });
    }
    
    // Initialize the app
    console.log('Music app initialized');
});

function setCustomTimer() {
    const customMinutes = document.getElementById('customMinutes').value;
    if (customMinutes && !isNaN(customMinutes) && customMinutes > 0 && customMinutes <= 120) {
        setTimer(parseInt(customMinutes));
    } else {
        alert('Please enter a valid time between 1 and 120 minutes');
    }
}

function resetTimer() {
    stopTimer();
    timeLeft = 0;
    updateTimerDisplay();
    document.getElementById('startTimerBtn').disabled = false;
    document.getElementById('stopTimerBtn').disabled = true;
}

function toggleTimerControls() {
    const timerSection = document.querySelector('.timer-section');
    timerSection.classList.toggle('expanded');
    
    // Add a subtle animation effect
    if (timerSection.classList.contains('expanded')) {
        timerSection.style.transform = 'scale(1.02)';
        setTimeout(() => {
            timerSection.style.transform = 'scale(1)';
        }, 200);
    }
} 