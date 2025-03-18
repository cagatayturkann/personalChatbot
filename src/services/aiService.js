const axios = require('axios');
require('dotenv').config();

// Gemini API key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

/**
 * Generate a response using Gemini API
 * @param {string} prompt - User's message
 * @param {string} context - Optional context from vector search
 * @returns {string} - AI response
 */
const generateGeminiResponse = async (prompt, context = '') => {
  try {
    try {
      // Prepare request data for Gemini API
      const data = JSON.stringify({
        system_instruction: {
          parts: {
            text: `You are a helpful assistant that can answer questions about Çağatay Türkan and only IT related topics. Based on the user's question "${prompt}", analyze the information in the context: ${context} and return information only about the most relevant matching information(s). ${context} will have a property called 'answer' that will be a string. Respond with the answer property as humanly as possible and always answer in the same language as the ${prompt}, but be careful with special names such as brand, model, etc. - don't translate those.`,
          },
        },
        contents: {
          parts: {
            text: prompt,
          },
        },
      });

      // Configuration for API request
      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        headers: {
          'Content-Type': 'application/json',
        },
        data: data,
      };

      // Send API request
      const response = await axios.request(config);
      console.log(JSON.stringify(response.data));

      // Return the response
      if (
        response.data &&
        response.data.candidates &&
        response.data.candidates[0] &&
        response.data.candidates[0].content &&
        response.data.candidates[0].content.parts &&
        response.data.candidates[0].content.parts[0]
      ) {
        return response.data.candidates[0].content.parts[0].text;
      } else {
        return 'No response received.';
      }
    } catch (geminiError) {
      console.error('Gemini API error:', geminiError);
      throw geminiError;
    }
  } catch (error) {
    console.error('Error generating AI response:', error);
    return 'Sorry, an error occurred while generating a response: ' + error.message;
  }
};

module.exports = {
  generateGeminiResponse,
};
