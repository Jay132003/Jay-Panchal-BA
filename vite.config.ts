import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    strictPort: true,
  },
  // Pre-bundle the heavy deps at server boot so the first page load never
  // stalls waiting on on-demand dependency optimization (@tabler/icons-react
  // in particular is large). Prevents the "stuck on splash" cold-start.
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      'motion',
      'motion/react',
      '@tabler/icons-react',
      'lucide-react',
      'cobe',
      'clsx',
      'tailwind-merge',
    ],
  },
});
