<template>
  <div class="menu-container">
    <ul class="ul">
      <li
        v-for="(user, index) in userList"
        :key="user._id"
        :class="['li', chatUserId === user._id ? 'selected' : '']"
        @click="() => handleUserSelect(user)"
      >
        <a-dropdown
          trigger="contextMenu"
          align-point
          :style="{ display: 'block' }"
        >
          <div class="flex">
            <a-space>
              <user-avatar
                class="user"
                :avatar="user.avatar"
                :size="28"
              ></user-avatar>
              <a-space direction="vertical" size="large">
                <strong class="name">{{ user.name }}</strong>
              </a-space>
            </a-space>
            <a-badge :count="user.count" :max-count="99" />
          </div>
          <template #content>
            <a-doption @click.stop="() => handleRoute(user)"
              >查看个人主页</a-doption
            >
            <a-doption @click.stop="() => handleDelete(user, index)"
              >删除对话</a-doption
            >
          </template>
        </a-dropdown>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { toRef } from 'vue';
import { useRouter } from 'vue-router';
import { Modal } from '@arco-design/web-vue';
import UserAvatar from '@/components/user-avatar/index.vue';

const props = defineProps({
  users: {
    type: Array,
    default() {
      return [];
    },
  },
  chatUserId: {
    type: String,
    default: '',
  },
});
const emit = defineEmits(['select', 'delete']);

const router = useRouter();
const userList = toRef(() => props.users || []);
const chatUserId = toRef(() => props.chatUserId || '');

const handleUserSelect = user => emit('select', user);

const handleRoute = user => {
  const uid = user._id;
  if (!uid) return;
  const { href } = router.resolve({
    name: 'user',
    params: { id: uid },
  });
  window.open(href, '__blank');
};
const handleDelete = (user, index) => {
  Modal.confirm({
    title: '警告通知',
    content: `确定删除与用户 ${user.name} 的全部聊天记录吗？`,
    onOk: async () => {
      emit('delete', { user, index });
    },
  });
};
</script>

<style lang="less" scoped>
.menu-container {
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
      padding: 10px 16px;
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
</style>
