<template>
  <a-dropdown position="br" trigger="hover" @select="handleSelect">
    <a-badge :count="total" @click.stop="handleClick">
      <IconNotification class="icon" />
    </a-badge>
    <template #content>
      <a-doption value="1">
        <a-space>
          <span>评论和@</span>
          <a-badge :count="messageInfo.reply" />
        </a-space>
      </a-doption>
      <a-doption value="2">
        <a-space>
          <span>新增粉丝</span>
          <a-badge :count="messageInfo.follow" />
        </a-space>
      </a-doption>
      <a-doption value="3">
        <a-space>
          <span>私信</span>
          <a-badge :count="messageInfo.chat" />
        </a-space>
      </a-doption>
    </template>
  </a-dropdown>
</template>

<script setup>
import { onBeforeMount, onBeforeUnmount, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useCommonStore } from '@/store';
import { IconNotification } from '@arco-design/icon-vue';
import { getUnreadInformationCount } from '@/api/common';

const props = defineProps({
  uid: {
    type: String,
    default: '',
  },
});

const commonStore = useCommonStore();
const router = useRouter();
const total = ref(0);
const messageInfo = ref({});
let timer = null;

const fetchMessageCount = async () => {
  const uid = props.uid;
  if (!uid) return;
  const result = await getUnreadInformationCount({ uid });
  total.value = result.total;
  const record = result.record || {};
  messageInfo.value = {
    reply: record.comment + record.reply,
    follow: record.follow,
    chat: record.chat,
  };
};
const handleTimer = () => {
  fetchMessageCount();
  handleTimerCancel();
  timer = setInterval(() => fetchMessageCount(), 1000 * 60);
};
const handleTimerCancel = () => {
  timer && clearInterval(timer);
};

const handleClick = () => {
  router.push({ name: 'notification' });
};
const handleSelect = value => {
  router.push({ name: 'notification', query: { tab: value } });
};

watch(
  () => props.uid,
  value => {
    if (!value) return;
    handleTimer();
  }
);

watch(
  () => props.uid && commonStore.refetchMessageCount,
  value => {
    if (!value) return;
    fetchMessageCount();
    commonStore.setRefetchMessageCount(false);
  }
);

onBeforeMount(() => handleTimer());
onBeforeUnmount(() => handleTimerCancel());
</script>

<style lang="less" scoped>
.icon {
  font-size: 22px;
  color: #515767;
  cursor: pointer;

  &:hover {
    color: #000;
  }
}

:deep(.arco-dropdown-option-content) {
  width: 90px;
}
</style>
