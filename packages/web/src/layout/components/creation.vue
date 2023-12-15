<template>
  <a-dropdown-button type="primary" trigger="click">
    创作者中心
    <template #icon>
      <icon-down />
    </template>
    <template #content>
      <a-doption
        ><router-link class="link" :to="{ name: 'editor-new' }"
          >写文章</router-link
        ></a-doption
      >
      <a-doption
        ><router-link class="link" :to="{ name: 'drafts' }"
          >草稿箱</router-link
        ></a-doption
      >
    </template>
  </a-dropdown-button>
</template>

<script setup>
import { IconDown } from '@arco-design/icon-vue';
</script>

<style lang="less" scoped>
.link {
  display: block;
  width: 100%;
  height: 100%;
}

:deep(.arco-dropdown-option-content) {
  width: 110px;
}
</style>
