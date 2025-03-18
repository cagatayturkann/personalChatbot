const Conversation = require('../models/Conversation');

/**
 * Yeni bir konuşma oluşturur
 * @param {String} title - Konuşma başlığı (opsiyonel)
 * @returns {Promise<Object>} - Oluşturulan konuşma
 */
const createConversation = async (title = null) => {
  try {
    // Eğer title null ise, varsayılan değer ata
    const conversationTitle = title || 'Yeni Konuşma';
    
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
 * ID'ye göre bir konuşmayı getirir
 * @param {String} conversationId - Konuşma ID
 * @returns {Promise<Object>} - Bulunan konuşma
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
 * Tüm konuşmaları getirir
 * @returns {Promise<Array>} - Konuşmalar dizisi
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
 * Bir konuşmaya yeni mesaj ekler
 * @param {String} conversationId - Konuşma ID
 * @param {String} role - Mesaj rolü ('user' veya 'assistant')
 * @param {String} content - Mesaj içeriği
 * @returns {Promise<Object>} - Güncellenen konuşma
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
 * Bir konuşmayı siler
 * @param {String} conversationId - Konuşma ID
 * @returns {Promise<Boolean>} - İşlem başarılı ise true
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
  addMessageToConversation,
  deleteConversation
}; 