<template>
  <div>
    <div class="list-box">
      <user-avatar
        class="user"
        :avatar="commentInfo.author.avatar"
        :size="40"
      ></user-avatar>
      <ul class="ul">
        <li class="title">
          <div class="name">
            <router-link
              class="link overflow"
              :to="{ name: 'user', params: { id: commentInfo.author._id } }"
              >{{ commentInfo.author.name }}</router-link
            >
            <template v-if="commentInfo.replyVisible">
              <span class="space">回复</span>
              <router-link
                class="link overflow"
                :to="{
                  name: 'user',
                  params: { id: commentInfo.replyUser._id },
                }"
                >{{ commentInfo.replyUser.name }}</router-link
              >
            </template>
          </div>
          <span v-if="commentInfo.rootId">：{{ commentInfo.content }}</span>
        </li>
        <li v-if="!commentInfo.rootId" class="content">
          {{ commentInfo.content }}
        </li>
        <li class="actions">
          <span class="time">{{ commentInfo.createTime }}</span>
          <span class="icon" @click="handleActionReply"><icon-message /> </span>
        </li>
      </ul>
    </div>
    <div v-if="inputVisible" class="reply-box">
      <reply-input
        ref="inputInstance"
        :logged-in="userLoggedIn"
        :placeholder="placeholder"
        @blur="handleInputBlur"
        @send="handleReplySend"
      ></reply-input>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue';
import dayjs from 'dayjs';
import ReplyInput from './input.vue';
import UserAvatar from '@/components/user-avatar/index.vue';
import { IconMessage } from '@arco-design/icon-vue';

const props = defineProps({
  comment: {
    type: Object,
    default() {
      return {};
    },
  },
  loggedIn: {
    type: Boolean,
    default: false,
  },
  top: {
    type: Boolean,
    default: true,
  },
  userId: {
    type: String,
    default: '',
  },
});
const emit = defineEmits(['login', 'reply']);
const inputInstance = ref();
const inputVisible = ref(false);
const commentInfo = computed(() => {
  const comment = props.comment || {};
  const replyUser = comment.replyUser || {};
  return {
    _id: comment._id,
    rootId: comment.root_comment_id,
    content: comment.content,
    createTime: dayjs(comment.create_at).format('YYYY-MM-DD'),
    author: comment.user || {},
    replyVisible: !!replyUser._id,
    replyUser,
  };
});
const userLoggedIn = computed(() => props.loggedIn);
const placeholder = computed(() => `回复 ${commentInfo.value.author.name}`);

const handleActionReply = () => {
  if (!userLoggedIn.value) {
    emit('login');
    return;
  }

  inputVisible.value = true;
  nextTick(() => {
    const inputComInstance = inputInstance.value;
    inputComInstance && inputComInstance.focusInput();
  });
};
const handleInputBlur = existContent => {
  if (existContent) return;
  inputVisible.value = false;
};
const handleReplySend = data => {
  const { _id: commentId, rootId } = commentInfo.value;
  const params = { ...data };
  if (rootId) {
    params['parentId'] = commentId;
    params['rootId'] = rootId;
  } else {
    params['rootId'] = commentId;
  }
  emit('reply', params);
  handleInputBlur(false);
};
</script>

<style lang="less" scoped>
.list-box {
  display: flex;

  .user {
    flex: none;
    margin-right: 10px;
  }

  .ul {
    margin: 0;
    padding: 0;
    list-style: none;
    line-height: 22px;
  }

  .title {
    .name {
      display: inline-flex;
      align-items: center;
      color: #515767;
      font-weight: 500;
    }

    .space {
      margin: 0 6px;
    }
  }

  .overflow {
    display: inline-block;
    max-width: 6em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .actions {
    > span {
      padding: 0 5px;
      color: #8a919f;
      user-select: none;
    }

    .time {
      padding-left: 0;
    }

    .icon {
      cursor: pointer;

      &:hover {
        color: #1e80ff;
      }
    }
  }

  .link {
    cursor: pointer;

    &:hover {
      color: #1e80ff;
    }
  }
}

.reply-box {
  margin-left: 50px;
}
</style>
