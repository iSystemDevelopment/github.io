# iSystem Development

Welcome to the iSystem Development homepage repository. This website features a comprehensive support system with an FAQ section and an integrated chatbot powered by a VPS backend.

## Features

- **Responsive Design**: Mobile-friendly interface that works on all devices
- **FAQ Section**: Interactive accordion-style frequently asked questions
- **Support Chatbot**: Real-time chat support with VPS backend integration
- **Modern UI**: Clean and professional design with smooth animations

## Getting Started

### Viewing the Website

Simply open `index.html` in a web browser to view the website locally.

### Chatbot Backend Setup

The chatbot requires a VPS backend to provide intelligent responses. See [BACKEND_SETUP.md](BACKEND_SETUP.md) for detailed instructions on setting up the backend server.

#### Quick Backend Configuration

1. Set up your backend server (Node.js, Python, etc.)
2. Update the API endpoint in `chatbot.js`:
   ```javascript
   const CONFIG = {
       apiEndpoint: 'https://your-vps-server.com/api/chat',
       timeout: 30000,
       enableFallback: true
   };
   ```
3. Deploy your changes

### Fallback Mode

The chatbot includes a fallback mode that provides basic responses when the backend is unavailable, ensuring users always receive some assistance.

## File Structure

- `index.html` - Main website page with FAQ and chatbot widget
- `styles.css` - All styling for the website
- `chatbot.js` - Chatbot functionality with VPS backend integration
- `faq.js` - FAQ accordion functionality
- `config.example.js` - Example configuration file
- `BACKEND_SETUP.md` - Detailed backend setup guide

## Customization

### FAQ Content

Edit the FAQ items in `index.html` within the `.faq-section` to add or modify questions and answers.

### Chatbot Appearance

Modify `styles.css` to customize the chatbot colors, sizes, and positioning.

### Backend Integration

Update the `CONFIG` object in `chatbot.js` to point to your VPS backend endpoint.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

© 2024 iSystem Development. All rights reserved.
