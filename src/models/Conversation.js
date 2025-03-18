const mongoose = require('mongoose');

// Message schema - Used embedded within Conversation
const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Conversation schema
const conversationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true // Marked as required since we assign a value in the service
  },
  messages: [messageSchema], // Array of messages
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { versionKey: false }); // Disable versionKey

// Update updatedAt field when a message is added
conversationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Update title when the first message is added
  if (this.isModified('messages') && this.messages.length > 0 && this.title === 'New Conversation') {
    // Use the first user message as title (maximum 30 characters)
    const userMessages = this.messages.filter(msg => msg.role === 'user');
    if (userMessages.length > 0) {
      const firstUserMessage = userMessages[0].content;
      this.title = firstUserMessage.length > 30 
        ? firstUserMessage.substring(0, 30) + '...' 
        : firstUserMessage;
    }
  }
  
  next();
});

module.exports = mongoose.model('Conversation', conversationSchema); 