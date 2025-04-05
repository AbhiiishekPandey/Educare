require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const axios = require('axios');
const path = require('path');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('website'));

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Routes
app.post('/api/chat', async (req, res) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const chat = model.startChat();
        const result = await chat.sendMessage(req.body.message);
        const response = await result.response;
        
        res.json({ reply: response.text() });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while processing your request' });
    }
});

app.post('/api/translate', async (req, res) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `Translate the following text from ${req.body.fromLanguage} to ${req.body.toLanguage}: ${req.body.text}`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        
        res.json({ translation: response.text() });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while processing your request' });
    }
});

app.post('/api/summarize-pdf', upload.single('pdf'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No PDF file uploaded' });
        }

        const dataBuffer = await fs.promises.readFile(req.file.path);
        const data = await pdfParse(dataBuffer);
        const text = data.text;

        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-3.5-turbo",
            messages: [{ 
                role: "user", 
                content: `Please provide a concise summary of the following text:\n\n${text}` 
            }],
            temperature: 0.7,
            max_tokens: 500
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        // Clean up uploaded file
        await fs.promises.unlink(req.file.path);

        res.json(response.data);
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to process PDF' });
    }
});

// Create uploads directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 
const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }

    const extname = path.extname(filePath);
    let contentType = 'text/html';
    
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
    }

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if(error.code === 'ENOENT') {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(500);
                res.end('Server Error: ' + error.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

const PORT = 8080;
server.listen(PORT, '127.0.0.1', () => {
    console.log(`Server running at http://127.0.0.1:${PORT}/`);
    console.log('Press Ctrl+C to stop the server');
}); 