import router from './routes';
import { getAccessToken } from '@/utils/auth';
import { useCommonStore } from '@/store';
import { updateArticleReadCount } from '@/api/article';

router.beforeEach(to => {
  const { requireAuth } = to.meta;
  const token = getAccessToken();
  if (requireAuth) {
    if (!token) {
      const store = useCommonStore();
      store.setLoginVisible(true);
    }
    return token ? true : { name: 'home' };
  }
  // 阅读量
  if (to.name === 'article' && to.params.id) {
    updateArticleReadCount(to.params.id);
  }
  return true;
});
