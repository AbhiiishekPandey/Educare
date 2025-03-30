# Educare - Smart Learning Platform

A comprehensive educational platform with AI-powered features for learning and homework assistance.

## Features

- Smart Homework Assistant
- Study Planner
- Content Summarizer
- Quiz Generator
- Translator
- Speech to Text

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/yourusername/educare.git
cd educare
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your OpenAI API key:
```
OPENAI_API_KEY=your_api_key_here
```

4. Start the server:
```bash
node server.js
```

5. Open your browser and navigate to:
```
http://localhost:3000
```

## Environment Variables

The following environment variables are required:

- `OPENAI_API_KEY`: Your OpenAI API key
- `PORT`: (Optional) Port number for the server (default: 3000)

## Security Note

Never commit your `.env` file or expose your API keys. The `.env` file is already included in `.gitignore` to prevent accidental commits.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 