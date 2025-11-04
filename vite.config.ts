import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import mkcert from 'vite-plugin-mkcert';
import tsconfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/reactjs-template/',
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern',
      },
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    tsconfigPaths(),
    process.env.HTTPS && mkcert(),
  ],
  build: {
    target: 'esnext',
    minify: 'terser'
  },
  publicDir: './public',
  server: {
    // Exposes your dev server and makes it accessible for the devices in the same network.
    host: true,
  },
});
