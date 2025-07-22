import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'; // Add React plugin

export default defineConfig({
  plugins: [
    react(), // Enable React plugin for JSX/TSX support
    tailwindcss(),
    
  ],
  mode: 'development',
  build: {
    sourcemap: true, // Explicitly enable source maps
  },
})