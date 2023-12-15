<template>
  <div class="settings">
    <a-menu
      class="menu"
      v-model:selected-keys="selectedKeys"
      @menu-item-click="handleMenuSelect"
    >
      <a-menu-item key="profile">
        <template #icon><icon-apps></icon-apps></template>
        个人资料
      </a-menu-item>
      <a-menu-item key="account">
        <template #icon><icon-safe></icon-safe></template>
        账号设置
      </a-menu-item>
    </a-menu>
    <div class="content">
      <router-view v-slot="{ Component, route }">
        <transition name="fade" mode="out-in" appear>
          <keep-alive v-if="route.meta.cache">
            <component :is="Component" :key="route.fullPath" />
          </keep-alive>
          <component :is="Component" v-else :key="route.fullPath" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { IconApps, IconSafe } from '@arco-design/icon-vue';

const route = useRoute();
const router = useRouter();
const selectedKeys = ref([route.name]);

const handleMenuSelect = key => {
  router.push({ name: key });
};
</script>

<style lang="less" scoped>
.settings {
  display: flex;

  .menu {
    position: sticky;
    top: 80px;
    left: 0;
    width: 140px;
    height: 300px;
    flex: none;
  }

  .content {
    flex: 1;
    margin-left: 20px;
  }
}
</style>
