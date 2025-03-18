const express = require('express');
const router = express.Router();
const conversationRoutes = require('./conversationRoutes');
const chatRoutes = require('./chatRoutes');

// API routes
router.use('/api/conversations', conversationRoutes);
router.use('/api/chat', chatRoutes);

module.exports = router; 