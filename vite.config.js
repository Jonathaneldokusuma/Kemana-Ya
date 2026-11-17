import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    include: ['src/**/*.test.{js,jsx}'],
  },
  build: {
    outDir: 'www',
    emptyOutDir: true,
  },
});
