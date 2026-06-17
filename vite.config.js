// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig(() => {
  return {
    base: './',
    build: {
      outDir: 'build',
    },
    esbuild: {
      loader: 'jsx',
      include: /src\/.*\.jsx?$/,
      exclude: [],
    },
    optimizeDeps: {
      esbuildOptions: {
        loader: {
          '.js': 'jsx',
        },
      },
    },
    plugins: [react()],
    resolve: {
      alias: {
        'src': path.resolve(__dirname, 'src'),
        
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
    },
    server: {
      host: '0.0.0.0', //  allows access from network IPs
      port: 5173,
      cors: true,      // optional, helps with cross-device testing
      proxy: {
        '/api': {
          target: 'http://172.16.16.10:8087',
         //    target: 'http://172.16.16.10:8067',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
  };
});
