<template>
  <a-layout class="layout">
    <layout-header />
    <a-layout-content class="content">
      <router-view v-slot="{ Component, route }">
        <transition name="fade" mode="out-in" appear>
          <keep-alive v-if="route.meta.cache">
            <component :is="Component" :key="route.fullPath" />
          </keep-alive>
          <component :is="Component" v-else :key="route.fullPath" />
        </transition>
      </router-view>
    </a-layout-content>
    <login-model />
  </a-layout>
</template>

<script setup>
import LoginModel from '@/components/login/index.vue';
import LayoutHeader from './components/header.vue';
import { getUserBaseInfo } from '@/api/user';
import { getAccessToken } from '@/utils/auth';
import { useUserStore } from '@/store';

const userStore = useUserStore();

const refreshUserBaseInf = () => {
  if (getAccessToken()) {
    getUserBaseInfo().then(res => {
      userStore.setLoggedIn(true);
      userStore.setUserInfo({ ...res });
    });
  }
};

refreshUserBaseInf();
</script>

<style scoped lang="less">
.layout {
  width: 100%;
  height: 100%;
  border: none;

  .content {
    width: 100%;
    height: 100%;
    margin: 0 auto;
    margin-top: 80px;
    max-width: 1000px;
  }
}
</style>
