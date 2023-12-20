<template>
  <div ref="commentBoxElement" :class="boxClassList">
    <div class="flex">
      <user-avatar
        class="user"
        :avatar="userInfo.avatar"
        :size="40"
      ></user-avatar>
      <comment-input
        ref="inputInstance"
        :user="userInfo"
        :logged-in="loggedIn"
        @login="handleLogin"
        @send="handleCommentCreate"
      ></comment-input>
    </div>
    <template v-for="item of commentList" :key="item._id">
      <comment-item
        class="top-comment"
        :comment="item"
        :user-id="userInfo.uid"
        :logged-in="loggedIn"
        @login="handleLogin"
        @reply="handleCommentCreate"
        @delete="handleCommentDelete"
      ></comment-item>
      <div v-if="item.replies && item.replies.length">
        <template v-for="child of item.replies" :key="child._id">
          <comment-item
            class="sub-comment"
            :comment="child"
            :user-id="userInfo.uid"
            :logged-in="loggedIn"
            @login="handleLogin"
            @reply="handleCommentCreate"
            @delete="handleCommentDelete"
          ></comment-item>
        </template>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import CommentInput from './input.vue';
import CommentItem from './list-item.vue';
import UserAvatar from '@/components/user-avatar/index.vue';
import { useCommonStore, useUserStore } from '@/store';
import { getComments, createComment, deleteComment } from '@/api/comment';
import useScrollPageRequest from '@/hook/useScrollPageRequest';

const props = defineProps({
  preview: {
    type: Boolean,
    default: true,
  },
  topicId: {
    type: String,
    default: '',
  },
});
const emit = defineEmits('success');

const commonStore = useCommonStore();
const userStore = useUserStore();
const commentBoxElement = ref();
const commentList = ref([]);
const inputInstance = ref();

const boxClassList = computed(() => {
  return {
    'comment-box': true,
    'scroll-box': !props.preview,
  };
});
const userInfo = computed(() => userStore.userInfo || {});
const loggedIn = computed(() => userStore.isLoggedIn || false);

const fetchComments = async pageParams => {
  const topicId = props.topicId;
  if (!topicId) return;
  const result = await getComments({ topicId, ...pageParams });
  commentList.value = !props.preview
    ? [...commentList.value, ...result]
    : [...result];
  return result.length === pageParams.size;
};

if (props.preview) {
  fetchComments({ page: 1, size: 2 });
}

onMounted(() => {
  if (props.preview) return;
  useScrollPageRequest({
    element: commentBoxElement.value,
    request: pageParams => fetchComments(pageParams),
  });
});

const handleLogin = () => {
  commonStore.setLoginVisible(true);
};
const handleCommentCreate = async data => {
  const user = userInfo.value;
  if (!user) return;
  const topicId = props.topicId;
  const uid = user.uid;
  await createComment({
    topicId,
    uid,
    ...data,
  });
  fetchComments({ page: 1, size: props.preview ? 2 : 10 });
  const inputComInstance = inputInstance.value;
  if (!inputComInstance) return;
  inputComInstance.clearInput();
  emit('success');
};
const handleCommentDelete = async id => {
  await deleteComment(id);
  fetchComments({ page: 1, size: props.preview ? 2 : 10 });
  emit('success');
};
</script>

<style lang="less" scoped>
.comment-box {
  .flex {
    display: flex;
  }

  .user {
    margin-right: 10px;
  }

  .top-comment {
    margin-top: 25px;
  }

  .sub-comment {
    margin: 15px 0 0 50px;
  }
}

.scroll-box {
  position: relative;
  height: 100%;
  padding: 12px 16px;
  box-sizing: border-box;
  overflow: auto;
}
</style>
