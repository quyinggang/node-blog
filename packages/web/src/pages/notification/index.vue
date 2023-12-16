<template>
  <div class="tab-container">
    <a-tabs
      v-model:active-key="activeKey"
      lazy-load
      destroy-on-hide
      @tab-click="handleTabSelect"
    >
      <a-tab-pane key="1" title="评论和@">
        <comment-message :user-id="userInfo.uid"></comment-message>
      </a-tab-pane>
      <a-tab-pane key="2" title="新增粉丝">
        <follow-message :user-id="userInfo.uid"></follow-message>
      </a-tab-pane>
      <a-tab-pane key="3" title="私信">
        <chat-message :im="imUserId"></chat-message>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup>
import { computed, onBeforeMount, ref, toRef } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '@/store';
import CommentMessage from './components/comment.vue';
import FollowMessage from './components/follow.vue';
import ChatMessage from './components/chat.vue';

const useStore = useUserStore();
const route = useRoute();
const activeKey = ref();
const userInfo = computed(() => useStore.userInfo || {});
const initialTab = computed(() => {
  const tab = Number(route.query.tab);
  return Math.min(3, Math.max(1, tab)).toString();
});
const imUserId = toRef(() => route.query.im || '');

onBeforeMount(() => {
  activeKey.value = initialTab.value;
});

const handleTabSelect = value => {
  activeKey.value = value;
};
</script>

<style lang="less" scoped>
.tab-container {
  margin: 10px 20px;
  background: #fff;

  :deep(.arco-tabs-content) {
    padding: 0;
  }
}
</style>
