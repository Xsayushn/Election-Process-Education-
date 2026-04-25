import { describe, it, expect } from 'vitest';
import { clearConversationHistory } from '../src/api.js';

describe('API Module Tests', () => {
  it('should have a function to clear conversation history', () => {
    expect(typeof clearConversationHistory).toBe('function');
    
    // Calling it shouldn't throw an error
    expect(() => clearConversationHistory()).not.toThrow();
  });
});
