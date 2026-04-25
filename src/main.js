import { quickTopics, electionTimeline, systemPrompt } from './election-data.js';
import { marked } from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js';

// DOM Elements
const chatMessages = document.getElementById('chat-messages');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const settingsBtn = document.getElementById('settings-btn');
const settingsModal = document.getElementById('settings-modal');
const closeSettingsBtn = document.getElementById('close-settings-btn');
const apiKeyInput = document.getElementById('api-key-input');
const saveKeyBtn = document.getElementById('save-key-btn');
const clearKeyBtn = document.getElementById('clear-key-btn');
const apiKeyStatus = document.getElementById('api-key-status');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const sidebar = document.querySelector('.sidebar');

// State
let conversationHistory = [];
const API_KEY_STORAGE = 'democrachat_gemini_key';

// Initialize UI
function init() {
  populateSidebar();
  loadApiKey();
  
  // Event Listeners
  chatForm.addEventListener('submit', handleChatSubmit);
  settingsBtn.addEventListener('click', openSettings);
  closeSettingsBtn.addEventListener('click', closeSettings);
  saveKeyBtn.addEventListener('click', saveApiKey);
  clearKeyBtn.addEventListener('click', clearApiKey);
  mobileMenuBtn.addEventListener('click', toggleMobileMenu);
  
  // Close modal on outside click
  settingsModal.addEventListener('click', (e) => {
    if (e.target === settingsModal) closeSettings();
  });
}

// Populate Sidebar data
function populateSidebar() {
  const topicsGrid = document.getElementById('topics-grid');
  const timelineContainer = document.getElementById('timeline');
  
  // Render Topics
  quickTopics.forEach(topic => {
    const button = document.createElement('button');
    button.className = 'topic-tag';
    button.textContent = topic;
    button.addEventListener('click', () => {
      chatInput.value = `Tell me about ${topic}`;
      chatInput.focus();
      if (window.innerWidth <= 768) toggleMobileMenu();
    });
    topicsGrid.appendChild(button);
  });
  
  // Render Timeline
  electionTimeline.forEach(item => {
    const div = document.createElement('div');
    div.className = 'timeline-item';
    div.innerHTML = `
      <div class="timeline-date">${item.date}</div>
      <div class="timeline-title">${item.title}</div>
    `;
    div.addEventListener('click', () => {
      chatInput.value = `What happens during: ${item.title}?`;
      chatInput.focus();
      if (window.innerWidth <= 768) toggleMobileMenu();
    });
    timelineContainer.appendChild(div);
  });
}

// Mobile Menu Toggle
function toggleMobileMenu() {
  sidebar.classList.toggle('open');
}

// API Key Management
function loadApiKey() {
  const key = localStorage.getItem(API_KEY_STORAGE);
  if (key) {
    apiKeyInput.value = key;
  }
}

function saveApiKey() {
  const key = apiKeyInput.value.trim();
  if (key) {
    localStorage.setItem(API_KEY_STORAGE, key);
    showStatus('API Key saved successfully!', 'success');
    setTimeout(closeSettings, 1500);
  } else {
    showStatus('Please enter a valid API Key', 'error');
  }
}

function clearApiKey() {
  localStorage.removeItem(API_KEY_STORAGE);
  apiKeyInput.value = '';
  showStatus('API Key cleared', 'success');
}

function showStatus(message, type) {
  apiKeyStatus.textContent = message;
  apiKeyStatus.className = `status-message ${type}`;
  setTimeout(() => {
    apiKeyStatus.style.display = 'none';
  }, 3000);
}

function openSettings() {
  settingsModal.classList.add('active');
}

function closeSettings() {
  settingsModal.classList.remove('active');
  apiKeyStatus.style.display = 'none';
}

// Chat Logic
async function handleChatSubmit(e) {
  e.preventDefault();
  const message = chatInput.value.trim();
  if (!message) return;

  const apiKey = localStorage.getItem(API_KEY_STORAGE);
  if (!apiKey) {
    appendMessage('assistant', 'Please configure your Gemini API Key in the Settings to use the assistant.');
    openSettings();
    return;
  }

  // Clear input
  chatInput.value = '';
  
  // Append user message
  appendMessage('user', message);
  
  // Show typing indicator
  const typingId = showTypingIndicator();
  
  try {
    const response = await callGeminiAPI(message, apiKey);
    removeMessage(typingId);
    appendMessage('assistant', response, true);
  } catch (error) {
    console.error('API Error:', error);
    removeMessage(typingId);
    appendMessage('assistant', `Error: ${error.message}. Please check your API key or network connection.`);
  }
}

function appendMessage(role, content, parseMarkdown = false) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${role}`;
  
  const icon = role === 'user' ? 'ri-user-smile-fill' : 'ri-robot-2-fill';
  
  let formattedContent = content;
  if (parseMarkdown) {
    // Sanitize basic HTML if needed, marked parses markdown to HTML
    formattedContent = marked.parse(content);
  } else {
    // Protect against XSS for normal text
    formattedContent = `<p>${escapeHTML(content)}</p>`;
  }

  msgDiv.innerHTML = `
    <div class="message-avatar">
      <i class="${icon}"></i>
    </div>
    <div class="message-content">
      ${formattedContent}
    </div>
  `;
  
  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
  const id = 'typing-' + Date.now();
  const msgDiv = document.createElement('div');
  msgDiv.className = 'message assistant';
  msgDiv.id = id;
  
  msgDiv.innerHTML = `
    <div class="message-avatar">
      <i class="ri-robot-2-fill"></i>
    </div>
    <div class="message-content">
      <div class="typing-indicator">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    </div>
  `;
  
  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return id;
}

function removeMessage(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

async function callGeminiAPI(userMessage, apiKey) {
  if (apiKey === 'test') {
    return new Promise(resolve => {
      setTimeout(() => resolve("This is a simulated response for demonstration purposes. **You asked:** " + userMessage + "\n\nIn a real scenario, I would provide accurate information about the election process!"), 1000);
    });
  }
  
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  
  // Append user message to history
  conversationHistory.push({ role: "user", parts: [{ text: userMessage }] });
  
  // Format history for Gemini API
  const contents = [
    {
      role: "user",
      parts: [{ text: systemPrompt }]
    },
    {
      role: "model",
      parts: [{ text: "Understood. I will act as a neutral Election Process Assistant and only answer questions related to the election process, voting, and civic duty." }]
    },
    ...conversationHistory
  ];

  const payload = {
    contents: contents,
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 1000,
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'API request failed');
  }

  const data = await response.json();
  const botReply = data.candidates[0].content.parts[0].text;
  
  // Add bot reply to history
  conversationHistory.push({ role: "model", parts: [{ text: botReply }] });
  
  return botReply;
}

// Start
document.addEventListener('DOMContentLoaded', init);
