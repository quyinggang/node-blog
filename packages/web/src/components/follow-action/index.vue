<template>
  <a-button v-if="followed" :loading="loading" @click.stop="handleFollowCancel">
    已关注
  </a-button>
  <a-button v-else type="primary" :loading="loading" @click.stop="handleFollow"
    >关注</a-button
  >
  <a-button class="btn" type="outline" @click.stop="handleChat">私信</a-button>
</template>

<script setup>
import { computed, onBeforeMount, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore, useCommonStore } from '@/store';
import {
  followUser,
  cancelFollowUser,
  getUserFollowRelation,
} from '@/api/user';

const props = defineProps({
  userId: {
    type: String,
    default: '',
  },
});
const emit = defineEmits(['follow-success', 'cancel-success']);

const router = useRouter();
const userStore = useUserStore();
const commonStore = useCommonStore();
const followed = ref(false);
const loading = ref(false);
const fetched = ref(false);
const userInfo = computed(() => userStore.userInfo || {});

const fetchUserRelation = async () => {
  const userId = props.userId;
  const { uid } = userInfo.value;
  if (!userId || !uid || fetched.value) return;
  fetched.value = true;
  const data = await getUserFollowRelation({ uid, targetId: userId });
  followed.value = !!data;
};

watch(
  () => props.userId && userInfo.value,
  value => {
    if (!value) return;
    fetchUserRelation();
  }
);

onBeforeMount(() => fetchUserRelation());

const handleChat = () => {
  if (!userStore.isLoggedIn) {
    commonStore.setLoginVisible(true);
    return;
  }
  const userId = props.userId;
  router.push({ name: 'notification', query: { tab: 3, im: userId } });
};
const handleFollow = async () => {
  if (!userStore.isLoggedIn) {
    commonStore.setLoginVisible(true);
    return;
  }
  const userId = props.userId;
  const { uid } = userInfo.value;
  if (!uid || !userId) return;
  loading.value = true;
  try {
    await followUser({ uid, followUserId: userId });
    followed.value = true;
    emit('follow-success');
  } finally {
    loading.value = false;
  }
};
const handleFollowCancel = async () => {
  const userId = props.userId;
  const { uid } = userInfo.value;
  if (!userId || !uid) return;
  loading.value = true;
  try {
    await cancelFollowUser({ uid, followUserId: userId });
    followed.value = false;
    emit('cancel-success');
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="less" scoped>
.btn {
  margin-left: 10px;
}
</style>
