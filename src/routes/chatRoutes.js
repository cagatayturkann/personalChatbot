const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Process chat message
router.post('/', chatController.processChat);

module.exports = router; 