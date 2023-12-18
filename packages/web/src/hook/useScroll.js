import { onBeforeUnmount } from 'vue';
import { checkHtmlElement } from '@/utils/common';

export default function useScroll(config) {
  const { element, onScrollEnd, onScrollTop } = config;
  let preScrollTop = 0;
  let isWaiting = false;
  const isHtmlElement = checkHtmlElement(element);

  const handleScrollBottom = target => {
    const { scrollTop, scrollHeight, offsetHeight } = target;
    const bottom = Math.floor(scrollHeight - (scrollTop + offsetHeight));
    if (bottom <= 10 && !isWaiting) {
      isWaiting = true;
      try {
        typeof onScrollEnd === 'function' && onScrollEnd();
      } finally {
        window.requestAnimationFrame(() => (isWaiting = false));
      }
    }
  };
  const handleScrollTop = target => {
    const { scrollTop } = target;
    if (scrollTop <= 10 && !isWaiting) {
      isWaiting = true;
      try {
        typeof onScrollTop === 'function' && onScrollTop();
      } finally {
        window.requestAnimationFrame(() => (isWaiting = false));
      }
    }
  };

  const handleScroll = () => {
    const target =
      element instanceof Document ? document.documentElement : element;
    const { scrollTop } = target;
    scrollTop >= preScrollTop
      ? handleScrollBottom(target)
      : handleScrollTop(target);
    preScrollTop = scrollTop;
  };

  isHtmlElement && element.addEventListener('scroll', handleScroll);

  onBeforeUnmount(() => {
    isHtmlElement && element.removeEventListener('scroll', handleScroll);
  });
}
