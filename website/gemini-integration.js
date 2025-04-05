const GEMINI_API_KEY = 'AIzaSyDPwmlEXSk6iX5SGjlmbQVrTsgGH7M2fMk';

// The exact URL from the curl command
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

async function askGemini(userQuestion) {
    const requestBody = {
        contents: [{
            parts: [{
                text: userQuestion
            }]
        }]
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// Example usage:
askGemini("Explain how AI works")
    .then(response => {
        console.log('Gemini Response:', response);
    })
    .catch(error => {
        console.error('Error:', error);
    });

// Add all your Gemini API integration code here