import { describe, it, expect } from 'vitest';
import { quickTopics, electionTimeline, systemPrompt } from '../src/election-data.js';

describe('Election Data Module', () => {
  it('should have an array of quick topics', () => {
    expect(Array.isArray(quickTopics)).toBe(true);
    expect(quickTopics.length).toBeGreaterThan(0);
    expect(quickTopics).toContain('Voter Registration');
    expect(quickTopics).toContain('Election Day');
  });

  it('should have a correctly formatted election timeline', () => {
    expect(Array.isArray(electionTimeline)).toBe(true);
    expect(electionTimeline.length).toBeGreaterThan(0);
    
    // Check structure of first item
    const firstItem = electionTimeline[0];
    expect(firstItem).toHaveProperty('date');
    expect(firstItem).toHaveProperty('title');
    expect(firstItem).toHaveProperty('details');
  });

  it('should contain a strict system prompt for the AI', () => {
    expect(typeof systemPrompt).toBe('string');
    expect(systemPrompt).toContain('Election Process Assistant');
    expect(systemPrompt).toContain('neutral');
    expect(systemPrompt).toContain('non-partisan');
  });
});
