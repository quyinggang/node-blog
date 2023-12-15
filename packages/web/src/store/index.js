import { createPinia } from 'pinia';
import useUserStore from './modules/user';
import useCommonStore from './modules/common';

const pinia = createPinia();

export { useUserStore, useCommonStore };
export default pinia;
