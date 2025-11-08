import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import mkcert from 'vite-plugin-mkcert';
import tsconfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev
export default defineConfig({
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
    // mkcert(),
  ],
  build: {
    target: 'esnext',
    minify: 'terser'
  },
  publicDir: './public',
  server: {
    watch:{
      usePolling: true,
    },
    port: 1012,
    allowedHosts:['brief-urchin-only.ngrok-free.app'],
    // Exposes your dev server and makes it accessible for the devices in the same network.
    host: true,
  },
});
