# Election Process Education Assistant

This project aims to build an interactive, smart assistant that helps users understand the election process, timelines, and steps.

## User Review Required

> [!IMPORTANT]
> **API Key Approach**: To fulfill the "Meaningful integration of Google Services" requirement securely, the app will integrate the **Google Gemini API**. Because it's a frontend-only app, I will build a secure Settings modal where the user can input their own Gemini API Key (stored locally in their browser). Is this approach acceptable?

> [!WARNING]
> **Repository Size Limit**: The challenge requires the repository size to be **under 1 MB**. To guarantee this, I will use a minimal build setup with Vanilla HTML, CSS, and JS (via Vite), avoiding heavy libraries.

## Proposed Changes

### Setup and Tooling
- Initialize a Vite Vanilla project to provide a modern development experience while keeping the bundle size minuscule.

### Core Application (Vanilla HTML/CSS/JS)

#### [NEW] `index.html`
- Semantic HTML structure.
- Accessible layout with a sidebar for quick topics and a main chat interface.
- Settings modal for API key input.

#### [NEW] `style.css`
- Modern, dynamic, and premium design (glassmorphism, smooth animations).
- Focus on accessibility (high contrast, keyboard focus indicators).
- Responsive layout (mobile-friendly).

#### [NEW] `src/main.js`
- Application logic.
- DOM manipulation and event listeners.
- Gemini API integration using `@google/genai` or direct REST API `fetch`.
- Context-aware prompting (the system prompt will restrict the assistant to only answer questions about the election process).

#### [NEW] `src/election-data.js`
- Static timeline data and predefined steps/rules to populate the UI (interactive timeline component) so the user has immediate visual context.

#### [MODIFY] `README.md`
- Detailed explanation of the vertical (Election Process Education).
- Approach, logic, how it works, and assumptions made.
- Instructions on how to run locally and insert the API key.

## Verification Plan

### Automated Tests
- Run Lighthouse audits to ensure accessibility, performance, and best practices.

### Manual Verification
- Verify the repo/build size is well under 1MB.
- Test the chat assistant with various election-related questions and ensure it deflects non-election topics.
- Check responsiveness across desktop and mobile views.
