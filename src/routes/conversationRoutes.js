const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversationController');

// Get all conversations
router.get('/', conversationController.getAllConversations);

// Create a new conversation
router.post('/', conversationController.createConversation);

// Get a conversation by ID
router.get('/:id', conversationController.getConversationById);

// Get messages from a conversation
router.get('/:id/messages', conversationController.getConversationMessages);

// Delete a conversation
router.delete('/:id', conversationController.deleteConversation);

module.exports = router; 