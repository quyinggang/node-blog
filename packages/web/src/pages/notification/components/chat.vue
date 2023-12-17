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
import { useUserStore } from '@/store';
import { IconWechat } from '@arco-design/icon-vue';
import chatMenu from './chat-menu.vue';
import ChatEditor from './chat-editor.vue';
import { userWebSocketUrl, deleteChatMessages } from '@/api/chat';
import { socketTypeAlias } from '@/utils/common';
import useAuthWebSocket from '@/hook/useAuthWebSocket';

const props = defineProps({
  im: {
    type: String,
    default: '',
  },
});

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

const handleChatUserSelect = user => {
  chatUser.value = user;
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
