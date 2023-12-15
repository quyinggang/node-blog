<template>
  <a-layout-header class="header">
    <div class="container">
      <div class="left"><logo /></div>
      <div class="right">
        <a-space size="large">
          <creation></creation>
          <a-space v-if="loggedIn" size="large">
            <message-dropdown :uid="userInfo.uid" />
            <user-dropdown :user="userInfo" @logout="handleLogout" />
          </a-space>
          <a-button v-else type="outline" @click="handleLoginOrRegister"
            >登录 | 注册</a-button
          >
        </a-space>
      </div>
    </div>
  </a-layout-header>
</template>

<script setup>
import Logo from '@/components/logo/index.vue';
import Creation from './creation.vue';
import UserDropdown from './user.vue';
import MessageDropdown from './message.vue';
import { useCommonStore, useUserStore } from '@/store';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { deleteToken } from '@/utils/auth';
import { logout } from '@/api/user';

const router = useRouter();

const commonStore = useCommonStore();
const userStore = useUserStore();
const loggedIn = computed(() => userStore.isLoggedIn);
const userInfo = computed(() => userStore.userInfo || {});

const handleLoginOrRegister = () => {
  commonStore.setLoginVisible(true);
};
const handleLogout = async () => {
  await logout();
  userStore.setLoggedIn(false);
  deleteToken();
  router.replace('/');
};
</script>

<style lang="less" scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  z-index: 100;
  color: #909090;
  background: #fff;
  box-shadow: 0 2px 8px #f2f3f5;

  .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1000px;
    margin: 0 auto;
  }
}
</style>
