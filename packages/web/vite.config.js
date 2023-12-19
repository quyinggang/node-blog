import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'node:path';
import vue from '@vitejs/plugin-vue';

const developmentEnv = loadEnv('development', process.cwd())

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@arco-design/icon-vue': '@arco-design/web-vue/es/icon',
    },
  },
  server: {
    // 静态资源代理设置
    proxy: {
      '/static': {
        target: developmentEnv.VITE_HTTP_API_URL,
        changeOrigin: true,
      },
    },
  },
});
