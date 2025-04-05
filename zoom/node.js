// Node.js backend (Express) - save as server.js
const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const app = express();
require('dotenv').config();

app.use(express.json());

// Zoom API credentials from environment variables
const ZOOM_API_KEY = process.env.ZOOM_API_KEY;
const ZOOM_API_SECRET = process.env.ZOOM_API_SECRET;

// Generate Zoom JWT token
function generateZoomToken() {
    const payload = {
        iss: ZOOM_API_KEY,
        exp: ((new Date()).getTime() + 5000)
    };
    return jwt.sign(payload, ZOOM_API_SECRET);
}

// Create Zoom meeting
app.post('/api/create-zoom-meeting', async (req, res) => {
    try {
        const { topic, start_time, duration = 60, type = 1 } = req.body;
        
        const token = generateZoomToken();
        const response = await axios.post('https://api.zoom.us/v2/users/me/meetings', {
            topic: topic || ' Meeting',
            type: type, // 1 = instant, 2 = scheduled, 3 = recurring, 8 = recurring no fixed time
            start_time: type === 2 ? start_time : undefined,
            duration,
            settings: {
                host_video: true,
                participant_video: true,
                join_before_host: false,
                mute_upon_entry: false,
                watermark: true,
                use_pmi: false,
                approval_type: 0
            }
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        res.json({
            id: response.data.id,
            topic: response.data.topic,
            start_time: response.data.start_time,
            duration: response.data.duration,
            join_url: response.data.join_url,
            password: response.data.password
        });
    } catch (error) {
        console.error('Zoom API error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to create Zoom meeting' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));