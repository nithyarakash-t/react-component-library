import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { version } from './package.json';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.REACT_APP_VERSION': JSON.stringify(version),
  }
})
