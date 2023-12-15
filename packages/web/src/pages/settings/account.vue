<template>
  <div class="account-container">
    <h3 class="title">账号设置</h3>
    <a-list :bordered="false">
      <a-list-item>
        <a-list-item-meta title="密码" description=""> </a-list-item-meta>
        <template #actions>
          <a-button type="text" @click="handlePasswordReset">重置</a-button>
        </template>
      </a-list-item>
      <a-list-item>
        <a-list-item-meta title="账号注销" description=""> </a-list-item-meta>
        <template #actions>
          <a-button type="text" @click="handleRevoked">注销</a-button>
        </template>
      </a-list-item>
    </a-list>

    <a-modal
      v-model:visible="visible"
      :width="380"
      title-align="start"
      :footer="false"
      @cancel="handleCancel"
    >
      <template #title><h3>重置密码</h3></template>
      <div class="content">
        <reset-form
          ref="formInstance"
          @form-submit="handleResetSubmit"
        ></reset-form>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store';
import { Modal, Message } from '@arco-design/web-vue';
import { deleteToken } from '@/utils/auth';
import { cancelAccount, resetPassword } from '@/api/user';
import ResetForm from './components/form.vue';

const router = useRouter();
const userStore = useUserStore();

const visible = ref(false);
const formInstance = ref();

const handleCancel = () => {
  const form = formInstance.value;
  if (form.value && typeof form.resetForm === 'function') {
    form.resetForm();
  }
  visible.value = false;
};
const handlePasswordReset = () => {
  visible.value = true;
};
const resetUserAndBackHome = () => {
  userStore.setLoggedIn(false);
  deleteToken();
  router.replace({ name: 'home' });
};
const handleResetSubmit = async password => {
  await resetPassword({ uid: userStore.userInfo.uid, password });
  Message.success({ duration: 2000, content: '修改密码成功' });
  handleCancel();
  resetUserAndBackHome();
};
const handleRevoked = () => {
  Modal.confirm({
    title: '注销提示',
    content: '注销后将会销毁全部用户数据，确定注销账号吗？',
    onOk: async () => {
      await cancelAccount(userStore.userInfo.uid);
      resetUserAndBackHome();
    },
  });
};
</script>

<style lang="less" scoped>
.account-container {
  background: #fff;

  .title {
    margin: 0;
    padding: 15px 0 15px 15px;
    border-bottom: 1px solid #e4e6eb;
  }

  :deep(.arco-list-item-meta-title) {
    font-weight: normal;
  }
}
</style>
