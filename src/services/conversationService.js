const Conversation = require('../models/Conversation');

/**
 * Creates a new conversation
 * @param {String} title - Conversation title (optional)
 * @returns {Promise<Object>} - Created conversation
 */
const createConversation = async (title = null) => {
  try {
    // Assign default value if title is null
    const conversationTitle = title || 'New Conversation';
    
    const conversation = new Conversation({
      title: conversationTitle,
      messages: []
    });
    
    await conversation.save();
    return conversation;
  } catch (error) {
    console.error('Error creating conversation:', error);
    throw error;
  }
};

/**
 * Gets a conversation by ID
 * @param {String} conversationId - Conversation ID
 * @returns {Promise<Object>} - Found conversation
 */
const getConversationById = async (conversationId) => {
  try {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }
    return conversation;
  } catch (error) {
    console.error('Error getting conversation:', error);
    throw error;
  }
};

/**
 * Gets all conversations
 * @returns {Promise<Array>} - Array of conversations
 */
const getAllConversations = async () => {
  try {
    const conversations = await Conversation.find()
      .sort({ updatedAt: -1 });
    return conversations;
  } catch (error) {
    console.error('Error getting all conversations:', error);
    throw error;
  }
};

/**
 * Gets the last messages of a conversation up to a limit
 * @param {String} conversationId - Conversation ID
 * @param {Number} limit - Maximum number of messages to retrieve
 * @returns {Promise<Array>} - Array of messages
 */
const getConversationMessages = async (conversationId, limit = 10) => {
  try {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }
    
    // Get the last "limit" messages
    const messages = conversation.messages;
    const startIdx = Math.max(0, messages.length - limit);
    
    return messages.slice(startIdx);
  } catch (error) {
    console.error('Error getting conversation messages:', error);
    throw error;
  }
};

/**
 * Adds a new message to a conversation
 * @param {String} conversationId - Conversation ID
 * @param {String} role - Message role ('user' or 'assistant')
 * @param {String} content - Message content
 * @returns {Promise<Object>} - Updated conversation
 */
const addMessageToConversation = async (conversationId, role, content) => {
  try {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }
    
    conversation.messages.push({
      role,
      content,
      timestamp: new Date()
    });
    
    await conversation.save();
    return conversation;
  } catch (error) {
    console.error('Error adding message to conversation:', error);
    throw error;
  }
};

/**
 * Deletes a conversation
 * @param {String} conversationId - Conversation ID
 * @returns {Promise<Boolean>} - True if operation is successful
 */
const deleteConversation = async (conversationId) => {
  try {
    const result = await Conversation.findByIdAndDelete(conversationId);
    if (!result) {
      throw new Error('Conversation not found');
    }
    return true;
  } catch (error) {
    console.error('Error deleting conversation:', error);
    throw error;
  }
};

module.exports = {
  createConversation,
  getConversationById,
  getAllConversations,
  getConversationMessages,
  addMessageToConversation,
  deleteConversation
}; 