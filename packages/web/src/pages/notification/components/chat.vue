<template>
  <div class="chat-container">
    <div class="left">
      <ul class="ul">
        <li
          v-for="user of userList"
          :key="user._id"
          class="li"
          @click="() => handleUserSelect(user)"
        >
          <a-avatar class="user" :size="40">
            <img alt="avatar" :src="user.avatar" loading="lazy" />
          </a-avatar>
          <a-space direction="vertical" size="large">
            <strong class="name">{{ user.name }}</strong>
          </a-space>
        </li>
      </ul>
    </div>
    <div class="right">
      <div v-if="chatVisible" class="chat-box">
        <ul class="ul">
          <li class="info">您与当前用户暂不是好友关系，只能发送一条信息</li>
          <li v-for="message of chatMessages" :key="message._id">
            <chat-message :message="message"></chat-message>
          </li>
        </ul>
        <div class="editor">
          <a-textarea
            v-model="message"
            placeholder="Enter发送消息，Ctrl + Enter换行..."
            allow-clear
            auto-size
            @keyup.enter="handleSubmit"
          />
        </div>
      </div>
      <a-empty v-else>
        <template #image>
          <icon-wechat />
        </template>
        暂未选中或发起聊天，快去愉快沟通吧~
      </a-empty>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useUserStore } from '@/store';
import { IconWechat } from '@arco-design/icon-vue';
import ChatMessage from './message.vue';
import { chatWebSocketUrl, userWebSocketUrl } from '@/api/message';
import { getRefreshToken } from '@/utils/auth';

const userStore = useUserStore();
const chatUser = ref({});
const userList = ref([]);
const currentMessage = ref('');
const chatMessages = ref([]);
const chatVisible = computed(() => chatUser.value && chatUser.value.uid);
const userInfo = computed(() => userStore.userInfo || {});

const createWebSocket = (url, messageHandler, userSocket = false) => {
  const socket = new WebSocket(url);
  socket.addEventListener('message', event => {
    typeof messageHandler === 'function' && messageHandler(event.data);
  });
  socket.addEventListener('open', () => {
    // 权限校验
    const message = { type: 0, value: getRefreshToken() };
    socket.send(JSON.stringify(message));

    userSocket && socket.send(JSON.stringify({ type: 1, value: 'get' }));
  });
  return socket;
};

const handleUserListSocketMessage = () => {
  console.log('开始获取信息');
};
createWebSocket(userWebSocketUrl, handleUserListSocketMessage, true);

let chatSocket = null;
const handleWebSocketMessage = data => {
  console.log(data);
};
const handleUserSelect = user => {
  chatUser.value = user;
  if (!chatSocket) {
    chatSocket = createWebSocket(chatWebSocketUrl, handleWebSocketMessage);
  }
};

const handleSubmit = event => {
  event.stopPropagation();
  if (event.ctrlKey) {
    currentMessage.value += '\n';
    return;
  }
  const sender = userInfo.value.uid;
  const receiver = chatUser.value.uid;
  if (!sender || !receiver || !chatSocket) return;
  if (chatSocket.readyState !== WebSocket.OPEN) return;
  const content = currentMessage.value;
  if (!content) return;
  const message = {
    type: 1,
    value: {
      sender,
      receiver,
      content,
    },
  };
  chatSocket.send(JSON.stringify(message));
  currentMessage.value = '';
};
</script>

<style lang="less" scoped>
.chat-container {
  display: flex;
  height: calc(100vh - 160px);

  .left {
    width: 180px;
    flex: none;
    border-right: 1px solid #e4e6eb;

    .ul {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .name {
      display: block;
      max-width: 8em;
      color: #252933;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      cursor: pointer;
    }

    .current {
      color: #1e80ff;
    }
  }

  .right {
    position: relative;
    flex: 1;

    .chat-box {
      display: flex;
      flex-direction: column;
      height: 100%;

      .ul {
        list-style: none;
        margin: 0;
        padding: 0;
        flex: 1;
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

    :deep(.arco-empty) {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>
