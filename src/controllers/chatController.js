const conversationService = require('../services/conversationService');
const aiService = require('../services/aiService');
const vectorService = require('../services/vectorService');
const { translatorAgent } = require('../controllers/agentController');

/**
 * Process chat message and return response
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const processChat = async (req, res) => {
  try {
    const { message, conversationId } = req.body;
    let conversation;

    // Create a new conversation if conversationId doesn't exist
    if (!conversationId) {
      // Use first message as title (maximum 30 characters)
      const title = message.length > 30 ? message.substring(0, 30) + '...' : message;
      conversation = await conversationService.createConversation(title);
    } else {
      // Get existing conversation
      try {
        conversation = await conversationService.getConversationById(conversationId);
      } catch (error) {
        // Create a new conversation if the existing one can't be found
        const title = message.length > 30 ? message.substring(0, 30) + '...' : message;
        conversation = await conversationService.createConversation(title);
      }
    }

    // Add user message to conversation
    await conversationService.addMessageToConversation(conversation._id, 'user', message);

    // Retrieve relevant information from vector database
    let vectorInfo = [];
    try {
      const translatedMessage = await translatorAgent(message);
      console.log(`Translated message: ${translatedMessage}`);
      vectorInfo = await vectorService.getVectorInfo(translatedMessage);
      console.log(`Vector info retrieved: ${vectorInfo.length} items`);
    } catch (vectorError) {
      console.error('Vector search error:', vectorError);
      // Continue even if vector search fails
    }

    // Use vector search results as context if available
    let context = '';
    if (vectorInfo && vectorInfo.length > 0) {
      context = JSON.stringify(vectorInfo);
    }

    // Generate response using Gemini API (with vector information as context if available)
    const assistantResponse = await aiService.generateGeminiResponse(message, context);

    // Add bot response to conversation
    await conversationService.addMessageToConversation(conversation._id, 'assistant', assistantResponse);

    res.json({
      response: assistantResponse,
      conversationId: conversation._id,
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({
      error: 'An error occurred while processing your request',
    });
  }
};

module.exports = {
  processChat,
};
