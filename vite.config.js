import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
  },
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['@google/generative-ai', 'firebase/app', 'firebase/analytics', 'firebase/auth'],
          markdown: ['marked']
        }
      }
    }
  }
});
