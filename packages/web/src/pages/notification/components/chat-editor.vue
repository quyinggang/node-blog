<template>
  <div class="chat-box">
    <ul class="ul">
      <li v-for="message of chatMessages" :key="message._id">
        <chat-message
          :user-id="loginUser.uid"
          :message="message"
        ></chat-message>
      </li>
    </ul>
    <div class="editor">
      <a-textarea
        v-model="currentMessage"
        placeholder="Enter发送消息，Ctrl + Enter换行..."
        allow-clear
        auto-size
        @keyup.enter="handleSubmit"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, toRef, watch } from 'vue';
import ChatMessage from './message.vue';
import useAuthWebSocket from '@/hook/useAuthWebSocket';
import { chatWebSocketUrl } from '@/api/chat';
import { socketTypeAlias } from '@/utils/common';

const props = defineProps({
  chatUser: {
    type: Object,
    default() {
      return {};
    },
  },
  loginUser: {
    type: Object,
    default() {
      return {};
    },
  },
});

const currentMessage = ref('');
const chatMessages = ref([]);
const chatUser = toRef(() => props.chatUser || {});
const loginUser = toRef(() => props.loginUser || {});

watch(
  () => chatUser.value,
  () => {
    chatMessages.value = [];
  }
);

const getTargetUserAvatar = sender => {
  const loginUserInfo = loginUser.value;
  const chatTarget = chatUser.value;
  return sender === loginUserInfo.uid ? loginUserInfo : chatTarget;
};
const handleWebSocketMessage = data => {
  if (data.type === socketTypeAlias.response.connected) return;
  const { _id, sender, content } = data.value;
  const targetUser = getTargetUserAvatar(sender);

  chatMessages.value.push({
    _id,
    avatar: targetUser.avatar,
    sender,
    content,
  });
};
const chatSocket = useAuthWebSocket({
  ws: chatWebSocketUrl,
  onMessage: handleWebSocketMessage,
});

const handleSubmit = event => {
  event.stopPropagation();
  event.preventDefault();
  if (event.ctrlKey) {
    currentMessage.value += '\n';
    return;
  }
  let content = currentMessage.value;
  if (content) {
    content = content.replace(/\\n$/, '').trim();
  }
  if (!content) return;
  if (!chatSocket || chatSocket.readyState !== WebSocket.OPEN) return;
  const sender = loginUser.value.uid;
  const receiver = chatUser.value._id;
  if (!sender || !receiver) return;
  const message = JSON.stringify({
    type: socketTypeAlias.request.chat,
    value: {
      sender,
      receiver,
      content,
    },
  });
  currentMessage.value = '';
  chatSocket.send(message);
};
</script>

<style lang="less" scoped>
.chat-box {
  display: flex;
  flex-direction: column;
  height: 100%;

  .ul {
    list-style: none;
    margin: 0;
    padding: 0 10px;
    flex: 1;
    background-color: #ebebeb;
  }

  .editor {
    height: 100px;
    flex: none;
    border-top: 1px solid #e4e6eb;

    :deep(.arco-textarea-wrapper) {
      border: none;
      background-color: #fff;
      height: 100%;
    }
  }
}
</style>
