<template>
  <div class="container">
    <a-space direction="vertical" size="large">
      <a-space v-show="!immersionMode" direction="vertical" size="large">
        <div class="btn"><icon-thumb-up-fill /></div>
        <div class="btn" @click="handleCommentView"><icon-message /></div>
        <div class="btn"><icon-star-fill /></div>
      </a-space>
      <a-tooltip :content="tooltipContent">
        <div
          :class="['btn', immersionMode ? 'selected' : '']"
          @click="handleModeSwitch"
        >
          <icon-fullscreen />
        </div>
      </a-tooltip>
    </a-space>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import {
  IconThumbUpFill,
  IconMessage,
  IconStarFill,
  IconFullscreen,
} from '@arco-design/icon-vue';

const emit = defineEmits(['action']);

const immersionMode = ref(false);
const tooltipContent = computed(() =>
  immersionMode.value ? '退出沉浸' : '沉浸阅读'
);

const handleCommentView = () => {
  emit('action', { type: 'comment', value: true });
};
const handleModeSwitch = () => {
  immersionMode.value = !immersionMode.value;
  emit('action', { type: 'mode', value: immersionMode.value });
};
</script>

<style lang="less" scoped>
.btn {
  width: 46px;
  height: 46px;
  line-height: 46px;
  color: #8a919f;
  font-size: 20px;
  text-align: center;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 2px 4px 0 rgba(50, 50, 50, 4%);
  cursor: pointer;

  &:hover {
    color: #000;
  }
}

.selected {
  color: #1e80ff;

  &:hover {
    color: #1e80ff;
  }
}
</style>
