import { quickTopics, electionTimeline } from './election-data.js';
import { marked } from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js';
import { initFirebase } from './firebase.js';

// Initialize Firebase immediately for analytics
initFirebase();

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

const API_KEY_STORAGE = 'democrachat_gemini_key';

/**
 * Initializes the application, populates UI, and binds event listeners.
 */
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

/**
 * Populates the sidebar with quick topics and election timeline data.
 */
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

/**
 * Toggles the mobile sidebar menu.
 */
function toggleMobileMenu() {
  sidebar.classList.toggle('open');
}

/**
 * Loads the API key from local storage if available.
 */
function loadApiKey() {
  const key = localStorage.getItem(API_KEY_STORAGE);
  if (key) {
    apiKeyInput.value = key;
  }
}

/**
 * Saves the user's API key to local storage securely.
 */
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

/**
 * Clears the user's API key from local storage.
 */
function clearApiKey() {
  localStorage.removeItem(API_KEY_STORAGE);
  apiKeyInput.value = '';
  showStatus('API Key cleared', 'success');
}

/**
 * Displays a temporary status message in the settings modal.
 * @param {string} message - The message to display.
 * @param {string} type - The class type (e.g., 'success', 'error').
 */
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

/**
 * Handles the submission of a new chat message.
 * @param {Event} e - The form submission event.
 */
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
    // Dynamically import API module to optimize initial load
    const { callGeminiAPI } = await import('./api.js');
    const response = await callGeminiAPI(message, apiKey);
    removeMessage(typingId);
    appendMessage('assistant', response, true);
  } catch (error) {
    console.error('API Error:', error);
    removeMessage(typingId);
    appendMessage('assistant', `Error: ${error.message}. Please check your API key or network connection.`);
  }
}

/**
 * Appends a message to the chat interface.
 * @param {string} role - The role of the sender ('user' or 'assistant').
 * @param {string} content - The text content of the message.
 * @param {boolean} [parseMarkdown=false] - Whether to parse the content as markdown.
 */
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

/**
 * Escapes HTML characters to prevent Cross-Site Scripting (XSS).
 * @param {string} str - The string to escape.
 * @returns {string} The escaped safe string.
 */
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

// Start
document.addEventListener('DOMContentLoaded', init);
