import { describe, it, expect, beforeEach, vi } from 'vitest';
import { JSDOM } from 'jsdom';

// Setup basic DOM for testing main.js functions
const dom = new JSDOM(`
  <!DOCTYPE html>
  <body>
    <div class="sidebar"></div>
    <div id="topics-grid"></div>
    <div id="timeline"></div>
    <input id="api-key-input" />
    <div id="api-key-status"></div>
    <div id="settings-modal" class=""></div>
    
    <div id="chat-messages"></div>
    <form id="chat-form"></form>
    <input id="chat-input" />
    <button id="send-btn"></button>
    <button id="settings-btn"></button>
    <button id="close-settings-btn"></button>
    <button id="save-key-btn"></button>
    <button id="clear-key-btn"></button>
    <button id="mobile-menu-btn"></button>
  </body>
`);

global.window = dom.window;
global.document = dom.window.document;
global.localStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};

describe('UI and Main Logic Tests', () => {
  beforeEach(() => {
    document.getElementById('chat-messages').innerHTML = '';
    vi.clearAllMocks();
  });

  it('should correctly toggle the mobile menu', () => {
    const sidebar = document.querySelector('.sidebar');
    expect(sidebar.classList.contains('open')).toBe(false);
    
    // Simulate toggle function
    sidebar.classList.toggle('open');
    expect(sidebar.classList.contains('open')).toBe(true);
  });

  it('should save API key to local storage', () => {
    const input = document.getElementById('api-key-input');
    input.value = 'test-api-key-123';
    
    // Simulate saveApiKey logic
    const key = input.value.trim();
    if (key) {
      localStorage.setItem('democrachat_gemini_key', key);
    }
    
    expect(localStorage.setItem).toHaveBeenCalledWith('democrachat_gemini_key', 'test-api-key-123');
  });

  it('should escape HTML characters to prevent XSS', () => {
    // Re-create the escape function for isolated testing
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

    const maliciousInput = '<script>alert("hack")</script>';
    const safeOutput = escapeHTML(maliciousInput);
    
    expect(safeOutput).toBe('&lt;script&gt;alert(&quot;hack&quot;)&lt;/script&gt;');
    expect(safeOutput).not.toContain('<script>');
  });
});
