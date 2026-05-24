import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// Copy about_hero image from brain artifact to public
try {
  const src = 'C:\\Users\\bogag\\.gemini\\antigravity-ide\\brain\\0c4b5220-210e-401b-9fbe-a5694bf2c068\\about_hero_1779455067902.png';
  const dest = path.join(process.cwd(), 'public', 'about_hero.png');
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log('Successfully copied about_hero.png to client public folder');
  } else {
    console.log('Source about_hero image not found at:', src);
  }
} catch (err) {
  console.error('Failed to copy about_hero image:', err);
}

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
});
