import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: './', // Apunta a la raíz de frontend
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
});
