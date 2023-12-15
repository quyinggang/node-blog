<template>
  <div class="follower-container">
    <a-empty v-show="emptyVisible" />
    <ul class="ul">
      <li v-for="item in list" :key="item._id" class="li">
        <span class="name" @click.stop="() => handleRoute(item._id)">{{
          item.name
        }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { getFollowerList } from '@/api/user';
import useScrollPageRequest from '@/hook/useScrollPageRequest';

const props = defineProps({
  uid: {
    type: String,
    default: '',
  },
});

const router = useRouter();
const list = ref([]);
const emptyVisible = computed(() => list.value.length === 0);

const fetchList = async pageParams => {
  const uid = props.uid;
  if (!uid) return;
  const data = await getFollowerList({ uid, ...pageParams });
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
</script>

<style lang="less" scoped>
.follower-container {
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
