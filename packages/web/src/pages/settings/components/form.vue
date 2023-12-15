<template>
  <a-form
    ref="formInstance"
    :model="form"
    class="form"
    layout="vertical"
    @submit="handleSubmit"
  >
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
      </a-input-password>
    </a-form-item>
    <a-form-item
      field="secondPassword"
      :rules="[{ required: true, validator: rules.secondPassword }]"
      :validate-trigger="['change']"
      hide-label
    >
      <a-input-password
        v-model="form.secondPassword"
        placeholder="请再次输入密码"
        allow-clear
      >
      </a-input-password>
    </a-form-item>
    <a-space direction="vertical">
      <a-button type="primary" html-type="submit" long> 重置 </a-button>
    </a-space>
  </a-form>
</template>

<script setup>
import { markRaw, ref } from 'vue';

const emit = defineEmits(['form-submit']);
const formInstance = ref(null);
// 简单处理密码不加密直接明文传输
const form = ref({
  password: '',
  secondPassword: '',
});
const rules = markRaw({
  secondPassword: (value, callback) => {
    if (!value) {
      return callback('请填写密码');
    }
    const { password, secondPassword } = form.value;
    if (password !== secondPassword) {
      callback('前后密码不一致');
    }
  },
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
  emit('form-submit', values.secondPassword);
};

defineExpose({ resetForm });
</script>

<style lang="less" scoped>
.form {
  width: 100%;
}
</style>
