document.addEventListener('DOMContentLoaded', function() {
    const chatbotMessages = document.getElementById('chatbot-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    
    // API keys
    const OPENAI_API_KEY = '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';
    const YOUTUBE_API_KEY = 'AIzaSyCf2GcCRu0hrCgjho7Gfn6PIXtme4TnfNQ';
    
    // Ensure chatbot starts minimized/hidden
    const chatbotContainer = document.getElementById('chatbot-container');
    chatbotContainer.classList.add('minimized');
    
    // Add a welcome message (only shown when the chatbot is opened)
    addBotMessage("Hello! Welcome to Educare. How can I help you with your educational needs today?");
    
    // Handle send button click
    sendButton.addEventListener('click', sendMessage);
    
    // Handle Enter key press
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    function sendMessage() {
        const message = userInput.value.trim();
        if (message === '') return;
        
        addUserMessage(message);
        userInput.value = '';
        
        // Show typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'message bot-message';
        typingIndicator.id = 'typing-indicator';
        typingIndicator.textContent = '...';
        chatbotMessages.appendChild(typingIndicator);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        
        // First try to provide a hardcoded response
        const hardcodedResponse = getHardcodedResponse(message.toLowerCase());
        
        if (hardcodedResponse) {
            // Remove typing indicator after a short delay to simulate thinking
            setTimeout(() => {
                if (document.getElementById('typing-indicator')) {
                    document.getElementById('typing-indicator').remove();
                }
                addBotMessage(hardcodedResponse);
                
                // Add YouTube video suggestions for the topic
                fetchYouTubeVideos(message);
            }, 1000);
            } else {
            // Try to get AI response, fallback to generic response on error
            getAIResponse(message)
                .then(response => {
                    // Remove typing indicator
                    if (document.getElementById('typing-indicator')) {
                        document.getElementById('typing-indicator').remove();
                    }
                    addBotMessage(response);
                    
                    // Add YouTube video suggestions for the topic
                    fetchYouTubeVideos(message);
                })
                .catch(error => {
                    console.error('Error:', error);
                    if (document.getElementById('typing-indicator')) {
                        document.getElementById('typing-indicator').remove();
                    }
                    
                    // Enhanced fallback response with specific suggestions
                    const fallbackResponse = getFallbackResponse(message.toLowerCase());
                    addBotMessage(fallbackResponse);
                    
                    // Still try to fetch videos even if AI response fails
                    fetchYouTubeVideos(message);
                });
        }
    }
    
    function addUserMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'message user-message';
        messageElement.textContent = message;
        chatbotMessages.appendChild(messageElement);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
    
    function addBotMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'message bot-message';
        messageElement.textContent = message;
        chatbotMessages.appendChild(messageElement);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
    
    function addVideoSuggestions(videos) {
        const videoContainer = document.createElement('div');
        videoContainer.className = 'message bot-message';
        
        let videoHTML = '<div class="video-suggestion-section">';
        videoHTML += '<div class="video-suggestion-header"><i class="fas fa-video"></i> Educational Videos</div>';
        videoHTML += '<div class="video-cards-container">';
        
        videos.forEach(video => {
            videoHTML += `
                <div class="video-card">
                    <a href="https://www.youtube.com/watch?v=${video.id}" target="_blank">
                        <img src="${video.thumbnail}" alt="${video.title}">
                        <div class="video-info">
                            <h4>${video.title}</h4>
                            <p><i class="fas fa-user-circle"></i> ${video.channel}</p>
                        </div>
                    </a>
                </div>
            `;
        });
        
        videoHTML += '</div></div>';
        videoContainer.innerHTML = videoHTML;
        
        chatbotMessages.appendChild(videoContainer);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
    
    function getHardcodedResponse(query) {
        // Common educational topics with detailed, informative responses
        if (query.includes('python') || query.includes('programming')) {
            return "We have excellent programming courses available! Python is a great language to start with. Our Python fundamentals course covers variables, functions, loops, and data structures. For advanced learners, we offer courses on web development with Django, data science with NumPy and Pandas, and machine learning with scikit-learn.";
        } else if (query.includes('math') || query.includes('mathematics')) {
            return "Our mathematics courses cover topics from basic algebra to advanced calculus. We offer structured learning paths for each level including pre-algebra, algebra, geometry, trigonometry, pre-calculus, calculus, and statistics. Each course includes practice problems, quizzes, and visual explanations to help you master the concepts.";
        } else if (query.includes('science') || query.includes('physics') || query.includes('chemistry')) {
            return "We offer comprehensive science courses designed for all learning levels. Our interactive learning approach includes video lessons, practice exercises, and virtual experiments to help you understand scientific concepts deeply.";
        } else if (query.includes('history')) {
            return "Our history courses cover world history, specific civilizations, and important historical events. They include interactive timelines, primary source documents, documentary clips, and engaging narratives. We offer courses on ancient civilizations, medieval history, renaissance, industrial revolution, world wars, and modern global history.";
        } else if (query.includes('language') || query.includes('english')) {
            return "We offer language courses for beginners to advanced learners. Our language learning approach includes reading, writing, listening, and speaking practice. For English, we have courses on grammar, vocabulary, composition, literature, and business English. We also offer courses in Spanish, French, German, Mandarin, Japanese, and many more languages.";
        } else if (query.includes('help') || query.includes('assist')) {
            return "I can help you find educational resources, recommend courses, answer questions about specific subjects, or provide study tips. Our platform offers courses in mathematics, sciences, programming, languages, history, arts, and professional skills. Let me know which subject interests you, and I'll provide specific recommendations.";
        } else if (query.includes('data science')) {
            return "Our data science curriculum is comprehensive and industry-aligned. It includes courses on statistics, Python programming, data visualization, machine learning, deep learning, and big data technologies. You'll learn to use tools like Pandas, NumPy, Matplotlib, scikit-learn, TensorFlow, and SQL. Our project-based approach ensures you build a strong portfolio while learning.";
        } else if (query.includes('art') || query.includes('drawing')) {
            return "Our art courses cater to all skill levels from beginners to advanced artists. We offer courses in drawing fundamentals, painting (oil, acrylic, watercolor), digital art, animation, graphic design, and art history. Each course includes step-by-step demonstrations, feedback opportunities, and projects to build your portfolio.";
        }
        
        // Return null if no hardcoded response matches
        return null;
    }
    
    function getFallbackResponse(query) {
        // More detailed fallback responses based on query keywords
        if (query.includes('python') || query.includes('programming') || query.includes('code')) {
            return "I'd be happy to help with programming topics. Educare offers comprehensive programming courses covering Python, JavaScript, Java, C++, web development, and more. Each course includes coding exercises, projects, and certificates upon completion. Would you like me to suggest some specific programming resources?";
        } else if (query.includes('math') || query.includes('calculus') || query.includes('algebra')) {
            return "Our mathematics resources can help you master any math topic. We offer interactive lessons, practice problems, and video tutorials for algebra, geometry, calculus, statistics, and more. Would you like recommendations for a specific math topic?";
        } else if (query.includes('science') || query.includes('physics') || query.includes('chemistry') || query.includes('biology')) {
            return "At Educare, we believe in making science accessible and engaging for everyone. Our science courses use interactive methods and visual learning to help you grasp complex concepts. What specific area of science interests you?";
        } else if (query.includes('history') || query.includes('world') || query.includes('war') || query.includes('ancient')) {
            return "Our history courses bring the past to life through engaging narratives, primary sources, and multimedia content. We cover world history, American history, European history, ancient civilizations, and more. Which historical period interests you most?";
        } else if (query.includes('language') || query.includes('english') || query.includes('spanish') || query.includes('french')) {
            return "Language learning at Educare includes interactive exercises, conversation practice, and cultural insights. We offer courses in over 20 languages with beginner to advanced levels. Which language would you like to learn?";
        } else {
            return "I can help you find educational resources on that topic. Educare offers courses in mathematics, science, programming, languages, history, arts, business, and professional skills. Let me know which subject you're interested in, and I'll provide specific recommendations.";
        }
    }
    
    async function getAIResponse(prompt) {
        try {
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'HTTP-Referer': window.location.href,
                    'X-Title': document.title
                },
                body: JSON.stringify({
                    model: "openai/gpt-3.5-turbo",
                    messages: [
                        {
                            "role": "system",
                            "content": "You are a helpful assistant for the Educare educational platform. Provide detailed, informative responses about educational topics. Include specific course recommendations, learning resources, and practical advice when relevant."
                        },
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 200
                })
            });
            
            const data = await response.json();
            
            if (data.error) {
                console.error('API Error:', data.error);
                throw new Error(data.error.message || 'Error from API');
            }
            
            if (data.choices && data.choices[0] && data.choices[0].message) {
                return data.choices[0].message.content;
            } else {
                throw new Error('Invalid response structure');
            }
        } catch (error) {
            console.error('Error calling API:', error);
            throw error;
        }
    }

    async function fetchYouTubeVideos(query) {
        try {
            // Add educational focus to the query
            const educationalQuery = `${query} education tutorial`;
            
            // Fetch videos from YouTube API
            const response = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&q=${encodeURIComponent(educationalQuery)}&part=snippet&type=video&maxResults=3&videoEmbeddable=true&relevanceLanguage=en`);
            
            if (!response.ok) {
                throw new Error('YouTube API request failed');
            }
            
            const data = await response.json();
            
            if (data.items && data.items.length > 0) {
                const videos = data.items.map(item => ({
                    id: item.id.videoId,
                    title: item.snippet.title,
                    description: item.snippet.description,
                    thumbnail: item.snippet.thumbnails.medium.url,
                    channel: item.snippet.channelTitle
                }));
                
                addVideoSuggestions(videos);
            } else {
                console.log('No videos found');
            }
        } catch (error) {
            console.error('Error fetching YouTube videos:', error);
            // Show direct link as a fallback
            addBotMessage(`You can find educational videos on ${query} here: https://www.youtube.com/results?search_query=${encodeURIComponent(query)}+education+tutorial`);
        }
    }

    // Add chatbot toggle functionality
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotClose = document.getElementById('chatbot-close');

    chatbotToggle.addEventListener('click', function() {
        chatbotContainer.classList.toggle('minimized');
    });

    chatbotClose.addEventListener('click', function() {
        chatbotContainer.classList.add('minimized');
    });
});
