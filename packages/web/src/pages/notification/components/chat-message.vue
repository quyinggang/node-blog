<template>
  <div :class="messageClass">
    <user-avatar class="user" :avatar="message.avatar" :size="36"></user-avatar>
    <div class="content">
      {{ message.content }}
    </div>
  </div>
</template>

<script setup>
import { toRef, computed } from 'vue';
import UserAvatar from '@/components/user-avatar/index.vue';

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

const message = toRef(() => props.message || {});

const messageClass = computed(() => {
  const userId = props.userId;
  const { sender } = message.value;
  const isUserSelf = sender && userId ? sender === userId : false;
  const defaultClass = 'message-container';
  return isUserSelf ? [defaultClass, 'right'] : [defaultClass, 'left'];
});
</script>

<style lang="less" scoped>
.message-container {
  display: flex;
  align-items: flex-start;
  margin: 10px 0;

  .user {
    flex: none;
  }

  .content {
    position: relative;
    max-width: 40%;
    line-height: 1.5;
    padding: 7px;
    border-radius: 4px;
    color: #4e5969;
    font-size: 14px;

    &::before {
      content: '';
      display: block;
      position: absolute;
      top: 12px;
      width: 8px;
      height: 8px;
      transform: rotate(45deg);
    }
  }
}

.left {
  flex-direction: row;

  .content {
    margin-left: 10px;
    background-color: #fff;

    &::before {
      left: -4px;
      background-color: #fff;
    }
  }
}

.right {
  flex-direction: row-reverse;

  .content {
    margin-right: 10px;
    background-color: #a7ea74;

    &::before {
      right: -4px;
      background-color: #a7ea74;
    }
  }
}
</style>
