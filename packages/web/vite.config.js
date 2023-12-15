import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@arco-design/icon-vue': '@arco-design/web-vue/es/icon'
    },
  },
  server: {
    // 静态资源代理设置
    proxy: {
      '/static': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true
      },
    }
  }
});
