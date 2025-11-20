// Configuration Example for Chatbot VPS Backend
// Copy this file to config.js and update with your actual values

const CONFIG = {
    // Your VPS backend API endpoint
    apiEndpoint: 'https://your-vps-server.com/api/chat',
    
    // API timeout in milliseconds
    timeout: 30000,
    
    // Enable fallback responses when backend is unavailable
    enableFallback: true,
    
    // Optional: API authentication token
    // apiToken: 'your-api-token-here',
    
    // Optional: Custom headers for API requests
    // customHeaders: {
    //     'X-API-Key': 'your-api-key',
    //     'X-Client-Id': 'your-client-id'
    // }
};

// Export for use in chatbot.js
// Note: Update chatbot.js to import this config if using ES6 modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
