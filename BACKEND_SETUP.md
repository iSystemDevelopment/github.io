# ChatBot VPS Backend Setup Guide

This guide explains how to set up and integrate the VPS backend for the support chatbot.

## Overview

The chatbot on the iSystem Development website communicates with a VPS backend server to provide intelligent responses to user queries. The backend should be a REST API that receives chat messages and returns appropriate responses.

## Backend API Requirements

### Endpoint

The backend should expose a POST endpoint at `/api/chat` (or any path you configure).

### Request Format

```json
{
  "message": "User's message text",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "sessionId": "session-1234567890-abc123"
}
```

### Response Format

```json
{
  "response": "Bot's response text"
}
```

### Optional: Extended Response Format

```json
{
  "response": "Bot's response text",
  "suggestions": ["Suggestion 1", "Suggestion 2"],
  "metadata": {
    "confidence": 0.95,
    "intent": "support_request"
  }
}
```

## Backend Implementation Examples

### Node.js/Express Example

```javascript
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const { message, sessionId, timestamp } = req.body;
  
  // Process message with your AI/logic
  const response = await processMessage(message, sessionId);
  
  res.json({ response });
});

async function processMessage(message, sessionId) {
  // Implement your chatbot logic here
  // This could integrate with OpenAI, DialogFlow, or custom NLP
  
  // Example: Simple keyword matching
  if (message.toLowerCase().includes('support')) {
    return 'I can help you with support. What specific issue are you facing?';
  }
  
  return 'Thank you for your message. How can I assist you further?';
}

app.listen(3000, () => {
  console.log('Chatbot backend running on port 3000');
});
```

### Python/Flask Example

```python
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json()
    message = data.get('message')
    session_id = data.get('sessionId')
    
    # Process message with your AI/logic
    response = process_message(message, session_id)
    
    return jsonify({'response': response})

def process_message(message, session_id):
    # Implement your chatbot logic here
    # This could integrate with OpenAI, DialogFlow, or custom NLP
    
    # Example: Simple keyword matching
    if 'support' in message.lower():
        return 'I can help you with support. What specific issue are you facing?'
    
    return 'Thank you for your message. How can I assist you further?'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)
```

## Configuration

### Update Frontend Configuration

Edit the `chatbot.js` file and update the `CONFIG` object:

```javascript
const CONFIG = {
    apiEndpoint: 'https://your-vps-server.com/api/chat',
    timeout: 30000,
    enableFallback: true
};
```

### Environment Variables (Backend)

Set these environment variables on your VPS:

```bash
# .env file
PORT=3000
NODE_ENV=production
ALLOWED_ORIGINS=https://isystemdevelopment.github.io
API_KEY=your-secret-api-key
```

## Security Considerations

### CORS Configuration

Ensure your backend only accepts requests from your domain:

```javascript
// Node.js example
const cors = require('cors');
app.use(cors({
  origin: 'https://isystemdevelopment.github.io',
  methods: ['POST'],
  credentials: true
}));
```

### Rate Limiting

Implement rate limiting to prevent abuse:

```javascript
// Node.js example
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/chat', limiter);
```

### Authentication (Optional)

Add API key authentication:

```javascript
// Node.js example
app.use((req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});
```

## Deployment

### VPS Setup

1. **SSH into your VPS:**
   ```bash
   ssh user@your-vps-server.com
   ```

2. **Install dependencies:**
   ```bash
   # For Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # For Python
   sudo apt-get update
   sudo apt-get install -y python3 python3-pip
   ```

3. **Clone your backend repository:**
   ```bash
   git clone https://github.com/yourusername/chatbot-backend.git
   cd chatbot-backend
   ```

4. **Install application dependencies:**
   ```bash
   # For Node.js
   npm install
   
   # For Python
   pip3 install -r requirements.txt
   ```

5. **Set up a process manager:**
   ```bash
   # PM2 for Node.js
   sudo npm install -g pm2
   pm2 start server.js --name chatbot-backend
   pm2 startup
   pm2 save
   
   # Or systemd for Python
   sudo systemctl enable chatbot-backend
   sudo systemctl start chatbot-backend
   ```

6. **Configure Nginx as reverse proxy:**
   ```nginx
   server {
       listen 80;
       server_name your-vps-server.com;
       
       location /api/chat {
           proxy_pass http://localhost:3000/api/chat;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

7. **Set up SSL with Let's Encrypt:**
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-vps-server.com
   ```

## Testing

### Test the Backend

```bash
# Test locally
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello","sessionId":"test-123","timestamp":"2024-01-01T12:00:00.000Z"}'

# Test on VPS
curl -X POST https://your-vps-server.com/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello","sessionId":"test-123","timestamp":"2024-01-01T12:00:00.000Z"}'
```

### Test the Frontend Integration

1. Open the website in a browser
2. Click the chatbot button
3. Send a test message
4. Verify the response appears

## Monitoring

### Log Files

Monitor your backend logs:

```bash
# PM2 logs
pm2 logs chatbot-backend

# System logs
sudo journalctl -u chatbot-backend -f
```

### Health Check Endpoint

Add a health check endpoint:

```javascript
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
```

## Troubleshooting

### Common Issues

1. **CORS errors**: Verify CORS configuration on backend
2. **Timeout errors**: Increase timeout in CONFIG or optimize backend response time
3. **Connection refused**: Check firewall rules and ensure backend is running
4. **SSL errors**: Verify SSL certificate is valid

### Fallback Mode

The chatbot includes a fallback mode that provides basic responses when the backend is unavailable. This ensures users always get some response even if the backend is down.

## AI Integration Options

### OpenAI Integration

```javascript
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function processMessage(message, sessionId) {
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: message }]
  });
  
  return completion.choices[0].message.content;
}
```

### DialogFlow Integration

```javascript
const dialogflow = require('@google-cloud/dialogflow');
const sessionClient = new dialogflow.SessionsClient();

async function processMessage(message, sessionId) {
  const sessionPath = sessionClient.projectAgentSessionPath(
    'your-project-id',
    sessionId
  );
  
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: message,
        languageCode: 'en-US',
      },
    },
  };
  
  const responses = await sessionClient.detectIntent(request);
  return responses[0].queryResult.fulfillmentText;
}
```

## Support

For issues or questions about the chatbot integration, please contact the development team or create an issue in the repository.
