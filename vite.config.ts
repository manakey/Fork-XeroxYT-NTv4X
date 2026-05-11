import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

import { cloudflare } from "@cloudflare/vite-plugin";

// FIX: Get __dirname in an ES module environment to avoid using process.cwd(), which had typing issues.
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      plugins: [viteSingleFile(), cloudflare()],
      // GAS Configuration: Use relative paths and inline assets
      base: './', 
      
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname),
        }
      },
      build: {
        outDir: 'dist',
        assetsDir: 'assets',
        emptyOutDir: true,
        // Increase chunk size warning since we are bundling everything into one file
        chunkSizeWarningLimit: 100000000, 
      }
    };
});