<template>
  <div class="chat-box">
    <ul ref="scrollElement" class="ul">
      <li
        v-for="message of chatMessages"
        :key="message._id"
        :class="{ anchor: endMessageId === message._id }"
      >
        <chat-message
          :user-id="loginUser.uid"
          :message="message"
        ></chat-message>
      </li>
    </ul>
    <div class="input-container">
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
import { computed, onMounted, ref, toRef, watch } from 'vue';
import ChatMessage from './chat-message.vue';
import useAuthWebSocket from '@/hook/useAuthWebSocket';
import {
  chatWebSocketUrl,
  getChatMessagesList,
  getChatMessageTotalNumber,
} from '@/api/chat';
import { socketTypeAlias } from '@/utils/common';
import useScroll from '@/hook/useScroll';

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

const defaultSize = 20;
const scrollElement = ref();
const currentMessage = ref('');
const chatMessages = ref([]);
const endMessageId = ref();
const page = ref(1);
const loading = ref(false);
const chatUser = toRef(() => props.chatUser || {});
const loginUser = toRef(() => props.loginUser || {});
const recordFetchVisible = computed(() => {
  const chatTarget = chatUser.value;
  const loginUserInfo = loginUser.value;
  const result =
    chatTarget && loginUserInfo ? chatTarget._id && loginUserInfo.uid : false;
  return !!result;
});
const chatMessageLength = computed(() =>
  Array.isArray(chatMessages.value) ? chatMessages.value.length : 0
);

watch(
  () => chatUser.value,
  () => {
    chatMessages.value = [];
    page.value = 1;
    endMessageId.value = null;
  },
  { immediate: true }
);

const getTargetUserAvatar = sender => {
  const loginUserInfo = loginUser.value;
  const chatTarget = chatUser.value;
  return sender === loginUserInfo.uid ? loginUserInfo : chatTarget;
};
const fetchHistoryChatRecordByPage = async data => {
  if (!recordFetchVisible.value) return;
  const { size = defaultSize, append = true } = data;
  const params = {
    sender: loginUser.value.uid,
    receiver: chatUser.value._id,
    page: page.value,
    size,
  };
  const result = await getChatMessagesList(params);
  const list = result.list || [];
  const record = list.map(item => {
    const user = getTargetUserAvatar(item.sender);
    return {
      _id: item._id,
      content: item.content,
      sender: item.sender,
      avatar: user.avatar,
    };
  });
  if (append) {
    chatMessages.value.push(...record);
  } else {
    chatMessages.value.unshift(...record);
  }
};
const fetchHistoryRecordTotal = async () => {
  if (!recordFetchVisible.value) return;

  const params = {
    sender: loginUser.value.uid,
    receiver: chatUser.value._id,
  };
  const result = await getChatMessageTotalNumber(params);
  const lastPage = result ? Math.ceil(result / defaultSize) : 1;
  const isExistManyMessage = lastPage > 2;
  // 保证初始内容充满容器出现滚动条才可实现滚动到顶部加载历史数据的交互
  page.value = isExistManyMessage ? lastPage - 2 : lastPage;
  const initialSize = isExistManyMessage ? defaultSize * 2 : result;
  fetchHistoryChatRecordByPage({ size: initialSize || defaultSize });
};

watch(
  () => recordFetchVisible.value && chatUser.value._id,
  value => {
    if (!value) return;
    // 切换沟通用户后拉取总数计算出最后一页并拉取数据
    fetchHistoryRecordTotal();
  },
  { immediate: true }
);

watch(
  () => chatMessageLength.value,
  value => {
    if (!value) return;
    // 应该定位找最早一个未阅读的message，这里简单处理找到最后一个元素添加锚点
    const messages = chatMessages.value;
    endMessageId.value = messages[messages.length - 1]._id;
  },
  { immediate: true }
);

watch(
  () => endMessageId.value,
  value => {
    if (!value) return;
    // 定位滚动到最后一个元素
    const element = document.querySelector('.anchor');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  },
  { flush: 'post' }
);

onMounted(() => {
  useScroll({
    element: scrollElement.value,
    onScrollTop: async () => {
      // 滚动到顶部加载历史数据
      if (loading.value || page.value <= 1) return;
      page.value -= 1;
      loading.value = true;
      try {
        fetchHistoryChatRecordByPage({ append: false });
      } finally {
        loading.value = false;
      }
    },
  });
});

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
  currentMessage.value = '';
  if (!content) return;
  if (!chatSocket || chatSocket.readyState !== WebSocket.OPEN) {
    currentMessage.value = content;
    return;
  }
  const sender = loginUser.value.uid;
  const receiver = chatUser.value._id;
  if (!sender || !receiver) {
    currentMessage.value = content;
    return;
  }
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
    padding: 20px 10px;
    flex: 1;
    background-color: #ebebeb;
    overflow-y: auto;
  }

  .input-container {
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
