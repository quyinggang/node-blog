<template>
  <ul class="author-container">
    <li>
      <user-avatar
        class="user"
        :avatar="author.avatar"
        :size="50"
      ></user-avatar>
      <strong class="name">{{ author.name }}</strong>
    </li>
    <li>
      <span class="flex">
        <span>{{ author.articleCount }}</span>
        <span>文章</span>
      </span>
      <span class="flex">
        <span>{{ author.readCount }}</span>
        <span>阅读</span>
      </span>
      <span class="flex">
        <span>{{ author.followerCount }}</span>
        <span>粉丝</span>
      </span>
    </li>
    <li v-if="btnVisible">
      <follow-action
        :user-id="authorId"
        @follow-success="handleFollowSuccess"
        @cancel-success="handleFollowSuccess"
      ></follow-action>
    </li>
  </ul>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { useUserStore } from '@/store';
import { getUserAllInfo } from '@/api/user';
import UserAvatar from '@/components/user-avatar/index.vue';
import FollowAction from '@/components/follow-action/index.vue';

const props = defineProps({
  authorId: {
    type: String,
    default: '',
  },
});

const userStore = useUserStore();
const author = ref({});
const authorId = computed(() => props.authorId);
const userInfo = computed(() => userStore.userInfo || {});
const btnVisible = computed(() => userInfo.value.uid !== authorId.value);

const fetchUserInfo = async () => {
  if (!authorId.value) return;
  const data = await getUserAllInfo(authorId.value);
  author.value = { ...data };
};

watch(
  () => authorId.value,
  value => {
    if (!value) return;
    fetchUserInfo();
  }
);

const handleFollowSuccess = () => fetchUserInfo();
</script>

<style lang="less" scoped>
.author-container {
  list-style: none;
  padding: 0;
  margin: 0;

  > li {
    display: flex;
    justify-content: space-around;
    align-items: center;

    &:first-child {
      justify-content: flex-start;
      margin-left: 1em;
    }

    &:nth-child(2) {
      line-height: 22px;
      margin: 10px 0;
    }
  }

  .name {
    font-size: 18px;
    padding-left: 1em;
  }

  .flex {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>
