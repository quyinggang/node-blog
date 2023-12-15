<template>
  <div :class="messageClass">
    <a-avatar class="user" :size="40">
      <img alt="avatar" :src="message.avatar" loading="lazy" />
    </a-avatar>
    <p class="content">{{ message.content }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  userId: {
    type: String,
    default: '',
  },
  message: {
    type: Object,
    default() {
      return {};
    },
  },
});

const message = computed(() => {
  const { sender, content, create_at } = props.message || {};
  return {
    avatar: sender ? sender.avatar : '#',
    content: content || '',
    time: create_at || '',
  };
});
const messageClass = computed(() => {
  const userId = props.userId;
  const { sender } = props.message || {};
  const isUserSelf = sender && userId ? sender._id === userId : false;
  const defaultClass = 'message-container';
  return isUserSelf ? [defaultClass, 'right'] : [defaultClass, 'left'];
});
</script>

<style lang="less" scoped>
.message-container {
  display: flex;
}

.left {
  flex-direction: row;

  .content {
    margin-left: 10px;

    &::before {
      content: '';
      display: block;
      position: absolute;
      top: 10px;
      left: 0;
      width: 8px;
      height: 8px;
      border: 1px solid #e5e6eb;
      transform: rotate(45deg);
    }
  }
}

.right {
  flex-direction: row-reverse;

  .content {
    margin-right: 10px;

    &::before {
      content: '';
      display: block;
      position: absolute;
      top: 10px;
      right: 0;
      width: 8px;
      height: 8px;
      border: 1px solid #e5e6eb;
      transform: rotate(45deg);
    }
  }
}
</style>
