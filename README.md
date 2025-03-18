# Personal Chatbot

An intelligent chatbot application based on Gemini API, using the RAG (Retrieval Augmented Generation) model.

## Özellikler

- **Gemini API Integration**: Uses Google's Gemini AI model for modern and powerful AI responses
- **RAG (Retrieval Augmented Generation)**: Produces knowledge-based responses using vector database
- **Weaviate Vector Database**: Weaviate vector database integration for semantic search
- **Conversation History**: Stores all conversations in MongoDB and remembers past messages
- **Multi-language Support**: Ability to query in different languages thanks to integrated translator tool
- **Web Widget**: Ready-to-use chatbot widget for easy integration
- **Security**: CORS protection and origin/referrer control

## Getting Started

### Requirements

- Node.js 14.x or higher
- MongoDB
- Weaviate account and a collection
- Gemini API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/cagatayturkann/personalChatbot.git
cd personalChatbot
```

2. Install dependencies:
```bash
npm install
```

3. Configure the `.env` file:
```
GEMINI_API_KEY=your_gemini_api_key
OPENROUTER_API_KEY=your_openrouter_api_key
PORT=3000
SITE_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/chatbot
NODE_ENV=development
WEAVIATE_URL=your_weaviate_url
WEAVIATE_API_KEY=your_weaviate_api_key
```

4. Make sure MongoDB is running

5. Start the application:
```bash
npm run dev
```

## Proje Yapısı

```
personalChatbot/
├── src/
│   ├── config/           # Database and other configuration files
│   ├── controllers/      # Request handlers
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── services/         # Business logic services
│   └── server.js         # Main application file
├── public/               # Static files (HTML, CSS, JS)
├── .env                  # Environment variables
├── .gitignore            # Files to be ignored by Git
├── package.json          # Project dependencies
└── README.md             # Project documentation
```

## API Reference

### Chat API

- **POST /api/chat**
  - Sends a new message and receives an AI response
  - Request body: `{ "message": "string", "conversationId": "string" (optional) }`
  - Response: `{ "response": "string", "conversationId": "string" }`

### Konuşma API

- **GET /api/conversations**
  - Lists all conversations
  - Response: `[{ "_id": "string", "title": "string", "createdAt": "date" }]`

- **GET /api/conversations/:id**
  - Gets details of a specific conversation
  - Response: `{ "_id": "string", "title": "string", "messages": [{ "role": "string", "content": "string", "timestamp": "date" }] }`

- **DELETE /api/conversations/:id**
  - Deletes a conversation
  - Response: `{ "success": true }`

## Widget Integration

You can integrate the chatbot into your website by adding the widget code:

```html
<!-- ChaCha Chatbot Widget -->
<script>
(function() {
  // Widget kodu buraya gelecek
})();
</script>
```

Visit the `/iframe` endpoint to get the widget code.

## Vector Database

This project uses Weaviate vector database. For usage:

1. Create a Weaviate account
2. Create a collection named "Questions"
3. Add data in each item with this structure: `{ "question": "string", "answer": "string" }`

## Development

### Services Description

- **aiService**: Interacts with Gemini API and generates AI responses
- **vectorService**: Creates vector embeddings and retrieves information from Weaviate
- **conversationService**: Manages conversations (creation, updating, deletion)

### Controllers Description

- **chatController**: Processes user messages and returns AI responses
- **conversationController**: Performs conversation management operations
- **agentController**: Provides auxiliary functions such as translation

## Contributing

1. Fork this repo
2. Create a new branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push your branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## Contact

Project link: [https://github.com/cagatayturkann/personalChatbot](https://github.com/cagatayturkann/personalChatbot)