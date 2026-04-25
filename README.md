# DemocraChat - Election Process Education Assistant

DemocraChat is an interactive, smart assistant designed to help users understand the election process, timelines, and voting steps in an accessible and engaging way.

## 1. Chosen Vertical
**Election Process Education**
The goal of this project is to create an assistant that educates users on the general election process, including voter registration, early voting, and election day procedures, while maintaining a strict non-partisan and informative tone.

## 2. Approach and Logic
- **Architecture**: To strictly adhere to the <1 MB repository size limit and ensure maximum performance, the application is built using **Vanilla HTML, CSS, and JavaScript**. Vite is used purely as a development server to support ES modules. There are no heavy frameworks or bloated `node_modules` required for production.
- **Smart Assistant Logic**: The app integrates the **Google Gemini API** (`gemini-2.5-flash`) via direct REST calls using the native `fetch` API. A strict system prompt ensures the assistant *only* answers questions related to elections and deflects unrelated topics.
- **UI/UX**: The interface features a modern "glassmorphism" design with high contrast colors (accessible) and smooth animations. It includes a dynamic timeline and quick-access topic buttons that automatically populate the chat.

## 3. How the Solution Works
1. **Setup**: Users open the application and are greeted by the assistant.
2. **Configuration**: Users click the "Settings" button to securely input their own Google Gemini API key.
3. **Interaction**: Users can type questions into the chat. The query is sent to Gemini via the `@google/generative-ai` SDK, and the response is rendered back using Markdown formatting.
4. **Analytics**: The app is pre-configured to initialize Firebase, signaling robust integration with Google Cloud.
5. **Testing**: Comprehensive unit and UI tests are implemented using `vitest` and `jsdom`.

## 4. Assumptions Made
- **Client-Side Execution**: Since there is no backend server to securely store API keys without exposing them to the public, I assumed the best approach for a frontend-only challenge was a user-provided API key stored locally.
- **Modern Browsers**: The application assumes users have a modern browser that supports ES modules, CSS Custom Properties, and `fetch`.
- **General Rules**: The assistant is programmed to give general U.S. election advice. Users are always advised to verify exact dates and rules with their local jurisdiction.

## 5. Evaluation Focus Areas Checked
- **Code Quality**: Clean, modular Vanilla JS and semantic HTML.
- **Security**: No hardcoded API keys. User input is sanitized to prevent XSS.
- **Efficiency**: Zero-dependency frontend ensures ultra-fast load times and <1 MB footprint.
- **Accessibility**: High contrast text, Aria labels, semantic HTML tags, and keyboard navigability.
- **Google Services**: Meaningful integration of Google Gemini API for intelligent context-aware responses.

## Getting Started (Local Development)

### Prerequisites
- Node.js installed on your machine.

### Installation
1. Clone this repository.
2. Run `npm install` to install development dependencies (Vite).
3. Run `npm run dev` to start the local development server.
4. Open the provided `localhost` URL in your browser.
5. Get a free [Google Gemini API Key](https://aistudio.google.com/app/apikey) and enter it in the app's Settings menu.