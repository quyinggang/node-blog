<template>
  <a-modal
    v-model:visible="visible"
    :width="380"
    title-align="start"
    :footer="false"
    @cancel="handleCancel"
  >
    <template #title><h3>登录社区探索更多可能</h3></template>
    <div class="content">
      <login-form ref="formInstance" @success="handleSubmitOk"></login-form>
    </div>
  </a-modal>
</template>

<script setup>
import { computed, ref } from 'vue';
import LoginForm from './form.vue';
import { useCommonStore, useUserStore } from '@/store/index';

const commonStore = useCommonStore();
const userStore = useUserStore();
const formInstance = ref(null);
const visible = computed({
  get() {
    return commonStore.loginVisible;
  },
  set(value) {
    commonStore.setLoginVisible(value);
  },
});

const handleCancel = () => {
  const form = formInstance.value;
  if (form && typeof form.resetForm === 'function') {
    form.resetForm();
  }
  visible.value = false;
};

const handleSubmitOk = user => {
  userStore.setLoggedIn(true);
  userStore.setUserInfo({ ...user });
  handleCancel();
};
</script>
