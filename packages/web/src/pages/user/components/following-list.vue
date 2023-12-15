<template>
  <div class="following-container">
    <a-empty v-show="emptyVisible" />
    <ul class="ul">
      <li v-for="(item, index) in list" :key="item._id" class="li">
        <span class="name" @click.stop="() => handleRoute(item._id)">{{
          item.name
        }}</span>
        <a-button
          v-if="cancelVisible"
          type="text"
          @click.stop="() => handleDelete(index, item._id)"
          >取消关注</a-button
        >
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store';
import { getFollowingList, cancelFollowUser } from '@/api/user';
import useScrollPageRequest from '@/hook/useScrollPageRequest';

const props = defineProps({
  uid: {
    type: String,
    default: '',
  },
});

const userStore = useUserStore();
const router = useRouter();
const list = ref([]);
const emptyVisible = computed(() => list.value.length === 0);
const cancelVisible = computed(() => {
  const uid = props.uid;
  const { uid: userId } = userStore.userInfo || {};
  return uid && userId ? userId === uid : false;
});

const fetchList = async pageParams => {
  const uid = props.uid;
  if (!uid) return;
  const data = await getFollowingList({ uid, ...pageParams });
  list.value = [...list.value, ...data];
};

useScrollPageRequest({
  element: document,
  request: pageParams => fetchList(pageParams),
});

const handleRoute = id => {
  const { href } = router.resolve({ name: 'user', params: { id } });
  window.open(href, '__blank');
};
const handleDelete = async (index, id) => {
  const item = list.value[index];
  const { uid } = userStore.userInfo || {};
  if (item._id !== id || !uid) return;
  await cancelFollowUser({ uid, followUserId: id });
  list.value.splice(index, 1);
};
</script>

<style lang="less" scoped>
.following-container {
  padding: 0 1em;

  .ul {
    margin: 0;
    padding: 0;
    list-style: none;

    .li {
      height: 36px;
      line-height: 36px;
    }

    .name {
      cursor: pointer;
    }
  }
}
</style>
