import { onBeforeUnmount } from 'vue';
import { checkHtmlElement } from '@/utils/common';

export default function useScroll(config) {
  const element = config.element;
  const onScrollEnd = config.onScrollEnd;
  let preScrollTop = 0;
  let isWaiting = false;
  const isHtmlElement = checkHtmlElement(element);

  const handleScroll = () => {
    const target =
      element instanceof Document ? document.documentElement : element;
    const { scrollTop, scrollHeight, offsetHeight } = target;
    const bottom = Math.floor(scrollHeight - (scrollTop + offsetHeight));
    if (scrollTop > preScrollTop && bottom <= 10 && !isWaiting) {
      isWaiting = true;
      try {
        typeof onScrollEnd === 'function' && onScrollEnd();
      } finally {
        window.requestAnimationFrame(() => (isWaiting = false));
      }
    }
    preScrollTop = scrollTop;
  };

  isHtmlElement && element.addEventListener('scroll', handleScroll);

  onBeforeUnmount(() => {
    isHtmlElement && element.removeEventListener('scroll', handleScroll);
  });
}
