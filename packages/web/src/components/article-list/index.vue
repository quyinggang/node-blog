<template>
  <a-list :bordered="false" :data="list" hoverable>
    <template #item="{ item }">
      <list-item :type="type" :item="item" @delete="handleDelete" />
    </template>
  </a-list>
</template>

<script setup>
import { computed, ref } from 'vue';
import ListItem from './list-item.vue';
import {
  getAllArticle,
  getArticleOfTargetUser,
  deleteArticle,
} from '@/api/article';
import useScrollPageRequest from '@/hook/useScrollPageRequest';

const props = defineProps({
  uid: {
    type: String,
    default: '',
  },
  type: {
    type: Number,
    default: 0,
  },
});
const list = ref([]);
const type = computed(() => props.type);

const fetchArticles = async (pageParams, isInit = false) => {
  const fetchApi = props.uid
    ? () => getArticleOfTargetUser(props.uid, pageParams)
    : () => getAllArticle(pageParams);
  const data = await fetchApi();
  if (isInit) {
    list.value = [...data];
  } else {
    list.value.push(...data);
  }
  return data.length === pageParams.size;
};

useScrollPageRequest({
  element: document,
  request: pageParams => fetchArticles(pageParams),
});

const handleDelete = async id => {
  await deleteArticle(id);
  fetchArticles({ page: 1, size: 10 }, true);
};
</script>
