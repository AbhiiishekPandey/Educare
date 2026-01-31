// Topic Explorer functionality
document.addEventListener('DOMContentLoaded', function() {
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotContainer = document.getElementById('chatbot-container');
    const chatbotClose = document.getElementById('chatbot-close');
    const topicInput = document.getElementById('topicInput');
    const responseDiv = document.getElementById('response');
    const videosDiv = document.getElementById('videos');

    // Ensure chatbot starts hidden
    if (chatbotContainer) {
        chatbotContainer.classList.add('hidden');
    }

    // Toggle chatbot visibility
    chatbotToggle.addEventListener('click', function() {
        chatbotContainer.classList.toggle('hidden');
    });

    // Close chatbot
    chatbotClose.addEventListener('click', function() {
        chatbotContainer.classList.add('hidden');
    });

    // Handle Enter key press
    topicInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            getTopicDetails();
        }
    });
});

async function getTopicDetails() {
    const topicInput = document.getElementById('topicInput');
    const responseDiv = document.getElementById('response');
    const videosDiv = document.getElementById('videos');
    const topic = topicInput.value.trim();

    if (!topic) return;

    // Show loading state
    responseDiv.innerHTML = '<div class="loading">Searching for information...</div>';
    videosDiv.innerHTML = '';

    try {
        // Get topic information from OpenAI
        const topicInfo = await getTopicInformation(topic);
        responseDiv.innerHTML = formatTopicResponse(topicInfo);

        // Get related videos
        const videos = await searchYouTubeVideos(topic);
        displayVideos(videos);
    } catch (error) {
        console.error('Error:', error);
        responseDiv.innerHTML = '<div class="error">Sorry, there was an error processing your request. Please try again.</div>';
    }
}

async function getTopicInformation(topic) {
    const OPENAI_API_KEY = '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';
    
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{
                    role: "user",
                    content: `Provide a comprehensive overview of ${topic}. Include key concepts, importance, and applications. Format the response with clear sections and bullet points.`
                }],
                temperature: 0.7,
                max_tokens: 500
            })
        });

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        throw error;
    }
}

function formatTopicResponse(text) {
    // Convert markdown-like formatting to HTML
    let html = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
        .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
        .replace(/\n/g, '<br>') // Line breaks
        .replace(/- (.*?)(?:\n|$)/g, '<li>$1</li>'); // Bullet points

    // Wrap bullet points in a list
    html = html.replace(/<li>.*?<\/li>/g, '<ul>$&</ul>');

    return `<div class="topic-response">${html}</div>`;
}

async function searchYouTubeVideos(topic) {
    const YOUTUBE_API_KEY = 'AIzaSyAJKPjVQw81AWVypg8QMw2Prhhj_RV3x5w';
    const searchQuery = `${topic} tutorial`;
    
    try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchQuery)}&type=video&maxResults=5&key=${YOUTUBE_API_KEY}`);
        const data = await response.json();
        return data.items;
    } catch (error) {
        console.error('Error searching YouTube:', error);
        throw error;
    }
}

function displayVideos(videos) {
    const videosDiv = document.getElementById('videos');
    videosDiv.innerHTML = '';

    videos.forEach(video => {
        const videoCard = document.createElement('div');
        videoCard.className = 'video-card';
        videoCard.innerHTML = `
            <a href="https://www.youtube.com/watch?v=${video.id.videoId}" target="_blank">
                <img src="${video.snippet.thumbnails.medium.url}" alt="${video.snippet.title}">
                <h3>${video.snippet.title}</h3>
                <p>${video.snippet.channelTitle}</p>
            </a>
        `;
        videosDiv.appendChild(videoCard);
    });
} 