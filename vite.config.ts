import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    server: {
      port: 3000,
      // Listen on all addresses
      host: true,
      // Ensure WebSocket protocol matches (sometimes helpful with proxies/tunnels)
      hmr: {
        clientPort: 3000
      },
      watch: {
        usePolling: true,
      },
    },
    plugins: [react()],
    define: {
      // Expose env vars to the client
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), '.'),
      }
    }
  };
});
