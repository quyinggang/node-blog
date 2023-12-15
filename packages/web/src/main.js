import { createApp } from 'vue';
import ArcoVue from '@arco-design/web-vue';
import '@arco-design/web-vue/dist/arco.css';
import './style.less';
import pinia from './store';
import App from './App.vue';
import '@/config/interceptor';
import '@/config/permission';
import router from '@/config/routes';

const app = createApp(App);

app.use(router);
app.use(pinia);
app.use(ArcoVue);

app.mount('#app');
