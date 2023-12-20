<template>
  <div class="upload-container">
    <a-upload
      :custom-request="handleUpload"
      list-type="picture"
      :file-list="fileList"
      @change="uploadChange"
      @before-upload="beforeUpload"
      @before-remove="beforeRemove"
    ></a-upload>
    <div class="info">
      <div>格式：支持JPG、PNG、JPEG</div>
      <div>大小：5M以内</div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { Message } from '@arco-design/web-vue';
import { uploadAvatarImage } from '@/api/user';

const emit = defineEmits(['update:modelValue']);

const file = ref();
const fileList = computed(() => (file.value ? [file.value] : []));

const beforeUpload = currentFile => {
  const isType = ['image/jpeg', 'image/jpg', 'image/png'].includes(
    currentFile.type
  );
  const isLt5M = currentFile.size / 1024 / 1024 < 5;
  if (!isType) {
    Message.error('图片类型不支持');
  }
  if (!isLt5M) {
    Message.error('文件大小超过5M');
  }
  return isType && isLt5M;
};
const beforeRemove = () => {
  file.value = null;
};
const uploadChange = (_, currentFile) => {
  file.value = currentFile;
};
const handleUpload = async option => {
  const fileItem = option.fileItem;
  const fileName = await uploadAvatarImage({ file: fileItem.file });
  emit('update:modelValue', fileName);
};
</script>

<style lang="less" scoped>
.upload-container {
  .info {
    color: #8a919f;
    line-height: 22px;
  }
}

:deep(.arco-upload-progress) {
  display: none;
}
</style>
