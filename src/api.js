import { GoogleGenerativeAI } from '@google/generative-ai';
import { systemPrompt } from './election-data.js';

let conversationHistory = [];

/**
 * Calls the Google Gemini API using the official SDK.
 * @param {string} userMessage - The latest user query.
 * @param {string} apiKey - The user's Google Gemini API key.
 * @returns {Promise<string>} The response text from the AI.
 */
export async function callGeminiAPI(userMessage, apiKey) {
  if (apiKey === 'test') {
    return new Promise(resolve => {
      setTimeout(() => resolve("This is a simulated response for demonstration purposes. **You asked:** " + userMessage + "\n\nIn a real scenario, I would provide accurate information about the election process!"), 1000);
    });
  }
  
  // Initialize the official Google SDK
  const genAI = new GoogleGenerativeAI(apiKey);
  
  // Get the model with specific instructions
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    systemInstruction: systemPrompt 
  });
  
  // Start or continue the chat session
  const chat = model.startChat({
    history: conversationHistory,
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 1000,
    },
  });

  try {
    const result = await chat.sendMessage(userMessage);
    const botReply = result.response.text();
    
    // Update history manually for our state tracking
    conversationHistory.push({ role: "user", parts: [{ text: userMessage }] });
    conversationHistory.push({ role: "model", parts: [{ text: botReply }] });
    
    return botReply;
  } catch (error) {
    throw new Error(error.message || 'SDK request failed');
  }
}

/**
 * Resets the conversation history.
 */
export function clearConversationHistory() {
  conversationHistory = [];
}
