// Chatbot Functionality with VPS Backend Integration
(function() {
    'use strict';

    // Configuration for VPS backend
    const CONFIG = {
        // VPS backend endpoint - Update this with your actual VPS API endpoint
        apiEndpoint: 'https://your-vps-server.com/api/chat',
        // Alternative: Can use environment-specific endpoints
        // apiEndpoint: window.location.hostname === 'localhost' 
        //     ? 'http://localhost:3000/api/chat' 
        //     : 'https://your-vps-server.com/api/chat',
        
        // API timeout in milliseconds
        timeout: 30000,
        
        // Enable fallback responses if backend is unavailable
        enableFallback: true
    };

    // Fallback responses for when backend is unavailable
    const FALLBACK_RESPONSES = {
        greeting: "Hello! I'm the iSystem Development support bot. How can I help you today?",
        support: "For immediate assistance, please email us at support@isystem.dev or check our FAQ section above.",
        hours: "Our business hours are Monday to Friday, 9:00 AM to 6:00 PM (EST).",
        services: "We provide custom software development, cloud solutions, infrastructure management, and technical consulting.",
        contact: "You can reach us at support@isystem.dev or use this chat for immediate assistance.",
        default: "I understand your question. For detailed information, please check our FAQ section or contact our support team at support@isystem.dev."
    };

    // DOM elements
    let chatbotButton, chatbotWindow, chatbotClose, chatbotMessages, chatbotInput, chatbotSend;

    // Initialize chatbot when DOM is ready
    document.addEventListener('DOMContentLoaded', initChatbot);

    function initChatbot() {
        // Get DOM elements
        chatbotButton = document.getElementById('chatbot-button');
        chatbotWindow = document.getElementById('chatbot-window');
        chatbotClose = document.getElementById('chatbot-close');
        chatbotMessages = document.getElementById('chatbot-messages');
        chatbotInput = document.getElementById('chatbot-input');
        chatbotSend = document.getElementById('chatbot-send');

        // Event listeners
        chatbotButton.addEventListener('click', toggleChatbot);
        chatbotClose.addEventListener('click', toggleChatbot);
        chatbotSend.addEventListener('click', sendMessage);
        chatbotInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    function toggleChatbot() {
        const isVisible = chatbotWindow.style.display === 'flex';
        chatbotWindow.style.display = isVisible ? 'none' : 'flex';
        
        if (!isVisible) {
            chatbotInput.focus();
        }
    }

    function sendMessage() {
        const message = chatbotInput.value.trim();
        
        if (!message) {
            return;
        }

        // Display user message
        addMessage(message, 'user');
        chatbotInput.value = '';

        // Show typing indicator
        showTypingIndicator();

        // Send message to backend
        sendToBackend(message);
    }

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const messageParagraph = document.createElement('p');
        messageParagraph.textContent = text;
        
        messageDiv.appendChild(messageParagraph);
        chatbotMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message';
        typingDiv.id = 'typing-indicator';
        
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        typingIndicator.innerHTML = '<span></span><span></span><span></span>';
        
        typingDiv.appendChild(typingIndicator);
        chatbotMessages.appendChild(typingDiv);
        
        // Scroll to bottom
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    async function sendToBackend(message) {
        try {
            // Create abort controller for timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), CONFIG.timeout);

            const response = await fetch(CONFIG.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    timestamp: new Date().toISOString(),
                    sessionId: getSessionId()
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            removeTypingIndicator();
            
            // Display bot response
            if (data.response) {
                addMessage(data.response, 'bot');
            } else {
                throw new Error('Invalid response format');
            }

        } catch (error) {
            console.error('Error communicating with backend:', error);
            
            removeTypingIndicator();
            
            // Use fallback response if enabled
            if (CONFIG.enableFallback) {
                const fallbackResponse = getFallbackResponse(message);
                addMessage(fallbackResponse, 'bot');
            } else {
                addMessage('Sorry, I\'m having trouble connecting to the server. Please try again later or contact support@isystem.dev.', 'bot');
            }
        }
    }

    function getFallbackResponse(message) {
        const lowerMessage = message.toLowerCase();

        if (lowerMessage.match(/hello|hi|hey|greetings/)) {
            return FALLBACK_RESPONSES.greeting;
        }
        
        if (lowerMessage.match(/support|help|assistance/)) {
            return FALLBACK_RESPONSES.support;
        }
        
        if (lowerMessage.match(/hours|time|when|available/)) {
            return FALLBACK_RESPONSES.hours;
        }
        
        if (lowerMessage.match(/service|what do you|what can/)) {
            return FALLBACK_RESPONSES.services;
        }
        
        if (lowerMessage.match(/contact|email|phone|reach/)) {
            return FALLBACK_RESPONSES.contact;
        }

        return FALLBACK_RESPONSES.default;
    }

    function getSessionId() {
        // Get or create session ID for conversation tracking
        let sessionId = sessionStorage.getItem('chatbot-session-id');
        
        if (!sessionId) {
            sessionId = 'session-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('chatbot-session-id', sessionId);
        }
        
        return sessionId;
    }

    // Public API (if needed)
    window.ChatBot = {
        open: function() {
            chatbotWindow.style.display = 'flex';
        },
        close: function() {
            chatbotWindow.style.display = 'none';
        },
        sendMessage: function(message) {
            chatbotInput.value = message;
            sendMessage();
        }
    };
})();
