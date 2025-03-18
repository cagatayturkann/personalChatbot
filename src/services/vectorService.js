const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Get API keys from environment variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Initialize API client
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

/**
 * Generate embedding vector for the given text
 * @param {string} text - Text to generate embedding for
 * @returns {Array} - Embedding vector
 */
async function getEmbedding(text) {
  const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
  const result = await model.embedContent(text);
  return result.embedding.values;
}

/**
 * Get relevant information from Weaviate vector database
 * @param {string} query - Search query
 * @returns {Array} - Results from vector search
 */
const getVectorInfo = async (query) => {
  try {
    // Generate embedding for the query
    const embedding = await getEmbedding(query);

    // Use fixed alpha value for vector search (balance between vector and keyword search)
    const alpha = 0.5;

    console.log(`Vector search alpha: ${alpha}`);

    // Prepare GraphQL query for Weaviate
    const data = JSON.stringify({
      query: `{
        Get {
          Questions (
            hybrid: {
              query: "${query}"
              alpha: ${alpha},
              vector: ${JSON.stringify(embedding)},
            }
            limit: 3
          ) {
            data
            _additional { score }
          }
        }
      }`,
    });

    // Configuration for Weaviate API request
    const config = {
      method: 'post',
      url: process.env.WEAVIATE_URL + '/v1/graphql',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.WEAVIATE_API_KEY}`,
      },
      data: data,
    };

    // Send request to Weaviate
    const response = await axios.request(config);

    console.log('Vector search results:', response.data.data.Get.Questions);
    return response.data.data.Get.Questions.map((item) => item.data);
  } catch (error) {
    console.error('Error during Weaviate query:', error);
    return [];
  }
};

module.exports = {
  getEmbedding,
  getVectorInfo,
};
