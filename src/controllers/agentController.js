const axios = require('axios');

require('dotenv').config();

/**
 * Translates user messages from any language to Turkish
 * This agent uses OpenRouter API with Gemini model to provide accurate translations
 * while preserving context and correcting grammatical errors
 * 
 * @param {string} message - User message to translate
 * @returns {string} - Translated message in Turkish
 */
const translatorAgent = async (message) => {
  try {
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
            content: `You are a sophisticated AI agent specializing in translating user queries from multiple languages into Turkish. Before translating, you identify and correct typos, grammatical errors, and punctuation mistakes in the source text to ensure clarity and readability. Your translations should maintain the original context and be culturally nuanced. You also verify that the translated Turkish text is free of errors, providing precise and reliable communication for the chatbot. Return only the translated text as plain text, without any line breaks, including the "\n" character, HTML elements, special characters, or trailing newline characters. Ensure the output is a continuous string of text.`,
          },
          {
            role: 'user',
            content: message,
          },
        ],
      },
    });

    return response.data.choices[0].message.content.replace(/\n+$/, '');
  } catch (error) {
    console.error('OpenRouter API error:', error);
    return 'Sorry, an error occurred while generating a response: ' + error.message;
  }
};

module.exports = {
  translatorAgent,
};
