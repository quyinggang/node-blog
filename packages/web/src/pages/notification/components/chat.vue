<template>
  <div class="chat-container">
    <chat-menu
      :users="userList"
      :chat-user-id="chatUserId"
      @select="handleChatUserSelect"
      @delete="handleChatDelete"
    ></chat-menu>
    <div class="content">
      <chat-editor
        v-if="chatPanelVisible"
        :chat-user="chatUser"
        :login-user="userInfo"
      ></chat-editor>
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
import { IconWechat } from '@arco-design/icon-vue';
import chatMenu from './chat-menu.vue';
import ChatEditor from './chat-editor.vue';
import { socketTypeAlias } from '@/utils/common';
import useAuthWebSocket from '@/hook/useAuthWebSocket';
import { useUserStore, useCommonStore } from '@/store';
import {
  userWebSocketUrl,
  deleteChatMessages,
  updateChatReadStatus,
} from '@/api/chat';

const props = defineProps({
  im: {
    type: String,
    default: '',
  },
});

const commonStore = useCommonStore();
const userStore = useUserStore();
const chatUser = ref({});
const userList = ref([]);
const userSocketAuthSuccess = ref(false);
const userInfo = toRef(() => userStore.userInfo || {});
const chatPanelVisible = computed(() => {
  return chatUser.value && chatUser.value._id;
});
const chatVisible = computed(
  () => userSocketAuthSuccess.value && userInfo.value.uid
);
const chatUserId = computed(() => (chatUser.value ? chatUser.value._id : ''));

const handleUserListSocketMessage = data => {
  if (data.type === socketTypeAlias.response.connected) {
    userSocketAuthSuccess.value = true;
    return;
  }
  userList.value = data.value || [];
};
const userSocket = useAuthWebSocket({
  ws: userWebSocketUrl,
  onMessage: handleUserListSocketMessage,
});

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

const fetchLatestUserList = () => {
  if (!userSocket || userSocket.readyState !== WebSocket.OPEN) return;
  const message = JSON.stringify({
    type: socketTypeAlias.request.message,
    value: {
      sender: userInfo.value.uid,
    },
  });
  userSocket.send(message);
};
watch(
  () => chatVisible.value && (!userList.value || userList.value.length === 0),
  value => {
    if (!value) return;
    fetchLatestUserList();
  }
);

const updateChatAllMessageRead = async () => {
  const chatTarget = chatUser.value;
  const loginUser = userInfo.value;
  if (!loginUser || !chatTarget) return;
  if (!loginUser.uid || !chatTarget._id) return;
  if (chatTarget.count <= 0) return;
  await updateChatReadStatus({
    sender: loginUser.uid,
    receiver: chatTarget._id,
  });
  chatVisible.value && fetchLatestUserList();
  commonStore.setRefetchMessageCount(true);
};
const handleChatUserSelect = user => {
  if (chatUser.value && user && chatUser.value._id === user._id) {
    return;
  }
  chatUser.value = user;
  updateChatAllMessageRead();
};
const handleChatDelete = async data => {
  const { user, index } = data;
  const sender = userInfo.value.uid;
  const receiver = user._id;
  if (!sender || !receiver) return;
  await deleteChatMessages({ sender, receiver });
  const users = userList.value;
  if (Array.isArray(users) && users[index] === user) {
    users.splice(index, 1);
  }
  if (chatUserId.value === receiver) {
    chatUser.value = {};
  }
};
</script>

<style lang="less" scoped>
.chat-container {
  display: flex;
  height: calc(100vh - 160px);

  .content {
    position: relative;
    flex: 1;

    :deep(.arco-empty) {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>
