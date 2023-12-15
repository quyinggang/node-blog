<template>
  <div class="profile">
    <h3 class="title">个人资料</h3>
    <div class="content">
      <a-form
        ref="formInstance"
        :model="form"
        class="form"
        @submit="handleSubmit"
      >
        <a-form-item
          field="name"
          :rules="[{ required: true, message: '请输入用户名' }]"
          :validate-trigger="['change']"
          label="用户名"
        >
          <a-input
            v-model="form.name"
            placeholder="请输入用户名"
            :max-length="20"
            allow-clear
            show-word-limit
          >
          </a-input>
        </a-form-item>
        <a-form-item label="上传头像">
          <upload v-model="form.avatar" />
        </a-form-item>
        <a-form-item label="">
          <a-button type="primary" html-type="submit"> 保存修改 </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store';
import { updateProfile } from '@/api/user';
import Upload from './components/upload.vue';
import { Message } from '@arco-design/web-vue';

const router = useRouter();
const userStore = useUserStore();

const form = ref({
  name: '',
  avatar: '',
});

watch(
  () => userStore.userInfo,
  value => {
    form.value = { ...form.value, name: value ? value.name : '' };
  }
);

onMounted(() => {
  const userInfo = userStore.userInfo;
  form.value = { ...form.value, name: userInfo ? userInfo.name : '' };
});

const handleSubmit = async data => {
  const { errors, values } = data;
  if (errors) return;
  const { name, avatar } = values;
  const userInfo = userStore.userInfo;
  const avatarData = avatar ? { avatar } : {};
  const result = await updateProfile({
    name,
    uid: userInfo.uid,
    ...avatarData,
  });
  Message.success({ duration: 2000, content: '用户信息更新成功' });
  userStore.setUserInfo({ ...userInfo, ...result });
  router.replace({ name: 'home' });
};
</script>

<style lang="less" scoped>
.profile {
  background: #fff;

  > .title {
    margin: 0;
    padding: 15px 0 15px 15px;
    border-bottom: 1px solid #e4e6eb;
  }

  .content {
    padding: 20px;
  }
}

:deep(.arco-form) {
  max-width: 600px;
}

:deep(.arco-picker-size-medium) {
  width: 100%;
}

:deep(.arco-upload-wrapper) {
  width: auto;
}
</style>
