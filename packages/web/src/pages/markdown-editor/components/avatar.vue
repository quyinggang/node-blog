<template>
  <a-dropdown position="br" trigger="click">
    <user-avatar
      class="user"
      :avatar="userInfo.avatar"
      :size="36"
    ></user-avatar>
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
        <router-link :to="{ name: 'drafts' }">
          <a-space>
            <icon-archive />
            <span> 草稿箱 </span>
          </a-space>
        </router-link>
      </a-doption>
    </template>
  </a-dropdown>
</template>

<script setup>
import { computed } from 'vue';
import { useUserStore } from '@/store';
import { getUserBaseInfo } from '@/api/user';
import { IconUser, IconArchive } from '@arco-design/icon-vue';
import UserAvatar from '@/components/user-avatar/index.vue';

const userStore = useUserStore();
const userInfo = computed(() => userStore.userInfo || {});

getUserBaseInfo().then(data => {
  userStore.setUserInfo({
    uid: data.uid,
    name: data.name,
    avatar: data.avatar,
  });
});
</script>

<style lang="less" scoped>
.user {
  cursor: pointer;
}
</style>
