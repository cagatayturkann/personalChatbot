const axios = require('axios');
const conversationService = require('../services/conversationService');

/**
 * Chat mesajını işler ve yanıt döndürür
 * @param {Object} req - Express request nesnesi
 * @param {Object} res - Express response nesnesi
 */
const processChat = async (req, res) => {
  try {
    const { message, imageUrl, conversationId } = req.body;
    let conversation;
    
    // Eğer conversationId yoksa, yeni bir konuşma oluştur
    if (!conversationId) {
      // İlk mesajı title olarak kullan (maksimum 30 karakter)
      const title = message.length > 30 ? message.substring(0, 30) + '...' : message;
      conversation = await conversationService.createConversation(title);
    } else {
      // Var olan konuşmayı getir
      try {
        conversation = await conversationService.getConversationById(conversationId);
      } catch (error) {
        // Konuşma bulunamazsa yeni bir tane oluştur
        // İlk mesajı title olarak kullan (maksimum 30 karakter)
        const title = message.length > 30 ? message.substring(0, 30) + '...' : message;
        conversation = await conversationService.createConversation(title);
      }
    }
    
    // Kullanıcı mesajını konuşmaya ekle
    await conversationService.addMessageToConversation(conversation._id, 'user', message);

    // Mesaj içeriğini hazırla
    let messageContent = message;

    const response = await axios({
      method: 'post',
      url: 'https://openrouter.ai/api/v1/chat/completions',
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.SITE_URL || 'http://localhost:3000',
        'X-Title': 'AI Chatbot',
      },
      data: {
        model: 'google/gemini-2.0-flash-001',
        messages: [
          {
            role: 'system',
            content: `You are a helpful AI shopping assistant and personal assistant for Çağatay Türkan. 
            You can answer questions about shopping related topics and about Çağatay's projects, and experience.
            For other topics, be helpful and friendly. If you don't know the answer, say so politely.`,
          },
          {
            role: 'user',
            content: messageContent,
          },
        ],
      },
    });

    const assistantResponse = response.data.choices[0].message.content;
    
    // Bot yanıtını konuşmaya ekle
    await conversationService.addMessageToConversation(conversation._id, 'assistant', assistantResponse);

    res.json({
      response: assistantResponse,
      conversationId: conversation._id
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({
      error: 'An error occurred while processing your request',
    });
  }
};

module.exports = {
  processChat
}; 