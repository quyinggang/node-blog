<template>
  <div class="chat-container">
    <div class="aside">
      <ul class="ul">
        <li
          v-for="user of userList"
          :key="user._id"
          :class="[
            'li',
            chatUser && chatUser._id === user._id ? 'selected' : '',
          ]"
          @click="() => handleUserSelect(user)"
        >
          <div class="flex">
            <a-space>
              <a-avatar class="user" :size="28">
                <img alt="avatar" :src="user.avatar" loading="lazy" />
              </a-avatar>
              <a-space direction="vertical" size="large">
                <strong class="name">{{ user.name }}</strong>
              </a-space>
            </a-space>
            <a-badge :count="user.count" :max-count="99" />
          </div>
        </li>
      </ul>
    </div>
    <div class="content">
      <div v-if="chatPanelVisible" class="chat-box">
        <ul class="ul">
          <li v-for="message of chatMessages" :key="message._id">
            <chat-message
              :user-id="userInfo.uid"
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
import { ref, computed, toRef, watch } from 'vue';
import { useUserStore } from '@/store';
import { IconWechat } from '@arco-design/icon-vue';
import ChatMessage from './message.vue';
import { chatWebSocketUrl, userWebSocketUrl } from '@/api/message';
import { getRefreshToken } from '@/utils/auth';
import { socketTypeAlias, jsonParse } from '@/utils/common';

const props = defineProps({
  im: {
    type: String,
    default: '',
  },
});

const userStore = useUserStore();
const chatUser = ref({});
const userList = ref([]);
const currentMessage = ref('');
const chatMessages = ref([]);
const userSocketAuthSuccess = ref(false);
const chatPanelVisible = toRef(() => chatUser.value && chatUser.value._id);
const userInfo = toRef(() => userStore.userInfo || {});
const chatVisible = computed(
  () => userSocketAuthSuccess.value && userInfo.value.uid
);

const createWebSocket = (url, messageHandler) => {
  const socket = new WebSocket(url);
  socket.addEventListener('message', event => {
    const messageInfo = jsonParse(event.data);
    if (messageInfo && typeof messageHandler === 'function') {
      messageHandler(messageInfo);
    }
  });
  socket.addEventListener('open', () => {
    // 权限校验
    const message = JSON.stringify({
      type: socketTypeAlias.request.auth,
      value: getRefreshToken(),
    });
    socket.send(message);
  });
  return socket;
};

const handleUserListSocketMessage = data => {
  if (data.type === socketTypeAlias.response.connected) {
    userSocketAuthSuccess.value = true;
    return;
  }
  userList.value = data.value || [];
};
const userSocket = createWebSocket(
  userWebSocketUrl,
  handleUserListSocketMessage,
  true
);

watch(
  () => chatVisible.value,
  value => {
    if (!value) return;
    const message = JSON.stringify({
      type: socketTypeAlias.request.message,
      value: {
        sender: userInfo.value.uid,
      },
    });
    userSocket.send(message);
  }
);

watch(
  () => props.im && chatVisible.value,
  value => {
    if (!value) return;
    const message = JSON.stringify({
      type: socketTypeAlias.request.connection,
      value: {
        sender: userInfo.value.uid,
        receiver: props.im,
      },
    });
    userSocket.send(message);
  }
);

let chatSocket = null;
const getTargetUserAvatar = sender => {
  const loginUser = userInfo.value;
  const chatTarget = chatUser.value;
  return sender === loginUser.uid ? loginUser : chatTarget;
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
const handleUserSelect = user => {
  chatMessages.value = [];
  chatUser.value = user;
  if (!chatSocket) {
    chatSocket = createWebSocket(chatWebSocketUrl, handleWebSocketMessage);
  }
};

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
  const sender = userInfo.value.uid;
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
.chat-container {
  display: flex;
  height: calc(100vh - 160px);

  .aside {
    width: 200px;
    flex: none;
    border-right: 1px solid #e4e6eb;

    .flex {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .ul {
      list-style: none;
      margin: 0;
      padding: 0;
      cursor: pointer;
      overflow-y: auto;

      .name {
        display: block;
        max-width: 8em;
        color: inherit;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .li {
        padding: 5px 16px;
        color: #252933;

        &:hover {
          background: #f2f3f5;
        }
      }

      .selected {
        color: #1e80ff;
        background: #f2f3f5;
      }
    }
  }

  .content {
    position: relative;
    flex: 1;

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

    :deep(.arco-empty) {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>
