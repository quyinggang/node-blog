import { ref } from 'vue';
import useScroll from './useScroll';

export default function useScrollPageRequest(config) {
  const { request, element, immediate = true, page = 1, size = 10 } = config;
  if (typeof request !== 'function' || !element) return;

  const pageNumber = ref(page <= 0 ? 1 : page);
  const pageSize = ref(size <= 0 ? 10 : size);
  const nextPage = ref(false);
  const loading = ref(false);
  const cachePage = ref(0);

  const sendRequest = async () => {
    const nextPageVisible = await request({
      page: pageNumber.value,
      size: pageSize.value,
    });
    cachePage.value = pageNumber.value;
    nextPage.value = !!nextPageVisible;
  };

  if (immediate) {
    sendRequest();
  }

  useScroll({
    element,
    onScrollEnd: async () => {
      if (loading.value) return;
      if (nextPage.value) pageNumber.value += 1;
      if (cachePage.value === pageNumber.value) return;
      try {
        await sendRequest();
      } finally {
        loading.value = false;
      }
    },
  });
}
