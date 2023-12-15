<template>
  <a-form
    ref="formInstance"
    :model="form"
    class="form"
    layout="vertical"
    @submit="handleSubmit"
  >
    <a-form-item
      field="email"
      :rules="[{ required: true, validator: rules.validateEmail }]"
      :validate-trigger="['change']"
      hide-label
    >
      <a-input v-model="form.email" placeholder="请输入邮箱">
        <template #prefix>
          <icon-email />
        </template>
      </a-input>
    </a-form-item>
    <a-form-item
      field="password"
      :rules="[{ required: true, message: '请填写密码' }]"
      :validate-trigger="['change']"
      hide-label
    >
      <a-input-password
        v-model="form.password"
        placeholder="请输入密码"
        allow-clear
      >
        <template #prefix>
          <icon-lock />
        </template>
      </a-input-password>
    </a-form-item>
    <a-space direction="vertical">
      <a-button type="primary" html-type="submit" long> 登录/注册 </a-button>
    </a-space>
  </a-form>
</template>

<script setup>
import { markRaw, ref } from 'vue';
import validator from 'validator';
import { IconLock, IconEmail } from '@arco-design/icon-vue';
import { useRouter } from 'vue-router';
import { saveToken } from '@/utils/auth';
import { login } from '@/api/user';

const emit = defineEmits(['success']);
const router = useRouter();
const formInstance = ref(null);
const rules = markRaw({
  validateEmail: (value, callback) => {
    if (!value) {
      return callback('请填写邮箱地址');
    }
    if (!validator.isEmail(value)) {
      callback('非法的邮箱地址');
    }
  },
});

// 简单处理密码不加密直接明文传输
const form = ref({
  email: '',
  password: '',
});

const resetForm = () => {
  const form = formInstance.value;
  if (!form) return;
  form.clearValidate();
  form.resetFields();
};

const handleSubmit = async data => {
  const { errors, values } = data;
  if (errors) return;
  const params = { ...values };
  const { user, ...tokens } = await login(params);
  saveToken(tokens);
  emit('success', user);
  resetForm();
  router.push('/');
};

defineExpose({ resetForm });
</script>

<style lang="less" scoped>
.form {
  width: 100%;
}
</style>
