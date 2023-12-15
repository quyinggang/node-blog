import zhHans from 'bytemd/locales/zh_Hans.json';
import gfm from '@bytemd/plugin-gfm';
import frontmatter from '@bytemd/plugin-frontmatter';
import breaks from '@bytemd/plugin-breaks';
import gemoji from '@bytemd/plugin-gemoji';
import highlight from '@bytemd/plugin-highlight';
import math from '@bytemd/plugin-math';
import zoom from '@bytemd/plugin-medium-zoom';
import mermaid from '@bytemd/plugin-mermaid';

import 'bytemd/dist/index.min.css';
import 'highlight.js/styles/vs.css';
import 'juejin-markdown-themes/dist/juejin.min.css';

export default {
  zh: zhHans,
  plugins: [
    gfm(),
    highlight(),
    breaks(),
    gemoji(),
    math(),
    zoom(),
    frontmatter(),
    mermaid(),
  ],
};
