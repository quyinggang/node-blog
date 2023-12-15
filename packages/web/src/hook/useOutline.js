import { onBeforeUnmount, ref, watch, computed } from 'vue';

export default function useOutline(config) {
  const { outline } = config;

  const prefix = 'heading-';
  const toc = ref([]);
  const scrollVisible = computed(() => toc.value.length && outline.value);

  const handleScroll = () => {
    const outlineElement = outline.value;
    if (!outlineElement) return;
    const tocList = toc.value;
    const { scrollTop, clientHeight } = document.documentElement;
    const currentElement = document.querySelector('.active');
    for (let index = 0, limit = tocList.length; index < limit; index++) {
      const { id, offsetTop } = tocList[index];
      const offset = offsetTop - scrollTop;
      if (offset > 0 && offset < clientHeight) {
        currentElement && currentElement.classList.remove('active');
        const nextElement = outlineElement.querySelector(
          `li[data-id="${prefix}${id}"]`
        );
        nextElement && nextElement.classList.add('active');
        break;
      }
    }
  };
  const mountOutlineNode = () => {
    const outlineList = toc.value;
    const outlineElement = outline.value;
    if (!outlineElement || !outlineList.length) return;

    const elements = outlineList.map((item) => {
      const { id, level, text } = item;
      const pdClass = level ? `pl-${level}` : '';
      const className = `li ${pdClass}`.trim();
      return `<li data-id="${prefix}${id}" class="${className}">${text}</li>`;
    });

    const html = `
      <ul class="outline-list">
        ${elements.join('\n')}
      </ul>
    `;
    outlineElement.innerHTML = html;
  };
  const handleOutlineClick = (event) => {
    const target = event.target;
    const tagName = String(target.tagName).toLowerCase();
    const dataSet = target.dataset;
    if (tagName !== 'li' || !dataSet.id) return;
    const element = document.getElementById(dataSet.id);
    element && element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };
  const removeClickEvent = () => {
    const outlineElement = outline.value;
    if (!outlineElement) return;
    outlineElement.removeEventListener('click', handleOutlineClick);
  };
  const bindClickEvent = () => {
    const outlineElement = outline.value;
    if (!outlineElement) return;
    outlineElement.addEventListener('click', handleOutlineClick);
  };

  const removeListener = () => {
    removeClickEvent();
    window.removeEventListener('scroll', handleScroll);
  };

  watch(
    () => scrollVisible.value,
    (value) => {
      if (!value) return;
      removeListener();
      bindClickEvent();
      mountOutlineNode();
      window.addEventListener('scroll', handleScroll);
    }
  );

  const outlinePlugin = () => {
    return {
      viewerEffect({ markdownBody }) {
        const nodes = Array.from(markdownBody.children);
        if (nodes.length === 0) return;
        const headingList = [];
        let minLevel = 10;
        nodes.forEach((item, index) => {
          const tagName = String(item.tagName).toLowerCase();
          if (tagName.length === 2 && tagName.indexOf('h') === 0) {
            const level = tagName[1];
            minLevel = Math.min(minLevel, level);
            item.setAttribute('id', `heading-${index}`);
            headingList.push({
              id: index,
              level,
              text: item.textContent.trim(),
              offsetTop: item.offsetTop,
            });
          }
        });

        toc.value = headingList.map((item) => {
          return { ...item, level: item.level - minLevel };
        });
      },
    };
  };

  onBeforeUnmount(() => removeListener());

  return outlinePlugin;
}
