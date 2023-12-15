<template>
  <a-dropdown position="br" trigger="click">
    <a-avatar class="user" :size="36">
      <img class="image" alt="avatar" :src="userInfo.avatar" loading="lazy" />
    </a-avatar>
    <template #content>
      <a-doption>
        <router-link :to="{ name: 'user', params: { id: userInfo.uid } }">
          <a-space>
            <icon-user />
            <span> 我的主页 </span>
          </a-space>
        </router-link>
      </a-doption>
      <a-doption>
        <router-link :to="{ name: 'profile' }">
          <a-space>
            <icon-settings />
            <span> 我的设置 </span>
          </a-space>
        </router-link>
      </a-doption>
      <a-doption>
        <a-space @click="handleLogout">
          <icon-export />
          <span> 退出登录 </span>
        </a-space>
      </a-doption>
    </template>
  </a-dropdown>
</template>

<script setup>
import { Modal } from '@arco-design/web-vue';
import { IconUser, IconExport, IconSettings } from '@arco-design/icon-vue';
import { computed } from 'vue';

const props = defineProps({
  user: {
    type: Object,
    default() {
      return {};
    },
  },
});
const emit = defineEmits(['logout']);
const userInfo = computed(() => props.user || {});

const handleLogout = () => {
  Modal.confirm({
    title: '退出登录',
    content: '确定退出当前系统登录吗？',
    bodyStyle: 'text-align: center',
    onOk: () => {
      emit('logout');
    },
  });
};
</script>

<style lang="less" scoped>
.user {
  cursor: pointer;
}
</style>
